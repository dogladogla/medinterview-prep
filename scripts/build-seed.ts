/**
 * Validates everything in /content and writes idempotent seed SQL to
 * supabase/seed/. Run with `npm run seed:build`.
 *
 * Apply the generated files in numeric order in the Supabase SQL editor
 * (or ask Claude to apply them). Re-running is safe: rows are upserted by
 * slug and join tables are rebuilt for every seeded row.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  categories,
  frameworks,
  personas,
  questionGroups,
  reading,
  universities,
} from "../content";
import {
  CategorySchema,
  FrameworkSchema,
  PersonaSchema,
  QuestionSchema,
  ReadingSchema,
  UniversitySchema,
} from "../content/schema";

const OUT_DIR = join(process.cwd(), "supabase", "seed");
const S = "interview";

// ---------------------------------------------------------------- SQL helpers
// Dollar-quoting avoids escaping problems with apostrophes and quotes in prose.
function lit(value: string): string {
  let tag = "c";
  while (value.includes(`$${tag}$`)) tag += "c";
  return `$${tag}$${value}$${tag}$`;
}
const str = (v: string | undefined | null): string => (v == null ? "null" : lit(v));
const json = (v: unknown): string => `${lit(JSON.stringify(v))}::jsonb`;
const textArr = (v: readonly string[]): string =>
  v.length ? `array[${v.map(lit).join(", ")}]::text[]` : `'{}'::text[]`;
const enumArr = (v: readonly string[], type: string): string =>
  v.length ? `array[${v.map(lit).join(", ")}]::${S}.${type}[]` : `'{}'::${S}.${type}[]`;
const idBySlug = (table: string, slug: string): string => `(select id from ${S}.${table} where slug = ${lit(slug)})`;

// ---------------------------------------------------------------- validation
const errors: string[] = [];
function fail(msg: string): void {
  errors.push(msg);
}

function parseAll<T>(label: string, schema: { safeParse: (x: unknown) => { success: boolean; data?: T; error?: { message: string } } }, items: unknown[]): T[] {
  return items.map((item, i) => {
    const r = schema.safeParse(item);
    if (!r.success) {
      const s = (item as { slug?: string }).slug ?? `#${i}`;
      fail(`${label} ${s}: ${r.error?.message}`);
    }
    return r.data as T;
  });
}

const cats = parseAll("category", CategorySchema, categories);
const unis = parseAll("university", UniversitySchema, universities);
const fws = parseAll("framework", FrameworkSchema, frameworks);
const reads = parseAll("reading", ReadingSchema, reading);
const pers = parseAll("persona", PersonaSchema, personas);
const qGroups = Object.fromEntries(
  Object.entries(questionGroups).map(([k, qs]) => [k, parseAll("question", QuestionSchema, qs)]),
);
const allQs = Object.values(qGroups).flat();

// Stop before cross-checks if any item failed schema validation.
if (errors.length) {
  console.error(`\n✗ Content validation failed (${errors.length}):\n  - ${errors.join("\n  - ")}\n`);
  process.exit(1);
}

function checkUnique(label: string, slugs: string[]): void {
  const seen = new Set<string>();
  for (const s of slugs) {
    if (seen.has(s)) fail(`duplicate ${label} slug: ${s}`);
    seen.add(s);
  }
}
checkUnique("category", cats.map((c) => c.slug));
checkUnique("university", unis.map((u) => u.slug));
checkUnique("framework", fws.map((f) => f.slug));
checkUnique("reading", reads.map((r) => r.slug));
checkUnique("persona", pers.map((p) => p.slug));
checkUnique("question", allQs.map((q) => q.slug));

const catSet = new Set(cats.map((c) => c.slug));
const uniSet = new Set(unis.map((u) => u.slug));
const fwSet = new Set(fws.map((f) => f.slug));
const readSet = new Set(reads.map((r) => r.slug));
const qSet = new Set(allQs.map((q) => q.slug));

for (const q of allQs) {
  if (!catSet.has(q.category)) fail(`question ${q.slug}: unknown category ${q.category}`);
  for (const u of q.universities) if (!uniSet.has(u)) fail(`question ${q.slug}: unknown university ${u}`);
  for (const f of q.frameworks) if (!fwSet.has(f.slug)) fail(`question ${q.slug}: unknown framework ${f.slug}`);
  for (const r of q.reading) if (!readSet.has(r)) fail(`question ${q.slug}: unknown reading ${r}`);
  if (q.frameworks.filter((f) => f.primary).length > 1) fail(`question ${q.slug}: more than one primary framework`);
}
for (const f of fws) {
  if (f.workedExampleQuestion && !qSet.has(f.workedExampleQuestion))
    fail(`framework ${f.slug}: unknown workedExampleQuestion ${f.workedExampleQuestion}`);
}
for (const r of reads) for (const c of r.categories) if (!catSet.has(c)) fail(`reading ${r.slug}: unknown category ${c}`);
for (const u of unis) for (const r of u.reading) if (!readSet.has(r)) fail(`university ${u.slug}: unknown reading ${r}`);
for (const p of pers) if (p.affinityUniversity && !uniSet.has(p.affinityUniversity)) fail(`persona ${p.slug}: unknown university`);
// Every framework should be demonstrated by at least one question.
for (const f of fws) if (!allQs.some((q) => q.frameworks.some((x) => x.slug === f.slug))) fail(`framework ${f.slug}: not linked to any question`);

if (errors.length) {
  console.error(`\n✗ Content validation failed (${errors.length}):\n  - ${errors.join("\n  - ")}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------- SQL: base
const base: string[] = ["begin;"];

cats.forEach((c, i) => {
  base.push(
    `insert into ${S}.categories (slug, name, description, icon, sort_order) values (${lit(c.slug)}, ${lit(c.name)}, ${lit(c.description)}, ${lit(c.icon)}, ${i})
on conflict (slug) do update set name = excluded.name, description = excluded.description, icon = excluded.icon, sort_order = excluded.sort_order;`,
  );
});

for (const u of unis) {
  base.push(
    `insert into ${S}.universities (slug, name, interview_formats, overview, interview_format_detail, interview_style_notes, what_they_look_for, key_values, typical_question_themes, preparation_tips, external_links, last_verified_at, status)
values (${lit(u.slug)}, ${lit(u.name)}, ${enumArr(u.interviewFormats, "interview_format")}, ${lit(u.overview)}, ${lit(u.interviewFormatDetail)}, ${lit(u.interviewStyleNotes)}, ${json(u.whatTheyLookFor)}, ${json(u.keyValues)}, ${json(u.typicalQuestionThemes)}, ${json(u.preparationTips)}, ${json(u.externalLinks)}, ${lit(u.lastVerified)}, 'published')
on conflict (slug) do update set name = excluded.name, interview_formats = excluded.interview_formats, overview = excluded.overview, interview_format_detail = excluded.interview_format_detail, interview_style_notes = excluded.interview_style_notes, what_they_look_for = excluded.what_they_look_for, key_values = excluded.key_values, typical_question_themes = excluded.typical_question_themes, preparation_tips = excluded.preparation_tips, external_links = excluded.external_links, last_verified_at = excluded.last_verified_at, status = excluded.status;`,
  );
}

fws.forEach((f, i) => {
  base.push(
    `insert into ${S}.frameworks (slug, name, category, summary, when_to_use, steps, worked_example, common_mistakes, sort_order, status)
values (${lit(f.slug)}, ${lit(f.name)}, ${lit(f.category)}::${S}.framework_category, ${lit(f.summary)}, ${lit(f.whenToUse)}, ${json(f.steps)}, ${lit(f.workedExample)}, ${json(f.commonMistakes)}, ${i}, 'published')
on conflict (slug) do update set name = excluded.name, category = excluded.category, summary = excluded.summary, when_to_use = excluded.when_to_use, steps = excluded.steps, worked_example = excluded.worked_example, common_mistakes = excluded.common_mistakes, sort_order = excluded.sort_order, status = excluded.status;`,
  );
});

for (const r of reads) {
  base.push(
    `insert into ${S}.reading_items (slug, title, source_type, author, url, edition_note, summary, why_it_matters, key_takeaways, how_to_use_it, difficulty, last_verified_at, status)
values (${lit(r.slug)}, ${lit(r.title)}, ${lit(r.sourceType)}::${S}.reading_source_type, ${str(r.author)}, ${str(r.url)}, ${str(r.editionNote)}, ${lit(r.summary)}, ${lit(r.whyItMatters)}, ${json(r.keyTakeaways)}, ${lit(r.howToUseIt)}, ${r.difficulty}, ${lit(r.lastVerified)}, 'published')
on conflict (slug) do update set title = excluded.title, source_type = excluded.source_type, author = excluded.author, url = excluded.url, edition_note = excluded.edition_note, summary = excluded.summary, why_it_matters = excluded.why_it_matters, key_takeaways = excluded.key_takeaways, how_to_use_it = excluded.how_to_use_it, difficulty = excluded.difficulty, last_verified_at = excluded.last_verified_at, status = excluded.status;`,
  );
  base.push(`delete from ${S}.reading_item_categories where reading_item_id = ${idBySlug("reading_items", r.slug)};`);
  for (const c of r.categories) {
    base.push(
      `insert into ${S}.reading_item_categories (reading_item_id, category_id) values (${idBySlug("reading_items", r.slug)}, ${idBySlug("categories", c)});`,
    );
  }
}

for (const u of unis) {
  base.push(`delete from ${S}.university_reading_items where university_id = ${idBySlug("universities", u.slug)};`);
  for (const r of u.reading) {
    base.push(
      `insert into ${S}.university_reading_items (university_id, reading_item_id) values (${idBySlug("universities", u.slug)}, ${idBySlug("reading_items", r)});`,
    );
  }
}

pers.forEach((p, i) => {
  base.push(
    `insert into ${S}.interviewer_personas (slug, name, style, description, follow_up_style, prompt_key, affinity_university_id, sort_order, is_active)
values (${lit(p.slug)}, ${lit(p.name)}, ${lit(p.style)}::${S}.persona_style, ${lit(p.description)}, ${lit(p.followUpStyle)}, ${lit(p.promptKey)}, ${p.affinityUniversity ? idBySlug("universities", p.affinityUniversity) : "null"}, ${i}, true)
on conflict (slug) do update set name = excluded.name, style = excluded.style, description = excluded.description, follow_up_style = excluded.follow_up_style, prompt_key = excluded.prompt_key, affinity_university_id = excluded.affinity_university_id, sort_order = excluded.sort_order, is_active = excluded.is_active;`,
  );
});
base.push("commit;");

// ---------------------------------------------------------------- SQL: questions
function questionSql(qs: typeof allQs): string {
  const out: string[] = ["begin;"];
  for (const q of qs) {
    out.push(
      `insert into ${S}.questions (slug, category_id, formats, difficulty, question_text, station_brief, what_is_being_tested, follow_ups, model_answer_scaffold, model_answer_exemplar, exemplar_annotations, key_points, common_pitfalls, tags, status)
values (${lit(q.slug)}, ${idBySlug("categories", q.category)}, ${enumArr(q.formats, "interview_format")}, ${q.difficulty}, ${lit(q.question)}, ${str(q.stationBrief)}, ${lit(q.whatIsBeingTested)}, ${json(q.followUps)}, ${json(q.scaffold)}, ${lit(q.exemplar)}, ${json(q.annotations)}, ${json(q.keyPoints)}, ${json(q.pitfalls)}, ${textArr(q.tags)}, 'published')
on conflict (slug) do update set category_id = excluded.category_id, formats = excluded.formats, difficulty = excluded.difficulty, question_text = excluded.question_text, station_brief = excluded.station_brief, what_is_being_tested = excluded.what_is_being_tested, follow_ups = excluded.follow_ups, model_answer_scaffold = excluded.model_answer_scaffold, model_answer_exemplar = excluded.model_answer_exemplar, exemplar_annotations = excluded.exemplar_annotations, key_points = excluded.key_points, common_pitfalls = excluded.common_pitfalls, tags = excluded.tags, status = excluded.status;`,
    );
    const qid = idBySlug("questions", q.slug);
    out.push(`delete from ${S}.question_universities where question_id = ${qid};`);
    for (const u of q.universities) {
      out.push(`insert into ${S}.question_universities (question_id, university_id) values (${qid}, ${idBySlug("universities", u)});`);
    }
    out.push(`delete from ${S}.question_frameworks where question_id = ${qid};`);
    for (const f of q.frameworks) {
      out.push(
        `insert into ${S}.question_frameworks (question_id, framework_id, is_primary) values (${qid}, ${idBySlug("frameworks", f.slug)}, ${f.primary ? "true" : "false"});`,
      );
    }
    out.push(`delete from ${S}.reading_item_questions where question_id = ${qid};`);
    for (const r of q.reading) {
      out.push(`insert into ${S}.reading_item_questions (reading_item_id, question_id) values (${idBySlug("reading_items", r)}, ${qid});`);
    }
  }
  out.push("commit;");
  return out.join("\n");
}

// ---------------------------------------------------------------- SQL: final links
const final: string[] = ["begin;"];
for (const f of fws) {
  final.push(
    `update ${S}.frameworks set worked_example_question_id = ${f.workedExampleQuestion ? idBySlug("questions", f.workedExampleQuestion) : "null"} where slug = ${lit(f.slug)};`,
  );
}
final.push("commit;");

// ---------------------------------------------------------------- write
mkdirSync(OUT_DIR, { recursive: true });
for (const f of readdirSync(OUT_DIR)) if (f.endsWith(".sql")) rmSync(join(OUT_DIR, f));

const files: [string, string][] = [["00-base.sql", base.join("\n")]];
Object.entries(qGroups).forEach(([name, qs], i) => {
  files.push([`${String(i + 1).padStart(2, "0")}-questions-${name}.sql`, questionSql(qs)]);
});
files.push([`${String(files.length).padStart(2, "0")}-links.sql`, final.join("\n")]);

for (const [name, sql] of files) writeFileSync(join(OUT_DIR, name), `-- Generated by scripts/build-seed.ts. Do not edit by hand.\n${sql}\n`);

console.log(
  `✓ Content valid: ${cats.length} categories, ${unis.length} universities, ${fws.length} frameworks, ${reads.length} reading items, ${pers.length} personas, ${allQs.length} questions.`,
);
console.log(`✓ Wrote ${files.length} files to supabase/seed/`);
