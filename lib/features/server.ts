import "server-only";

import { cache } from "react";

import { getSession } from "@/lib/auth";
import { hasFeature, type FeatureKey } from "@/lib/features/has-feature";
import { ensureProfile } from "@/lib/profile";
import type { FeatureFlag, Profile } from "@/types/database.types";

/** True when the server has an Anthropic key configured. */
export function aiConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export const getFlags = cache(async (): Promise<FeatureFlag[]> => {
  const { supabase } = await getSession();
  const { data } = await supabase.from("feature_flags").select("*");
  return data ?? [];
});

export const getMyProfile = cache(async (): Promise<Profile | null> => {
  const { supabase, user } = await getSession();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (data) return data;
  // Layouts and pages render in parallel, so the (app) layout's ensureProfile may
  // not have finished yet on a first visit — create it here too (idempotent).
  await ensureProfile(supabase, user.id);
  const { data: created } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return created;
});

/**
 * Whether the current visitor can use a feature. Signed-out visitors are
 * treated as free tier (the feature pages themselves still require sign-in).
 */
export async function canUse(key: FeatureKey): Promise<boolean> {
  const [flags, profile] = await Promise.all([getFlags(), getMyProfile()]);
  return hasFeature(flags, profile?.tier ?? "free", key);
}

/** Feature is enabled for this user AND the AI backend is configured. */
export async function canUseAi(key: Extract<FeatureKey, "ai_feedback" | "ai_interviewer">): Promise<boolean> {
  return aiConfigured() && (await canUse(key));
}
