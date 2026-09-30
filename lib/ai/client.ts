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
export async function callStructured<S extends z.ZodType>(opts: {
  system: string;
  messages: Message[];
  toolName: string;
  toolDescription: string;
  schema: S;
  maxTokens?: number;
  temperature?: number;
}): Promise<{ data: z.infer<S>; model: string }> {
  const anthropic = getClient();
  const tool: Anthropic.Tool = {
    name: opts.toolName,
    description: opts.toolDescription,
    input_schema: toInputSchema(opts.schema),
  };

  let lastIssue = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    let res: Anthropic.Message;
    try {
      res = await anthropic.messages.create({
        model: MODELS.main,
        max_tokens: opts.maxTokens ?? 2000,
        temperature: opts.temperature ?? 0.4,
        system: opts.system,
        messages: opts.messages,
        tools: [tool],
        tool_choice: { type: "tool", name: opts.toolName },
      });
    } catch (e) {
      const status = e instanceof Anthropic.APIError ? e.status : undefined;
      console.error("[ai] upstream error", status, e instanceof Error ? e.message : e);
      throw new AiError("The AI service is busy or unavailable. Please try again in a minute.", "upstream");
    }

    if (res.stop_reason === "refusal") throw new AiError("The AI declined to respond to this input.", "refused");
    const block = res.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
    const parsed = opts.schema.safeParse(block?.input);
    if (parsed.success) return { data: parsed.data, model: res.model };
    lastIssue = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    console.warn("[ai] invalid structured output, retrying:", lastIssue);
  }
  throw new AiError(`The AI returned an unexpected format (${lastIssue.slice(0, 200)}).`, "invalid_output");
}
