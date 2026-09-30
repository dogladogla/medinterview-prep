"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getSession } from "@/lib/auth";
import { ensureProfile } from "@/lib/profile";

export type FormState = { ok: boolean; message: string | null };

const ProfileSchema = z.object({
  display_name: z.string().trim().max(80, "Name must be 80 characters or fewer."),
  applicant_type: z.enum(["", "school_leaver", "graduate", "international", "reapplicant"]),
  universities: z.array(z.string().uuid()).max(10),
});

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = ProfileSchema.safeParse({
    display_name: formData.get("display_name") ?? "",
    applicant_type: formData.get("applicant_type") ?? "",
    universities: formData.getAll("universities"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check the form." };

  const { supabase, user } = await getSession();
  if (!user) return { ok: false, message: "Please sign in again." };
  await ensureProfile(supabase, user.id);

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name || null,
      applicant_type: parsed.data.applicant_type || null,
    })
    .eq("id", user.id);
  if (error) return { ok: false, message: "Couldn't save your profile." };

  // Replace target universities (small list — delete then insert).
  const { error: delErr } = await supabase.from("profile_target_universities").delete().eq("profile_id", user.id);
  if (delErr) return { ok: false, message: "Couldn't update target universities." };
  if (parsed.data.universities.length) {
    const { error: insErr } = await supabase
      .from("profile_target_universities")
      .insert(parsed.data.universities.map((id) => ({ profile_id: user.id, university_id: id })));
    if (insErr) return { ok: false, message: "Couldn't update target universities." };
  }
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved." };
}

/**
 * Deletes all of this user's practice data in this app. Sign-in is shared with
 * other apps in the same Supabase project, so the auth account itself is kept;
 * a fresh empty profile is created on next visit.
 */
export async function deleteMyData(formData: FormData): Promise<void> {
  if (formData.get("confirm") !== "DELETE") redirect("/settings?deleted=0");
  const { supabase, user } = await getSession();
  if (!user) redirect("/login");
  const { error } = await supabase.from("profiles").delete().eq("id", user.id); // cascades to all practice data
  if (error) redirect("/settings?deleted=0");
  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
