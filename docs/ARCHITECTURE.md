# Architecture

This document is the durable technical map of The Tirtayasa Portfolio after production launch. It consolidates the completed Phase 1–6 implementation history so `tasks/` can be removed or reused for future work without losing architectural context.

## System Purpose

The project is a production portfolio for **Abdul F. Tirtayasa**, positioned as a **Data Analyst & AI Enabler**. It serves three primary audiences: recruiters, clients, and startup founders/collaborators.

The system has three active product surfaces:

1. Public portfolio pages for profile, about, projects, experience, résumé, notes, and contact.
2. Backend APIs for content-backed project data, contact submissions, ingestion, retrieval, chat, and feedback.
3. A grounded assistant experience named **Tirtayasa AI**.

The core invariant is that version-controlled public content powers both rendered portfolio claims and AI retrieval context. Draft, archived, or private content must not render publicly and must not enter the vector index.

## Runtime Architecture

```text
Browser
  └── Next.js App Router frontend on :3030
        ├── Static/public portfolio pages from content/
        ├── Contact form client
        └── Tirtayasa AI chat launcher/panel
              └── POST text/event-stream to FastAPI Cloud /v1/chat

FastAPI Cloud backend
  ├── Public REST APIs under /v1
  ├── Internal ingestion API under /internal
  ├── Content validation/loading
  ├── Contact persistence
  ├── RAG ingestion/retrieval
  ├── Gemini grounded answer generation
  ├── Chat session/message/feedback persistence
  ├── Privacy-preserving AI rate limits
  └── Global AI budget controls

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

Production deployment split:

- Frontend: Ubuntu 24.04 VPS, Next.js standalone, systemd, Nginx, `https://thetirtayasa.my.id`.
- Backend: FastAPI Cloud as a separate API origin.
- Database: Supabase PostgreSQL with pgvector.
- AI provider: Gemini.

## Repository Layout

```text
.
├── AGENTS.md                         # Contributor/agent rules and coding standards
├── PRODUCT.md                        # Product/register context for design and agent work
├── DESIGN.md                         # Concise visual design system and UX rules
├── README.md                         # Product overview, implemented features, setup, deployment
├── content/                          # Public portfolio source content and RAG source
│   ├── profile.yaml                  # Homepage identity/profile/contact source
│   ├── about.md                      # About page narrative
│   ├── skills.yaml                   # Capability groups
│   ├── experience.yaml               # Experience timeline
│   ├── availability.yaml             # Availability/contact context
│   ├── resume.md                     # Résumé link metadata
│   ├── linkedin.md                   # LinkedIn about/skills/certifications/awards
│   └── projects/*.md                 # Public project case studies
├── frontend/                         # Next.js App Router app
│   ├── src/app/                      # Routes, layout, metadata, sitemap, robots, route tests
│   ├── src/components/               # Reusable UI, rich text, contact form, chat components
│   ├── src/lib/                      # Content loaders, config, API clients, tests
│   ├── package.json
│   └── bun.lock
├── backend/                          # FastAPI service
│   ├── app/api/                      # HTTP route modules
│   ├── app/ai/                       # Gemini chat/embedding clients
│   ├── app/chat/                     # Policy, limits, budget, orchestration, persistence helpers
│   ├── app/content/                  # Content schemas and project loaders
│   ├── app/core/                     # Settings/configuration
│   ├── app/database/                 # SQLAlchemy declarative models and sessions
│   ├── app/ingestion/                # All-content parsing, chunking, hashing, sync
│   ├── app/models/                   # Pydantic API models
│   ├── app/prompts/                  # Grounded assistant prompt
│   ├── app/repositories/             # Database repository boundaries
│   ├── app/retrieval/                # Candidate retrieval, thresholds, ranking
│   ├── app/security/                 # Redaction and privacy-preserving identifiers
│   ├── alembic/                      # Migrations
│   └── tests/                        # Backend unit/API/evaluation tests
├── docs/                             # Durable architecture/spec documentation
├── deployment/                       # Frontend VPS scripts/templates and production runbook
└── .github/workflows/ci.yml          # CI checks
```

## Completed Implementation by Phase

### Phase 1 — Foundation

Implemented:

- Monorepo directory structure.
- Frontend and backend environment templates with placeholders only.
- `.gitignore` for secrets, local envs, build outputs, caches, and generated artifacts.
- Next.js App Router frontend scaffold.
- FastAPI backend scaffold with `GET /health`.
- Content layout and schema foundation.
- Repository documentation and design/product context.

Key decisions:

- Frontend uses Bun and `frontend/bun.lock` only.
- Backend uses Python/FastAPI with repository-local virtualenv workflow.
- Content is the shared source for public pages and RAG context.
- No real credentials are committed.

