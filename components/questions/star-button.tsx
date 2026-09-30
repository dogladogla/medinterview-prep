"use client";

import { Star } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toggleStar } from "@/lib/actions/progress";
import { cn } from "@/lib/utils";

export function StarButton({ questionId, initial }: { questionId: string; initial: boolean }) {
  const [pending, start] = useTransition();
  const [starred, setStarred] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-pressed={starred}
        disabled={pending}
        onClick={() => {
          const next = !starred;
          setStarred(next); // optimistic
          setError(null);
          start(async () => {
            const res = await toggleStar(questionId, next);
            if (!res.ok) {
              setStarred(!next); // roll back
              setError(res.error);
            }
          });
        }}
      >
        <Star className={cn(starred && "fill-amber-400 text-amber-500")} aria-hidden />
        {starred ? "Starred" : "Star"}
      </Button>
      {error && (
        <span role="alert" className="text-destructive text-xs">
          {error}
        </span>
      )}
    </span>
  );
}
