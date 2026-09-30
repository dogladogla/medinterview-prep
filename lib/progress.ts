import "server-only";

import type { ServerSupabase } from "@/lib/auth";
import type { UserProgressRow } from "@/types/database.types";

/** All of the signed-in user's question progress, keyed by question id. */
export async function getProgressMap(supabase: ServerSupabase): Promise<Map<string, UserProgressRow>> {
  const { data, error } = await supabase.from("user_progress").select("*");
  if (error) throw new Error(`Could not load progress: ${error.message}`);
  return new Map((data ?? []).map((r) => [r.question_id, r]));
}

import { nextReviewAt } from "./progress-math";

export { nextReviewAt, reviewIntervalDays } from "./progress-math";

/** Increments the attempt counter. Used by practice and mock submissions. */
export async function recordAttempt(supabase: ServerSupabase, userId: string, questionId: string): Promise<void> {
  const { data: existing } = await supabase.from("user_progress").select("*").eq("question_id", questionId).maybeSingle();
  await supabase.from("user_progress").upsert(
    {
      user_id: userId,
      question_id: questionId,
      times_attempted: (existing?.times_attempted ?? 0) + 1,
      last_attempted_at: new Date().toISOString(),
      next_review_at: existing?.next_review_at ?? nextReviewAt(existing?.confidence ?? null, existing?.last_score ?? null),
    },
    { onConflict: "user_id,question_id" },
  );
}


