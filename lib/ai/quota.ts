import "server-only";

import type { ServerSupabase } from "@/lib/auth";

export type QuotaResult = { allowed: true } | { allowed: false; reason: "limit" | "disabled"; limit: number | null };

/** Atomically checks and consumes one unit of the user's daily allowance. */
export async function consumeQuota(supabase: ServerSupabase, feature: "ai_feedback" | "ai_interviewer"): Promise<QuotaResult> {
  const { data, error } = await supabase.rpc("consume_ai_quota", { p_feature: feature });
  if (error) throw new Error(`Quota check failed: ${error.message}`);
  const row = data?.[0];
  if (!row) return { allowed: false, reason: "disabled", limit: 0 };
  if (row.allowed) return { allowed: true };
  return { allowed: false, reason: row.daily_limit === 0 ? "disabled" : "limit", limit: row.daily_limit };
}

export function quotaMessage(q: Exclude<QuotaResult, { allowed: true }>): string {
  return q.reason === "limit"
    ? `You've reached today's limit of ${q.limit} AI requests for this feature. It resets at midnight (UK time).`
    : "This feature isn't available on your plan.";
}
