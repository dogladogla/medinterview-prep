import type { Framework, University } from "@/lib/content/types";
import type { TranscriptEntry } from "../schemas/interviewer";
import { sanitizeForPrompt } from "../sanitize";
import { GUARDRAILS } from "./guardrails";
import { universityContext } from "./university-context";

export const DEBRIEF_PROMPT_VERSION = "debrief-v1";

export function buildDebriefPrompt(opts: {
  personaName: string;
  transcript: TranscriptEntry[];
  frameworks: Framework[];
  university?: University | null;
}): { system: string; user: string } {
  const system = `
You are an experienced UK medical school admissions tutor reviewing a practice interview transcript between an interviewer ("${opts.personaName}") and a student applicant. Write an honest, constructive, encouraging debrief that helps the student improve. Coach — never write model answers for them.

${GUARDRAILS}

<output_rules>
- Respond only by calling the submit_debrief tool.
- Refer to specific things the student said. Calibrate for a strong 17-year-old applicant.
- exchanges: one entry per main question topic, in order, each with a one- or two-sentence comment.
- follow_up_handling: how they coped when pushed, challenged or asked "why?".
- suggested_frameworks: up to 3 slugs chosen ONLY from the framework list provided; empty if none fit.
- If the student said very little, say so kindly and focus on how to open up answers.
- wellbeing_note: empty unless the wellbeing rule applies.
- British English.
</output_rules>

<frameworks_available>
${opts.frameworks.map((f) => `${f.slug}: ${f.name}`).join("\n")}
</frameworks_available>

${universityContext(opts.university)}`.trim();

  const transcript = opts.transcript
    .map((t) =>
      t.role === "interviewer"
        ? `INTERVIEWER: ${t.content}`
        : `STUDENT: <student_message>${sanitizeForPrompt(t.content, 3000)}</student_message>`,
    )
    .join("\n\n");

  return { system, user: `<transcript>\n${transcript}\n</transcript>\n\nWrite the debrief now.` };
}
