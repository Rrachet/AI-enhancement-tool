# AI Enhancement Tool

> **AI-assisted application workflow with validation, provider abstraction and deterministic fallback.**

This project is a supporting AI engineering example. It demonstrates how to integrate external AI services without making the application completely dependent on a single provider.

## Product flow

```text
User intent
    ↓
Validation
    ↓
Intent + task analysis
    ↓
AI provider
    ↓
Output validation
    ↓
Quality score + explanation
    ↓
User result
```

If the external AI service is unavailable, the deterministic enhancement engine remains available. That fallback is an important reliability pattern: **an external dependency failing should not automatically mean the entire user experience fails.**

## What it demonstrates

- Server-side API integration
- Provider abstraction
- Input/output validation
- External dependency handling
- Deterministic fallback
- Quality scoring
- Clear user-facing error boundaries
- Next.js application architecture

## Architecture

```text
app/api/enhance/       server-side endpoint
app/page.tsx           product workspace
lib/prompt-engine.ts   domain orchestration + fallback
lib/ai/provider.ts     provider boundary
lib/ai/types.ts        domain contracts
docs/                  architecture notes
```

## Local development

```bash
npm install
npm run dev
npm run check
npm run build
```

For AI-powered enhancement, configure `.env.local` from `.env.example`. Without an AI key, the deterministic engine remains available.

## Portfolio role

**SUPPORTING ENGINEERING — resilient API/AI integration**

This project supports the IBM application-operations story by demonstrating dependency isolation, validation and graceful fallback. The primary operational projects remain [APIAtlas](https://github.com/Rrachet/apiatlas) and [SupportHub](https://github.com/Rrachet/SupportHub).

## License

MIT
