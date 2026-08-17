export type TargetModel =
  | "ChatGPT"
  | "Gemini"
  | "Claude"
  | "Cursor"
  | "Midjourney"
  | "Other";

export type Goal =
  | "Best answer"
  | "Professional output"
  | "Code"
  | "Research"
  | "Image"
  | "Custom";

export interface PromptAnalysis {
  task: string;
  objective: string;
  context: string[];
  constraints: string[];
  outputFormat: string;
  tone: string;
  missingContext: string[];
  assumptions: string[];
  confidence: number;
}

export interface EnhancementResult {
  enhancedPrompt: string;
  analysis: PromptAnalysis;
  score: number;
  changes: string[];
  provider: "ai" | "deterministic";
}
