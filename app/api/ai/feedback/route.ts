import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { generateFeedbackForAnswer } from "@/lib/ai/feedback-service";
import { getSession } from "@/lib/auth";

export const maxDuration = 60;

const Body = z.object({ answerId: z.string().uuid() });

export async function POST(request: NextRequest) {
  const { supabase, user } = await getSession();
  if (!user) return NextResponse.json({ ok: false, error: "Please sign in." }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  try {
    const result = await generateFeedbackForAnswer(supabase, parsed.data.answerId);
    if (result.ok) return NextResponse.json({ ok: true, feedback: result.feedback });
    return NextResponse.json({ ok: false, error: result.error, code: result.code }, { status: result.status });
  } catch (e) {
    console.error("[api/ai/feedback]", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
