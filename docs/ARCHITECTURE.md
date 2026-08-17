# Architecture

## 1. User flow

```text
Prompt Workspace
      |
      +--> target model
      +--> task type
      +--> enhancement depth
      +--> desired outcome
      |
      v
Enhancement API
      |
      +--> Intent Analyzer
      +--> Context Analyzer
      +--> Constraint Extractor
      +--> Framework Selector
      +--> Model Adapter
      +--> Prompt Compiler
      +--> Quality Evaluator
      |
      v
Enhanced Prompt + Explanation + Score
```

## 2. Service boundaries

### Web application
Owns the interface, client state, validation, prompt editing, comparison view, and accessibility.

### Enhancement service
Owns intent analysis, prompt construction, model-specific adaptation, validation, and quality scoring.

### Provider adapters
Expose a stable internal interface so the application is not tightly coupled to one model provider.

```ts
interface AIProvider {
  generate(input: ProviderRequest): Promise<ProviderResponse>;
}
```

### Persistence
PostgreSQL will store users, prompts, enhancement runs, preferences, and usage metadata. Redis can later support caching, rate limiting, and short-lived workflow state.

## 3. Prompt representation

The internal representation should be structured instead of passing one giant string between services.

```ts
interface PromptIntent {
  task: string;
  objective?: string;
  audience?: string;
  context: string[];
  constraints: string[];
  outputFormat?: string;
  tone?: string;
  targetModel: string;
  confidence: number;
}
```

The compiler turns this representation into a final prompt suitable for the selected target model.

## 4. Safety and trust

The system should preserve user intent and must not silently fabricate facts. Important missing information should trigger clarification or an explicit assumption section.

The quality evaluator should reward clarity, completeness, specificity, constraint coverage, and model fit rather than prompt length.

## 5. Delivery strategy

Build vertical slices instead of disconnected screens:

1. Prompt workspace -> deterministic mock enhancer -> polished result UI.
2. Real provider -> structured enhancement output.
3. Quality evaluator -> score and explanations.
4. Persistence -> history and saved prompts.
5. Model adapters -> model-aware optimization.
