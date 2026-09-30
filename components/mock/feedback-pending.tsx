"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { requestFeedback } from "@/lib/ai/client-api";

/** Refreshes the page every few seconds while any feedback is still being generated. */
export function FeedbackPoller({ active, maxSeconds = 120 }: { active: boolean; maxSeconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const started = Date.now();
    const id = setInterval(() => {
      if (Date.now() - started > maxSeconds * 1000) clearInterval(id);
      else router.refresh();
    }, 5000);
    return () => clearInterval(id);
  }, [active, maxSeconds, router]);
  return null;
}

/** Shown for an answer without feedback: waiting state, or a retry after an error/timeout. */
export function PendingFeedback({ answerId, error, stale }: { answerId: string; error: string | null; stale: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(error);

  if (!error && !stale && !msg) {
    return (
      <p className="text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm" role="status">
        <Loader2 className="size-4 animate-spin" aria-hidden /> Feedback is being prepared…
      </p>
    );
  }
  return (
    <div className="space-y-2 rounded-lg border border-dashed p-4 text-sm">
      <p className={msg ? "text-destructive" : "text-muted-foreground"} role={msg ? "alert" : undefined}>
        {msg ?? "Feedback is taking longer than usual."}
      </p>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await requestFeedback(answerId);
            if (r.ok) {
              setMsg(null);
              router.refresh();
            } else setMsg(r.error);
          })
        }
      >
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <RefreshCw aria-hidden />}
        {pending ? "Generating…" : "Get feedback"}
      </Button>
    </div>
  );
}
