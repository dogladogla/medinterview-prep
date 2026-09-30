/**
 * Student text is embedded inside XML-style tags in prompts. Neutralise any
 * tag-like sequences so text can't close the wrapper and pose as instructions.
 */
export function sanitizeForPrompt(text: string, maxChars = 8000): string {
  return text
    .slice(0, maxChars)
    .replace(/<\/?\s*(student_answer|student_message|question_context|guardrails|rubric|system|output_rules|university_context|question_pool|transcript)[^>]*>/gi, "[tag removed]")
    .replace(/\u0000/g, "");
}
