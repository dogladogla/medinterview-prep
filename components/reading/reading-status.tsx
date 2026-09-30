"use client";

import { Bookmark, Check } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { setReadingStatus } from "@/lib/actions/reading";
import type { ReadingStatus as Status } from "@/types/database.types";

export function ReadingStatusButtons({ itemId, initial }: { itemId: string; initial: Status }) {
  const [status, setStatus] = useState<Status>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const change = (next: Status) => {
    const prev = status;
    setStatus(next);
    setError(null);
    start(async () => {
      const r = await setReadingStatus(itemId, next);
      if (!r.ok) {
        setStatus(prev);
        setError(r.error);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        size="sm"
        variant={status === "read" ? "default" : "outline"}
        aria-pressed={status === "read"}
        disabled={pending}
        onClick={() => change(status === "read" ? "unread" : "read")}
      >
        <Check aria-hidden /> {status === "read" ? "Read" : "Mark as read"}
      </Button>
      <Button
        type="button"
        size="sm"
        variant={status === "bookmarked" ? "default" : "outline"}
        aria-pressed={status === "bookmarked"}
        disabled={pending}
        onClick={() => change(status === "bookmarked" ? "unread" : "bookmarked")}
      >
        <Bookmark aria-hidden /> {status === "bookmarked" ? "Saved" : "Save for later"}
      </Button>
      {error && (
        <span role="alert" className="text-destructive text-xs">
          {error}
        </span>
      )}
    </div>
  );
}
