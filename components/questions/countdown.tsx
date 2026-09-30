"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wall-clock countdown: computes remaining time from a fixed end timestamp so
 * it stays accurate when the tab is throttled in the background.
 */
export function useCountdown(endAt: number | null, onExpire?: () => void) {
  const [now, setNow] = useState(() => Date.now());
  const fired = useRef(false);
  const expireRef = useRef(onExpire);
  useEffect(() => {
    expireRef.current = onExpire;
  });

  useEffect(() => {
    fired.current = false;
    if (endAt == null) return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t >= endAt && !fired.current) {
        fired.current = true;
        expireRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endAt]);

  const remainingMs = endAt == null ? 0 : Math.max(0, endAt - now);
  return { remainingMs, remainingSec: Math.ceil(remainingMs / 1000) };
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
