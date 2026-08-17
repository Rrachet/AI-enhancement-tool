"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy, Sparkles } from "lucide-react";

const models = ["ChatGPT", "Gemini", "Claude", "Cursor", "Midjourney", "Other"];
const goals = ["Best answer", "Professional output", "Code", "Research", "Image", "Custom"];

function buildLocalEnhancement(input: string, model: string, goal: string) {
  const task = goal === "Best answer" ? "Provide the most useful and accurate answer possible." : `Optimize the response for ${goal.toLowerCase()}.`;
  return `Act as an expert assistant optimized for ${model}.

Objective:
${task}

User request:
${input.trim()}

Instructions:
- First identify the user's actual intent and preserve it exactly.
- Use the available context instead of inventing facts, requirements, or background.
- Resolve ambiguity with reasonable assumptions only when they do not change the intended outcome.
- Structure the response so the result is clear, actionable, and easy to evaluate.
- Prioritize accuracy, relevance, and directness over unnecessary verbosity.
- Follow the requested format and explicitly state important assumptions when needed.

Before producing the final result, silently check that every requirement in the user's request has been addressed.`;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("ChatGPT");
  const [goal, setGoal] = useState("Best answer");
  const [enhanced, setEnhanced] = useState("");
  const [copied, setCopied] = useState(false);

  const count = useMemo(() => prompt.length, [prompt]);

  function enhance() {
    if (!prompt.trim()) return;
    setEnhanced(buildLocalEnhancement(prompt, model, goal));
    setCopied(false);
  }

  async function copyPrompt() {
    if (!enhanced) return;
    await navigator.clipboard.writeText(enhanced);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand"><span className="brand-mark">E</span> Enhance</div>
        <span className="nav-note">Prompt intelligence, without the jargon.</span>
      </nav>

      <section className="hero">
        <div className="eyebrow">AI prompt enhancement</div>
        <h1>Make AI understand what you mean.</h1>
        <p className="hero-copy">Start with a rough idea. Enhance turns it into a clear, structured prompt tailored to the AI tool you want to use.</p>
      </section>

      <section className="workspace">
        <div className="workspace-grid">
          <div>
            <div className="panel">
              <div className="panel-head">
                <span className="panel-label">Your prompt</span>
                <span className="counter">{count.toLocaleString()} / 5,000</span>
              </div>
              <textarea
                className="prompt-input"
                maxLength={5000}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="e.g. make a landing page for my startup that gets people to book a demo"
                aria-label="Prompt to enhance"
              />
            </div>

            <div className="panel output">
              <div className="panel-head">
                <span className="panel-label">Enhanced prompt</span>
                {enhanced && <span className="counter">Ready to use</span>}
              </div>
              <div className={`output-body ${!enhanced ? "output-empty" : ""}`}>
                {enhanced || "Your enhanced prompt will appear here."}
              </div>
              {enhanced && (
                <div className="output-actions">
                  <button className="action primary" onClick={copyPrompt}>
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy prompt</>}
                  </button>
                  <button className="action" onClick={() => setEnhanced("")}>Clear</button>
                </div>
              )}
            </div>
          </div>

          <aside className="panel">
            <div className="panel-head"><span className="panel-label">Enhancement settings</span></div>
            <div className="controls">
              <label className="control">
                <span className="control-label">Where will you use it?</span>
                <select className="select" value={model} onChange={(event) => setModel(event.target.value)}>
                  {models.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <div className="control">
                <span className="control-label">What do you want back?</span>
                <div className="mode-grid">
                  {goals.map((item) => (
                    <button key={item} className={goal === item ? "active" : ""} onClick={() => setGoal(item)}>{item}</button>
                  ))}
                </div>
              </div>

              <button className="enhance" disabled={!prompt.trim()} onClick={enhance}>
                <Sparkles size={15} /> Enhance prompt <ArrowUpRight size={15} />
              </button>
            </div>
          </aside>
        </div>
      </section>

      <footer className="footer">
        <span>Built to make better instructions, not longer instructions.</span>
        <span>v0.1 · Enhancement engine preview</span>
      </footer>
    </main>
  );
}
