"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";

import type { ActionResult } from "@/lib/actions/progress";
import { recordAttempt } from "@/lib/progress";
import { generateFeedbackForAnswer, recomputeSessionScore } from "@/lib/ai/feedback-service";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { canUse } from "@/lib/features/server";
import { selectMockQuestions } from "@/lib/mock/select-questions";
import { ensureProfile } from "@/lib/profile";

const ConfigSchema = z.object({
  format: z.enum(["mmi", "panel", "oxbridge", "online"]),
  university: z.string().max(60).optional(),
  stations: z.coerce.number().int().min(1).max(8),
  prep: z.coerce.number().int().min(0).max(300),
  answer: z.coerce.number().int().min(60).max(900),
});

export type MockConfigState = { error: string | null };

export async function createMockSession(_prev: MockConfigState, formData: FormData): Promise<MockConfigState> {
  const parsed = ConfigSchema.safeParse({
    format: formData.get("format"),
    university: formData.get("university") || undefined,
    stations: formData.get("stations"),
    prep: formData.get("prep"),
    answer: formData.get("answer"),
  });
  if (!parsed.success) return { error: "Please check the settings and try again." };

  const { supabase, user } = await getSession();
  if (!user) return { error: "Please sign in." };
  if (!(await canUse("mock_station"))) return { error: "Mock stations aren't available on your plan." };
  await ensureProfile(supabase, user.id);

  const idx = await getIndexes();
  const uni = parsed.data.university ? idx.universityBySlug.get(parsed.data.university) : undefined;
  const picked = selectMockQuestions({
    questions: idx.questions,
    categorySlugById: new Map(idx.categories.map((c) => [c.id, c.slug])),
    format: parsed.data.format,
    universityId: uni?.id,
    count: parsed.data.stations,
  });
  if (picked.length === 0) return { error: "No questions match those settings — try a different format or university." };

  const { data, error } = await supabase
    .from("mock_sessions")
    .insert({
      mode: "mock",
      format: parsed.data.format,
      university_id: uni?.id ?? null,
      question_ids: picked.map((q) => q.id),
      prep_seconds: parsed.data.prep,
      answer_seconds: parsed.data.answer,
    })
    .select("id")
    .single();
  if (error || !data) return { error: "Couldn't start the mock. Please try again." };

  redirect(`/mock/${data.id}`);
}

const SubmitSchema = z.object({
  sessionId: z.string().uuid(),
  position: z.number().int().min(0).max(11),
  text: z.string().max(8000),
});

/**
 * Saves one station's answer and queues AI feedback to run after the response,
 * so the student moves straight on to the next station.
 */
export async function submitMockAnswer(
  sessionId: string,
  position: number,
  text: string,
): Promise<ActionResult<{ answerId: string }>> {
  const parsed = SubmitSchema.safeParse({ sessionId, position, text });
  if (!parsed.success) return { ok: false, error: "Answer too long (max 8,000 characters)." };
  const { supabase, user } = await getSession();
  if (!user) return { ok: false, error: "Your session has expired — please sign in again." };

  const { data: session } = await supabase.from("mock_sessions").select("*").eq("id", parsed.data.sessionId).maybeSingle();
  if (!session) return { ok: false, error: "Mock session not found." };
  if (session.completed_at) return { ok: false, error: "This mock has already finished." };
  const questionId = session.question_ids[parsed.data.position];
  if (!questionId) return { ok: false, error: "Invalid station." };

  const answerText = parsed.data.text.trim() || "[No answer given]";
  const { data: inserted, error } = await supabase
    .from("mock_answers")
    .insert({ session_id: session.id, question_id: questionId, position: parsed.data.position, answer_text: answerText })
    .select("id")
    .single();

  let answerId = inserted?.id;
  if (error) {
    // Unique (session, position): a double-submit returns the existing answer.
    const { data: existing } = await supabase
      .from("mock_answers")
      .select("id")
      .eq("session_id", session.id)
      .eq("position", parsed.data.position)
      .maybeSingle();
    if (!existing) return { ok: false, error: "Couldn't save your answer. Please try again." };
    answerId = existing.id;
  } else {
    await recordAttempt(supabase, user.id, questionId);
  }
  if (!answerId) return { ok: false, error: "Couldn't save your answer." };

  const id = answerId;
  after(async () => {
    try {
      await generateFeedbackForAnswer(supabase, id);
    } catch (e) {
      console.error("[mock] background feedback failed", e);
    }
  });
  return { ok: true, data: { answerId: id } };
}

export async function completeMockSession(sessionId: string): Promise<ActionResult> {
  if (!z.string().uuid().safeParse(sessionId).success) return { ok: false, error: "Invalid session." };
  const { supabase, user } = await getSession();
  if (!user) return { ok: false, error: "Please sign in." };
  const { error } = await supabase
    .from("mock_sessions")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", sessionId)
    .is("completed_at", null);
  if (error) return { ok: false, error: "Couldn't finish the session." };
  await recomputeSessionScore(supabase, sessionId);
  revalidatePath(`/mock/${sessionId}`);
  revalidatePath("/dashboard");
  return { ok: true, data: null };
}
