# Architecture

This document is the technical map of the portfolio system. It extracts the durable architecture from the long-form specs so a new contributor can understand how the codebase fits together before editing.

## System Purpose

The project is a production portfolio for Abdul F. Tirtayasa, positioned as a **Data Analyst & AI Enabler**. It has three active product surfaces:

1. Public portfolio pages for recruiters, clients, and startup founders.
2. Backend APIs for content, contact submissions, ingestion, retrieval, and chat.
3. A frontend chat experience powered by a grounded assistant named **Tirtayasa AI**.

The architectural invariant is that version-controlled public content powers both the rendered portfolio and AI retrieval context. Draft/private content must not render publicly or enter the vector index.

## High-Level Runtime Architecture

```text
Browser
  └── Next.js App Router frontend on :3030
        ├── Static/public portfolio pages from content/
        ├── Contact form client
        └── Tirtayasa AI chat launcher/panel
              └── POST text/event-stream to /v1/chat

FastAPI backend on :8888
  ├── Public REST APIs under /v1
  ├── Internal ingestion API under /internal
  ├── Content validation/loading
  ├── Contact persistence
  ├── RAG ingestion/retrieval
  ├── Gemini grounded answer generation
  └── Chat session/message/feedback persistence

Supabase PostgreSQL + pgvector
  ├── portfolio_documents with vector embeddings
  ├── contact_submissions
  ├── chat_sessions
  ├── chat_messages
  ├── chat_feedback
  └── ai_rate_limit_counters

Gemini via google-genai
  ├── RETRIEVAL_DOCUMENT embeddings during ingestion
  ├── RETRIEVAL_QUERY embeddings during chat retrieval
  └── Grounded chat generation from retrieved verified context
```

## Repository Layout

