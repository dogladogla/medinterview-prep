import "server-only";

import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/** Per-request memoised Supabase client + verified user (null when signed out). */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
});

export type ServerSupabase = Awaited<ReturnType<typeof getSession>>["supabase"];
