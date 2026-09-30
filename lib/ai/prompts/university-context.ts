import type { University } from "@/lib/content/types";

/** Brief §6.3: inject the selected university's interview style into prompts. */
export function universityContext(u: University | null | undefined): string {
  if (!u) return "";
  return `
<university_context>
The student is preparing for ${u.name}.
Interview style: ${u.interviewStyleNotes}
What they look for: ${u.whatTheyLookFor.join("; ")}
Use this to calibrate emphasis. Do not state admissions facts about ${u.name} beyond what is given here.
</university_context>`.trim();
}
