"use client";

import { useState, useTransition } from "react";

import { setConfidence } from "@/lib/actions/progress";
import { cn } from "@/lib/utils";

const LABELS = ["", "Not at all", "Shaky", "Getting there", "Confident", "Nailed it"];

export function ConfidenceRating({ questionId, initial }: { questionId: string; initial: number | null }) {
  const [value, setValue] = useState<number | null>(initial);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [pending, start] = useTransition();

  return (
    <fieldset className="space-y-2" disabled={pending}>
      <legend className="text-sm font-medium">How confident do you feel answering this now?</legend>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={cn(
              "has-focus-visible:ring-ring/50 cursor-pointer rounded-md border px-3 py-1.5 text-sm has-focus-visible:ring-[3px]",
              value === n ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted",
            )}
          >
            <input
              type="radio"
              name={`confidence-${questionId}`}
              value={n}
              checked={value === n}
              className="sr-only"
              onChange={() => {
                setValue(n);
                start(async () => {
                  const r = await setConfidence(questionId, n);
                  setStatus(r.ok ? "saved" : "error");
                });
              }}
            />
            {n} · {LABELS[n]}
          </label>
        ))}
      </div>
      <p className="text-muted-foreground min-h-5 text-xs" role="status" aria-live="polite">
        {status === "saved" && "Saved. Lower ratings bring this question back for review sooner."}
        {status === "error" && <span className="text-destructive">Couldn&apos;t save — please try again.</span>}
      </p>
    </fieldset>
  );
}
