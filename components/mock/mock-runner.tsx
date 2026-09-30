"use client";

import { Loader2, SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Prose } from "@/components/content/prose";
import { formatClock, useCountdown } from "@/components/questions/countdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { completeMockSession, submitMockAnswer } from "@/lib/actions/mock";
import { cn } from "@/lib/utils";

export type RunnerStation = {
  position: number;
  questionText: string;
  stationBrief: string | null;
  categoryName: string;
};

type Phase = "prep" | "answer" | "saving" | "finishing";

export function MockRunner({
  sessionId,
  stations,
  answeredPositions,
  prepSeconds,
  answerSeconds,
}: {
  sessionId: string;
  stations: RunnerStation[];
  answeredPositions: number[];
  prepSeconds: number;
  answerSeconds: number;
}) {
  const router = useRouter();
  // Resume at the first unanswered station (e.g. after a reload).
  const remaining = stations.filter((s) => !answeredPositions.includes(s.position));
  const [queueIndex, setQueueIndex] = useState(0);
  const station = remaining[queueIndex];
  const [phase, setPhase] = useState<Phase>(prepSeconds > 0 ? "prep" : "answer");
  const [endAt, setEndAt] = useState<number>(() => Date.now() + (prepSeconds > 0 ? prepSeconds : answerSeconds) * 1000);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const textValue = useRef(text);
  useEffect(() => {
    textValue.current = text;
  }, [text]);

  const finish = useCallback(async () => {
    setPhase("finishing");
    const r = await completeMockSession(sessionId);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    router.refresh();
  }, [router, sessionId]);

  const startAnswer = useCallback(() => {
    setPhase("answer");
    setEndAt(Date.now() + answerSeconds * 1000);
    setAnnounce("Answer time has started.");
    requestAnimationFrame(() => textRef.current?.focus());
  }, [answerSeconds]);

  const submit = useCallback(async () => {
    if (!station) return;
    setPhase("saving");
    setError(null);
    const r = await submitMockAnswer(sessionId, station.position, textValue.current);
    if (!r.ok) {
      setError(r.error);
      setPhase("answer");
      setEndAt(Date.now() + 60_000); // grace minute to retry
      return;
    }
    setText("");
    if (queueIndex + 1 >= remaining.length) {
      await finish();
      return;
    }
    setQueueIndex((i) => i + 1);
    if (prepSeconds > 0) {
      setPhase("prep");
      setEndAt(Date.now() + prepSeconds * 1000);
      setAnnounce("Next station. Reading time has started.");
    } else {
      startAnswer();
    }
  }, [finish, prepSeconds, queueIndex, remaining.length, sessionId, startAnswer, station]);

  const onExpire = useCallback(() => {
    if (phase === "prep") startAnswer();
    else if (phase === "answer") {
      setAnnounce("Time is up. Your answer has been submitted.");
      void submit();
    }
  }, [phase, startAnswer, submit]);

  const { remainingSec } = useCountdown(phase === "prep" || phase === "answer" ? endAt : null, onExpire);

  // Warn before leaving mid-answer.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (phase === "answer" && textValue.current.trim()) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  // Everything already answered (e.g. reload after last submit): just finish.
  useEffect(() => {
    if (remaining.length === 0) void finish();
  }, [remaining.length, finish]);

  if (!station || phase === "finishing") {
    return (
      <div className="bg-card flex items-center gap-3 rounded-xl border p-6" role="status">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        <span>Finishing your mock and preparing feedback…</span>
        {error && <span className="text-destructive text-sm">{error}</span>}
      </div>
    );
  }

  const total = stations.length;
  const stationNumber = station.position + 1;
  const low = phase === "answer" && remainingSec <= 30;

  return (
    <div className="space-y-5">
      <p className="sr-only" role="status" aria-live="assertive">
        {announce}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-sm">
            Station {stationNumber} of {total} · {station.categoryName}
          </p>
          <p className="font-medium">{phase === "prep" ? "Reading time" : phase === "saving" ? "Saving…" : "Answer time"}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            role="timer"
            aria-label={phase === "prep" ? "Reading time remaining" : "Answer time remaining"}
            className={cn(
              "rounded-lg border px-3 py-1 font-mono text-2xl tabular-nums",
              low && "border-destructive text-destructive",
            )}
          >
            {formatClock(remainingSec)}
          </span>
          {phase === "prep" && (
            <Button type="button" variant="outline" onClick={startAnswer}>
              <SkipForward aria-hidden /> Start answering
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card space-y-4 rounded-xl border p-5" aria-live="polite">
        {station.stationBrief && (
          <div className="bg-accent/40 rounded-lg p-4">
            <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase">Station brief</p>
            <Prose text={station.stationBrief} />
          </div>
        )}
        <p className="text-lg font-medium text-pretty">{station.questionText}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mock-answer">Your answer</Label>
        <Textarea
          id="mock-answer"
          ref={textRef}
          rows={10}
          maxLength={8000}
          disabled={phase !== "answer"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            phase === "prep" ? "Reading time — plan your answer. You can type once answer time starts." : "Speak your answer aloud, then type the key points you made…"
          }
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">It submits automatically when time runs out.</p>
          <Button type="button" disabled={phase !== "answer"} onClick={() => void submit()}>
            {phase === "saving" && <Loader2 className="animate-spin" aria-hidden />}
            {queueIndex + 1 >= remaining.length ? "Submit and finish" : "Submit and next station"}
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
