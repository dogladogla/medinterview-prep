import type { Question } from "@/lib/content/types";
import type { InterviewFormat } from "@/types/database.types";

/** Categories that don't make sense as timed stations. */
const EXCLUDED_CATEGORY_SLUGS = new Set(["questions-for-them"]);

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * Picks `count` questions for a mock: matching format and university, then
 * round-robin across categories so a session covers a spread of skills.
 */
export function selectMockQuestions(opts: {
  questions: Question[];
  categorySlugById: Map<string, string>;
  format: InterviewFormat;
  universityId?: string | null;
  count: number;
  rand?: () => number;
}): Question[] {
  const rand = opts.rand ?? Math.random;
  const pool = opts.questions.filter(
    (q) =>
      q.formats.includes(opts.format) &&
      !EXCLUDED_CATEGORY_SLUGS.has(opts.categorySlugById.get(q.categoryId) ?? "") &&
      (!opts.universityId || q.universityIds.length === 0 || q.universityIds.includes(opts.universityId)),
  );

  const byCategory = new Map<string, Question[]>();
  for (const q of shuffle(pool, rand)) {
    const list = byCategory.get(q.categoryId) ?? [];
    list.push(q);
    byCategory.set(q.categoryId, list);
  }
  const queues = shuffle([...byCategory.values()], rand);

  const picked: Question[] = [];
  while (picked.length < opts.count && queues.some((qu) => qu.length)) {
    for (const qu of queues) {
      const next = qu.shift();
      if (next) picked.push(next);
      if (picked.length >= opts.count) break;
    }
  }
  return picked;
}

export const MOCK_PRESETS = [
  { id: "imperial", label: "Imperial-style MMI", format: "mmi", university: "imperial", stations: 6, prep: 60, answer: 300, note: "6 stations · 1 min reading · 5 min each" },
  { id: "manchester", label: "Manchester-style MMI", format: "mmi", university: "manchester", stations: 5, prep: 60, answer: 480, note: "5 stations · 1 min reading · 8 min each" },
  { id: "oxbridge", label: "Oxbridge tutorial", format: "oxbridge", university: "", stations: 3, prep: 0, answer: 600, note: "3 problems · no reading time · 10 min each" },
  { id: "panel", label: "Panel interview", format: "panel", university: "", stations: 5, prep: 0, answer: 240, note: "5 questions · 4 min each" },
  { id: "quick", label: "Quick practice", format: "mmi", university: "", stations: 3, prep: 30, answer: 180, note: "3 stations · 30 s reading · 3 min each" },
] as const;
