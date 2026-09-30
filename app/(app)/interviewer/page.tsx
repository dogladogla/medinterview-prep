import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/content/page-header";
import { FeatureLocked } from "@/components/feature-locked";
import { InterviewerStart } from "@/components/interviewer/interviewer-start";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { aiConfigured, canUse } from "@/lib/features/server";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = { title: "AI interviewer" };

export default async function InterviewerPage() {
  const [idx, allowed, { supabase }] = await Promise.all([getIndexes(), canUse("ai_interviewer"), getSession()]);
  if (!allowed) return <FeatureLocked title="The AI interviewer" />;
  if (!aiConfigured())
    return (
      <FeatureLocked
        title="The AI interviewer"
        reason="The AI service hasn't been switched on for this site yet. Question bank, frameworks and mock stations still work."
      />
    );

  const { data: sessions } = await supabase
    .from("interviewer_sessions")
    .select("id, persona_id, status, started_at, university_id")
    .order("started_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI interviewer"
        description="A text interview that asks one question at a time and follows up on what you say — the part real interviews are won and lost on. After 5–8 answers you get a debrief."
      />
      <section className="bg-card rounded-xl border p-5">
        <InterviewerStart
          personas={idx.personas.map((p) => ({
            slug: p.slug,
            name: p.name,
            description: p.description,
            followUpStyle: p.followUpStyle,
          }))}
          universities={idx.universities.map((u) => ({ slug: u.slug, name: u.name }))}
        />
      </section>
      <p className="text-muted-foreground text-sm">
        Tip: answer as you would out loud — full sentences, but don&apos;t polish. The interviewer is an AI and can make
        mistakes; it&apos;s for practice, not a prediction of how you&apos;ll do.
      </p>

      {sessions && sessions.length > 0 && (
        <section className="space-y-3" aria-labelledby="past-int">
          <h2 id="past-int" className="text-lg font-semibold">
            Past interviews
          </h2>
          <ul className="divide-y rounded-xl border">
            {sessions.map((s) => (
              <li key={s.id}>
                <Link href={`/interviewer/${s.id}`} className="hover:bg-muted/50 flex items-center justify-between gap-3 p-3">
                  <span>
                    <span className="font-medium">{idx.personaById.get(s.persona_id)?.name ?? "Interview"}</span>
                    <span className="text-muted-foreground text-sm">
                      {" "}
                      · {formatDate(s.started_at)}
                      {s.university_id && ` · ${idx.universityById.get(s.university_id)?.name ?? ""}`}
                    </span>
                  </span>
                  {s.status === "active" ? <Badge variant="muted">In progress</Badge> : <Badge variant="outline">Debrief</Badge>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
