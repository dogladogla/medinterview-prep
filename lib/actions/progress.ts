"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSession, type ServerSupabase } from "@/lib/auth";
import { ensureProfile } from "@/lib/profile";
import { nextReviewAt, recordAttempt } from "@/lib/progress";

export type ActionResult<T = null> = { ok: true; data: T } | { ok: false; error: string };

const Uuid = z.string().uuid();

async function requireUser() {
  const { supabase, user } = await getSession();
  if (!user) return null;
  await ensureProfile(supabase, user.id);
  return { supabase, user };
}

async function currentProgress(supabase: ServerSupabase, questionId: string) {
  const { data } = await supabase.from("user_progress").select("*").eq("question_id", questionId).maybeSingle();
  return data;
}

export async function toggleStar(questionId: string, starred: boolean): Promise<ActionResult> {
  if (!Uuid.safeParse(questionId).success) return { ok: false, error: "Invalid question." };
  const s = await requireUser();
  if (!s) return { ok: false, error: "Sign in to star questions." };
  const { error } = await s.supabase
    .from("user_progress")
    .upsert({ question_id: questionId, user_id: s.user.id, starred: Boolean(starred) }, { onConflict: "user_id,question_id" });
  if (error) return { ok: false, error: "Couldn't save. Please try again." };
  revalidatePath("/dashboard");
  return { ok: true, data: null };
}

export async function setConfidence(questionId: string, confidence: number): Promise<ActionResult> {
  const parsed = z.object({ q: Uuid, c: z.number().int().min(1).max(5) }).safeParse({ q: questionId, c: confidence });
  if (!parsed.success) return { ok: false, error: "Invalid rating." };
  const s = await requireUser();
  if (!s) return { ok: false, error: "Sign in to track your confidence." };
  const existing = await currentProgress(s.supabase, questionId);
  const { error } = await s.supabase.from("user_progress").upsert(
    {
      user_id: s.user.id,
      question_id: questionId,
      confidence: parsed.data.c,
      // A rating counts as an attempt only if nothing else has recorded one yet.
      times_attempted: Math.max(existing?.times_attempted ?? 0, 1),
      last_attempted_at: existing?.last_attempted_at ?? new Date().toISOString(),
      next_review_at: nextReviewAt(parsed.data.c, existing?.last_score ?? null),
    },
    { onConflict: "user_id,question_id" },
  );
  if (error) return { ok: false, error: "Couldn't save your rating." };
  revalidatePath("/dashboard");
  return { ok: true, data: null };
}

export async function saveNotes(questionId: string, notes: string): Promise<ActionResult> {
  const parsed = z.object({ q: Uuid, n: z.string().max(4000) }).safeParse({ q: questionId, n: notes });
  if (!parsed.success) return { ok: false, error: "Notes must be under 4,000 characters." };
  const s = await requireUser();
  if (!s) return { ok: false, error: "Sign in to save notes." };
  const { error } = await s.supabase
    .from("user_progress")
    .upsert(
      { user_id: s.user.id, question_id: questionId, notes: parsed.data.n.trim() || null },
      { onConflict: "user_id,question_id" },
    );
  if (error) return { ok: false, error: "Couldn't save your notes." };
  return { ok: true, data: null };
}

const PracticeInput = z.object({
  questionId: Uuid,
  answer: z.string().trim().min(1, "Write an answer first.").max(8000, "Answers must be under 8,000 characters."),
});

/** Saves a single-question practice answer so it can receive AI feedback. */
export async function createPracticeAnswer(questionId: string, answer: string): Promise<ActionResult<{ answerId: string }>> {
  const parsed = PracticeInput.safeParse({ questionId, answer });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid answer." };
  const s = await requireUser();
  if (!s) return { ok: false, error: "Sign in to get AI feedback." };

  const { data: session, error: sErr } = await s.supabase
    .from("mock_sessions")
    .insert({ mode: "practice", question_ids: [parsed.data.questionId], prep_seconds: 0, completed_at: new Date().toISOString() })
    .select("id")
    .single();
  if (sErr || !session) return { ok: false, error: "Couldn't save your answer." };

  const { data: ans, error: aErr } = await s.supabase
    .from("mock_answers")
    .insert({ session_id: session.id, question_id: parsed.data.questionId, position: 0, answer_text: parsed.data.answer })
    .select("id")
    .single();
  if (aErr || !ans) return { ok: false, error: "Couldn't save your answer." };

  await recordAttempt(s.supabase, s.user.id, parsed.data.questionId);
  return { ok: true, data: { answerId: ans.id } };
}
