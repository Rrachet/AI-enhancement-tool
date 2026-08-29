# AI Enhancement Tool

> **An AI prompt-engineering product that turns rough intent into clearer, model-aware instructions.**

This project explores a practical product question: how can an AI system improve the quality of what a user asks without silently changing what they meant?

## Product flow

```text
User intent
    ↓
Input validation
    ↓
Intent + task analysis
    ↓
Context + constraint detection
    ↓
Task / model guidance
    ↓
AI prompt compiler
    ↓
Output normalization
    ↓
Quality score + explanation
    ↓
Copy-ready prompt
```

## What it does

- Intent and task classification
- Missing-context detection
- Prompt enhancement while preserving intent
- Model-aware guidance for GPT, Gemini, Claude, Cursor and image workflows
- AI-powered enhancement through the Vercel AI Gateway
- Deterministic fallback when AI is unavailable
- Prompt quality scoring
- Explainable enhancement changes
- Confidence and missing-context signals
- Validated server-side API route

## Architecture

```text
app/
├── api/enhance/        server-side enhancement endpoint
├── page.tsx            product workspace
└── globals.css         UI system

lib/
├── prompt-engine.ts    domain orchestration + fallback
└── ai/
    ├── provider.ts     provider boundary
    ├── prompts.ts      model/task instructions
    └── types.ts        domain contracts

docs/
└── ARCHITECTURE.md
```

The provider boundary keeps model-specific behaviour separate from the product engine. The UI and domain logic do not need to change when the model/provider changes.

## Engineering principles

1. Preserve user intent.
2. Never silently invent important facts.
3. Ask for clarification when it materially improves the result.
4. Optimise for output quality, not prompt length.
5. Isolate model-specific behaviour behind adapters.
6. Validate AI output before returning it to the client.
7. Keep the product simple for first-time AI users.

## Local development

```bash
npm install
npm run dev
```

Type-check:

```bash
npm run check
```

Production build:

```bash
npm run build
```

For AI-powered enhancement, create `.env.local` from `.env.example` and configure the gateway credentials. Without an AI key, the deterministic enhancement engine remains available.

## Engineering roadmap

- [x] Product UI foundation
- [x] Deterministic enhancement engine
- [x] Enhancement API
- [x] AI provider abstraction
- [x] AI-powered enhancement
- [x] Deterministic fallback
- [x] Quality scoring and explanations
- [ ] Schema-native structured AI output
- [ ] Prompt benchmark suite
- [ ] Original vs enhanced diff view
- [ ] Clarification flow for high-impact missing context
- [ ] Prompt history and saved prompts
- [ ] Authentication and usage limits
- [ ] Observability and product analytics

## Product + engineering signal

This project represents the intersection I care about most: **product UX + AI systems + engineering constraints**. The goal is not simply to call an LLM, but to design the workflow around validation, fallbacks, quality signals and a clear user outcome.

## License

MIT
