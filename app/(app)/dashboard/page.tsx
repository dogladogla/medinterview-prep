import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);
  const name = profile?.display_name;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{name ? `Welcome back, ${name}` : "Welcome"}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your progress will appear here</CardTitle>
          <CardDescription>
            Questions attempted, score trends and weakest categories arrive in M7. Start with the question bank.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/questions">Go to questions</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
