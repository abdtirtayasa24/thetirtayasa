# The Tirtayasa Portfolio

Production portfolio for **Abdul F. Tirtayasa**, positioned as a **Data Analyst & AI Enabler**. The site communicates Abdul's analytics, automation, AI enablement, business-support experience, and selected public project work through a Next.js frontend, FastAPI backend, Supabase persistence, and a grounded assistant named **Tirtayasa AI**.

## What This Repository Contains

This is a monorepo with four active product layers:

| Layer | What it does today | Where to work |
| --- | --- | --- |
| Public portfolio frontend | Renders homepage, projects, project details, experience, about, résumé, notes, contact, SEO metadata, sitemap, and robots from version-controlled content. | `frontend/`, `content/` |
| Chat frontend | Provides the global Tirtayasa AI launcher/panel, streaming chat client, session persistence, starter prompts, source cards, feedback controls, and unavailable/retry states. | `frontend/src/components/chat/`, `frontend/src/lib/chat-client.ts` |
| Backend data/API foundation | Serves health, projects, contact submissions, internal ingestion sync, streaming chat, and chat feedback endpoints. | `backend/app/`, `backend/tests/` |
| RAG/assistant backend | Parses public content, chunks and hashes documents, wraps Gemini embeddings/chat generation, ranks retrieval candidates, applies assistant guardrails, streams chat events, and stores chat sessions/messages/feedback. | `backend/app/ingestion/`, `backend/app/retrieval/`, `backend/app/chat/`, `backend/app/ai/` |

Supporting documentation:

- `AGENTS.md` — contributor and coding rules.
- `docs/ARCHITECTURE.md` — technical architecture, repository layout, data flows, APIs, database model, ingestion flow, and chat contracts.
- `DESIGN.md` — visual design system and interface rules.
- `tasks/plan.md` and `tasks/todo.md` — implementation phases and checkpoint state.

## Current Implementation Status

Completed:

- Local monorepo foundation.
- Next.js App Router frontend with TypeScript, Tailwind CSS, Radix UI, lucide-react, Bun, and standalone build output.
- Public portfolio pages backed by typed Markdown/YAML content.
- Real published project content and real experience/LinkedIn content rendering.
- Global frontend chat experience for Tirtayasa AI.
- FastAPI backend with settings, health check, CORS, typed routes, and test harness.
- Alembic + async SQLAlchemy schema for Supabase PostgreSQL/pgvector.
- Contact form submission storage.
- Full-content RAG ingestion for public `content/` files and published public projects.
- Gemini embedding and grounded chat generation path.
- Chat session/message/feedback persistence with redaction helpers.
- Privacy-preserving AI chat rate limits, global daily AI budget controls, and graceful chat degradation.
- Ubuntu VPS systemd/Nginx frontend deployment templates, FastAPI Cloud backend notes, operations runbook, smoke-test script, and CI workflow.

Intentionally pending:

- Frontend VPS deployment must still be manually executed and smoke-tested on the target server.
- Backend FastAPI Cloud deployment must still be configured and smoke-tested.
- Final launch disclosure review for confidential details and unsupported claims.
- Public résumé URL must be confirmed/configured before launch if not already set.

## Local Development

Use two terminal sessions: one for the backend API and one for the frontend app.

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
fastapi dev app/main.py --host 127.0.0.1 --port 8888
```

Health check:

```bash
curl http://127.0.0.1:8888/health
```

Expected response:

```json
{"status":"ok","service":"Data Analyst & AI Enabler Portfolio API"}
```

### Frontend

```bash
cd frontend
bun install
bun run dev -- --hostname 127.0.0.1 --port 3030
```

Open:

```text
http://127.0.0.1:3030
```

For local frontend-to-backend integration, create `frontend/.env.local` from `frontend/.env.example` and keep:

```bash
NEXT_PUBLIC_BACKEND_API_URL=http://127.0.0.1:8888
```

To test the production-style standalone frontend server:

```bash
cd frontend
bun run build
bun start
```

## Verification Commands

Backend checks:

```bash
cd backend
source .venv/bin/activate
pytest
ruff check .
```

Frontend checks:

```bash
cd frontend
bun test
bun run lint
bun run build
```

Run relevant subsets during development, then run the full affected layer checks before handing work back.

## Environment Files

Environment templates are intentionally placeholder-based:

- `backend/.env.example`
- `frontend/.env.example`

Do not commit real credentials. Server-only secrets such as Supabase connection strings, Gemini API keys, ingestion secrets, and HMAC secrets belong only in backend environment files.

## Content Workflow

Public portfolio content lives in `content/`. It is the source for both public pages and RAG ingestion.

Currently used content files:

- `content/profile.yaml`
- `content/skills.yaml`
- `content/experience.yaml`
- `content/availability.yaml`
- `content/linkedin.md`
- `content/resume.md`
- `content/projects/*.md`

Rules:

- Keep claims public-safe and verifiable.
- Use `status: draft` for incomplete project content.
- Use `visibility: private` for content that must never render or be indexed.
- Rerun ingestion after changing public content that should be available to Tirtayasa AI.

## Deployment Artifacts

Deployment templates live under `deployment/`:

- `deployment/systemd/portfolio-nextjs.service`
- `deployment/nginx/thetirtayasa.my.id.conf`
- `deployment/scripts/smoke-test.sh`
- `deployment/RUNBOOK.md`

CI lives at `.github/workflows/ci.yml` and runs frontend/backend tests, linting, and builds.

## Useful Local API Checks

After starting the backend:

```bash
curl http://127.0.0.1:8888/v1/projects
```

Unauthorized ingestion should return `401`:

```bash
curl -i -X POST http://127.0.0.1:8888/internal/ingestion/sync
```

After public content changes, rerun ingestion with your backend-only secret:

```bash
curl -X POST http://127.0.0.1:8888/internal/ingestion/sync \
  -H "x-ingestion-secret: YOUR_INGESTION_SECRET"
```

Streaming chat smoke test:

```bash
curl -N -X POST http://127.0.0.1:8888/v1/chat \
  -H 'content-type: application/json' \
  -d '{"message":"What projects has Abdul built?"}'
```