### Phase 2 — Public Portfolio Frontend

Implemented:

- Tailwind design tokens matching the dark technical visual system.
- Global layout, sticky responsive navigation, footer, focus states, reduced-motion support.
- Homepage with identity, profile summary, capability map, featured projects, business perspective, assistant intro, and CTAs.
- Projects index with category filtering and accessible empty state.
- Dynamic project details from published public project content.
- Experience, About, Résumé, Notes, and Contact pages.
- SEO metadata, sitemap, robots, and social route metadata.
- Typed frontend content loading from Markdown/YAML.
- Rich text rendering for content paragraphs and bold emphasis.

Current route behavior:

| Route | Source |
| --- | --- |
| `/` | `content/profile.yaml`, `content/skills.yaml`, featured public projects |
| `/about` | `content/about.md`, `content/skills.yaml` |
| `/projects` | published public `content/projects/*.md` |
| `/projects/[slug]` | one published public project by slug |
| `/experience` | `content/experience.yaml` and `content/linkedin.md` |
| `/resume` | `content/resume.md` / site config |
| `/notes` | production-safe empty state until notes exist |
| `/contact` | `content/profile.yaml`, site config, backend contact form |

Key decisions:

- Draft/private project slugs return not found and do not appear in lists or sitemap.
- Project metrics accept object metrics and simple string metrics; strings normalize to `{ label, value: "", public: true }`.
- Homepage uses `profile.yaml` summary; About page uses `about.md` as the canonical long-form narrative.
- Frontend local and production app port is `3030`.

### Phase 3 — Database and Core Backend

Implemented:

- Alembic setup and initial Supabase-compatible migration.
- Async SQLAlchemy engine/session setup.
- Repository classes for documents, contact, chat, feedback, and rate limits.
- Project APIs:
  - `GET /v1/projects`
  - `GET /v1/projects/{slug}`
- Contact API:
  - `POST /v1/contact`
- Frontend contact form integration with success/error states.

Database tables:

| Table | Purpose |
| --- | --- |
| `portfolio_documents` | Public RAG chunks, metadata, hashes, and pgvector embeddings |
| `contact_submissions` | Contact form submissions only |
| `chat_sessions` | Anonymous chat sessions with expiry/current project |
| `chat_messages` | Redacted user/assistant messages and referenced document IDs |
| `chat_feedback` | Helpful/not-helpful feedback for assistant messages |
| `ai_rate_limit_counters` | Expiring privacy-preserving rate/budget counters |
| `alembic_version` | Migration state |

Key decisions:

- Database target is Supabase PostgreSQL with pgvector.
- Migration uses Supabase `extensions.vector(768)`.
- SQLAlchemy timestamp columns use `DateTime(timezone=True)` to match `TIMESTAMPTZ` and avoid asyncpg timezone errors.
- Contact submissions are separate from chat data.
- Frontend never references server-only credentials.

### Phase 4 — Ingestion and RAG Backend

Implemented:

- Public-content parser for top-level YAML/Markdown plus project Markdown.
- Semantic chunking, stable content hashes, unchanged-chunk skipping, and deleted-source cleanup.
- Gemini embeddings with configurable model/dimensions.
- Protected ingestion endpoint:
  - `POST /internal/ingestion/sync`
- Retrieval pipeline with query embedding, pgvector candidates, Python ranking, relevance thresholding, and configurable context limits.
- Assistant guardrail policy and grounded system prompt.
- Gemini grounded chat service.
- Streaming chat endpoint:
  - `POST /v1/chat`
- Chat persistence with normalized sessions, redacted messages, and referenced document IDs.
- Feedback endpoint:
  - `POST /v1/chat/feedback`
- Evaluation fixtures/tests for AI answer quality and safety behavior.

Ingested public sources:

- `content/profile.yaml`
- `content/about.md`
- `content/skills.yaml`
- `content/experience.yaml`
- `content/availability.yaml`
- `content/linkedin.md`
- `content/resume.md`
- `content/projects/*.md`

Excluded sources:

- `content/README.md`
- `status: draft`
- `status: archived`
- `visibility: private`

Retrieval controls:

- `MAXIMUM_CONTEXT_CHUNKS` limits context sent to Gemini.
- `RETRIEVAL_MINIMUM_SIMILARITY` filters weak semantic matches before boosts.
- `CHAT_MAXIMUM_SOURCE_CARDS` caps source cards sent to the frontend.

Key decisions:

- Chat uses POST plus a readable `text/event-stream` response instead of GET EventSource.
- Retrieval is hybrid: pgvector handles semantic candidates; Python applies additional ranking.
- Current project context boosts but does not hard-filter sources.
- Source cards are tied to backend `sources` events, not to specific UI assumptions.
- If evidence is missing, the assistant should acknowledge missing verified information and redirect to contact rather than invent claims.

