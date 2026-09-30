import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/content/page-header";
import { FeatureLocked } from "@/components/feature-locked";
import { MockConfigForm } from "@/components/mock/mock-config-form";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { aiConfigured, canUse } from "@/lib/features/server";
import { FORMAT_LABEL, formatDate, formatScore } from "@/lib/labels";

export const metadata: Metadata = { title: "Mock station" };

export default async function MockPage() {
  const [idx, allowed, { supabase }] = await Promise.all([getIndexes(), canUse("mock_station"), getSession()]);
  if (!allowed) return <FeatureLocked title="Mock stations" />;

  const { data: sessions } = await supabase
    .from("mock_sessions")
    .select("*")
    .eq("mode", "mock")
    .order("started_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mock station"
        description="Timed practice under realistic conditions. Each station has reading time, then answer time — and you get structured rubric feedback on every answer at the end."
      />
      {!aiConfigured() && (
        <p className="bg-muted rounded-lg p-3 text-sm">
          AI feedback isn&apos;t switched on yet, so you&apos;ll be able to practise and review your answers but not get
          scored feedback.
        </p>
      )}
      <section className="bg-card rounded-xl border p-5">
        <MockConfigForm universities={idx.universities.map((u) => ({ slug: u.slug, name: u.name }))} />
      </section>

      <section aria-labelledby="past-mocks" className="space-y-3">
        <h2 id="past-mocks" className="text-lg font-semibold">
          Your recent mocks
        </h2>
        {!sessions?.length ? (
          <p className="text-muted-foreground text-sm">No mocks yet — your first one will appear here.</p>
        ) : (
          <ul className="divide-y rounded-xl border">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link href={`/mock/${s.id}`} className="hover:bg-muted/50 flex flex-wrap items-center justify-between gap-3 p-3">
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{formatDate(s.started_at)}</span>
                    {s.format && <Badge variant="outline">{FORMAT_LABEL[s.format]}</Badge>}
                    <span className="text-muted-foreground text-sm">
                      {s.question_ids.length} station{s.question_ids.length === 1 ? "" : "s"}
                      {s.university_id && ` · ${idx.universityById.get(s.university_id)?.name ?? ""}`}
                    </span>
                  </span>
                  <span className="text-sm">
                    {s.completed_at ? (
                      <>
                        Score <span className="font-semibold tabular-nums">{formatScore(s.total_score)}</span>
                      </>
                    ) : (
                      <Badge variant="muted">In progress</Badge>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
