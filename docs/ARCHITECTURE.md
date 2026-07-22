# Architecture

This document is the technical map of the portfolio system. It extracts the durable architecture from the long-form specs so a new contributor can understand how the codebase fits together before editing.

## System Purpose

The project is a production portfolio for Abdul F. Tirtayasa, positioned as a **Data Analyst & AI Enabler**. It has three product surfaces:

1. Public portfolio pages for recruiters, clients, and startup founders.
2. Backend APIs for content, contact submissions, ingestion, retrieval, and chat.
3. A future frontend chat experience powered by a grounded assistant named **Tirtayasa AI**.

The architectural invariant is that version-controlled public content powers both the rendered portfolio and AI retrieval context. Draft/private content must not render publicly or enter the vector index.

## High-Level Runtime Architecture

```text
Browser
  └── Next.js App Router frontend on :3030
        ├── Static/public portfolio pages from content/
        ├── Contact form client
        └── Future streaming chat UI

FastAPI backend on :8888
  ├── Public REST APIs under /v1
  ├── Internal ingestion API under /internal
  ├── Content validation/loading
  ├── Contact persistence
  ├── RAG ingestion/retrieval foundation
  └── Streaming chat endpoint

Supabase PostgreSQL + pgvector
  ├── portfolio_documents with vector embeddings
  ├── contact_submissions
  ├── chat_sessions
  ├── chat_messages
  ├── chat_feedback
  └── ai_rate_limit_counters

Gemini via google-genai
  ├── Embeddings for documents and queries
  └── Future grounded answer generation path
```

## Repository Layout

```text
.
├── AGENTS.md                         # Contributor/agent rules and coding standards
├── README.md                         # Project overview, status, and local operation
├── DESIGN.md                         # Visual design system and UX rules
├── content/                          # Public portfolio source content
│   ├── profile.yaml
│   ├── skills.yaml
│   ├── experience.yaml
│   ├── availability.yaml
│   ├── resume.md
│   ├── linkedin.md
│   └── projects/*.md
├── frontend/                         # Next.js App Router app
│   ├── src/app/                      # Routes, layouts, metadata, sitemap, robots
│   ├── src/components/               # Reusable UI components
│   ├── src/lib/                      # Content, config, API clients, tests
│   ├── package.json
│   └── bun.lock
├── backend/                          # FastAPI service
│   ├── app/api/                      # HTTP route modules
│   ├── app/ai/                       # Gemini clients/wrappers
│   ├── app/chat/                     # Chat policy, orchestration, persistence helpers
│   ├── app/content/                  # Content schemas and loaders
│   ├── app/core/                     # Settings/configuration
│   ├── app/database/                 # SQLAlchemy declarative models and sessions
│   ├── app/ingestion/                # Parsing, chunking, hashing, sync service
│   ├── app/models/                   # Pydantic API models
│   ├── app/prompts/                  # Grounded assistant prompts
│   ├── app/repositories/             # Database repository boundaries
│   ├── app/retrieval/                # Candidate retrieval and ranking
│   ├── alembic/                      # Migrations
│   └── tests/                        # Backend unit/API/evaluation tests
├── docs/                             # Specs and architecture documentation
└── tasks/                            # Phase plan and task checklist
```

## Frontend Architecture

The frontend is a Next.js App Router application built with TypeScript, Tailwind CSS, Radix UI, and lucide-react.

### Route responsibilities

- `/` renders the homepage identity, capabilities, featured projects, and CTAs.
- `/projects` renders published public project cards with category filtering.
- `/projects/[slug]` renders one published public project; draft/private slugs are treated as not found.
- `/experience`, `/about`, `/resume`, `/notes`, and `/contact` render supporting portfolio pages.
- `/sitemap.xml` and `/robots.txt` are generated from public route/content state.

### Content loading

Frontend build-time content loading lives in `frontend/src/lib/content.ts` and related types in `frontend/src/lib/content-types.ts`. It reads from the root `content/` directory, validates visibility/status rules, and exposes typed data to pages.

### Contact integration

The contact page provides mailto and WhatsApp alternatives and uses the backend contact API for form submissions. The client code lives in `frontend/src/lib/contact-client.ts`; UI state lives in `frontend/src/components/ContactForm.tsx`.

### Future chat UI integration point

Phase 5 will add a frontend streaming chat client and UI components. The backend already exposes a POST-based SSE stream at `/v1/chat`. Project detail pages should pass the current project slug to the chat client when implemented.

## Backend Architecture

The backend is a FastAPI application with explicit module boundaries.

### API layer

`backend/app/main.py` creates the app, configures CORS, and includes routers:

- `GET /health`
- `GET /v1/projects`
- `GET /v1/projects/{slug}`
- `POST /v1/contact`
- `POST /internal/ingestion/sync`
- `POST /v1/chat`
- `POST /v1/chat/feedback`

Routes use Pydantic models for validation and dependency injection for repository/service boundaries.

### Settings layer

