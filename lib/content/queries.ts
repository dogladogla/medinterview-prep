import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import { createPublicClient } from "@/lib/supabase/public";
import type { Json } from "@/types/database.types";
import type {
  Annotation,
  Category,
  ContentBundle,
  ExternalLink,
  Framework,
  FrameworkStep,
  Persona,
  Question,
  ReadingItem,
  ScaffoldStep,
  University,
} from "./types";

// ---------------------------------------------------------------- JSON coercion
// Content JSON is validated at seed time; these guards stop a malformed row
// from crashing a page (bad entries are dropped rather than thrown).
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function strings(v: Json | null | undefined): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}
function records<T>(v: Json | null | undefined, keys: (keyof T & string)[]): T[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is Json => isRecord(x) && keys.every((k) => typeof x[k] === "string")) as unknown as T[];
}

function groupBy<T, K extends string>(rows: T[], key: (r: T) => K): Map<K, T[]> {
  const m = new Map<K, T[]>();
  for (const r of rows) {
    const k = key(r);
    const list = m.get(k);
    if (list) list.push(r);
    else m.set(k, [r]);
  }
  return m;
}

function must<T>(label: string, res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(`Failed to load ${label}: ${res.error.message}`);
  return res.data ?? ([] as unknown as T);
}

// ---------------------------------------------------------------- loader
async function loadBundle(): Promise<ContentBundle> {
  const db = createPublicClient();
  const [cats, unis, fws, qs, qfs, qus, reads, rcats, rqs, ureads, pers] = await Promise.all([
    db.from("categories").select("*").order("sort_order"),
    db.from("universities").select("*").order("name"),
    db.from("frameworks").select("*").order("sort_order"),
    db.from("questions").select("*"),
    db.from("question_frameworks").select("*"),
    db.from("question_universities").select("*"),
    db.from("reading_items").select("*").order("title"),
    db.from("reading_item_categories").select("*"),
    db.from("reading_item_questions").select("*"),
    db.from("university_reading_items").select("*"),
    db.from("interviewer_personas").select("*").order("sort_order"),
  ]);

  const categories: Category[] = must("categories", cats).map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description ?? "",
    sortOrder: c.sort_order,
    icon: c.icon,
  }));

  const uniReading = groupBy(must("university reading", ureads), (r) => r.university_id);
  const universities: University[] = must("universities", unis).map((u) => ({
    id: u.id,
    slug: u.slug,
    name: u.name,
    interviewFormats: u.interview_formats,
    overview: u.overview ?? "",
    interviewFormatDetail: u.interview_format_detail ?? "",
    interviewStyleNotes: u.interview_style_notes ?? "",
    whatTheyLookFor: strings(u.what_they_look_for),
    keyValues: strings(u.key_values),
    typicalQuestionThemes: strings(u.typical_question_themes),
    preparationTips: strings(u.preparation_tips),
    externalLinks: records<ExternalLink>(u.external_links, ["label", "url"]),
    lastVerifiedAt: u.last_verified_at,
    readingIds: (uniReading.get(u.id) ?? []).map((r) => r.reading_item_id),
  }));

  const frameworks: Framework[] = must("frameworks", fws).map((f) => ({
    id: f.id,
    slug: f.slug,
    name: f.name,
    category: f.category,
    summary: f.summary,
    whenToUse: f.when_to_use ?? "",
    steps: records<FrameworkStep>(f.steps, ["title", "detail"]),
    workedExample: f.worked_example ?? "",
    workedExampleQuestionId: f.worked_example_question_id,
    commonMistakes: strings(f.common_mistakes),
    sortOrder: f.sort_order,
  }));

  const qfByQ = groupBy(must("question frameworks", qfs), (r) => r.question_id);
  const quByQ = groupBy(must("question universities", qus), (r) => r.question_id);
  const rqRows = must("reading questions", rqs);
  const rqByQ = groupBy(rqRows, (r) => r.question_id);
  const catOrder = new Map(categories.map((c) => [c.id, c.sortOrder]));

  const questions: Question[] = must("questions", qs)
    .map((q) => ({
      id: q.id,
      slug: q.slug,
      categoryId: q.category_id,
      formats: q.formats,
      difficulty: q.difficulty,
      questionText: q.question_text,
      stationBrief: q.station_brief,
      whatIsBeingTested: q.what_is_being_tested ?? "",
      followUps: strings(q.follow_ups),
      scaffold: records<ScaffoldStep>(q.model_answer_scaffold, ["step", "guidance"]),
      exemplar: q.model_answer_exemplar ?? "",
      annotations: records<Annotation>(q.exemplar_annotations, ["excerpt", "note"]),
      keyPoints: strings(q.key_points),
      pitfalls: strings(q.common_pitfalls),
      tags: q.tags,
      universityIds: (quByQ.get(q.id) ?? []).map((r) => r.university_id),
      frameworkLinks: (qfByQ.get(q.id) ?? [])
        .map((r) => ({ frameworkId: r.framework_id, isPrimary: r.is_primary }))
        .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)),
      readingIds: (rqByQ.get(q.id) ?? []).map((r) => r.reading_item_id),
    }))
    // Stable display order: category order, then difficulty, then text.
    .sort(
      (a, b) =>
        (catOrder.get(a.categoryId) ?? 99) - (catOrder.get(b.categoryId) ?? 99) ||
        a.difficulty - b.difficulty ||
        a.questionText.localeCompare(b.questionText),
    );

  const rcByR = groupBy(must("reading categories", rcats), (r) => r.reading_item_id);
  const rqByR = groupBy(rqRows, (r) => r.reading_item_id);
  const reading: ReadingItem[] = must("reading", reads).map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    sourceType: r.source_type,
    author: r.author,
    url: r.url,
    editionNote: r.edition_note,
    summary: r.summary,
    whyItMatters: r.why_it_matters ?? "",
    keyTakeaways: strings(r.key_takeaways),
    howToUseIt: r.how_to_use_it ?? "",
    difficulty: r.difficulty,
    lastVerifiedAt: r.last_verified_at,
    categoryIds: (rcByR.get(r.id) ?? []).map((x) => x.category_id),
    questionIds: (rqByR.get(r.id) ?? []).map((x) => x.question_id),
  }));

  const personas: Persona[] = must("personas", pers).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    style: p.style,
    description: p.description ?? "",
    followUpStyle: p.follow_up_style ?? "",
    promptKey: p.prompt_key,
    affinityUniversityId: p.affinity_university_id,
  }));

  return { categories, universities, frameworks, questions, reading, personas };
}

