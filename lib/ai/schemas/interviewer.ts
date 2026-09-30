import { z } from "zod";

export const INTERVIEW_MIN_ANSWERS = 5;
export const INTERVIEW_MAX_ANSWERS = 8;
export const STUDENT_MESSAGE_MAX = 3000;

export const TranscriptEntrySchema = z.object({
  role: z.enum(["interviewer", "student"]),
  content: z.string(),
  at: z.string(),
});
export type TranscriptEntry = z.infer<typeof TranscriptEntrySchema>;

export function parseTranscript(v: unknown): TranscriptEntry[] {
  const r = z.array(TranscriptEntrySchema).safeParse(v);
  return r.success ? r.data : [];
}

export const InterviewerTurnSchema = z.object({
  message: z
    .string()
    .min(1)
    .max(1200)
    .describe("What you say next, in character: a brief reaction if appropriate, then ONE question (or your closing words)."),
  ends_interview: z.boolean().describe("True only when you are closing the interview and asking no further question."),
});
export type InterviewerTurn = z.infer<typeof InterviewerTurnSchema>;

export const DebriefSchema = z.object({
  overall_summary: z.string().min(1).max(900),
  strengths: z.array(z.string().min(1).max(300)).min(1).max(3),
  areas_to_develop: z.array(z.string().min(1).max(300)).min(1).max(3),
  exchanges: z
    .array(z.object({ topic: z.string().min(1).max(120), comment: z.string().min(1).max(400) }))
    .max(8)
    .describe("One short comment per question topic discussed, in order."),
  follow_up_handling: z.string().min(1).max(500).describe("How well the student handled follow-up and challenge questions."),
  one_thing_to_practise: z.string().min(1).max(400),
  suggested_frameworks: z.array(z.string()).max(3).describe("Slugs from the provided framework list only."),
  wellbeing_note: z.string().max(600).describe("Empty unless the wellbeing guardrail applies."),
});
export type Debrief = z.infer<typeof DebriefSchema>;

export function parseDebrief(v: unknown): Debrief | null {
  const r = DebriefSchema.safeParse(v);
  return r.success ? r.data : null;
}
