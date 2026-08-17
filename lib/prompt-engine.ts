export type TargetModel = "ChatGPT" | "Gemini" | "Claude" | "Cursor" | "Midjourney" | "Other";
export type Goal = "Best answer" | "Professional output" | "Code" | "Research" | "Image" | "Custom";

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
  const text = normalized(input);
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

function buildObjective(input: string, goal: Goal) {
  const goalText = goal === "Best answer" ? "produce the most useful and accurate result" : `produce a high-quality ${goal.toLowerCase()} result`;
  return `Use the user's request as the source of truth and ${goalText}, while preserving the original intent.`;
}

export function enhancePrompt(input: string, model: TargetModel, goal: Goal): EnhancementResult {
  const taskType = detectTask(input, goal);
  const missing = detectMissing(input, taskType, goal);
  const context = input.length > 80 ? ["Use all relevant details contained in the original request."] : [];
  const constraints = ["Do not invent important facts, requirements, or background.", "Preserve the user's intended outcome."];
  const changes = ["Clarified the objective", "Added explicit execution instructions", "Added ambiguity protection", "Adapted guidance for the selected model"];

  if (missing.length) changes.push(`Flagged ${missing.length} missing context item${missing.length === 1 ? "" : "s"}`);

  const modelLines = modelGuidance[model];
  const clarification = missing.length
    ? `\nMissing context to consider:\n${missing.map((item) => `- ${item}`).join("\n")}\nIf any missing item materially affects the result, ask a concise clarification question before proceeding. Otherwise, make only safe assumptions and state them.\n`
    : "";

  const enhancedPrompt = [
    `Task: ${taskType}`,
    `\nObjective:\n${buildObjective(input.trim(), goal)}`,
    `\nUser request:\n${input.trim()}`,
    context.length ? `\nContext:\n${context.map((item) => `- ${item}`).join("\n")}` : "",
    `\nInstructions:\n${modelLines.map((item) => `- ${item}`).join("\n")}`,
    `- ${constraints[0]}`,
    `- ${constraints[1]}`,
    `- Prioritize accuracy, relevance, and specificity over unnecessary length.`,
    `- Follow the requested output format exactly when one is provided.`,
    clarification,
    `\nQuality check:\nBefore responding, verify that the objective, constraints, and requested deliverable are all addressed.`,
  ].filter(Boolean).join("\n");

  const completeness = Math.min(100, 45 + Math.min(input.length / 5, 25) + (missing.length === 0 ? 25 : 8));
  const modelFit = model === "Other" ? 82 : 94;
  const score = Math.round((completeness * 0.45) + (modelFit * 0.35) + (taskType === "General task" ? 72 : 92) * 0.2);
  const confidence = Math.min(0.98, 0.58 + (taskType === "General task" ? 0 : 0.2) + Math.min(input.length / 1000, 0.2));

  return {
    enhancedPrompt,
    analysis: {
      intent: input.trim(),
      taskType,
      objective: buildObjective(input.trim(), goal),
      context,
      constraints,
      missing,
      confidence: Number(confidence.toFixed(2)),
      score,
      changes,
    },
  };
}
