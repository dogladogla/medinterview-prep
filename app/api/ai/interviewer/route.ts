import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { endInterview, startInterview, takeTurn } from "@/lib/ai/interviewer-service";
import { getSession } from "@/lib/auth";
import { ensureProfile } from "@/lib/profile";

export const maxDuration = 60;

const Body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("start"), personaSlug: z.string().max(60), universitySlug: z.string().max(60).nullish() }),
  z.object({ action: z.literal("turn"), sessionId: z.string().uuid(), message: z.string().max(10_000) }),
  z.object({ action: z.literal("end"), sessionId: z.string().uuid() }),
]);

export async function POST(request: NextRequest) {
  const { supabase, user } = await getSession();
  if (!user) return NextResponse.json({ ok: false, error: "Please sign in." }, { status: 401 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  const body = parsed.data;

  try {
    if (body.action === "start") {
      await ensureProfile(supabase, user.id);
      const r = await startInterview(supabase, body);
      return r.ok ? NextResponse.json(r) : NextResponse.json(r, { status: r.status });
    }
    if (body.action === "turn") {
      const r = await takeTurn(supabase, body.sessionId, body.message);
      return r.ok ? NextResponse.json(r) : NextResponse.json(r, { status: r.status });
    }
    const r = await endInterview(supabase, body.sessionId);
    return r.ok ? NextResponse.json(r) : NextResponse.json(r, { status: r.status });
  } catch (e) {
    console.error("[api/ai/interviewer]", e);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
