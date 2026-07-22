# The Tirtayasa Portfolio

Production portfolio for **Abdul F. Tirtayasa**, positioned as a **Data Analyst & AI Enabler**. The site communicates Abdul's analytics, automation, and AI enablement work through public portfolio pages, structured content, a FastAPI backend, Supabase persistence, and a grounded assistant foundation named **Tirtayasa AI**.

## What This Repository Contains

This is a monorepo with three active product layers:

| Layer | What it does today | Where to work |
| --- | --- | --- |
| Public portfolio frontend | Renders homepage, projects, project details, experience, about, résumé, notes, contact, SEO metadata, sitemap, and robots from version-controlled content. | `frontend/`, `content/` |
| Backend data/API foundation | Serves health, projects, contact submissions, internal ingestion sync, streaming chat, and chat feedback endpoints. | `backend/app/`, `backend/tests/` |
| RAG/assistant foundation | Parses public content, chunks and hashes documents, wraps Gemini embeddings, ranks retrieval candidates, applies assistant guardrails, streams chat events, and stores chat feedback. | `backend/app/ingestion/`, `backend/app/retrieval/`, `backend/app/chat/`, `backend/app/ai/` |

Supporting documentation:

- `AGENTS.md` — contributor and coding rules.
- `docs/ARCHITECTURE.md` — technical architecture, repository layout, data flows, APIs, and database model.
- `DESIGN.md` — visual design system and interface rules.
- `tasks/plan.md` and `tasks/todo.md` — implementation phases and checkpoint state.

## Current Implementation Status

Completed:

- Local monorepo foundation.
- Next.js App Router frontend with TypeScript, Tailwind CSS, Radix UI, lucide-react, Bun, and standalone build output.
- Public portfolio pages backed by typed Markdown/YAML content.
- FastAPI backend with settings, health check, CORS, typed routes, and test harness.
- Alembic + async SQLAlchemy schema for Supabase PostgreSQL/pgvector.
- Contact form submission storage.
- Backend RAG foundation through Phase 4.

Intentionally pending:

- Real published project content.
- Live pgvector indexing checkpoint with published public content.
- Frontend chat experience.
- Production rate-limit/budget hardening.
- Deployment artifacts and CI/CD.

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

Public portfolio content lives in `content/`. Use this directory for profile, skills, experience, availability, résumé metadata, LinkedIn content, and project Markdown.

Until final project content is published, draft/private placeholders are expected. Public pages and ingestion code must continue to hide or skip draft/private content.

## Useful Local API Checks

After starting the backend:

```bash
curl http://127.0.0.1:8888/v1/projects
```

Unauthorized ingestion should return `401`:

```bash
curl -i -X POST http://127.0.0.1:8888/internal/ingestion/sync
```

Streaming chat smoke test:

```bash
curl -N -X POST http://127.0.0.1:8888/v1/chat \
  -H 'content-type: application/json' \
  -d '{"message":"What is Abdul current role?"}'
```
