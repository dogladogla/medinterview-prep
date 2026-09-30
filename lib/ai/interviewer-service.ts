import "server-only";

import { randomUUID } from "node:crypto";

import type { ServerSupabase } from "@/lib/auth";
import { appliesToUniversity, getIndexes } from "@/lib/content/queries";
import type { Question } from "@/lib/content/types";
import { aiConfigured } from "@/lib/features/server";
import { AiError, callStructured, type Message } from "./client";
import { DEBRIEF_PROMPT_VERSION, buildDebriefPrompt } from "./prompts/debrief.v1";
import { INTERVIEWER_PROMPT_VERSION, PERSONAS, buildInterviewerSystem } from "./prompts/interviewer.v1";
import { consumeQuota, quotaMessage } from "./quota";
import { sanitizeForPrompt } from "./sanitize";
import {
  DebriefSchema,
  INTERVIEW_MAX_ANSWERS,
  INTERVIEW_MIN_ANSWERS,
  InterviewerTurnSchema,
  STUDENT_MESSAGE_MAX,
  parseDebrief,
  parseTranscript,
  type Debrief,
  type TranscriptEntry,
} from "./schemas/interviewer";

type Fail = { ok: false; error: string; status: number };

// ---------------------------------------------------------------- question pool
/** Deterministic PRNG so the same session always gets the same pool. */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

