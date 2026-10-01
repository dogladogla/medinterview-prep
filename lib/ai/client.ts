import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

// Model choice is configurable so it can be changed in Vercel without a deploy of code.
export const MODELS = {
  main: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5",
} as const;

export class AiError extends Error {
  constructor(
    message: string,
    public readonly code: "not_configured" | "invalid_output" | "upstream" | "refused",
  ) {
    super(message);
  }
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new AiError("AI features are not configured on this server.", "not_configured");
  // SDK retries 429/5xx twice with backoff by default.
  client ??= new Anthropic({ apiKey, timeout: 50_000, maxRetries: 2 });
  return client;
}

/** Convert a zod object schema to a JSON Schema acceptable as a tool input_schema. */
function toInputSchema(schema: z.ZodType): Anthropic.Tool.InputSchema {
  const json = z.toJSONSchema(schema, { target: "draft-7" }) as Record<string, unknown>;
  delete json.$schema;
  return json as Anthropic.Tool.InputSchema;
}

export type Message = { role: "user" | "assistant"; content: string };

/**
 * Calls Claude and forces it to answer through a single tool whose input is
 * validated with zod. Structured output avoids brittle JSON-in-text parsing.
 * Retries once if the output fails validation.
 */
/** Turns an Anthropic API error into a message that says what actually went wrong. */
function describeApiError(e: unknown): string {
  if (!(e instanceof Anthropic.APIError)) return "Couldn't reach the AI service. Please try again in a minute.";
  const msg = (e.message ?? "").toLowerCase();
  if (e.status === 401 || e.status === 403) return "The AI service rejected the API key. Check ANTHROPIC_API_KEY in Vercel.";
  if (msg.includes("credit balance")) return "The Anthropic account has no credit left. Add credit at console.anthropic.com → Billing.";
  if (e.status === 404) return `The AI model "${MODELS.main}" isn't available to this API key.`;
  if (e.status === 429) return "The AI service is rate-limiting requests. Please wait a minute and try again.";
  if (e.status && e.status >= 500) return "The AI service is busy or unavailable. Please try again in a minute.";
  return `The AI request was rejected (${e.status ?? "error"}): ${(e.message ?? "").slice(0, 160)}`;
}

export async function callStructured<S extends z.ZodType>(opts: {
  system: string;
  messages: Message[];
  toolName: string;
  toolDescription: string;
  schema: S;
  maxTokens?: number;
}): Promise<{ data: z.infer<S>; model: string }> {
  const anthropic = getClient();
  const tool: Anthropic.Tool = {
    name: opts.toolName,
    description: opts.toolDescription,
    input_schema: toInputSchema(opts.schema),
  };
  // Note: no `temperature` — models newer than Claude Opus 4.6 reject any value other than 1.0.
  let forceTool = true;

  let lastIssue = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    let res: Anthropic.Message;
    try {
      res = await anthropic.messages.create({
        model: MODELS.main,
        max_tokens: opts.maxTokens ?? 4000,
        system: forceTool ? opts.system : `${opts.system}\n\nYou must respond by calling the ${opts.toolName} tool.`,
        messages: opts.messages,
        tools: [tool],
        tool_choice: forceTool ? { type: "tool", name: opts.toolName } : { type: "auto" },
      });
    } catch (e) {
      const status = e instanceof Anthropic.APIError ? e.status : undefined;
      const message = e instanceof Error ? e.message : String(e);
      console.error("[ai] upstream error", status, message);
      // Some model configurations don't allow forcing a specific tool — fall back to auto once.
      if (forceTool && status === 400 && /tool_choice|thinking/i.test(message)) {
        forceTool = false;
        continue;
      }
      throw new AiError(describeApiError(e), "upstream");
    }

    if (res.stop_reason === "refusal") throw new AiError("The AI declined to respond to this input.", "refused");
    const block = res.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    const parsed = opts.schema.safeParse(block?.input);
    if (parsed.success) return { data: parsed.data, model: res.model };
    lastIssue = block
      ? parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
      : `no tool call (stop reason: ${res.stop_reason})`;
    console.warn("[ai] invalid structured output, retrying:", lastIssue);
  }
  throw new AiError(`The AI returned an unexpected format (${lastIssue.slice(0, 200)}).`, "invalid_output");
}
