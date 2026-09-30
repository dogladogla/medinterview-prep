import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lock } from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { SettingsForm } from "@/components/settings/settings-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteMyData } from "@/lib/actions/settings";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { dailyLimit, hasFeature, type FeatureKey } from "@/lib/features/has-feature";
import { aiConfigured, getFlags, getMyProfile } from "@/lib/features/server";

export const metadata: Metadata = { title: "Settings" };

const TIER_LABEL = { free: "Free", pro: "Pro", premium: "Premium" } as const;
const FEATURE_LABEL: Record<FeatureKey, string> = {
  ai_feedback: "AI feedback on answers",
  mock_station: "Timed mock stations",
  ai_interviewer: "AI interviewer",
  progress: "Progress dashboard",
};

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const { deleted } = await searchParams;
  const [{ supabase, user }, profile, flags, idx] = await Promise.all([getSession(), getMyProfile(), getFlags(), getIndexes()]);
  if (!user || !profile) return null;

  const [{ data: targets }, { data: usage }] = await Promise.all([
    supabase.from("profile_target_universities").select("university_id").eq("profile_id", user.id),
    supabase
      .from("ai_usage")
      .select("feature_key, count")
      .eq("day", new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" })),
  ]);
  const usedToday = new Map((usage ?? []).map((u) => [u.feature_key, u.count]));

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Settings" />

      <section className="bg-card space-y-4 rounded-xl border p-5" aria-labelledby="profile-h">
        <h2 id="profile-h" className="font-semibold">
          Profile
        </h2>
        <p className="text-muted-foreground text-sm">Signed in as {user.email}</p>
        <SettingsForm
          displayName={profile.display_name ?? ""}
          applicantType={profile.applicant_type}
          universities={idx.universities.map((u) => ({ id: u.id, name: u.name }))}
          targetIds={(targets ?? []).map((t) => t.university_id)}
        />
      </section>

      <section className="bg-card space-y-4 rounded-xl border p-5" aria-labelledby="plan-h">
        <div className="flex items-baseline justify-between">
          <h2 id="plan-h" className="font-semibold">
            Plan
          </h2>
          <span className="text-sm">
            Current plan: <strong>{TIER_LABEL[profile.tier]}</strong>
          </span>
        </div>
        <ul className="divide-y rounded-lg border text-sm">
          {(Object.keys(FEATURE_LABEL) as FeatureKey[]).map((key) => {
            const on = hasFeature(flags, profile.tier, key);
            const limit = dailyLimit(flags, profile.tier, key);
            const isAi = key === "ai_feedback" || key === "ai_interviewer";
            return (
              <li key={key} className="flex flex-wrap items-center justify-between gap-2 p-3">
                <span className="flex items-center gap-2">
                  {on ? <Check className="text-primary size-4" aria-label="Included" /> : <Lock className="text-muted-foreground size-4" aria-label="Not included" />}
                  {FEATURE_LABEL[key]}
                </span>
                {on && isAi && (
                  <span className="text-muted-foreground">
                    {!aiConfigured() ? "Not switched on yet" : limit == null ? "Unlimited" : `${usedToday.get(key) ?? 0} of ${limit} used today`}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="text-muted-foreground text-xs">All features are free during launch. Daily AI limits reset at midnight UK time.</p>
      </section>

      <section className="border-destructive/40 space-y-3 rounded-xl border p-5" aria-labelledby="danger-h">
        <h2 id="danger-h" className="font-semibold">
          Delete my data
        </h2>
        <p className="text-muted-foreground text-sm">
          Permanently deletes your answers, AI feedback, interview transcripts, progress and settings in this app. This can&apos;t be
          undone. See our <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">privacy notice</Link>.
        </p>
        {deleted === "0" && (
          <p role="alert" className="text-destructive text-sm">
            Nothing was deleted — type DELETE exactly to confirm.
          </p>
        )}
        <form action={deleteMyData} className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Type DELETE to confirm</Label>
            <Input id="confirm" name="confirm" autoComplete="off" className="w-40" />
          </div>
          <Button type="submit" variant="destructive">
            Delete my data
          </Button>
        </form>
      </section>
    </div>
  );
}