### Phase 5 — Chat Frontend Experience

Implemented:

- Global Tirtayasa AI launcher/panel mounted in `frontend/src/app/layout.tsx`.
- POST-based SSE client parsing `token`, `sources`, `error`, and `done` events.
- Browser storage for normalized chat session IDs.
- Current project slug detection from `/projects/[slug]` path.
- Starter prompts.
- Source cards with links to portfolio pages.
- Helpful/not-helpful feedback controls.
- Loading, retry, unavailable, budget-exhaustion, and timeout handling.
- Chat panel auto-scroll to newest content/status changes.
- Assistant markdown-lite renderer for paragraphs, line breaks, bullet lists, and numbered lists.
- Accessibility coverage for launcher, panel, focus, controls, labels, and touch targets.

Frontend chat files:

- `frontend/src/lib/chat-client.ts`
- `frontend/src/lib/chat-session.ts`
- `frontend/src/components/chat/ChatProvider.tsx`
- `frontend/src/components/chat/ChatLauncher.tsx`
- `frontend/src/components/chat/ChatPanel.tsx`
- `frontend/src/components/chat/ChatMessage.tsx`
- `frontend/src/components/chat/SourceCard.tsx`
- `frontend/src/components/chat/FeedbackButtons.tsx`
- `frontend/src/components/chat/StarterPrompts.tsx`

Key decisions:

- Chat UI must not block portfolio browsing if the backend or AI is unavailable.
- Source cards are capped for mobile density.
- Assistant content is rendered safely without `dangerouslySetInnerHTML` or an HTML markdown parser.
- User messages remain plain text.

### Phase 6 — Security, Operations, and Launch Readiness

Implemented:

- Redaction for emails, phone numbers, IP addresses, API-token-like values, secret URLs, and account-like identifiers before chat persistence.
- Privacy-preserving HMAC visitor identifiers for AI rate limiting.
- DB-backed expiring rate-limit counters.
- Visitor/minute, session/hour, and conversation-message chat limits.
- Daily AI request budget and `AI_CHAT_ENABLED` kill switch.
- Machine-readable SSE `error` and `done` events for limit/budget exhaustion.
- CORS allowlist configuration.
- GitHub Actions CI for backend and frontend checks.
- Frontend VPS deployment templates and scripts.
- FastAPI Cloud backend deployment documentation.
- Operations runbook and smoke test script.
- Production launch and smoke verification.

Deployment files:

- `deployment/systemd/portfolio-nextjs.service`
- `deployment/nginx/conf.d/thetirtayasa-rate-limit.conf`
- `deployment/nginx/thetirtayasa.my.id.conf`
- `deployment/scripts/install-nginx-frontend.sh`
- `deployment/scripts/deploy-frontend.sh`
- `deployment/scripts/rollback-frontend.sh`
- `deployment/scripts/smoke-test.sh`
- `deployment/RUNBOOK.md`

Key decisions:

- Frontend domain `thetirtayasa.my.id` is for the frontend only.
- Backend production runs on FastAPI Cloud, not the VPS.
- Frontend systemd service binds Next.js standalone to `127.0.0.1:3030`.
- Nginx proxies only frontend traffic to local Next.js.
- Backend API calls go directly to the FastAPI Cloud origin configured by `NEXT_PUBLIC_BACKEND_API_URL`.
- Deployment script copies root `content/` into each frontend release because static prerendering reads `../content` relative to `frontend/`.
- Deployment script copies `.next/static` and `public` into `.next/standalone` so CSS/JS/image assets are available to the standalone server.
- Nginx `limit_req_zone` lives in `/etc/nginx/conf.d/thetirtayasa-rate-limit.conf`, not inside the site `server` block.

## Frontend Architecture Details

### Content loading

`frontend/src/lib/content.ts` is the build-time content source for public pages.

It loads:

- `getProfile()` from `content/profile.yaml`
- `getAboutSections()` from `content/about.md`
- `getSkillGroups()` from `content/skills.yaml`
- `getExperienceItems()` from `content/experience.yaml`
- `getLinkedInSections()` and certifications from `content/linkedin.md`
- `getAllProjects()`, `getFeaturedProjects()`, and `getProjectBySlug()` from `content/projects/*.md`

### Rich text

`frontend/src/components/RichText.tsx` renders safe paragraph-based content with `**bold**` support. It does not inject raw HTML.

`frontend/src/components/ExperienceSummary.tsx` renders multiline experience summaries with paragraph and bullet-list support.

`frontend/src/components/chat/ChatMessage.tsx` renders assistant markdown-lite output for paragraphs, bullet lists, and numbered lists. This is intentionally narrow and safe.

