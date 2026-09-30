import type { InterviewFormat } from "@/types/database.types";
import type { Question } from "./types";

export type QuestionFilters = {
  q?: string;
  category?: string; // category id
  university?: string; // university id
  format?: InterviewFormat;
  difficulty?: number;
  starredIds?: Set<string>; // when set, only these
};

const FORMATS: readonly InterviewFormat[] = ["mmi", "panel", "group", "online", "oxbridge"];

/** Parse untrusted URL search params into a clean filter object. */
export function parseFilterParams(sp: Record<string, string | string[] | undefined>) {
  const one = (k: string): string | undefined => {
    const v = sp[k];
    const s = Array.isArray(v) ? v[0] : v;
    return s && s.trim() ? s.trim().slice(0, 100) : undefined;
  };
  const format = one("format");
  const difficulty = Number(one("difficulty"));
  return {
    q: one("q"),
    category: one("category"), // slug
    university: one("university"), // slug
    format: FORMATS.includes(format as InterviewFormat) ? (format as InterviewFormat) : undefined,
    difficulty: Number.isInteger(difficulty) && difficulty >= 1 && difficulty <= 5 ? difficulty : undefined,
    starred: one("starred") === "1",
  };
}

function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’']/g, "'");
}

/** Every search word must appear somewhere in the question's searchable text. */
function matchesSearch(q: Question, query: string): boolean {
  const haystack = normalise(
    [q.questionText, q.stationBrief ?? "", q.tags.join(" "), q.keyPoints.join(" "), q.whatIsBeingTested].join(" "),
  );
  return normalise(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function filterQuestions(questions: Question[], f: QuestionFilters): Question[] {
  return questions.filter(
    (q) =>
      (!f.category || q.categoryId === f.category) &&
      (!f.university || q.universityIds.length === 0 || q.universityIds.includes(f.university)) &&
      (!f.format || q.formats.includes(f.format)) &&
      (!f.difficulty || q.difficulty === f.difficulty) &&
      (!f.starredIds || f.starredIds.has(q.id)) &&
      (!f.q || matchesSearch(q, f.q)),
  );
}
