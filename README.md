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
- Original vs enhanced comparison
- Explainable enhancement changes
- Adaptive clarification when important context is missing
- Prompt history and export

## Planned architecture

```text
User Prompt
    |
    v
Intent Detection
    |
    v
Context & Constraint Analysis
    |
    v
Task Framework Selection
    |
    v
Model Adapter
    |
    v
Prompt Compiler
    |
    v
Quality Evaluation
    |
    v
Enhanced Prompt
```

## Initial stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL + Prisma
- Redis
- Provider-agnostic AI service layer

## Engineering principles

1. Preserve user intent.
2. Never invent important facts silently.
3. Ask for clarification only when it materially improves the outcome.
4. Optimize for output quality, not prompt length.
5. Keep model-specific behavior isolated behind adapters.
6. Keep the interface simple enough for a first-time AI user.

## Project status

**Phase 0 — Repository foundation**

Next milestones:

- [ ] Initialize Next.js + TypeScript application
- [ ] Establish product UI system
- [ ] Build prompt workspace
- [ ] Add model and task selectors
- [ ] Create enhancement engine interfaces
- [ ] Add first AI provider adapter
- [ ] Implement prompt quality evaluation
- [ ] Add tests and CI

## License

MIT
