import type {
  ApplicantType,
  FrameworkCategory,
  InterviewFormat,
  ReadingSourceType,
  ReadingStatus,
} from "@/types/database.types";

export const FORMAT_LABEL: Record<InterviewFormat, string> = {
  mmi: "MMI",
  panel: "Panel",
  group: "Group",
  online: "Online",
  oxbridge: "Oxbridge",
};

export const FRAMEWORK_CATEGORY_LABEL: Record<FrameworkCategory, string> = {
  ethics: "Ethics",
  structure: "Structuring answers",
  reflection: "Reflection",
  communication: "Communication",
};

export const READING_SOURCE_LABEL: Record<ReadingSourceType, string> = {
  gmc: "GMC guidance",
  nhs: "NHS",
  book: "Book",
  article: "Current affairs",
  report: "Report",
  guidance: "Guidance",
  law: "Law",
  case: "Legal case",
};

export const READING_STATUS_LABEL: Record<ReadingStatus, string> = {
  unread: "Not read",
  read: "Read",
  bookmarked: "Saved for later",
};

export const APPLICANT_TYPE_LABEL: Record<ApplicantType, string> = {
  school_leaver: "School leaver (Year 12/13)",
  graduate: "Graduate",
  international: "International applicant",
  reapplicant: "Reapplicant",
};

export const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Warm-up",
  2: "Standard",
  3: "Challenging",
  4: "Hard",
  5: "Very hard",
};

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatScore(n: number | null | undefined): string {
  return n == null ? "—" : Number(n).toFixed(1);
}
