"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function DebriefRetry({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-2 rounded-xl border border-dashed p-4">
      <p className="text-sm">Your debrief hasn&apos;t been generated yet.</p>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setError(null);
            const res = await fetch("/api/ai/interviewer", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "end", sessionId }),
            }).catch(() => null);
            const body = (await res?.json().catch(() => null)) as { ok: boolean; error?: string } | null;
            if (body?.ok) router.refresh();
            else setError(body?.error ?? "Couldn't generate the debrief.");
          })
        }
      >
        {pending ? <Loader2 className="animate-spin" aria-hidden /> : <RefreshCw aria-hidden />}
        Generate debrief
      </Button>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
