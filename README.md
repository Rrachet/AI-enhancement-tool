# AI Enhancement Tool

An intelligent prompt enhancement platform that transforms rough natural-language instructions into clear, structured, model-aware prompts.

## Product vision

**Say what you mean. AI does the engineering.**

The goal is not to make prompts longer. Enhance analyzes intent, detects missing context, applies task-specific guidance, adapts instructions to the selected AI workflow, and evaluates the resulting prompt.

## Current capabilities

- Intent and task classification
- Missing-context detection
- Prompt enhancement without changing user intent
- Model-aware guidance for GPT, Gemini, Claude, Cursor, and image workflows
- AI-powered enhancement through the Vercel AI Gateway
- Deterministic fallback when no AI key is configured or the provider fails
- Prompt quality scoring
- Explainable enhancement changes
- Confidence and missing-context signals
- Copy-ready enhanced prompt output
- Production API route with validation and bounded runtime

## Enhancement pipeline

```text
User Prompt
    |
    v
Input Validation
    |
    v
Intent / Task Analysis
    |
    v
Context & Constraint Analysis
    |
    v
Task + Model Guidance
    |
    v
AI Prompt Compiler
    |
    v
Structured Result Normalization
    |
    v
Quality Score + Explanation
    |
    v
Enhanced Prompt
```

## Architecture

```text
app/
  api/enhance/        # Server-side enhancement endpoint
  page.tsx            # Product workspace
  globals.css         # Product UI system

lib/
  prompt-engine.ts    # Domain orchestration + safe fallback
  ai/
    provider.ts       # AI SDK provider boundary
    prompts.ts        # Model/task-aware compiler instructions
    types.ts          # Shared domain contracts

docs/
  ARCHITECTURE.md
```

The provider layer is intentionally separated from the product engine. The application can change AI providers or models without rewriting the UI or domain logic.

## AI provider

The project uses the Vercel AI Gateway through the AI SDK so the enhancement service can address multiple model providers through one interface.

For local development, create `.env.local` from `.env.example` and set:

```env
AI_GATEWAY_API_KEY=your_key_here
AI_ENHANCEMENT_MODEL=openai/gpt-5.5
```

Without a gateway key, the application continues to work using its deterministic enhancement engine.

## Engineering principles

1. Preserve user intent.
2. Never invent important facts silently.
3. Ask for clarification only when it materially improves the outcome.
4. Optimize for output quality, not prompt length.
5. Keep model-specific behavior isolated behind adapters.
6. Validate AI output before returning it to the client.
7. Keep the interface simple enough for a first-time AI user.

## Development

```bash
npm install
npm run dev
```

Type-check with:

```bash
npm run check
```

Build for production with:

```bash
npm run build
```

## Roadmap

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
- [ ] Model-specific optimization profiles
- [ ] Authentication and usage limits
- [ ] Observability and production analytics

## License

MIT
