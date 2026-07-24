# ChatCV

A RAG-style portfolio chatbot that answers questions about my professional background — without a vector database. All context is loaded from Markdown files in this repo and injected into the system prompt on every request.

## Architecture

```
content/*.md          →  content loader (server-side)
                              ↓
                         system prompt builder
                              ↓
/api/chat (POST)  →  LLM client (Groq)  →  streaming SSE response
                              ↓
                         structured logging (stdout)

/api/eval (GET)   →  eval harness (~20 test questions)
```

## Local Setup

### Prerequisites

- Node.js 20+
- A [Groq API key](https://console.groq.com/) (free tier available)

### Install & Run

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your LLM_API_KEY

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See `.env.example` for all options. Minimum required:

| Variable | Description |
|----------|-------------|
| `LLM_API_KEY` | API key for your LLM provider |
| `LLM_PROVIDER` | `groq` (default), `openrouter`, or `together` |
| `LLM_MODEL` | Model ID (default: `llama-3.3-70b-versatile` for Groq) |
| `EVAL_SECRET` | Secret to protect the eval endpoint/script |

## Adding Content

All knowledge lives in plain Markdown under `/content/`:

```
content/
├── resume.md          # Main resume / bio
├── skills.md          # Skills and technologies
└── projects/
    ├── project-one.md
    └── project-two.md
```

Edit these files, restart the dev server (or redeploy), and the chatbot picks up the new context automatically. Content is **never** sent to the client bundle — it's read server-side only.

Keep total content under ~50k tokens for cost and latency reasons.

## LLM Provider Abstraction

The LLM client lives in `src/lib/llm/`. To swap providers:

1. Implement `LLMClient` in `src/lib/llm/providers/<provider>.ts`
2. Register it in `src/lib/llm/client.ts`
3. Set `LLM_PROVIDER` and `LLM_MODEL` in your env

Groq is wired up out of the box. OpenRouter and Together AI have stub entries ready for you to implement.

## Rate Limiting

Rate limiting uses an in-memory stub by default (`src/lib/rate-limit/`). For production on Vercel, wire up [Upstash Redis](https://upstash.com/):

1. Create an Upstash Redis database
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to env
3. Replace the in-memory implementation with `@upstash/ratelimit`

## Eval Harness

Run ~20 fixed test questions to catch regressions when you update content or prompts.

### CLI

```bash
npm run eval
```

Requires `LLM_API_KEY` and `EVAL_SECRET` in `.env.local`.

### HTTP (protected)

```bash
curl -H "Authorization: Bearer $EVAL_SECRET" http://localhost:3000/api/eval
```

Returns a JSON report with pass/fail per question. HTTP 207 if any tests fail.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add environment variables from `.env.example`
4. Deploy

Vercel runs the Next.js App Router natively — no extra config needed.

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts      # Streaming chat endpoint
│   ├── api/eval/route.ts      # Eval harness endpoint
│   ├── page.tsx               # Chat UI
│   └── layout.tsx
├── components/chat/           # Chat UI components
└── lib/
    ├── content/loader.ts      # Reads /content/*.md
    ├── llm/                   # Provider-agnostic LLM client
    ├── prompts/               # System prompt + guardrails
    ├── rate-limit/            # Rate limiter interface + stub
    ├── logging/               # Structured request logging
    └── eval/                  # Eval questions + runner
content/                       # Your resume & knowledge base
scripts/run-eval.ts            # CLI eval runner
```

## Logging

Each chat request logs a JSON line to stdout:

```json
{
  "level": "info",
  "service": "chatcv",
  "event": "chat_request",
  "timestamp": "...",
  "question": "...",
  "response": "...",
  "latencyMs": 1234,
  "clientIp": "..."
}
```

Wire this to Datadog, Axiom, or Vercel Log Drains later — the call sites are already in place.

## License

MIT
