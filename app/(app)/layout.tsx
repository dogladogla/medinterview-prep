import { redirect } from "next/navigation";

import { ensureProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

// Second line of defence behind middleware: every page in (app) requires a user,
// and guarantees their profile row exists (auth is shared, so no signup trigger).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  await ensureProfile(supabase, user.id);

  return <>{children}</>;
}
