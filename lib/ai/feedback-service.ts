import "server-only";

import type { ServerSupabase } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { aiConfigured } from "@/lib/features/server";
import { nextReviewAt } from "@/lib/progress";
import { AiError, callStructured } from "./client";
import { FEEDBACK_PROMPT_VERSION, buildFeedbackPrompt } from "./prompts/feedback.v1";
import { consumeQuota, quotaMessage } from "./quota";
import { sanitizeForPrompt } from "./sanitize";
import { FeedbackSchema, overallScore, parseStoredFeedback, scoresOnly, type Feedback } from "./schemas/feedback";

export type FeedbackOutcome =
  | { ok: true; feedback: Feedback }
  | { ok: false; error: string; code: "not_found" | "quota" | "ai" | "not_configured" | "server"; status: number };

/**
 * Generates rubric feedback for one saved answer and stores it. Idempotent:
 * returns existing feedback instead of calling the AI again. RLS guarantees
 * the answer belongs to the signed-in user.
 */
export async function generateFeedbackForAnswer(supabase: ServerSupabase, answerId: string): Promise<FeedbackOutcome> {
  const { data: answer } = await supabase.from("mock_answers").select("*").eq("id", answerId).maybeSingle();
  if (!answer) return { ok: false, error: "Answer not found.", code: "not_found", status: 404 };

  const existing = parseStoredFeedback(answer.ai_feedback);
  if (existing) return { ok: true, feedback: existing };

  const { data: session } = await supabase.from("mock_sessions").select("*").eq("id", answer.session_id).maybeSingle();
  if (!session) return { ok: false, error: "Session not found.", code: "not_found", status: 404 };

  const idx = await getIndexes();
  const question = idx.questionById.get(answer.question_id);
  if (!question) return { ok: false, error: "Question not found.", code: "not_found", status: 404 };

  if (!aiConfigured()) {
    return { ok: false, error: "AI feedback isn't switched on yet.", code: "not_configured", status: 503 };
  }
  const quota = await consumeQuota(supabase, "ai_feedback");
  if (!quota.allowed) return { ok: false, error: quotaMessage(quota), code: "quota", status: 429 };

  const { system, user } = buildFeedbackPrompt({
    question,
    categoryName: idx.categoryById.get(question.categoryId)?.name ?? "",
    frameworks: question.frameworkLinks.map((l) => idx.frameworkById.get(l.frameworkId)).filter((f) => f != null),
    university: session.university_id ? idx.universityById.get(session.university_id) : null,
    format: session.format,
    answer: sanitizeForPrompt(answer.answer_text),
  });

  let feedback: Feedback;
  let model: string;
  try {
    const res = await callStructured({
      system,
      messages: [{ role: "user", content: user }],
      toolName: "submit_feedback",
      toolDescription: "Submit structured rubric feedback on the student's interview answer.",
      schema: FeedbackSchema,
      maxTokens: 2500,
      temperature: 0.3,
    });
    feedback = res.data;
    model = res.model;
  } catch (e) {
    const message = e instanceof AiError ? e.message : "Something went wrong generating feedback.";
    const code = e instanceof AiError && e.code === "not_configured" ? "not_configured" : "ai";
    await supabase.from("mock_answers").update({ feedback_error: message }).eq("id", answerId);
    return { ok: false, error: message, code, status: code === "not_configured" ? 503 : 502 };
  }

  const overall = feedback.not_assessable ? null : overallScore(feedback);
  const { error: upErr } = await supabase
    .from("mock_answers")
    .update({
      ai_feedback: feedback,
      score: scoresOnly(feedback),
      overall_score: overall,
      prompt_version: FEEDBACK_PROMPT_VERSION,
      model,
      feedback_error: null,
    })
    .eq("id", answerId);
  if (upErr) return { ok: false, error: "Feedback was generated but couldn't be saved.", code: "server", status: 500 };

  if (overall != null) {
    const { data: prog } = await supabase
      .from("user_progress")
      .select("confidence")
      .eq("question_id", answer.question_id)
      .maybeSingle();
    await supabase.from("user_progress").upsert(
      {
        user_id: session.user_id,
        question_id: answer.question_id,
        last_score: overall,
        next_review_at: nextReviewAt(prog?.confidence ?? null, overall),
      },
      { onConflict: "user_id,question_id" },
    );
  }

  if (session.completed_at) await recomputeSessionScore(supabase, session.id);
  return { ok: true, feedback };
}

/** Session score = mean of scored answers (unassessable answers excluded). */
export async function recomputeSessionScore(supabase: ServerSupabase, sessionId: string): Promise<void> {
  const { data } = await supabase.from("mock_answers").select("overall_score").eq("session_id", sessionId);
  const scores = (data ?? []).map((a) => a.overall_score).filter((s): s is number => s != null).map(Number);
  const total = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100 : null;
  await supabase.from("mock_sessions").update({ total_score: total }).eq("id", sessionId);
}
