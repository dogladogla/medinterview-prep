import { CheckCircle2, HeartHandshake, Target, TrendingUp } from "lucide-react";

import { RUBRIC_DIMENSIONS, overallScore, type Feedback } from "@/lib/ai/schemas/feedback";
import { cn } from "@/lib/utils";

/** Structured rubric feedback. Server- and client-safe (no hooks). */
export function FeedbackCard({ feedback, className }: { feedback: Feedback; className?: string }) {
  const overall = overallScore(feedback);

  return (
    <section aria-label="AI feedback" className={cn("bg-card space-y-5 rounded-xl border p-5", className)}>
      {feedback.wellbeing_note && (
        <div role="note" className="bg-accent text-accent-foreground flex gap-3 rounded-lg p-4 text-sm">
          <HeartHandshake className="mt-0.5 size-5 shrink-0" aria-hidden />
          <p>{feedback.wellbeing_note}</p>
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold">Feedback</h3>
        {!feedback.not_assessable && (
          <p className="text-sm">
            Overall <span className="text-lg font-semibold tabular-nums">{overall.toFixed(1)}</span>
            <span className="text-muted-foreground"> / 5</span>
          </p>
        )}
      </div>

      <p className="leading-relaxed">{feedback.overall_summary}</p>

      {!feedback.not_assessable && (
        <dl className="grid gap-3 md:grid-cols-2">
          {RUBRIC_DIMENSIONS.map(({ key, label }) => {
            const d = feedback[key];
            return (
              <div key={key} className="rounded-lg border p-3">
                <dt className="flex items-center justify-between gap-2 text-sm font-medium">
                  {label}
                  <ScoreBar score={d.score} label={label} />
                </dt>
                <dd className="text-muted-foreground mt-2 space-y-1.5 text-sm">
                  <p>{d.rationale}</p>
                  <p className="text-foreground">
                    <span className="font-medium">Try: </span>
                    {d.improvement}
                  </p>
                </dd>
              </div>
            );
          })}
        </dl>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <FeedbackList icon={CheckCircle2} title="What worked" items={feedback.what_worked} />
        <FeedbackList icon={TrendingUp} title="What to sharpen" items={feedback.what_to_sharpen} />
        <div className="space-y-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Target className="text-primary size-4" aria-hidden /> One thing to practise next
          </h4>
          <p className="text-sm">{feedback.one_thing_to_practise}</p>
        </div>
      </div>
      <p className="text-muted-foreground text-xs">
        AI feedback is a practice aid, not an assessment by a medical school. Treat it as one opinion.
      </p>
    </section>
  );
}

function FeedbackList({ icon: Icon, title, items }: { icon: typeof CheckCircle2; title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="text-primary size-4" aria-hidden /> {title}
      </h4>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <span className="flex items-center gap-2" role="img" aria-label={`${label}: ${score} out of 5`}>
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={cn("h-2 w-4 rounded-sm", i <= score ? "bg-primary" : "bg-muted")} />
        ))}
      </span>
      <span className="text-muted-foreground text-xs tabular-nums" aria-hidden>
        {score}/5
      </span>
    </span>
  );
}
