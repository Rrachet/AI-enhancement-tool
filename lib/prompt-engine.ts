import { aiProviderConfigured, enhanceWithAI } from "./ai/provider";
import type { Goal, TargetModel } from "./ai/types";

export type { Goal, TargetModel } from "./ai/types";

export interface PromptAnalysis {
  intent: string;
  taskType: string;
  objective: string;
  context: string[];
  constraints: string[];
  missing: string[];
  confidence: number;
  score: number;
  changes: string[];
}

export interface EnhancementResult {
  enhancedPrompt: string;
  analysis: PromptAnalysis;
  provider: "ai" | "deterministic";
}

const patterns: Array<{ type: string; terms: string[] }> = [
  { type: "Code generation", terms: ["code", "build", "app", "website", "function", "api", "bug", "debug", "javascript", "python", "react"] },
  { type: "Research", terms: ["research", "compare", "sources", "market", "analysis", "investigate", "study"] },
  { type: "Writing", terms: ["write", "rewrite", "email", "post", "article", "blog", "copy", "resume", "proposal"] },
  { type: "Image generation", terms: ["image", "illustration", "poster", "logo", "photo", "render", "visual"] },
  { type: "Planning", terms: ["plan", "strategy", "roadmap", "steps", "schedule", "launch"] },
  { type: "Explanation", terms: ["explain", "teach", "learn", "understand", "what is", "how does"] },
];

const modelGuidance: Record<TargetModel, string[]> = {
  ChatGPT: ["State the objective and constraints explicitly.", "Request a structured, directly usable output."],
  Gemini: ["Make context and source expectations explicit.", "Use clear sections for complex or multimodal tasks."],
  Claude: ["Provide complete context and precise constraints.", "Define the desired artifact or response structure."],
  Cursor: ["Specify the codebase context, files, stack, and acceptance criteria.", "Ask for a concise implementation plan before edits when useful."],
  Midjourney: ["Describe subject, composition, environment, lighting, style, and mood.", "Keep visual direction concrete and avoid contradictory descriptors."],
  Other: ["State the objective, context, constraints, and desired output explicitly.", "Keep instructions model-agnostic and easy to follow."],
};

function normalized(input: string) {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function detectTask(input: string, goal: Goal): string {
  const text = normalized(input);
  const match = patterns
    .map((pattern) => ({ pattern, hits: pattern.terms.filter((term) => text.includes(term)).length }))
    .sort((a, b) => b.hits - a.hits)[0];

  if (goal === "Image") return "Image generation";
  if (goal === "Code") return "Code generation";
  if (goal === "Research") return "Research";
  return match?.hits ? match.pattern.type : "General task";
}

function detectMissing(input: string, taskType: string, goal: Goal): string[] {
  const missing: string[] = [];
  if (input.length < 80) missing.push("Useful context or background");
  if (!/(for|target|audience|user|customer|reader|developer)/i.test(input)) missing.push("Target audience or user");
  if (!/(must|should|avoid|without|only|constraint|require)/i.test(input)) missing.push("Important constraints");
  if (!/(format|return|output|deliver|give me|respond|provide)/i.test(input)) missing.push("Desired output format");
  if (taskType === "Code generation" && !/(react|next|node|python|java|typescript|javascript|css|api|database)/i.test(input)) missing.push("Technology or implementation context");
  if (taskType === "Research" && !/(source|citation|date|period|country|market|scope)/i.test(input)) missing.push("Research scope or source expectations");
  if (goal === "Image" && !/(style|lighting|composition|camera|aspect|mood|color)/i.test(input)) missing.push("Visual direction");
  return [...new Set(missing)].slice(0, 5);
}

function buildDeterministic(input: string, model: TargetModel, goal: Goal): EnhancementResult {
  const taskType = detectTask(input, goal);
  const missing = detectMissing(input, taskType, goal);
  const objective = goal === "Best answer" ? "Produce the most useful and accurate result possible." : `Optimize the result for ${goal.toLowerCase()}.`;
  const changes = ["Clarified the objective", "Added explicit execution instructions", "Added ambiguity protection", "Adapted guidance for the selected model"];
  if (missing.length) changes.push(`Flagged ${missing.length} missing context item${missing.length === 1 ? "" : "s"}`);

  const enhancedPrompt = [
    `Task: ${taskType}`,
    `\nObjective:\n${objective}`,
    `\nUser request:\n${input.trim()}`,
    `\nInstructions:\n${modelGuidance[model].map((item) => `- ${item}`).join("\n")}`,
    "- Do not invent important facts, requirements, or background.",
    "- Preserve the user's intended outcome.",
    "- Prioritize accuracy, relevance, and specificity over unnecessary length.",
    missing.length ? `\nMissing context to consider:\n${missing.map((item) => `- ${item}`).join("\n")}` : "",
    "\nQuality check:\nVerify that the objective, constraints, and requested deliverable are addressed before responding.",
  ].filter(Boolean).join("\n");

  const score = Math.round(58 + Math.min(24, input.length / 10) + (missing.length === 0 ? 15 : 6));
  return {
    enhancedPrompt,
    provider: "deterministic",
    analysis: {
      intent: input.trim(), taskType, objective, context: [],
      constraints: ["Preserve user intent", "Do not invent important facts"],
      missing, confidence: Number(Math.min(0.92, 0.58 + input.length / 1200).toFixed(2)), score, changes,
    },
  };
}

export async function enhancePrompt(input: string, model: TargetModel, goal: Goal): Promise<EnhancementResult> {
  if (!aiProviderConfigured()) return buildDeterministic(input, model, goal);

  try {
    const result = await enhanceWithAI(input, model, goal);
    return {
      enhancedPrompt: result.enhancedPrompt,
      provider: "ai",
      analysis: {
        intent: input.trim(),
        taskType: result.analysis.task,
        objective: result.analysis.objective,
        context: result.analysis.context,
        constraints: result.analysis.constraints,
        missing: result.analysis.missingContext,
        confidence: result.analysis.confidence,
        score: result.score,
        changes: result.changes,
      },
    };
  } catch (error) {
    console.error("AI enhancement failed; using deterministic fallback.", error);
    return buildDeterministic(input, model, goal);
  }
}
