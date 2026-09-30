/**
 * Content quality checks beyond schema validation. Run: `npm run content:qc`.
 * Exits non-zero on errors; prints warnings for editorial review.
 */
import { categories, frameworks, questionGroups, reading, universities } from "../content";
import { QuestionSchema } from "../content/schema";

const errors: string[] = [];
const warnings: string[] = [];
// Parse so schema defaults (empty arrays) are applied.
const allQs = Object.values(questionGroups).flat().map((q) => QuestionSchema.parse(q));

// US spellings a UK audience would notice. Word-boundary matched, case-insensitive.
const US_SPELLINGS = [
  "color", "behavior", "center", "organize", "recognize", "realize", "analyze", 
  "favorite", "\\bprogram\\b", "honor", "labor", "pediatric", "anesthe", "hematolog", "fetus", "judgment call", "gray",
  "prioritize", "emphasize", "apologize", "criticize", "minimize", "maximize", "summarize", "utilize",
  "hospitalized", "counseling", "traveled", "canceled", "modeling", "defense", "offense", 
];
const wordCount = (s: string): number => s.trim().split(/\s+/).length;

function scanText(where: string, text: string): void {
  const lower = text.toLowerCase();
  for (const w of US_SPELLINGS) {
    if (w.includes("(")) continue;
    const re = w.startsWith("\\b") ? new RegExp(w, "i") : new RegExp(`\\b${w.trim()}`, "i");
    if (re.test(lower)) warnings.push(`${where}: possible US spelling "${w.trim()}"`);
  }
  if (/\s{2,}\S/.test(text.replace(/\n/g, " ").replace(/ {2,}\n/g, ""))) {
    if (/ {2,}/.test(text)) warnings.push(`${where}: double space`);
  }
  if (/\bTODO\b|lorem|XXX/i.test(text)) errors.push(`${where}: placeholder text`);
}

for (const q of allQs) {
  const where = `question ${q.slug}`;
  // Every annotation must quote the exemplar verbatim so the UI can highlight it.
  for (const a of q.annotations) {
    if (!q.exemplar.includes(a.excerpt)) errors.push(`${where}: annotation excerpt not found in exemplar: "${a.excerpt}"`);
  }
  const wc = wordCount(q.exemplar);
  const isRolePlay = q.category === "role-play-communication";
  const max = isRolePlay ? 520 : 460;
  if (wc < 120 && q.category !== "questions-for-them") warnings.push(`${where}: exemplar short (${wc} words)`);
  if (wc > max) warnings.push(`${where}: exemplar long for a spoken answer (${wc} words)`);
  if (q.frameworks.length === 0 && q.category !== "questions-for-them") warnings.push(`${where}: no linked framework`);
  if (!q.frameworks.some((f) => f.primary) && q.frameworks.length > 0) warnings.push(`${where}: no primary framework`);
  if (new Set(q.followUps).size !== q.followUps.length) errors.push(`${where}: duplicate follow-ups`);
  if (["mmi"].every((f) => q.formats.includes(f as never)) && q.stationBrief === undefined && q.question.startsWith("Role-play")) {
    errors.push(`${where}: role-play without station brief`);
  }
  for (const [k, v] of Object.entries({
    question: q.question,
    brief: q.stationBrief ?? "",
    tested: q.whatIsBeingTested,
    exemplar: q.exemplar,
    ...Object.fromEntries(q.keyPoints.map((p, i) => [`kp${i}`, p])),
    ...Object.fromEntries(q.pitfalls.map((p, i) => [`pf${i}`, p])),
    ...Object.fromEntries(q.scaffold.map((s, i) => [`sc${i}`, s.guidance])),
    ...Object.fromEntries(q.annotations.map((s, i) => [`an${i}`, s.note])),
  })) {
    scanText(`${where} [${k}]`, v);
  }
}

for (const f of frameworks) {
  scanText(`framework ${f.slug}`, [f.summary, f.whenToUse, f.workedExample, ...f.steps.map((s) => s.detail)].join("\n"));
}
for (const r of reading) {
  scanText(`reading ${r.slug}`, [r.summary, r.whyItMatters, r.howToUseIt, ...r.keyTakeaways].join("\n"));
  const wc = wordCount(r.summary);
  if (wc > 230) warnings.push(`reading ${r.slug}: summary ${wc} words (target 100–200)`);
  if (wc < 90) warnings.push(`reading ${r.slug}: summary ${wc} words (target 100–200)`);
  const age = (Date.now() - Date.parse(r.lastVerified)) / 864e5;
  if (age > 365) warnings.push(`reading ${r.slug}: lastVerified over a year old`);
}
for (const u of universities) scanText(`university ${u.slug}`, [u.overview, u.interviewFormatDetail].join("\n"));

// Coverage: every category has enough questions; reading items used somewhere.
for (const c of categories) {
  const n = allQs.filter((q) => q.category === c.slug).length;
  if (n < 3) warnings.push(`category ${c.slug}: only ${n} questions`);
}
for (const r of reading) {
  const used = allQs.some((q) => q.reading.includes(r.slug)) || universities.some((u) => u.reading.includes(r.slug));
  if (!used) warnings.push(`reading ${r.slug}: not linked from any question or university`);
}
const diffs = [1, 2, 3, 4, 5].map((d) => `${d}:${allQs.filter((q) => q.difficulty === d).length}`).join(" ");

console.log(`Questions: ${allQs.length}. Difficulty spread ${diffs}.`);
if (warnings.length) console.log(`\n⚠ ${warnings.length} warnings:\n  - ${warnings.join("\n  - ")}`);
if (errors.length) {
  console.error(`\n✗ ${errors.length} errors:\n  - ${errors.join("\n  - ")}`);
  process.exit(1);
}
console.log("\n✓ No content errors.");
