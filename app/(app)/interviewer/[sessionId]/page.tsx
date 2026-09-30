import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, HeartHandshake, Target, TrendingUp } from "lucide-react";

import { PageHeader } from "@/components/content/page-header";
import { DebriefRetry } from "@/components/interviewer/debrief-retry";
import { InterviewChat } from "@/components/interviewer/interview-chat";
import { Button } from "@/components/ui/button";
import {
  INTERVIEW_MAX_ANSWERS,
  STUDENT_MESSAGE_MAX,
  parseDebrief,
  parseTranscript,
} from "@/lib/ai/schemas/interviewer";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { formatDate } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const maxDuration = 60;
export const metadata: Metadata = { title: "AI interview" };

export default async function InterviewSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(sessionId)) notFound();

  const [{ supabase }, idx] = await Promise.all([getSession(), getIndexes()]);
  const { data: session } = await supabase.from("interviewer_sessions").select("*").eq("id", sessionId).maybeSingle();
  if (!session) notFound();

  const persona = idx.personaById.get(session.persona_id);
  const university = session.university_id ? idx.universityById.get(session.university_id) : undefined;
  const transcript = parseTranscript(session.transcript);
  const personaName = persona?.name ?? "Interviewer";

  if (session.status === "active") {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <PageHeader
          title={`Interview with ${personaName}`}
          description={university ? `${university.name} style` : "General interview"}
          back={{ href: "/interviewer", label: "AI interviewer" }}
        />
        <InterviewChat
          sessionId={session.id}
          personaName={personaName}
          initial={transcript}
          maxAnswers={INTERVIEW_MAX_ANSWERS}
          maxChars={STUDENT_MESSAGE_MAX}
        />
      </div>
    );
  }

  const debrief = parseDebrief(session.ai_summary);
  const hasAnswers = transcript.some((t) => t.role === "student");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Interview debrief"
        back={{ href: "/interviewer", label: "AI interviewer" }}
        description={`${personaName} · ${formatDate(session.started_at)}${university ? ` · ${university.name} style` : ""}`}
      />

      {!hasAnswers ? (
        <p className="text-muted-foreground">This interview ended before you answered any questions, so there&apos;s nothing to review.</p>
      ) : debrief ? (
        <section className="bg-card space-y-6 rounded-xl border p-5" aria-label="Debrief">
          {debrief.wellbeing_note && (
            <div role="note" className="bg-accent flex gap-3 rounded-lg p-4 text-sm">
              <HeartHandshake className="mt-0.5 size-5 shrink-0" aria-hidden />
              <p>{debrief.wellbeing_note}</p>
            </div>
          )}
          <p className="leading-relaxed">{debrief.overall_summary}</p>
          <div className="grid gap-5 md:grid-cols-2">
            <List icon={CheckCircle2} title="Strengths" items={debrief.strengths} />
            <List icon={TrendingUp} title="Areas to develop" items={debrief.areas_to_develop} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Question by question</h3>
            <ul className="space-y-2">
              {debrief.exchanges.map((x, i) => (
                <li key={i} className="rounded-lg border p-3 text-sm">
                  <span className="font-medium">{x.topic}</span>
                  <p className="text-muted-foreground mt-1">{x.comment}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Handling follow-ups</h3>
            <p className="text-sm">{debrief.follow_up_handling}</p>
          </div>
          <div className="bg-accent/40 space-y-1 rounded-lg p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Target className="text-primary size-4" aria-hidden /> One thing to practise next
            </h3>
            <p className="text-sm">{debrief.one_thing_to_practise}</p>
          </div>
          {debrief.suggested_frameworks.length > 0 && (
            <p className="text-sm">
              Frameworks to revisit:{" "}
              {debrief.suggested_frameworks.map((slug, i) => {
                const f = idx.frameworkBySlug.get(slug);
                return f ? (
                  <span key={slug}>
                    {i > 0 && ", "}
                    <Link href={`/frameworks/${slug}`} className="text-primary underline-offset-4 hover:underline">
                      {f.name}
                    </Link>
                  </span>
                ) : null;
              })}
            </p>
          )}
          <p className="text-muted-foreground text-xs">AI debrief — a practice aid, not a prediction of your interview result.</p>
        </section>
      ) : (
        <DebriefRetry sessionId={session.id} />
      )}

      <section className="space-y-3" aria-labelledby="transcript-h">
        <h2 id="transcript-h" className="text-lg font-semibold">
          Transcript
        </h2>
        <ol className="space-y-3">
          {transcript.map((t, i) => (
            <li key={i} className={cn("rounded-lg p-3 text-sm whitespace-pre-wrap", t.role === "student" ? "bg-accent/50 ml-8" : "bg-muted mr-8")}>
              <span className="mb-1 block text-xs font-semibold">{t.role === "student" ? "You" : personaName}</span>
              {t.content}
            </li>
          ))}
        </ol>
      </section>
      <Button asChild>
        <Link href="/interviewer">Start another interview</Link>
      </Button>
    </div>
  );
}

function List({ icon: Icon, title, items }: { icon: typeof CheckCircle2; title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="text-primary size-4" aria-hidden /> {title}
      </h3>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
