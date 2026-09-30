import "server-only";

import type { ServerSupabase } from "@/lib/auth";
import type { getIndexes } from "@/lib/content/queries";
import type { Question } from "@/lib/content/types";
import type { UserProgressRow } from "@/types/database.types";

type Indexes = Awaited<ReturnType<typeof getIndexes>>;

/** UK-local calendar date (YYYY-MM-DD) for activity counting. */
function ukDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}

export async function loadDashboard(supabase: ServerSupabase, userId: string, idx: Indexes) {
  const [progressRes, answersRes, mocksRes, interviewsRes, viewsRes, targetsRes] = await Promise.all([
    supabase.from("user_progress").select("*"),
    supabase.from("mock_answers").select("question_id, overall_score, created_at").order("created_at", { ascending: true }),
    supabase.from("mock_sessions").select("id, mode, completed_at, total_score, started_at, format").order("started_at", { ascending: false }),
    supabase.from("interviewer_sessions").select("id, status, started_at, persona_id").order("started_at", { ascending: false }),
    supabase.from("framework_views").select("framework_id"),
    supabase.from("profile_target_universities").select("university_id").eq("profile_id", userId),
  ]);
  const progress: UserProgressRow[] = progressRes.data ?? [];
  const answers = answersRes.data ?? [];
  const sessions = mocksRes.data ?? [];
  const interviews = interviewsRes.data ?? [];
  const targetIds = new Set((targetsRes.data ?? []).map((t) => t.university_id));

  const attempted = progress.filter((p) => p.times_attempted > 0);
  const scored = answers.filter((a) => a.overall_score != null).map((a) => ({ ...a, overall_score: Number(a.overall_score) }));
  const recentScored = scored.slice(-20);
  const avgRecent = recentScored.length
    ? recentScored.reduce((s, a) => s + a.overall_score, 0) / recentScored.length
    : null;

  // ---- Category strength: mean AI score, falling back to confidence (both 1–5).
  const catStats = new Map<string, { total: number; n: number }>();
  const add = (qid: string, v: number) => {
    const q = idx.questionById.get(qid);
    if (!q) return;
    const s = catStats.get(q.categoryId) ?? { total: 0, n: 0 };
    s.total += v;
    s.n += 1;
    catStats.set(q.categoryId, s);
  };
  const scoredQ = new Set<string>();
  for (const a of scored) {
    add(a.question_id, a.overall_score);
    scoredQ.add(a.question_id);
  }
  for (const p of progress) if (p.confidence != null && !scoredQ.has(p.question_id)) add(p.question_id, p.confidence);
  const categoryStrength = [...catStats.entries()]
    .map(([id, s]) => ({ category: idx.categoryById.get(id)!, avg: s.total / s.n, n: s.n }))
    .filter((c) => c.category)
    .sort((a, b) => a.avg - b.avg);

  // ---- Recommendations.
  const now = Date.now();
  const byQ = new Map(progress.map((p) => [p.question_id, p]));
  const due = attempted
    .filter((p) => p.next_review_at && Date.parse(p.next_review_at) <= now)
    .sort((a, b) => (a.confidence ?? 3) - (b.confidence ?? 3) || Date.parse(a.next_review_at!) - Date.parse(b.next_review_at!))
    .map((p) => idx.questionById.get(p.question_id))
    .filter((q): q is Question => Boolean(q))
    .slice(0, 3);

  const relevant = (q: Question) =>
    targetIds.size === 0 || q.universityIds.length === 0 || q.universityIds.some((u) => targetIds.has(u));
  const unattempted = idx.questions.filter((q) => !byQ.get(q.id)?.times_attempted && relevant(q));
  const weakest = categoryStrength[0]?.category;
  const fresh: Question[] = [];
  if (weakest) fresh.push(...unattempted.filter((q) => q.categoryId === weakest.id).slice(0, 2));
  // Otherwise (or to fill up): gentle starters across different categories.
  const seenCats = new Set(fresh.map((q) => q.categoryId));
  for (const q of unattempted.filter((q) => q.difficulty <= 3)) {
    if (fresh.length >= 3) break;
    if (!seenCats.has(q.categoryId) && !fresh.includes(q)) {
      fresh.push(q);
      seenCats.add(q.categoryId);
    }
  }

  // ---- Activity over the last 14 UK days (no streak mechanics — see README).
  const activeDays = new Set<string>([
    ...answers.map((a) => ukDay(a.created_at)),
    ...progress.filter((p) => p.last_attempted_at).map((p) => ukDay(p.last_attempted_at!)),
    ...interviews.map((i) => ukDay(i.started_at)),
  ]);
  const days = Array.from({ length: 14 }, (_, k) => {
    const d = new Date(now - (13 - k) * 864e5);
    const key = ukDay(d.toISOString());
    return {
      key,
      label: d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/London" }),
      active: activeDays.has(key),
    };
  });

  const trend = recentScored.map((a, i) => ({
    i,
    date: new Date(a.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    score: a.overall_score,
    question: idx.questionById.get(a.question_id)?.questionText ?? "",
  }));

  return {
    stats: {
      questionsAttempted: attempted.length,
      totalQuestions: idx.questions.length,
      mocksCompleted: sessions.filter((s) => s.mode === "mock" && s.completed_at).length,
      interviewsCompleted: interviews.filter((i) => i.status === "ended").length,
      frameworksViewed: new Set((viewsRes.data ?? []).map((v) => v.framework_id)).size,
      totalFrameworks: idx.frameworks.length,
      avgRecent,
      scoredCount: scored.length,
    },
    trend,
    categoryStrength,
    due,
    fresh,
    starred: progress
      .filter((p) => p.starred)
      .map((p) => idx.questionById.get(p.question_id))
      .filter((q): q is Question => Boolean(q)),
    recentMocks: sessions.filter((s) => s.mode === "mock").slice(0, 5),
    recentInterviews: interviews.slice(0, 5),
    days,
    activeDayCount: days.filter((d) => d.active).length,
    isNew: attempted.length === 0 && sessions.length === 0 && interviews.length === 0,
  };
}