### Styling

`DESIGN.md`, `frontend/src/app/globals.css`, and `frontend/tailwind.config.ts` define the current visual system:

- dark background `#0B0F14`
- surfaces `#111820` and `#17212B`
- primary text `#E6EDF3`
- secondary text `#9DA7B3`
- accent `#7EE787`
- border `#30363D`
- error `#FF7B72`
- sans font `var(--font-manrope)`
- mono font `var(--font-jetbrains-mono)`

## Backend Architecture Details

### API layer

`backend/app/main.py` creates the FastAPI app, configures CORS, and includes routers:

- `backend/app/api/projects.py`
- `backend/app/api/contact.py`
- `backend/app/api/ingestion.py`
- `backend/app/api/chat.py`
- `backend/app/api/chat_feedback.py`

Routes use Pydantic models and dependency injection. Unit/API tests mock repository/service boundaries where local DB access is not required.

### Settings layer

`backend/app/core/config.py` loads settings via `pydantic-settings`.

Important settings:

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

Server-only values must remain in backend/FastAPI Cloud secrets.

### Ingestion flow

```text
content/*
  └── parser.load_public_ingestion_documents(...)
        └── IngestionDocument[]
              └── chunker
                    └── content_hash
                          └── GeminiEmbeddingService.embed_document(...)
                                └── DocumentRepository.upsert_chunk(...)
                                      └── portfolio_documents
```

Important behavior:

- Ingestion is manually triggered after content changes.
- The ingestion endpoint requires `x-ingestion-secret`.
- Unchanged chunks are not re-embedded.
- Deleted public sources are removed.
- Public content must be synced into `portfolio_documents`; chat does not read files directly at runtime.

### Retrieval and chat flow

```text
POST /v1/chat
  ├── request validation
  ├── visitor/session/conversation limits
  ├── global daily AI budget check
  ├── session normalization/creation
  ├── redacted user-message persistence
  ├── policy classification
  ├── retrieval for allowed portfolio questions
  │     ├── Gemini query embedding
  │     ├── pgvector candidate search
  │     ├── similarity threshold
  │     ├── ranking boosts
  │     └── context formatting
  ├── Gemini grounded answer generation
  ├── redacted assistant-message persistence
  └── SSE stream token/sources/done or error/done
```

SSE events:

| Event | Meaning |
| --- | --- |
| `token` | Assistant answer content |
| `sources` | Source cards/references for the assistant answer |
| `error` | Machine-readable unavailable/rate/budget error |
| `done` | Terminal event with normalized `session_id` and optional `message_id` |

Source cards:

- Built from retrieved candidates by `ChatOrchestrator._format_sources()`.
- Deduplicated by URL/section.
- Capped by `CHAT_MAXIMUM_SOURCE_CARDS`.
- Not emitted for refusal/compensation/brief-safe-answer paths.

### Guardrails and privacy

- Request models enforce payload shape and message length.
- Policy refuses prompt disclosure, credential access, destructive requests, code generation, and private data access.
- Compensation questions redirect to contact.
- The system prompt requires verified public content for factual project/experience claims.
- Redaction runs before chat persistence.
- Contact submissions are not mixed into chat analytics.
- Raw IP addresses are not stored solely for rate limiting.
- Rate counters expire.
- AI budget exhaustion keeps the public site usable.

## External Interfaces

### Public contact details

- Email: `abdtirtayasa24@gmail.com`
- WhatsApp: `https://wa.me/6282121172378` with approved prefilled message
- GitHub and LinkedIn URLs come from `content/profile.yaml`.

### Public frontend domain

- `https://thetirtayasa.my.id`

### Backend origin

- FastAPI Cloud origin, configured in frontend builds through `NEXT_PUBLIC_BACKEND_API_URL`.

### CI

`.github/workflows/ci.yml` runs:

- frontend install/test/lint/build using Bun
- backend install/test/ruff using Python 3.12

## Verification Baseline

Expected local verification before merging backend/frontend behavior changes:

```bash
cd backend
source .venv/bin/activate
pytest
ruff check .

cd ../frontend
bun test
bun run lint
bun run build
```

Deployment scripts should pass shell syntax checks:

```bash
bash -n deployment/scripts/*.sh
```

## Production Status

Production launch is complete:

- Frontend is deployed and accessible on `https://thetirtayasa.my.id`.
- Backend is deployed on FastAPI Cloud.
- Expected portfolio pages, contact behavior, ingestion/RAG, grounded chat, source cards, feedback, rate/budget handling, and operational scripts have been verified by implementation tests and production checks.

Future work should use new issue/task tracking rather than relying on the old Phase 1–6 `tasks/` folder.
