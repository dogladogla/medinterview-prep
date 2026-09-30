import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";
import { DB_SCHEMA, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./env";

/**
 * Cookie-free anonymous client for reading published content. Because it
 * never touches request cookies it can be used inside unstable_cache.
 */
export function createPublicClient() {
  return createSupabaseClient<Database, typeof DB_SCHEMA>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    db: { schema: DB_SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
