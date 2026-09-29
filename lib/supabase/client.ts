import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";
import { DB_SCHEMA, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./env";

export function createClient() {
  return createBrowserClient<Database, typeof DB_SCHEMA>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    db: { schema: DB_SCHEMA },
  });
}
