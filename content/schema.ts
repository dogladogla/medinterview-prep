import { z } from "zod";

// Source-of-truth content model. Edit the files in /content, then run
// `npm run seed:build` to validate and regenerate supabase/seed/*.sql.

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");
const text = z.string().trim().min(1);

export const InterviewFormat = z.enum(["mmi", "panel", "group", "online", "oxbridge"]);
export type InterviewFormat = z.infer<typeof InterviewFormat>;

export const CategorySchema = z.object({
  slug,
  name: text,
  description: text,
  icon: text,
});
export type Category = z.infer<typeof CategorySchema>;

export const FrameworkSchema = z.object({
  slug,
  name: text,
  category: z.enum(["ethics", "reflection", "communication", "structure"]),
  summary: text,
  whenToUse: text,
  steps: z.array(z.object({ title: text, detail: text })).min(2),
  workedExample: text,
  /** Question whose exemplar demonstrates this framework (must exist). */
  workedExampleQuestion: slug.optional(),
  commonMistakes: z.array(text).min(1),
});
export type Framework = z.infer<typeof FrameworkSchema>;

export const ReadingSchema = z.object({
  slug,
  title: text,
  sourceType: z.enum(["gmc", "nhs", "book", "article", "report", "guidance", "law", "case"]),
  author: text.optional(),
  url: z.string().url().optional(),
  editionNote: text.optional(),
  /** Original summary in our own words — never reproduced source text. */
  summary: text,
  whyItMatters: text,
  keyTakeaways: z.array(text).min(3),
  howToUseIt: text,
  difficulty: z.number().int().min(1).max(5),
  categories: z.array(slug).min(1),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type Reading = z.infer<typeof ReadingSchema>;

export const UniversitySchema = z.object({
  slug,
  name: text,
  interviewFormats: z.array(InterviewFormat).min(1),
  overview: text,
  interviewFormatDetail: text,
  interviewStyleNotes: text,
  whatTheyLookFor: z.array(text).min(3),
  keyValues: z.array(text).min(3),
  typicalQuestionThemes: z.array(text).min(3),
  preparationTips: z.array(text).min(3),
  externalLinks: z.array(z.object({ label: text, url: z.string().url() })).min(1),
  reading: z.array(slug),
  lastVerified: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
export type University = z.infer<typeof UniversitySchema>;

export const PersonaSchema = z.object({
  slug,
  name: text,
  style: z.enum(["warm", "neutral", "clinical", "probing"]),
  description: text,
  followUpStyle: text,
  promptKey: text,
  affinityUniversity: slug.optional(),
});
export type Persona = z.infer<typeof PersonaSchema>;

export const QuestionSchema = z.object({
  slug,
  category: slug,
  formats: z.array(InterviewFormat).min(1),
  difficulty: z.number().int().min(1).max(5),
  /** Empty = applies to all universities. */
  universities: z.array(slug).default([]),
  question: text,
  /** Scenario, data or role-play brief shown before the question (MMI-style). */
  stationBrief: text.optional(),
  whatIsBeingTested: text,
  followUps: z.array(text).min(2),
  scaffold: z.array(z.object({ step: text, guidance: text })).min(2),
  exemplar: text,
  annotations: z.array(z.object({ excerpt: text, note: text })).min(2),
  keyPoints: z.array(text).min(3),
  pitfalls: z.array(text).min(2),
  frameworks: z.array(z.object({ slug, primary: z.boolean().default(false) })).default([]),
  reading: z.array(slug).default([]),
  tags: z.array(slug).default([]),
});
export type Question = z.input<typeof QuestionSchema>;