async function buildPool(sessionId: string, promptKey: string, universityId: string | null): Promise<Question[]> {
  const idx = await getIndexes();
  const spec = PERSONAS[promptKey] ?? PERSONAS["neutral-v1"]!;
  const allowed = new Set(spec.categories.map((slug) => idx.categoryBySlug.get(slug)?.id).filter(Boolean));
  const rand = seededRandom(sessionId);
  const candidates = idx.questions
    .filter((q) => allowed.has(q.categoryId) && (!universityId || appliesToUniversity(q, universityId)))
    .map((q) => ({ q, r: rand() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.q);
  // Spread across categories: take round-robin until 6.
  const byCat = new Map<string, Question[]>();
  for (const q of candidates) byCat.set(q.categoryId, [...(byCat.get(q.categoryId) ?? []), q]);
  const pool: Question[] = [];
  while (pool.length < 6 && [...byCat.values()].some((l) => l.length)) {
    for (const list of byCat.values()) {
      const q = list.shift();
      if (q) pool.push(q);
      if (pool.length >= 6) break;
    }
  }
  return pool;
}

// ---------------------------------------------------------------- message mapping
function toMessages(transcript: TranscriptEntry[]): Message[] {
  const msgs: Message[] = [{ role: "user", content: "[The student has joined the interview.]" }];
  for (const t of transcript) {
    const role = t.role === "interviewer" ? "assistant" : "user";
    const content =
      t.role === "student" ? `<student_message>${sanitizeForPrompt(t.content, STUDENT_MESSAGE_MAX)}</student_message>` : t.content;
    const last = msgs[msgs.length - 1];
    if (last && last.role === role) last.content += `\n\n${content}`; // keep strict alternation
    else msgs.push({ role, content });
  }
  if (msgs[msgs.length - 1]?.role === "assistant") msgs.push({ role: "user", content: "[Continue.]" });
  return msgs;
}

const studentAnswers = (t: TranscriptEntry[]) => t.filter((x) => x.role === "student").length;

async function interviewerTurn(opts: {
  sessionId: string;
  promptKey: string;
  universityId: string | null;
  transcript: TranscriptEntry[];
}) {
  const idx = await getIndexes();
  const pool = await buildPool(opts.sessionId, opts.promptKey, opts.universityId);
  const n = studentAnswers(opts.transcript);
  const { data, model } = await callStructured({
    system: buildInterviewerSystem({
      promptKey: opts.promptKey,
      pool,
      university: opts.universityId ? idx.universityById.get(opts.universityId) : null,
      answersSoFar: n,
    }),
    messages: toMessages(opts.transcript),
    toolName: "interviewer_turn",
    toolDescription: "Say your next line in the interview.",
    schema: InterviewerTurnSchema,
    maxTokens: 700,
    temperature: 0.7,
  });
  // Server-side limits win over the model's choice.
  const ends = n >= INTERVIEW_MAX_ANSWERS ? true : n < INTERVIEW_MIN_ANSWERS ? false : data.ends_interview;
  return { message: data.message.trim(), ends, model };
}

function aiFail(e: unknown): Fail {
  if (e instanceof AiError) return { ok: false, error: e.message, status: e.code === "not_configured" ? 503 : 502 };
  console.error("[interviewer]", e);
  return { ok: false, error: "Something went wrong. Please try again.", status: 500 };
}

// ---------------------------------------------------------------- public API
export async function startInterview(
  supabase: ServerSupabase,
  opts: { personaSlug: string; universitySlug?: string | null },
): Promise<{ ok: true; sessionId: string } | Fail> {
  if (!aiConfigured()) return { ok: false, error: "The AI interviewer isn't switched on yet.", status: 503 };
  const idx = await getIndexes();
  const persona = idx.personaBySlug.get(opts.personaSlug);
  if (!persona) return { ok: false, error: "Unknown interviewer.", status: 400 };
  const university = opts.universitySlug ? idx.universityBySlug.get(opts.universitySlug) : undefined;

  const quota = await consumeQuota(supabase, "ai_interviewer");
  if (!quota.allowed) return { ok: false, error: quotaMessage(quota), status: 429 };

  const sessionId = randomUUID();
  try {
    const turn = await interviewerTurn({
      sessionId,
      promptKey: persona.promptKey,
      universityId: university?.id ?? null,
      transcript: [],
    });
    const transcript: TranscriptEntry[] = [{ role: "interviewer", content: turn.message, at: new Date().toISOString() }];
    const { error } = await supabase.from("interviewer_sessions").insert({
      id: sessionId,
      persona_id: persona.id,
      university_id: university?.id ?? null,
      transcript,
      prompt_version: INTERVIEWER_PROMPT_VERSION,
      model: turn.model,
    });
    if (error) return { ok: false, error: "Couldn't start the interview.", status: 500 };
    return { ok: true, sessionId };
  } catch (e) {
    return aiFail(e);
  }
}

export async function takeTurn(
  supabase: ServerSupabase,
  sessionId: string,
  message: string,
): Promise<{ ok: true; reply: TranscriptEntry; ended: boolean } | Fail> {
  const text = message.trim();
  if (!text) return { ok: false, error: "Type an answer first.", status: 400 };
  if (text.length > STUDENT_MESSAGE_MAX) return { ok: false, error: `Keep answers under ${STUDENT_MESSAGE_MAX} characters.`, status: 400 };

  const { data: session } = await supabase.from("interviewer_sessions").select("*").eq("id", sessionId).maybeSingle();
  if (!session) return { ok: false, error: "Interview not found.", status: 404 };
  if (session.status !== "active") return { ok: false, error: "This interview has finished.", status: 409 };
  const idx = await getIndexes();
  const persona = idx.personaById.get(session.persona_id);
  if (!persona) return { ok: false, error: "Interviewer unavailable.", status: 500 };

  const transcript = parseTranscript(session.transcript);
  if (studentAnswers(transcript) >= INTERVIEW_MAX_ANSWERS) return { ok: false, error: "This interview has finished.", status: 409 };

  const quota = await consumeQuota(supabase, "ai_interviewer");
  if (!quota.allowed) return { ok: false, error: quotaMessage(quota), status: 429 };

  const withStudent: TranscriptEntry[] = [...transcript, { role: "student", content: text, at: new Date().toISOString() }];
  try {
    const turn = await interviewerTurn({
      sessionId,
      promptKey: persona.promptKey,
      universityId: session.university_id,
      transcript: withStudent,
    });
    const reply: TranscriptEntry = { role: "interviewer", content: turn.message, at: new Date().toISOString() };
    const { error } = await supabase
      .from("interviewer_sessions")
      .update({ transcript: [...withStudent, reply], model: turn.model })
      .eq("id", sessionId)
      .eq("status", "active");
    if (error) return { ok: false, error: "Couldn't save the conversation.", status: 500 };
    return { ok: true, reply, ended: turn.ends };
  } catch (e) {
    return aiFail(e);
  }
}

/** Ends the interview and generates the debrief (idempotent). */
export async function endInterview(
  supabase: ServerSupabase,
  sessionId: string,
): Promise<{ ok: true; debrief: Debrief | null } | Fail> {
  const { data: session } = await supabase.from("interviewer_sessions").select("*").eq("id", sessionId).maybeSingle();
  if (!session) return { ok: false, error: "Interview not found.", status: 404 };
  const existing = parseDebrief(session.ai_summary);
  if (existing) return { ok: true, debrief: existing };

  if (session.status === "active") {
    await supabase
      .from("interviewer_sessions")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", sessionId);
  }
  const transcript = parseTranscript(session.transcript);
  if (studentAnswers(transcript) === 0) return { ok: true, debrief: null }; // nothing to assess
  if (!aiConfigured()) return { ok: false, error: "The AI debrief isn't switched on yet.", status: 503 };

  const quota = await consumeQuota(supabase, "ai_interviewer");
  if (!quota.allowed) return { ok: false, error: quotaMessage(quota), status: 429 };

  const idx = await getIndexes();
  const persona = idx.personaById.get(session.persona_id);
  try {
    const { system, user } = buildDebriefPrompt({
      personaName: persona?.name ?? "Interviewer",
      transcript,
      frameworks: idx.frameworks,
      university: session.university_id ? idx.universityById.get(session.university_id) : null,
    });
    const { data } = await callStructured({
      system,
      messages: [{ role: "user", content: user }],
      toolName: "submit_debrief",
      toolDescription: "Submit the structured debrief for this practice interview.",
      schema: DebriefSchema,
      maxTokens: 2500,
      temperature: 0.3,
    });
    // Keep only framework slugs that actually exist.
    const debrief: Debrief = { ...data, suggested_frameworks: data.suggested_frameworks.filter((s) => idx.frameworkBySlug.has(s)) };
    await supabase
      .from("interviewer_sessions")
      .update({ ai_summary: debrief, prompt_version: `${INTERVIEWER_PROMPT_VERSION}+${DEBRIEF_PROMPT_VERSION}` })
      .eq("id", sessionId);
    return { ok: true, debrief };
  } catch (e) {
    return aiFail(e);
  }
}
