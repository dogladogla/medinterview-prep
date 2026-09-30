import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, MessagesSquare, Star, Timer } from "lucide-react";
import type { ReactNode } from "react";

import { ScoreTrend } from "@/components/dashboard/score-trend";
import { ScoreBar } from "@/components/feedback/feedback-card";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { getIndexes } from "@/lib/content/queries";
import type { Question } from "@/lib/content/types";
import { loadDashboard } from "@/lib/dashboard";
import { canUse, getMyProfile } from "@/lib/features/server";
import { FeatureLocked } from "@/components/feature-locked";
import { FORMAT_LABEL, formatDate, formatScore } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [{ supabase, user }, idx, profile] = await Promise.all([getSession(), getIndexes(), getMyProfile()]);
  if (!user) return null; // layout redirects
  if (!(await canUse("progress"))) return <FeatureLocked title="The progress dashboard" />;
  const d = await loadDashboard(supabase, user.id, idx);
  const name = profile?.display_name;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{name ? `Welcome back, ${name}` : "Your dashboard"}</h1>
          <p className="text-muted-foreground mt-1">
            {d.isNew ? "Start with a question or two — your progress will build up here." : "Here's where you are and what to do next."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/mock">
              <Timer aria-hidden /> Start a mock
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/interviewer">
              <MessagesSquare aria-hidden /> AI interviewer
            </Link>
          </Button>
        </div>
      </header>

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Questions attempted" value={d.stats.questionsAttempted} sub={`of ${d.stats.totalQuestions}`} />
        <Stat
          label="Average recent score"
          value={d.stats.avgRecent == null ? "—" : d.stats.avgRecent.toFixed(1)}
          sub={d.stats.scoredCount ? `last ${Math.min(20, d.stats.scoredCount)} scored answers` : "no scored answers yet"}
        />
        <Stat label="Mocks completed" value={d.stats.mocksCompleted} />
        <Stat label="AI interviews" value={d.stats.interviewsCompleted} />
        <Stat label="Frameworks viewed" value={d.stats.frameworksViewed} sub={`of ${d.stats.totalFrameworks}`} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Recommended next" icon={Compass}>
          {d.due.length > 0 && (
            <QuestionList heading="Due for review" questions={d.due} note="You rated these lower or they're scheduled for another go." />
          )}
          {d.fresh.length > 0 && (
            <QuestionList
              heading={d.categoryStrength[0] ? `New questions — including ${d.categoryStrength[0].category.name}` : "Good places to start"}
              questions={d.fresh}
            />
          )}
          {d.due.length === 0 && d.fresh.length === 0 && (
            <p className="text-muted-foreground text-sm">You&apos;ve attempted everything available. Try a mock to test yourself under time pressure.</p>
          )}
        </Panel>

        <Panel title="Last 14 days" icon={Timer}>
          <p className="text-sm">
            You practised on <strong>{d.activeDayCount}</strong> of the last 14 days.
          </p>
          <ol className="mt-3 grid grid-cols-7 gap-1.5" aria-label="Practice days, oldest first">
            {d.days.map((day) => (
              <li
                key={day.key}
                title={day.label}
                aria-label={`${day.label}: ${day.active ? "practised" : "no practice"}`}
                className={cn("h-7 rounded-md border", day.active ? "bg-primary border-primary" : "bg-muted")}
              />
            ))}
          </ol>
          <p className="text-muted-foreground mt-3 text-xs">Little and often beats cramming — a few questions a day is plenty.</p>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="AI score trend" icon={ArrowRight}>
          {d.trend.length >= 2 ? (
            <>
              <p className="text-muted-foreground text-sm">Overall rubric score (1–5) for your last {d.trend.length} scored answers.</p>
              <ScoreTrend data={d.trend} />
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              Get AI feedback on at least two answers to see your trend. Try a question from the bank or a quick mock.
            </p>
          )}
        </Panel>

        <Panel title="By category" icon={BookOpen}>
          {d.categoryStrength.length ? (
            <>
              <p className="text-muted-foreground mb-3 text-sm">Weakest first, from AI scores (or your confidence ratings).</p>
              <ul className="space-y-2">
                {d.categoryStrength.map((c) => (
                  <li key={c.category.id} className="flex items-center justify-between gap-3 text-sm">
                    <Link href={`/questions?category=${c.category.slug}`} className="hover:text-primary underline-offset-4 hover:underline">
                      {c.category.name}
                    </Link>
                    <ScoreBar score={Math.max(1, Math.round(c.avg))} label={c.category.name} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Rate your confidence on a few questions to see where to focus.</p>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Starred" icon={Star}>
          {d.starred.length ? (
            <ul className="space-y-1.5 text-sm">
              {d.starred.slice(0, 8).map((q) => (
                <li key={q.id}>
                  <Link href={`/questions/${q.slug}`} className="hover:text-primary underline-offset-4 hover:underline">
                    {q.questionText}
                  </Link>
                </li>
              ))}
              {d.starred.length > 8 && (
                <li>
                  <Link href="/questions?starred=1" className="text-primary text-sm">
                    All {d.starred.length} starred →
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">Star questions you want to come back to.</p>
          )}
        </Panel>
        <Panel title="Recent mocks" icon={Timer}>
          {d.recentMocks.length ? (
            <ul className="space-y-1.5 text-sm">
              {d.recentMocks.map((s) => (
                <li key={s.id} className="flex justify-between gap-2">
                  <Link href={`/mock/${s.id}`} className="hover:text-primary underline-offset-4 hover:underline">
                    {formatDate(s.started_at)} {s.format ? `· ${FORMAT_LABEL[s.format]}` : ""}
                  </Link>
                  <span className="tabular-nums">{s.completed_at ? formatScore(s.total_score) : "In progress"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No mocks yet.</p>
          )}
        </Panel>
        <Panel title="Recent interviews" icon={MessagesSquare}>
          {d.recentInterviews.length ? (
            <ul className="space-y-1.5 text-sm">
              {d.recentInterviews.map((s) => (
                <li key={s.id} className="flex justify-between gap-2">
                  <Link href={`/interviewer/${s.id}`} className="hover:text-primary underline-offset-4 hover:underline">
                    {idx.personaById.get(s.persona_id)?.name ?? "Interview"} · {formatDate(s.started_at)}
                  </Link>
                  <span className="text-muted-foreground">{s.status === "active" ? "In progress" : "Debrief"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No interviews yet.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="bg-card rounded-xl border p-4">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof Star; children: ReactNode }) {
  return (
    <section className="bg-card space-y-3 rounded-xl border p-5">
      <h2 className="flex items-center gap-2 font-semibold">
        <Icon className="text-primary size-4" aria-hidden /> {title}
      </h2>
      {children}
    </section>
  );
}

function QuestionList({ heading, questions, note }: { heading: string; questions: Question[]; note?: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{heading}</h3>
      {note && <p className="text-muted-foreground text-xs">{note}</p>}
      <ul className="space-y-1.5">
        {questions.map((q) => (
          <li key={q.id}>
            <Link href={`/questions/${q.slug}`} className="hover:bg-muted/60 flex items-center justify-between gap-3 rounded-lg border p-2.5 text-sm">
              <span>{q.questionText}</span>
              <ArrowRight className="text-muted-foreground size-4 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
