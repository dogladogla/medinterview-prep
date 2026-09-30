// Pure spaced-repetition maths (no server imports, so it can be unit-tested).

/**
 * Spaced-repetition interval. Lower confidence or a low AI score brings the
 * question back sooner. Returns days until next review.
 */
export function reviewIntervalDays(confidence: number | null, score: number | null): number {
  const levels = [confidence, score == null ? null : Math.round(score)].filter((x): x is number => x != null);
  const level = levels.length ? Math.min(...levels) : 2;
  return { 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 }[Math.max(1, Math.min(5, level))] ?? 2;
}

export function nextReviewAt(confidence: number | null, score: number | null, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + reviewIntervalDays(confidence, score));
  return d.toISOString();
}