```text
.
├── AGENTS.md                         # Contributor/agent rules and coding standards
├── README.md                         # Project overview, status, and local operation
├── DESIGN.md                         # Visual design system and UX rules
├── content/                          # Public portfolio source content and RAG source
│   ├── profile.yaml
│   ├── skills.yaml
│   ├── experience.yaml
│   ├── availability.yaml
│   ├── resume.md
│   ├── linkedin.md
│   └── projects/*.md
├── frontend/                         # Next.js App Router app
│   ├── src/app/                      # Routes, layouts, metadata, sitemap, robots
│   ├── src/components/               # Reusable UI and chat components
│   ├── src/lib/                      # Content loaders, config, API clients, tests
│   ├── package.json
│   └── bun.lock
├── backend/                          # FastAPI service
│   ├── app/api/                      # HTTP route modules
│   ├── app/ai/                       # Gemini chat/embedding clients
│   ├── app/chat/                     # Policy, orchestration, persistence helpers
│   ├── app/content/                  # Content schemas and project loaders
│   ├── app/core/                     # Settings/configuration
│   ├── app/database/                 # SQLAlchemy declarative models and sessions
│   ├── app/ingestion/                # All-content parsing, chunking, hashing, sync
│   ├── app/models/                   # Pydantic API models
│   ├── app/prompts/                  # Grounded assistant prompt
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
- `/experience` renders real work history from `content/experience.yaml` plus LinkedIn-derived skills, certifications, and awards from `content/linkedin.md`.
- `/about` renders a richer identity narrative than the homepage summary.
- `/resume`, `/notes`, and `/contact` render supporting portfolio pages.
- `/sitemap.xml` and `/robots.txt` are generated from public route/content state.

### Content loading

Frontend build-time content loading lives in `frontend/src/lib/content.ts` with types in `frontend/src/lib/content-types.ts`.

It currently loads:

- published public project Markdown from `content/projects/*.md`
- profile and skills YAML
- experience YAML
- LinkedIn markdown sections and certifications

Project `metrics` accept either the structured object format or simple strings. Simple strings are normalized to `{ label, value: "", public: true }` so existing project content can stay concise while UI/API types remain stable.

### Experience rendering

`frontend/src/components/ExperienceSummary.tsx` parses experience summaries into paragraphs and bullet lists. `content/experience.yaml` should use literal YAML scalars (`summary: |`) when line breaks and `•`/`-` bullet formatting must be preserved.

### Contact integration

The contact page provides mailto and WhatsApp alternatives and uses the backend contact API for form submissions. The client code lives in `frontend/src/lib/contact-client.ts`; UI state lives in `frontend/src/components/ContactForm.tsx`.

### Chat frontend

Phase 5 is implemented. The chat UI is globally mounted in `frontend/src/app/layout.tsx` through `ChatProvider`.

Key frontend chat files:

- `frontend/src/lib/chat-client.ts` parses POST-based SSE events from `/v1/chat`.
- `frontend/src/lib/chat-session.ts` persists normalized session IDs in browser storage.
- `frontend/src/components/chat/ChatLauncher.tsx` renders the global assistant launcher.
- `frontend/src/components/chat/ChatPanel.tsx` renders the responsive desktop/mobile chat container.
- `frontend/src/components/chat/StarterPrompts.tsx`, `SourceCard.tsx`, `FeedbackButtons.tsx`, and `ChatMessage.tsx` render chat content, sources, and feedback.

Project detail pages implicitly provide current-project context through the browser path (`/projects/[slug]`), which the chat provider sends as `current_project`.

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

The initial migration enables pgvector in Supabase's `extensions` schema and uses `extensions.vector(768)` for embeddings. Timestamp columns are `TIMESTAMPTZ` in the migration and `DateTime(timezone=True)` in SQLAlchemy models to avoid asyncpg offset-naive/offset-aware binding errors.

## Content and Ingestion Flow

```text
content/profile.yaml
content/skills.yaml
content/experience.yaml
content/availability.yaml
content/linkedin.md
content/resume.md
content/projects/*.md
  └── backend/app/ingestion/parser.py
        └── public documents and published/public projects only
              └── backend/app/ingestion/chunker.py
                    └── stable chunks with metadata and content_hash
                          └── GeminiEmbeddingService.embed_document(RETRIEVAL_DOCUMENT)
                                └── DocumentRepository.upsert_chunk(...)
                                      └── portfolio_documents.embedding
```

Important behavior:

- `status: draft`, `status: archived`, and `visibility: private` content is skipped.
- `content/README.md` is excluded so contributor guidance does not enter RAG context.
- Project chunks include both Markdown body and front matter metadata such as summary, categories, technologies, deployment, and metrics.
- Top-level YAML/Markdown content is converted into stable text sections before chunking.
- Chunk hashes are stable for unchanged normalized chunk text.
- Unchanged chunks are not re-embedded.
- Deleted public sources are removed from document/vector storage during sync.
- After content changes, rerun `POST /internal/ingestion/sync` so `portfolio_documents` matches the repository content.

## Retrieval and Assistant Flow

```text
POST /v1/chat
  ├── validate message/session/current_project
  ├── normalize or replace browser-provided session ID
  ├── persist redacted user message
  ├── classify policy and guardrails
  ├── for safe portfolio requests:
  │     ├── embed query with RETRIEVAL_QUERY
  │     ├── retrieve semantic candidates from portfolio_documents
  │     ├── rank with semantic score + keyword + featured + current-project boosts
  │     ├── send grounded prompt + retrieved context to Gemini chat model
  │     ├── persist redacted assistant answer with referenced document IDs
  │     └── stream token/source/done events
  └── for unsafe/off-scope requests:
        ├── refuse, redirect, or brief-safe-answer
        ├── persist assistant response
        └── stream done event
```

The system prompt in `backend/app/prompts/system_prompt.py` contains grounding rules, refusal rules, tone guidance, and supplemental Abdul background. Primary evidence for factual claims must come from retrieved public content.

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
- `done`: terminal event containing the normalized `session_id` and persisted assistant `message_id` when available

### Feedback contract

The frontend sends chat feedback to `POST /v1/chat/feedback` with an assistant `message_id`, rating (`1` or `-1`), and optional reason. Feedback is stored in `chat_feedback`.

## Guardrails and Privacy Boundaries

Assistant guardrails are intentionally layered:

- API request validation restricts payload size and shape.
- Policy classification refuses prompt disclosure, secret exposure, destructive instructions, and code-generation requests.
- Compensation questions redirect to direct contact.
- Public factual claims must come from verified content and include source references.
- Chat persistence redacts emails, phone numbers, and API-token-like strings before storage.
- Contact submissions are stored separately from chat data.
- Raw IP addresses should not be stored solely for rate limiting; rate counters use temporary HMAC-derived identifiers when application-level rate limits are implemented.

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
- Real project, experience, LinkedIn, skills, profile, availability, and résumé content loaders
- Frontend contact form integration
- Global Tirtayasa AI chat launcher/panel with streaming client, session persistence, source cards, starter prompts, feedback controls, unavailable/retry states, and current-project context
- FastAPI health, project, contact, ingestion, chat, and feedback routes
- Async SQLAlchemy models/repositories and Alembic migration foundation
- Supabase-compatible pgvector schema
- Full-content RAG ingestion utilities, Gemini embedding wrapper, retrieval ranking, Gemini grounded generation, guardrails, SSE chat contract, redaction helpers, persistence, and AI evaluation fixtures

Deferred or pending:

- Production AI budget controls and application-level rate-limit hardening
- Additional PII redaction coverage for future persistence paths
- VPS deployment artifacts and operations runbook
- GitHub Actions / FastAPI Cloud deployment configuration
- Final launch disclosure review for confidential details and unsupported claims
