"use server";

import { z } from "zod";

import type { ActionResult } from "@/lib/actions/progress";
import { getSession } from "@/lib/auth";
import { ensureProfile } from "@/lib/profile";

const Input = z.object({ id: z.string().uuid(), status: z.enum(["unread", "read", "bookmarked"]) });

export async function setReadingStatus(readingItemId: string, status: "unread" | "read" | "bookmarked"): Promise<ActionResult> {
  const parsed = Input.safeParse({ id: readingItemId, status });
  if (!parsed.success) return { ok: false, error: "Invalid request." };
  const { supabase, user } = await getSession();
  if (!user) return { ok: false, error: "Sign in to track your reading." };
  await ensureProfile(supabase, user.id);
  const { error } = await supabase
    .from("reading_progress")
    .upsert({ user_id: user.id, reading_item_id: parsed.data.id, status: parsed.data.status }, { onConflict: "user_id,reading_item_id" });
  return error ? { ok: false, error: "Couldn't save." } : { ok: true, data: null };
}
