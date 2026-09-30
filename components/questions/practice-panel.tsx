"use client";

import Link from "next/link";
import { Eye, Loader2, Sparkles, Timer } from "lucide-react";
import { useRef, useState, useTransition, type ReactNode } from "react";

import { FeedbackCard } from "@/components/feedback/feedback-card";
import { ConfidenceRating } from "@/components/questions/confidence-rating";
import { formatClock, useCountdown } from "@/components/questions/countdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPracticeAnswer, saveNotes } from "@/lib/actions/progress";
import { requestFeedback } from "@/lib/ai/client-api";
import type { Feedback } from "@/lib/ai/schemas/feedback";

type AiState =
  | { kind: "idle" }
  | { kind: "working" }
  | { kind: "done"; feedback: Feedback }
  | { kind: "error"; message: string };

const MAX = 8000;

export function PracticePanel({
  questionId,
  questionSlug,
  signedIn,
  aiAvailable,
  initialConfidence,
  initialNotes,
  guidance,
}: {
  questionId: string;
  questionSlug: string;
  signedIn: boolean;
  /** False when the feature flag is off or the AI service isn't configured. */
  aiAvailable: boolean;
  initialConfidence: number | null;
  initialNotes: string | null;
  guidance: ReactNode;
}) {
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [nudged, setNudged] = useState(false);
  const [ai, setAi] = useState<AiState>({ kind: "idle" });
  const [timerEnd, setTimerEnd] = useState<number | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const guidanceRef = useRef<HTMLHeadingElement>(null);
  const { remainingSec } = useCountdown(timerEnd, () => setTimeUp(true));

  function reveal() {
    if (!answer.trim() && !nudged) {
      setNudged(true);
      return;
    }
    setRevealed(true);
    // Move focus to the revealed guidance so keyboard and screen-reader users land on it.
    requestAnimationFrame(() => guidanceRef.current?.focus());
  }

  async function getFeedback() {
    setAi({ kind: "working" });
    const saved = await createPracticeAnswer(questionId, answer);
    if (!saved.ok) return setAi({ kind: "error", message: saved.error });
    const res = await requestFeedback(saved.data.answerId);
    setAi(res.ok ? { kind: "done", feedback: res.feedback } : { kind: "error", message: res.error });
  }

  const tooLong = answer.length > MAX;

  return (
    <div className="space-y-6">
      <section aria-labelledby="attempt-heading" className="bg-card space-y-4 rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="attempt-heading" className="font-semibold">
            Your attempt
          </h2>
          <div className="flex items-center gap-2">
            {timerEnd == null ? (
              <>
                <Timer className="text-muted-foreground size-4" aria-hidden />
                <span className="text-muted-foreground text-sm">Timer:</span>
                {[1, 2, 5].map((m) => (
                  <Button
                    key={m}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTimeUp(false);
                      setTimerEnd(Date.now() + m * 60_000);
                    }}
                  >
                    {m} min
                  </Button>
                ))}
              </>
            ) : (
              <>
                <span
                  role="timer"
                  aria-label="Time remaining"
                  className={`font-mono text-lg tabular-nums ${remainingSec <= 15 ? "text-destructive" : ""}`}
                >
                  {formatClock(remainingSec)}
                </span>
                <Button type="button" size="sm" variant="ghost" onClick={() => setTimerEnd(null)}>
                  Stop
                </Button>
              </>
            )}
          </div>
        </div>
        <p className="sr-only" role="status" aria-live="assertive">
          {timeUp ? "Time is up." : ""}
        </p>
        <p className="text-muted-foreground text-sm">
          Say your answer out loud first, then jot down the key points you made. Writing it helps you spot gaps — and
          it&apos;s what the AI feedback reads.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="answer" className="sr-only">
            Your answer
          </Label>
          <Textarea
            id="answer"
            rows={8}
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              if (ai.kind === "error") setAi({ kind: "idle" });
            }}
            placeholder="Type your answer or bullet points…"
            aria-invalid={tooLong || undefined}
            aria-describedby="answer-count"
          />
          <p id="answer-count" className={`text-right text-xs ${tooLong ? "text-destructive" : "text-muted-foreground"}`}>
            {answer.trim() ? answer.trim().split(/\s+/).length : 0} words{tooLong && " — too long (max 8,000 characters)"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!revealed && (
            <Button type="button" variant={nudged && !answer.trim() ? "outline" : "default"} onClick={reveal}>
              <Eye aria-hidden /> {nudged && !answer.trim() ? "Reveal anyway" : "Reveal guidance"}
            </Button>
          )}
          {signedIn ? (
            aiAvailable ? (
              <Button
                type="button"
                variant={revealed ? "default" : "secondary"}
                disabled={!answer.trim() || tooLong || ai.kind === "working"}
                onClick={getFeedback}
              >
                {ai.kind === "working" ? <Loader2 className="animate-spin" aria-hidden /> : <Sparkles aria-hidden />}
                {ai.kind === "working" ? "Reading your answer…" : ai.kind === "done" ? "Get fresh feedback" : "Get AI feedback"}
              </Button>
            ) : (
              <span className="text-muted-foreground text-sm">AI feedback is currently unavailable.</span>
            )
          ) : (
            <span className="text-muted-foreground text-sm">
              <Link href={`/login?next=/questions/${questionSlug}`} className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>{" "}
              to get AI feedback and track progress.
            </span>
          )}
        </div>
        {nudged && !answer.trim() && !revealed && (
          <p className="text-sm" role="status">
            Have a go first — even three bullet points. Attempting before you look is what makes the practice stick.
          </p>
        )}
        {ai.kind === "error" && (
          <p role="alert" className="text-destructive text-sm">
            {ai.message}
          </p>
        )}
      </section>

      {ai.kind === "working" && (
        <p className="text-muted-foreground flex items-center gap-2 text-sm" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden /> Your answer is being assessed against the rubric. This
          usually takes 10–20 seconds.
        </p>
      )}
      {ai.kind === "done" && <FeedbackCard feedback={ai.feedback} />}

      {signedIn && (revealed || ai.kind === "done") && (
        <section className="bg-card space-y-5 rounded-xl border p-5" aria-label="Track this question">
          <ConfidenceRating questionId={questionId} initial={initialConfidence} />
          <NotesBox questionId={questionId} initial={initialNotes} />
        </section>
      )}

      <div hidden={!revealed}>
        <h2 ref={guidanceRef} tabIndex={-1} className="mb-4 text-lg font-semibold outline-none">
          Guidance
        </h2>
        {guidance}
      </div>
    </div>
  );
}

function NotesBox({ questionId, initial }: { questionId: string; initial: string | null }) {
  const [notes, setNotes] = useState(initial ?? "");
  const [status, setStatus] = useState<string>("");
  const [pending, start] = useTransition();
  return (
    <div className="space-y-2">
      <Label htmlFor={`notes-${questionId}`}>Your notes</Label>
      <Textarea
        id={`notes-${questionId}`}
        rows={3}
        maxLength={4000}
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setStatus("");
        }}
        placeholder="Examples you'd use, phrases that worked, things to look up…"
      />
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await saveNotes(questionId, notes);
              setStatus(r.ok ? "Notes saved." : r.error);
            })
          }
        >
          Save notes
        </Button>
        <span className="text-muted-foreground text-xs" role="status" aria-live="polite">
          {status}
        </span>
      </div>
    </div>
  );
}
