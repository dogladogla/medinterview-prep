import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Profile } from "@/types/database.types";

type Client = SupabaseClient<Database, "interview">;

/**
 * Auth is shared with other apps in this Supabase project, so there is no
 * auth.users trigger. Instead the profile is created on first sign-in.
 * `ignoreDuplicates` makes this safe to call on every login.
 */
export async function ensureProfile(supabase: Client, userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new Error(`Could not create profile: ${error.message}`);
}

export async function getCurrentProfile(supabase: Client): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (error) throw new Error(`Could not load profile: ${error.message}`);
  return data;
}
