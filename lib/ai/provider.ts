import { generateText } from "ai";
import { buildEnhancementSystemPrompt } from "./prompts";
import type { EnhancementResult, Goal, TargetModel } from "./types";

const DEFAULT_MODEL = "openai/gpt-5.5";

function getModel() {
  return process.env.AI_ENHANCEMENT_MODEL || DEFAULT_MODEL;
}

function extractJson(text: string) {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI provider returned an invalid structured response.");
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function normalizeResult(value: unknown): Omit<EnhancementResult, "provider"> {
  if (!value || typeof value !== "object") throw new Error("Invalid enhancement response.");
  const result = value as Record<string, unknown>;
  const analysis = result.analysis as Record<string, unknown> | undefined;

  if (typeof result.enhancedPrompt !== "string" || !analysis) {
    throw new Error("AI provider returned an incomplete enhancement.");
  }

  const list = (key: string) =>
    Array.isArray(analysis[key]) ? analysis[key].filter((item): item is string => typeof item === "string") : [];

  const score = typeof result.score === "number" ? Math.max(0, Math.min(100, Math.round(result.score))) : 0;
  const confidence = typeof analysis.confidence === "number" ? Math.max(0, Math.min(1, analysis.confidence)) : 0;

  return {
    enhancedPrompt: result.enhancedPrompt.trim(),
    score,
    changes: Array.isArray(result.changes) ? result.changes.filter((item): item is string => typeof item === "string") : [],
    analysis: {
      task: typeof analysis.task === "string" ? analysis.task : "General task",
      objective: typeof analysis.objective === "string" ? analysis.objective : "",
      context: list("context"),
      constraints: list("constraints"),
      outputFormat: typeof analysis.outputFormat === "string" ? analysis.outputFormat : "",
      tone: typeof analysis.tone === "string" ? analysis.tone : "",
      missingContext: list("missingContext"),
      assumptions: list("assumptions"),
      confidence,
    },
  };
}

export async function enhanceWithAI(prompt: string, model: TargetModel, goal: Goal) {
  const result = await generateText({
    model: getModel(),
    system: buildEnhancementSystemPrompt(model, goal),
    prompt: `Analyze and enhance this user's prompt. Preserve the original intent and return only the requested JSON structure.\n\nUSER PROMPT:\n${prompt}`,
  });

  return { ...normalizeResult(extractJson(result.text)), provider: "ai" as const };
}

export function aiProviderConfigured() {
  return Boolean(process.env.AI_GATEWAY_API_KEY);
}
