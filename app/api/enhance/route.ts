import { NextResponse } from "next/server";
import { enhancePrompt, type Goal, type TargetModel } from "@/lib/prompt-engine";

const models: TargetModel[] = ["ChatGPT", "Gemini", "Claude", "Cursor", "Midjourney", "Other"];
const goals: Goal[] = ["Best answer", "Professional output", "Code", "Research", "Image", "Custom"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const model = models.includes(body.model) ? body.model : "ChatGPT";
    const goal = goals.includes(body.goal) ? body.goal : "Best answer";

    if (!prompt) return NextResponse.json({ error: "A prompt is required." }, { status: 400 });
    if (prompt.length > 5000) return NextResponse.json({ error: "Prompt exceeds the 5,000 character limit." }, { status: 400 });

    return NextResponse.json(enhancePrompt(prompt, model, goal));
  } catch {
    return NextResponse.json({ error: "Invalid enhancement request." }, { status: 400 });
  }
}
