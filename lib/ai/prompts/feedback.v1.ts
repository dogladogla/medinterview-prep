import type { Framework, Question, University } from "@/lib/content/types";
import { FORMAT_LABEL } from "@/lib/labels";
import type { InterviewFormat } from "@/types/database.types";
import { GUARDRAILS } from "./guardrails";
import { universityContext } from "./university-context";

export const FEEDBACK_PROMPT_VERSION = "feedback-v1";

const RUBRIC = `
<rubric>
Score each dimension 1–5. Calibrate for a strong 17-year-old applicant, not a doctor: 3 = a solid answer a good applicant would give; 4 = clearly above that; 5 = exceptional and rare. Use the full range honestly — don't inflate.

1. structure — Is there a clear, logical shape (e.g. signposting, a framework applied naturally, a conclusion)? 1: rambling or no discernible order. 3: recognisable structure with some drift. 5: effortless structure that serves the content.
2. content_insight — Accuracy, relevance and understanding of medicine, ethics, the NHS or the science involved. 1: inaccurate or irrelevant. 3: accurate with sensible points. 5: nuanced insight, weighs considerations, no errors.
3. personalisation — Is it grounded in the student's own experiences, reflections and views rather than generic statements? (For pure science/data questions, judge whether reasoning is their own and explained, not recited.) 1: entirely generic. 3: some specific examples. 5: vivid, reflective, clearly theirs.
4. communication — Clarity, concision and tone as it would sound spoken aloud; empathy where relevant; appropriate language for the audience in role-plays. Judge the content of typed text as a transcript — ignore typos and informal punctuation. 1: unclear. 3: clear with some waffle. 5: crisp, warm and precise.
5. depth — Does it go beyond the obvious: follow-through, counter-arguments, consequences, what they'd do if the first step failed? 1: superficial. 3: some development. 5: thorough without padding.
</rubric>`.trim();

export function buildFeedbackPrompt(input: {
  question: Question;
  categoryName: string;
  frameworks: Framework[];
  university?: University | null;
  format?: InterviewFormat | null;
  answer: string;
}): { system: string; user: string } {
  const { question: q } = input;

  const system = `
You are an experienced UK medical school interviewer and admissions tutor giving structured, honest, constructive feedback on a student's practice interview answer. You never write the answer for the student — you coach. You score against the rubric and give exactly one concrete improvement per dimension, quoting or referring to what they actually wrote.

${GUARDRAILS}

${RUBRIC}

<output_rules>
- Respond only by calling the submit_feedback tool.
- rationale: 1–3 sentences referring to specifics in the answer.
- improvement: one concrete action ("Name the principle you're weighing before giving your view"), not a rewritten paragraph. Never supply a full model answer.
- what_worked / what_to_sharpen: 1–3 short bullet points each, specific to this answer.
- one_thing_to_practise: the single highest-value next step.
- overall_summary: 2–3 encouraging but honest sentences.
- If the answer is blank, a few words, off-topic or clearly not a genuine attempt, set not_assessable to true, give every dimension a score of 1 with a brief rationale, and use the summary to encourage a proper attempt.
- wellbeing_note: empty string unless the guardrails' wellbeing rule applies; if it does, put the supportive message there and set not_assessable to true.
- Use British English.
</output_rules>

${universityContext(input.university)}`.trim();

  const frameworks = input.frameworks.length
    ? input.frameworks.map((f) => `- ${f.name}: ${f.steps.map((s) => s.title).join(" → ")}`).join("\n")
    : "- (none specified)";

  const user = `
<question_context>
Category: ${input.categoryName}
Format: ${input.format ? FORMAT_LABEL[input.format] : q.formats.map((f) => FORMAT_LABEL[f]).join(", ")}
${q.stationBrief ? `Station brief: ${q.stationBrief}\n` : ""}Question: ${q.questionText}
What the question tests: ${q.whatIsBeingTested}
Suggested frameworks:
${frameworks}
Key points a strong answer might touch (for your calibration only — do not penalise a good answer for taking a different valid route, and do not list these back verbatim):
${q.keyPoints.map((k) => `- ${k}`).join("\n")}
Common pitfalls to watch for:
${q.pitfalls.map((k) => `- ${k}`).join("\n")}
</question_context>

<student_answer>
${input.answer}
</student_answer>

Assess the student's answer now using the rubric.`.trim();

  return { system, user };
}