`backend/app/core/config.py` loads environment-based settings with `pydantic-settings`. Important settings include:

- `DATABASE_URL`
- `BACKEND_CORS_ORIGINS`
- `GEMINI_API_KEY`
- `GEMINI_CHAT_MODEL`
- `GEMINI_EMBEDDING_MODEL`
- `GEMINI_EMBEDDING_DIMENSIONS`
- `INGESTION_SECRET`
- AI rate limit settings
- `MAXIMUM_CONTEXT_CHUNKS`

Server-only values must remain in backend environment files and must not be referenced by frontend browser code.

### Database layer

`backend/app/database/base.py` defines SQLAlchemy models. Alembic migrations are the schema source for Supabase/PostgreSQL.

Current tables:

| Table | Purpose |
| --- | --- |
| `portfolio_documents` | Public RAG chunks, metadata, hashes, and pgvector embeddings |
| `contact_submissions` | Contact form submissions only |
| `chat_sessions` | Anonymous chat session records with expiry |
| `chat_messages` | Redacted user/assistant messages and referenced document IDs |
| `chat_feedback` | Helpful/not-helpful feedback for assistant messages |
| `ai_rate_limit_counters` | Expiring, privacy-preserving AI rate limit counters |
| `alembic_version` | Migration state |

The initial migration enables pgvector in Supabase's `extensions` schema and uses `extensions.vector(768)` for embeddings.

## Content and Ingestion Flow

```text
content/*.yaml and content/projects/*.md
  └── backend/app/ingestion/parser.py
        └── public/published documents only
              └── backend/app/ingestion/chunker.py
                    └── stable chunks with metadata and content_hash
                          └── GeminiEmbeddingService.embed_document(...)
                                └── DocumentRepository.upsert_chunk(...)
                                      └── portfolio_documents.embedding
```

Important behavior:

- `status: draft` and `visibility: private` content is skipped.
- Chunk hashes are stable for unchanged normalized content.
- Unchanged chunks are not re-embedded.
- Deleted public sources are removed from document/vector storage during sync.
- Live indexing into pgvector is intentionally deferred until real public project content is published.

## Retrieval and Assistant Flow

```text
POST /v1/chat
  ├── validate message/session/current_project
  ├── classify policy and guardrails
  ├── for safe portfolio requests:
  │     ├── embed query with RETRIEVAL_QUERY
  │     ├── retrieve semantic candidates from portfolio_documents
  │     ├── rank with semantic score + keyword + featured + current-project boosts
  │     ├── generate grounded answer from verified context
  │     └── stream token/source/done events
  └── for unsafe/off-scope requests:
        ├── refuse, redirect, or brief-safe-answer
        └── stream done event
```

The current implementation includes the policy, SSE route contract, ranking utilities, persistence helpers, and test fixtures. The full live Gemini grounded generation path can be tightened after real content is published and evaluated.

### Streaming contract

`POST /v1/chat` accepts JSON:

```json
{
  "message": "What projects has Abdul built?",
  "session_id": "optional-browser-session-id",
  "current_project": "optional-project-slug"
}
```

It returns `text/event-stream` events:

- `token`: partial or complete answer content
- `sources`: source cards/references for factual claims
- `done`: terminal event containing the normalized session ID

## Guardrails and Privacy Boundaries

Assistant guardrails are intentionally layered:

- API request validation restricts payload size and shape.
- Policy classification refuses prompt disclosure, secret exposure, destructive instructions, and code-generation requests.
- Compensation questions redirect to direct contact.
- Public factual claims must come from verified content and include source references.
- Chat persistence must redact emails, phone numbers, and API-token-like strings before storage.
- Raw IP addresses should not be stored solely for rate limiting; rate counters use temporary HMAC-derived identifiers.

## External Interfaces

### Public contact details

- Email: `abdtirtayasa24@gmail.com`
- WhatsApp base: `https://wa.me/6282121172378`
- Approved prefilled message is configured in frontend site config.

### Deployment target

The planned production target is Ubuntu 24.04 VPS with:

- Next.js standalone server behind Nginx
- FastAPI backend service
- Supabase PostgreSQL/pgvector
- Domain: `thetirtayasa.my.id`

Deployment artifacts, smoke tests, and operations runbook are later phase work.

## Current Architecture Status

Implemented:

- Monorepo foundation and safe environment templates
- Public portfolio pages from version-controlled content
- Frontend contact form integration
- FastAPI health, project, contact, ingestion, chat, and feedback routes
- Async SQLAlchemy models/repositories and Alembic migration foundation
- Supabase-compatible pgvector schema
- RAG ingestion utilities, Gemini embedding wrapper, retrieval ranking, guardrails, SSE chat contract, redaction helpers, and AI evaluation fixtures

Deferred or pending:

- Real published project content
- Live pgvector indexing with published content
- Frontend chat launcher/panel/dialog and streaming client
- Production AI budget/rate-limit hardening
- VPS deployment artifacts and runbook
- GitHub Actions / FastAPI Cloud deployment configuration
