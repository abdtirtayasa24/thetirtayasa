# The Tirtayasa Portfolio

Production portfolio for **Abdul F. Tirtayasa**, positioned as a **Data Analyst & AI Enabler**. The site communicates Abdul's analytics, automation, AI enablement, business-support experience, and selected public project work through a Next.js frontend, FastAPI backend on FastAPI Cloud, Supabase persistence, and a grounded assistant named **Tirtayasa AI**.

Production is live with this split deployment:

- Frontend: Ubuntu 24.04 VPS, Next.js standalone, systemd, Nginx, and `https://thetirtayasa.my.id`.
- Backend: FastAPI Cloud as a separate API origin.
- Database: Supabase PostgreSQL with pgvector.
- AI: Gemini via the official `google-genai` SDK.

## Documentation Guide

- `docs/ARCHITECTURE.md` is the durable technical history and architecture map. It lists the completed Phase 1–6 implementation, runtime flows, deployment decisions, and key tradeoffs.
- `DESIGN.md` is the concise visual design system.
- `PRODUCT.md` captures product/register context.
- `AGENTS.md` contains contributor and coding rules.

## Key Product and Architecture Decisions

- Brand position is **Data Analyst & AI Enabler**.
- Public audience includes recruiters, clients, startup founders, and collaborators.
- English-only MVP.
- `content/` is the source of truth for both public portfolio rendering and RAG context.
- Draft, archived, and private content must never render publicly or enter retrieval.
- Frontend package manager is Bun; do not create npm/pnpm/yarn lockfiles.
- Frontend local/production app port is `3030`.
- Backend local port is `8888`.
- Production domain `thetirtayasa.my.id` belongs to the frontend only.
- Production backend is FastAPI Cloud as a separate API origin configured through `NEXT_PUBLIC_BACKEND_API_URL`.
- Backend database is Supabase PostgreSQL with pgvector, not Neon.
- Server-only values such as Supabase credentials, Gemini keys, ingestion secret, and HMAC secret stay in backend/FastAPI Cloud secrets only.
- Gemini model names and embedding dimensions are configurable.
- Chat uses POST + readable SSE stream instead of GET EventSource so request payloads can be validated normally.
- Retrieval uses pgvector candidate search plus Python ranking and configurable relevance threshold/source caps.
- Source cards are shown only from backend `sources` events and are capped by `CHAT_MAXIMUM_SOURCE_CARDS`.
- Frontend remains usable when backend, Gemini, Supabase, rate limits, or budget controls make AI unavailable.
- Contact email is `abdtirtayasa24@gmail.com`.
- WhatsApp URL uses `wa.me/6282121172378` with the approved prefilled message.
- Assistant display name is `Tirtayasa AI`.
- Visual system is dark, technical, restrained, accessible, and production-oriented.

## Repository Map

| Area | Purpose |
| --- | --- |
| `frontend/` | Next.js App Router frontend, public pages, chat UI, frontend tests |
| `backend/` | FastAPI backend, ingestion, retrieval, chat orchestration, database models, backend tests |
| `content/` | Public portfolio source content and RAG source material |
| `docs/` | Durable architecture/spec documentation |
| `deployment/` | VPS frontend deployment templates, scripts, runbook, smoke tests |
| `.github/workflows/ci.yml` | CI checks for frontend and backend |

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

Production-style standalone check:

```bash
cd frontend
bun run build
bun start
```

## Verification Commands

Backend:

```bash
cd backend
source .venv/bin/activate
pytest
ruff check .
```

Frontend:

```bash
cd frontend
bun test
bun run lint
bun run build
```

Deployment script syntax:

```bash
bash -n deployment/scripts/*.sh
```

## Environment Files

Environment templates are placeholder-based:

- `backend/.env.example`
- `frontend/.env.example`

Important backend/FastAPI Cloud settings include:

- `DATABASE_URL`
- `BACKEND_CORS_ORIGINS`
- `GEMINI_API_KEY`
- `GEMINI_CHAT_MODEL`
- `GEMINI_EMBEDDING_MODEL`
- `GEMINI_EMBEDDING_DIMENSIONS`
- `INGESTION_SECRET`
- `RATE_LIMIT_HMAC_SECRET`
- `CHAT_REQUESTS_PER_MINUTE_PER_VISITOR`
- `CHAT_REQUESTS_PER_HOUR_PER_SESSION`
- `CHAT_MAXIMUM_MESSAGE_CHARACTERS`
- `CHAT_MAXIMUM_CONVERSATION_MESSAGES`
- `AI_CHAT_DAILY_REQUEST_LIMIT`
- `AI_CHAT_ENABLED`
- `RETRIEVAL_MINIMUM_SIMILARITY`
- `CHAT_MAXIMUM_SOURCE_CARDS`
- `MAXIMUM_CONTEXT_CHUNKS`

Only `NEXT_PUBLIC_*` values may be used in browser code.

## Content Workflow

Public portfolio content lives in `content/`. It powers both public pages and RAG ingestion.

Currently used content files:

- `content/profile.yaml` — homepage identity/profile summary/contact links
- `content/about.md` — about page narrative
- `content/skills.yaml` — capability groups
- `content/experience.yaml` — experience timeline
- `content/availability.yaml` — availability/contact context
- `content/linkedin.md` — LinkedIn about/skills/certifications/awards sections
- `content/resume.md` — résumé link metadata
- `content/projects/*.md` — public project case studies

Rules:

- Keep claims public-safe and verifiable.
- Use `status: draft` for incomplete project content.
- Use `visibility: private` for content that must never render or be indexed.
- Do not invent metrics, client names, outcomes, or confidential URLs.
- Rerun ingestion after changing public content that should be available to Tirtayasa AI.

Local ingestion smoke:

```bash
curl -X POST http://127.0.0.1:8888/internal/ingestion/sync \
  -H "x-ingestion-secret: YOUR_INGESTION_SECRET"
```

Production ingestion uses the FastAPI Cloud backend origin instead of the frontend domain.

## Deployment

Deployment templates live under `deployment/`:

- `deployment/systemd/portfolio-nextjs.service`
- `deployment/nginx/conf.d/thetirtayasa-rate-limit.conf`
- `deployment/nginx/thetirtayasa.my.id.conf`
- `deployment/scripts/install-nginx-frontend.sh`
- `deployment/scripts/deploy-frontend.sh`
- `deployment/scripts/rollback-frontend.sh`
- `deployment/scripts/smoke-test.sh`
- `deployment/RUNBOOK.md`

Production smoke test format:

```bash
BASE_URL=https://thetirtayasa.my.id \
API_URL=https://<fastapi-cloud-backend-origin> \
deployment/scripts/smoke-test.sh
```

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

Streaming chat smoke test:

```bash
curl -N -X POST http://127.0.0.1:8888/v1/chat \
  -H 'content-type: application/json' \
  -d '{"message":"What projects has Abdul built?"}'
```
