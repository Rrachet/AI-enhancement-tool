# AI Enhancement Tool

An intelligent prompt enhancement platform that transforms rough natural-language instructions into clear, structured, model-aware prompts.

## Product vision

**Say what you mean. AI does the engineering.**

The goal is not to make prompts longer. The system should understand the user's intent, identify ambiguity and missing context, preserve the user's objective, and produce a prompt optimized for the selected AI workflow.

## Core capabilities

- Intent and task classification
- Missing-context detection
- Prompt enhancement without changing user intent
- Model-aware optimization for GPT, Gemini, Claude, Cursor, and image-generation workflows
- Prompt quality evaluation
- Explainable enhancement changes
- Adaptive clarification when important context is missing
- Provider-independent AI service architecture
- Production typechecking and build verification through GitHub Actions

## Current engine

The first enhancement engine is deterministic by design. It provides a reliable baseline for intent classification, task detection, context-gap analysis, model guidance, prompt compilation, and quality scoring before a live AI provider is introduced.

```text
User Prompt
    |
    v
Intent / Task Detection
    |
    v
Context & Constraint Analysis
    |
    v
Framework Selection
    |
    v
Model Guidance
    |
    v
Prompt Compiler
    |
    v
Quality Evaluation
    |
    v
Enhanced Prompt + Analysis
```

## Initial stack

- Next.js
- TypeScript
- React
- Lucide React
- PostgreSQL + Prisma (planned)
- Redis (planned)
- Provider-agnostic AI service layer

## Engineering principles

1. Preserve user intent.
2. Never invent important facts silently.
3. Ask for clarification only when it materially improves the outcome.
4. Optimize for output quality, not prompt length.
5. Keep model-specific behavior isolated behind adapters.
6. Keep the interface simple enough for a first-time AI user.
7. Build deterministic foundations before adding probabilistic AI behavior.

## Project status

**Phase 2 — Prompt intelligence engine**

Completed:

- [x] Next.js + TypeScript application foundation
- [x] Product UI system and prompt workspace
- [x] Model and task selectors
- [x] Deterministic enhancement engine
- [x] Task and intent analysis
- [x] Missing-context detection
- [x] Model-aware prompt guidance
- [x] Quality score and explainable changes
- [x] Enhancement API endpoint
- [x] GitHub Actions typecheck + production build

Next:

- [ ] Add real AI provider adapter
- [ ] Replace deterministic classification with hybrid AI + rules
- [ ] Add prompt quality benchmark suite
- [ ] Add original vs enhanced comparison
- [ ] Add prompt history and saved prompts
- [ ] Add authentication and usage controls

## License

MIT