// Cross-request cache (10 min) + per-request dedupe.
const cachedBundle = unstable_cache(loadBundle, ["content-bundle-v1"], { revalidate: 600, tags: ["content"] });
export const getContent = cache(async (): Promise<ContentBundle> => cachedBundle());

// ---------------------------------------------------------------- lookups
export async function getIndexes() {
  const c = await getContent();
  return {
    ...c,
    categoryById: new Map(c.categories.map((x) => [x.id, x])),
    categoryBySlug: new Map(c.categories.map((x) => [x.slug, x])),
    universityById: new Map(c.universities.map((x) => [x.id, x])),
    universityBySlug: new Map(c.universities.map((x) => [x.slug, x])),
    frameworkById: new Map(c.frameworks.map((x) => [x.id, x])),
    frameworkBySlug: new Map(c.frameworks.map((x) => [x.slug, x])),
    questionById: new Map(c.questions.map((x) => [x.id, x])),
    questionBySlug: new Map(c.questions.map((x) => [x.slug, x])),
    readingById: new Map(c.reading.map((x) => [x.id, x])),
    readingBySlug: new Map(c.reading.map((x) => [x.slug, x])),
    personaBySlug: new Map(c.personas.map((x) => [x.slug, x])),
    personaById: new Map(c.personas.map((x) => [x.id, x])),
  };
}

/** A question with no university links applies to every university. */
export function appliesToUniversity(q: Question, universityId: string): boolean {
  return q.universityIds.length === 0 || q.universityIds.includes(universityId);
}
