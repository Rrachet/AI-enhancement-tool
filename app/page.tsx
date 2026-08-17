"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Copy, Sparkles } from "lucide-react";

const models = ["ChatGPT", "Gemini", "Claude", "Cursor", "Midjourney", "Other"];
const goals = ["Best answer", "Professional output", "Code", "Research", "Image", "Custom"];

type Analysis = {
  taskType: string;
  score: number;
  confidence: number;
  missing: string[];
  changes: string[];
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("ChatGPT");
  const [goal, setGoal] = useState("Best answer");
  const [enhanced, setEnhanced] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const count = useMemo(() => prompt.length, [prompt]);

  async function enhance() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, goal }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Enhancement failed.");
      setEnhanced(data.enhancedPrompt);
      setAnalysis(data.analysis);
      setCopied(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt() {
    if (!enhanced) return;
    await navigator.clipboard.writeText(enhanced);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function clearResult() {
    setEnhanced("");
    setAnalysis(null);
    setError("");
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
                {enhanced && <span className="counter">Score {analysis?.score ?? "—"}/100</span>}
              </div>
              <div className={`output-body ${!enhanced ? "output-empty" : ""}`}>
                {enhanced || "Your enhanced prompt will appear here."}
              </div>
              {error && <div className="error-message">{error}</div>}
              {enhanced && (
                <div className="output-actions">
                  <button className="action primary" onClick={copyPrompt}>
                    {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy prompt</>}
                  </button>
                  <button className="action" onClick={clearResult}>Clear</button>
                </div>
              )}
            </div>

            {analysis && (
              <div className="analysis-grid">
                <div className="panel insight-panel">
                  <div className="panel-head"><span className="panel-label">What we understood</span></div>
                  <div className="insight-content">
                    <div><span className="insight-key">Task</span><strong>{analysis.taskType}</strong></div>
                    <div><span className="insight-key">Confidence</span><strong>{Math.round(analysis.confidence * 100)}%</strong></div>
                  </div>
                </div>
                <div className="panel insight-panel">
                  <div className="panel-head"><span className="panel-label">What changed</span></div>
                  <ul className="change-list">{analysis.changes.map((change) => <li key={change}>{change}</li>)}</ul>
                </div>
                {analysis.missing.length > 0 && (
                  <div className="panel insight-panel missing-panel">
                    <div className="panel-head"><span className="panel-label">Context worth adding</span></div>
                    <ul className="change-list">{analysis.missing.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
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

              <button className="enhance" disabled={!prompt.trim() || loading} onClick={enhance}>
                <Sparkles size={15} /> {loading ? "Analyzing…" : "Enhance prompt"} <ArrowUpRight size={15} />
              </button>
            </div>
          </aside>
        </div>
      </section>

      <footer className="footer">
        <span>Built to make better instructions, not longer instructions.</span>
        <span>v0.2 · Prompt intelligence engine</span>
      </footer>
    </main>
  );
}
