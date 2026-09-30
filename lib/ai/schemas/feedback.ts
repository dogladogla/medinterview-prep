import { z } from "zod";

// Shared by the AI call (tool input schema), the database JSON and the UI.

const score = z.number().int().min(1).max(5);

export const DimensionSchema = z.object({
  score: score.describe("1 = weak, 3 = solid for a strong applicant, 5 = exceptional"),
  rationale: z.string().min(1).max(600).describe("Why this score, referring to what the student actually said"),
  improvement: z.string().min(1).max(400).describe("One specific, actionable improvement — never a rewritten answer"),
});

export const RUBRIC_DIMENSIONS = [
  { key: "structure", label: "Structure" },
  { key: "content_insight", label: "Content & insight" },
  { key: "personalisation", label: "Personalisation" },
  { key: "communication", label: "Communication" },
  { key: "depth", label: "Depth" },
] as const;

export type DimensionKey = (typeof RUBRIC_DIMENSIONS)[number]["key"];

export const FeedbackSchema = z.object({
  structure: DimensionSchema,
  content_insight: DimensionSchema,
  personalisation: DimensionSchema,
  communication: DimensionSchema,
  depth: DimensionSchema,
  overall_summary: z.string().min(1).max(700),
  what_worked: z.array(z.string().min(1).max(300)).min(1).max(3),
  what_to_sharpen: z.array(z.string().min(1).max(300)).min(1).max(3),
  one_thing_to_practise: z.string().min(1).max(400),
  /** Set when the answer isn't a genuine attempt (blank, off-topic, too short to assess). */
  not_assessable: z.boolean(),
  /** Supportive note if the answer suggests the student may be struggling or at risk. Otherwise empty. */
  wellbeing_note: z.string().max(600),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

export function overallScore(f: Feedback): number {
  const total = RUBRIC_DIMENSIONS.reduce((sum, d) => sum + f[d.key].score, 0);
  return Math.round((total / RUBRIC_DIMENSIONS.length) * 100) / 100;
}

export function scoresOnly(f: Feedback): Record<DimensionKey, number> {
  return Object.fromEntries(RUBRIC_DIMENSIONS.map((d) => [d.key, f[d.key].score])) as Record<DimensionKey, number>;
}

/** Safely read feedback stored as JSON; returns null if malformed. */
export function parseStoredFeedback(v: unknown): Feedback | null {
  const r = FeedbackSchema.safeParse(v);
  return r.success ? r.data : null;
}
