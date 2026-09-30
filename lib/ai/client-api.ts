import type { Feedback } from "@/lib/ai/schemas/feedback";

export type FeedbackResponse = { ok: true; feedback: Feedback } | { ok: false; error: string; code?: string };

/** Browser helper: request (or fetch existing) AI feedback for a saved answer. */
export async function requestFeedback(answerId: string, init?: { keepalive?: boolean }): Promise<FeedbackResponse> {
  try {
    const res = await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answerId }),
      keepalive: init?.keepalive,
    });
    const body = (await res.json().catch(() => null)) as FeedbackResponse | null;
    if (!body) return { ok: false, error: "The feedback service returned an unexpected response." };
    return body;
  } catch {
    return { ok: false, error: "Network error — check your connection and try again." };
  }
}
