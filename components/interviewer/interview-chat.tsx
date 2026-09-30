"use client";

import { Loader2, Send, Square } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Entry = { role: "interviewer" | "student"; content: string; at: string };

async function post(body: object): Promise<{ ok: boolean; error?: string; reply?: Entry; ended?: boolean }> {
  try {
    const res = await fetch("/api/ai/interviewer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return ((await res.json().catch(() => null)) as { ok: boolean; error?: string }) ?? { ok: false, error: "Unexpected response." };
  } catch {
    return { ok: false, error: "Network error — check your connection and try again." };
  }
}

export function InterviewChat({
  sessionId,
  personaName,
  initial,
  maxAnswers,
  maxChars,
}: {
  sessionId: string;
  personaName: string;
  initial: Entry[];
  maxAnswers: number;
  maxChars: number;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ending">("idle");
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const answers = entries.filter((e) => e.role === "student").length;

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries.length, state]);

  async function end() {
    setState("ending");
    setError(null);
    const r = await post({ action: "end", sessionId });
    if (!r.ok) setError(r.error ?? "Couldn't generate the debrief — you can retry from the next page.");
    router.refresh();
  }

  async function send() {
    const message = text.trim();
    if (!message || state !== "idle") return;
    setState("sending");
    setError(null);
    const optimistic: Entry = { role: "student", content: message, at: new Date().toISOString() };
    setEntries((e) => [...e, optimistic]);
    setText("");
    const r = await post({ action: "turn", sessionId, message });
    if (!r.ok || !r.reply) {
      // Roll back so the student can resend without retyping.
      setEntries((e) => e.filter((x) => x !== optimistic));
      setText(message);
      setError(r.error ?? "Couldn't send your answer.");
      setState("idle");
      return;
    }
    setEntries((e) => [...e, r.reply!]);
    if (r.ended) await end();
    else setState("idle");
  }

  return (
    <div className="space-y-4">
      <div className="text-muted-foreground flex items-center justify-between text-sm">
        <span>
          Answer {Math.min(answers + 1, maxAnswers)} of up to {maxAnswers}
        </span>
        {answers > 0 && state === "idle" && (
          <Button type="button" variant="ghost" size="sm" onClick={end}>
            <Square aria-hidden /> End interview
          </Button>
        )}
      </div>

      <ol className="bg-card space-y-4 rounded-xl border p-4" aria-label="Interview transcript" aria-live="polite">
        {entries.map((e, i) => (
          <li key={i} className={cn("flex", e.role === "student" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                e.role === "student" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm",
              )}
            >
              <span className="sr-only">{e.role === "student" ? "You: " : `${personaName}: `}</span>
              {e.content}
            </div>
          </li>
        ))}
        {state !== "idle" && (
          <li className="text-muted-foreground flex items-center gap-2 text-sm" role="status">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            {state === "sending" ? `${personaName} is thinking…` : "Writing your debrief…"}
          </li>
        )}
      </ol>
      <div ref={bottom} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="space-y-2"
      >
        <Label htmlFor="chat-input" className="sr-only">
          Your answer
        </Label>
        <Textarea
          id="chat-input"
          rows={4}
          maxLength={maxChars}
          value={text}
          disabled={state !== "idle"}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="Answer as you would out loud…"
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">Ctrl/⌘ + Enter to send</span>
          <Button type="submit" disabled={!text.trim() || state !== "idle"}>
            <Send aria-hidden /> Send
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
