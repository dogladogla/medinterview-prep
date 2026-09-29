import type { FeatureFlag, UserTier } from "@/types/database.types";

export type FeatureKey = "ai_feedback" | "mock_station" | "ai_interviewer" | "progress";

/**
 * Whether a tier has access to a feature. Unknown flags default to OFF so a
 * typo can never accidentally unlock something.
 */
export function hasFeature(flags: readonly FeatureFlag[], tier: UserTier, key: FeatureKey): boolean {
  const flag = flags.find((f) => f.key === key);
  if (!flag) return false;
  switch (tier) {
    case "free":
      return flag.free_enabled;
    case "pro":
      return flag.pro_enabled;
    case "premium":
      return flag.premium_enabled;
  }
}

/** Daily usage cap for a tier; null means unlimited. */
export function dailyLimit(flags: readonly FeatureFlag[], tier: UserTier, key: FeatureKey): number | null {
  const flag = flags.find((f) => f.key === key);
  if (!flag) return 0;
  switch (tier) {
    case "free":
      return flag.free_daily_limit;
    case "pro":
      return flag.pro_daily_limit;
    case "premium":
      return flag.premium_daily_limit;
  }
}
