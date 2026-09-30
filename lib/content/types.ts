import type {
  FrameworkCategory,
  InterviewFormat,
  PersonaStyle,
  ReadingSourceType,
} from "@/types/database.types";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  icon: string | null;
};

export type ExternalLink = { label: string; url: string };

export type University = {
  id: string;
  slug: string;
  name: string;
  interviewFormats: InterviewFormat[];
  overview: string;
  interviewFormatDetail: string;
  interviewStyleNotes: string;
  whatTheyLookFor: string[];
  keyValues: string[];
  typicalQuestionThemes: string[];
  preparationTips: string[];
  externalLinks: ExternalLink[];
  lastVerifiedAt: string | null;
  readingIds: string[];
};

export type FrameworkStep = { title: string; detail: string };

export type Framework = {
  id: string;
  slug: string;
  name: string;
  category: FrameworkCategory;
  summary: string;
  whenToUse: string;
  steps: FrameworkStep[];
  workedExample: string;
  workedExampleQuestionId: string | null;
  commonMistakes: string[];
  sortOrder: number;
};

export type ScaffoldStep = { step: string; guidance: string };
export type Annotation = { excerpt: string; note: string };

export type Question = {
  id: string;
  slug: string;
  categoryId: string;
  formats: InterviewFormat[];
  difficulty: number;
  questionText: string;
  stationBrief: string | null;
  whatIsBeingTested: string;
  followUps: string[];
  scaffold: ScaffoldStep[];
  exemplar: string;
  annotations: Annotation[];
  keyPoints: string[];
  pitfalls: string[];
  tags: string[];
  /** Empty = applies to all universities. */
  universityIds: string[];
  frameworkLinks: { frameworkId: string; isPrimary: boolean }[];
  readingIds: string[];
};

export type ReadingItem = {
  id: string;
  slug: string;
  title: string;
  sourceType: ReadingSourceType;
  author: string | null;
  url: string | null;
  editionNote: string | null;
  summary: string;
  whyItMatters: string;
  keyTakeaways: string[];
  howToUseIt: string;
  difficulty: number | null;
  lastVerifiedAt: string | null;
  categoryIds: string[];
  questionIds: string[];
};

export type Persona = {
  id: string;
  slug: string;
  name: string;
  style: PersonaStyle;
  description: string;
  followUpStyle: string;
  promptKey: string;
  affinityUniversityId: string | null;
};

export type ContentBundle = {
  categories: Category[];
  universities: University[];
  frameworks: Framework[];
  questions: Question[];
  reading: ReadingItem[];
  personas: Persona[];
};
