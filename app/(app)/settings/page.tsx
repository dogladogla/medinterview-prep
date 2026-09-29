import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

const TIER_LABEL = { free: "Free", pro: "Pro", premium: "Premium" } as const;

export default async function SettingsPage() {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    profile,
  ] = await Promise.all([supabase.auth.getUser(), getCurrentProfile(supabase)]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{user?.email}</dd>
            <dt className="text-muted-foreground">Plan</dt>
            <dd>{profile ? TIER_LABEL[profile.tier] : "—"}</dd>
          </dl>
          <p className="text-muted-foreground mt-4 text-sm">
            Display name and target universities become editable in M9.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
