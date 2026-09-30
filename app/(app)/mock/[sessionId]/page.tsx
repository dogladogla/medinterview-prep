import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/content/page-header";
import { Prose } from "@/components/content/prose";
import { FeedbackCard, ScoreBar } from "@/components/feedback/feedback-card";
import { FeedbackPoller, PendingFeedback } from "@/components/mock/feedback-pending";
import { MockRunner } from "@/components/mock/mock-runner";
import { Button } from "@/components/ui/button";
import { RUBRIC_DIMENSIONS, parseStoredFeedback } from "@/lib/ai/schemas/feedback";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import { aiConfigured } from "@/lib/features/server";
import { FORMAT_LABEL, formatDate, formatScore } from "@/lib/labels";

// Server actions invoked from this page (station submit + background feedback) share this limit.
export const maxDuration = 60;
export const metadata: Metadata = { title: "Mock session" };

type Props = { params: Promise<{ sessionId: string }> };

export default async function MockSessionPage({ params }: Props) {
  const { sessionId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(sessionId)) notFound();

  const { supabase } = await getSession();
  const [{ data: session }, { data: answers }, idx] = await Promise.all([
    supabase.from("mock_sessions").select("*").eq("id", sessionId).maybeSingle(),
    supabase.from("mock_answers").select("*").eq("session_id", sessionId).order("position"),
    getIndexes(),
  ]);
  if (!session) notFound();

  const stations = session.question_ids.map((qid, position) => {
    const q = idx.questionById.get(qid);
    return {
      position,
      question: q,
      categoryName: q ? (idx.categoryById.get(q.categoryId)?.name ?? "") : "",
    };
  });

  // ---- Still running: hand over to the timed runner.
  if (!session.completed_at) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <PageHeader title="Mock in progress" />
        <MockRunner
          sessionId={session.id}
          prepSeconds={session.prep_seconds}
          answerSeconds={session.answer_seconds}
          answeredPositions={(answers ?? []).map((a) => a.position)}
          stations={stations.map((s) => ({
            position: s.position,
            questionText: s.question?.questionText ?? "This question is no longer available.",
            stationBrief: s.question?.stationBrief ?? null,
            categoryName: s.categoryName,
          }))}
        />
      </div>
    );
  }

  // ---- Review.
  const byPosition = new Map((answers ?? []).map((a) => [a.position, a]));
  const parsed = stations.map((s) => {
    const a = byPosition.get(s.position);
    return { ...s, answer: a, feedback: a ? parseStoredFeedback(a.ai_feedback) : null };
  });
  const now = Date.now();
  const anyPending =
    aiConfigured() &&
    parsed.some((p) => p.answer && !p.feedback && !p.answer.feedback_error && now - Date.parse(p.answer.created_at) < 120_000);

  const scored = parsed.filter((p) => p.feedback && !p.feedback.not_assessable).map((p) => p.feedback!);
  const dimAverages = RUBRIC_DIMENSIONS.map((d) => ({
    ...d,
    avg: scored.length ? scored.reduce((s, f) => s + f[d.key].score, 0) / scored.length : null,
  }));
  const ranked = dimAverages.filter((d) => d.avg != null).sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));

  return (
    <div className="space-y-8">
      <FeedbackPoller active={anyPending} />
      <PageHeader
        title="Mock review"
        back={{ href: "/mock", label: "Mock station" }}
        description={`${formatDate(session.started_at)} · ${session.format ? FORMAT_LABEL[session.format] : "Mixed"} · ${session.question_ids.length} stations${
          session.university_id ? ` · ${idx.universityById.get(session.university_id)?.name ?? ""}` : ""
        }`}
      />

      <section className="bg-card grid gap-6 rounded-xl border p-5 md:grid-cols-[auto_1fr]" aria-label="Session summary">
        <div>
          <p className="text-muted-foreground text-sm">Session score</p>
          <p className="text-4xl font-semibold tabular-nums">
            {formatScore(session.total_score)}
            <span className="text-muted-foreground text-lg"> / 5</span>
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Average of {scored.length} scored station{scored.length === 1 ? "" : "s"}
          </p>
        </div>
        {ranked.length > 0 ? (
          <div className="space-y-3">
            <ul className="grid gap-2 sm:grid-cols-2">
              {dimAverages.map((d) => (
                <li key={d.key} className="flex items-center justify-between gap-3 text-sm">
                  <span>{d.label}</span>
                  {d.avg != null ? <ScoreBar score={Math.round(d.avg)} label={d.label} /> : <span>—</span>}
                </li>
              ))}
            </ul>
            <p className="text-sm">
              Strongest: <strong>{ranked[0]?.label}</strong>. Focus next on <strong>{ranked[ranked.length - 1]?.label}</strong>.
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground self-center text-sm">
            {anyPending ? "Scores will appear as feedback arrives." : "No scored stations yet."}
          </p>
        )}
      </section>

      <ol className="space-y-8">
        {parsed.map((p) => (
          <li key={p.position} className="space-y-3">
            <h2 className="text-lg font-semibold">
              Station {p.position + 1}
              {p.categoryName && <span className="text-muted-foreground font-normal"> · {p.categoryName}</span>}
            </h2>
            <div className="bg-card space-y-3 rounded-xl border p-5">
              {p.question?.stationBrief && <Prose text={p.question.stationBrief} className="text-muted-foreground text-sm" />}
              <p className="font-medium">{p.question?.questionText ?? "Question unavailable"}</p>
              {p.question && (
                <Link href={`/questions/${p.question.slug}`} className="text-primary text-sm underline-offset-4 hover:underline">
                  See the guidance and example answer →
                </Link>
              )}
            </div>
            {p.answer ? (
              <>
                <details className="rounded-xl border p-4" open={!p.feedback}>
                  <summary className="cursor-pointer text-sm font-medium">Your answer</summary>
                  <p className="mt-3 text-sm whitespace-pre-wrap">{p.answer.answer_text}</p>
                </details>
                {p.feedback ? (
                  <FeedbackCard feedback={p.feedback} />
                ) : aiConfigured() ? (
                  <PendingFeedback
                    answerId={p.answer.id}
                    error={p.answer.feedback_error}
                    stale={now - Date.parse(p.answer.created_at) >= 120_000}
                  />
                ) : null}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Not answered — the mock ended before this station.</p>
            )}
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/mock">Start another mock</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
