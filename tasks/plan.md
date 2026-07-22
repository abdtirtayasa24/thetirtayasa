# Implementation Plan: Data Analyst & AI Enabler Portfolio

## Overview
Build a production-ready portfolio for Abdul F. Tirtayasa that positions him as a Data Analyst & AI Enabler. The portfolio should communicate that Abdul delivers data analytics, automation, and AI solutions for business needs, with strengths in Python, Pandas, NumPy, FastAPI, SQL, advanced Google Sheets, data visualization, analytics, and Agentic Engineering. It should also highlight his prior sales team lead background, which gives him a hybrid data-and-business perspective and helps ensure solutions align with company goals. The system will include a dark-mode Next.js App Router frontend, a FastAPI backend, Git-versioned Markdown/YAML content, Supabase PostgreSQL with pgvector, and a Gemini-powered streaming portfolio assistant that answers from approved content with strict guardrails.

## Confirmed Product Decisions
- Audience: recruiters, clients, and startup founders are equally important.
- Language: English only for MVP.
- Frontend: Next.js App Router, TypeScript, Bun package manager, Tailwind CSS, lucide-react icons, Radix UI for interactive components. `frontend/bun.lock` is the frontend lockfile; do not use npm, pnpm, or yarn lockfiles.
- Visual system: follow `DESIGN.md`; dark technical interface, restrained green accent, WCAG 2.2 AA target.
- Backend: FastAPI, Python 3.12+, SQLAlchemy async, Alembic from the beginning.
- AI: Gemini through official `google-genai` SDK; model names configurable.
- Chat UX: token-by-token streaming, persistent visitor session via browser storage.
- Chat policy: strict guardrails against code-generation requests, system-prompt disclosure, prompt injection, destructive instructions, secret/data exposure; harmless non-portfolio questions may receive brief answers.
- Sources: required for factual project and experience claims.
- Retrieval: hybrid approach: SQL/vector candidate retrieval plus Python ranking/boosting.
- Database: Supabase PostgreSQL with pgvector; no browser exposure of server credentials.
- Contact: mailto `abdtirtayasa24@gmail.com` and WhatsApp `https://wa.me/6282121172378` with a prefilled initial message, plus contact submissions stored in Supabase.
- Résumé: downloadable PDF only; public basename `CV_Abdul-F-Tirtayasa`.
- Analytics provider: none for MVP; keep chat/contact operational records only.
- Rate limiting: use platform/Nginx rate limiting as the first layer where available; backend also enforces AI-chat application limits using temporary HMAC-derived visitor IP identifiers. Raw IP addresses must not be stored solely for rate limiting, and all rate-limit counters must expire automatically.
- Frontend deployment target: Ubuntu 24.04 VPS, Next.js standalone under native `systemd`, Nginx public reverse proxy, domain `thetirtayasa.my.id`.
- CI/CD: GitHub Actions and FastAPI Cloud deployment are later tasks after local apps work.

## Architecture Decisions
- **Content is the source of truth.** Markdown/YAML content drives public pages and RAG indexing so public claims and AI answers stay aligned.
- **Frontend remains usable without AI.** Chat failures must not break page navigation, project reading, résumé download, or contact actions.
- **Streaming chat uses POST + readable response stream.** This allows normal request payload validation while still supporting token-by-token UI updates.
- **Hybrid retrieval avoids locking all ranking logic into SQL.** Postgres handles vector candidate search; Python applies keyword, featured-content, and current-project boosts.
- **Guardrails are layered.** Request validation, scope classification, retrieval filtering, grounded prompt, source validation, and refusal/fallback behavior all participate.
- **Rate limiting is layered and privacy-preserving.** Nginx/platform limits handle coarse abuse control; backend AI-chat limits use expiring counters keyed by temporary HMAC-derived IP identifiers rather than raw IP storage.
- **Deployment is separated from initial local foundation.** Local apps, schemas, and tests come before VPS/FastAPI Cloud automation.

## Dependency Graph

```text
Repository foundation
  ├── Frontend scaffold
  │     ├── Design tokens/layout
  │     ├── Content loader/types
  │     │     ├── Homepage
  │     │     ├── Projects pages
  │     │     ├── Experience/About/Resume/Contact
  │     │     └── SEO/sitemap
  │     └── Chat UI client
  │
  ├── Backend scaffold
  │     ├── Settings/config
  │     ├── Alembic migrations
  │     │     ├── SQLAlchemy models/repositories
  │     │     ├── Contact submissions
  │     │     ├── Chat persistence
  │     │     └── Retrieval queries
  │     ├── Content ingestion
  │     │     ├── Gemini embeddings
  │     │     └── pgvector indexing
  │     └── Streaming chat endpoint
  │           ├── Scope/guardrails
  │           ├── Hybrid retrieval
  │           ├── Gemini generation
  │           └── Source references/feedback
  │
  └── Deployment artifacts
        ├── Next.js standalone build
        ├── systemd service
        ├── Nginx config
        └── smoke tests/rollback docs
```

## Task List

### Phase 1: Local Foundation
- [x] Task 1: Create monorepo structure and safe environment templates
- [x] Task 2: Scaffold Next.js App Router frontend with Tailwind, Radix, and lucide-react
- [x] Task 3: Scaffold FastAPI backend with settings, health endpoint, and test harness
- [x] Task 4: Define content schemas and placeholder content layout

### Checkpoint: Foundation
- [x] Frontend starts locally
- [x] Backend health endpoint responds locally
- [x] No secrets are committed
- [x] Placeholder content validates

### Phase 2: Public Portfolio Frontend
- [x] Task 5: Implement frontend content loading and typed project/profile models
- [x] Task 6: Build global layout, navigation, footer, and design tokens
- [x] Task 7: Build homepage with identity, capabilities, featured projects, and CTAs
- [x] Task 8: Build projects index with category filtering
- [x] Task 9: Build dynamic project pages
- [x] Task 10: Build experience, about, résumé, notes, and contact pages
- [x] Task 11: Add SEO metadata, sitemap, robots, and social metadata

### Checkpoint: Public Portfolio
- [x] Exactly three featured projects render by default when three are configured
- [x] Additional published projects require no layout code changes
- [x] Draft/private content is hidden
- [x] Mobile and desktop layouts are usable

### Phase 3: Database and Core Backend
- [x] Task 12: Add Alembic migrations for documents, chat, feedback, contact submissions, and AI rate limits
- [x] Task 13: Implement async SQLAlchemy database setup and repositories
- [x] Task 14: Implement project read API endpoints from approved content
- [x] Task 15: Implement contact submission API endpoint

### Checkpoint: Backend Data Foundation
- [x] Migrations apply cleanly against live Supabase-compatible Postgres
- [x] API tests pass
- [x] Contact data is stored separately from chat data
- [x] Server credentials are never exposed to frontend code

### Phase 4: Ingestion and RAG Backend
- [x] Task 16: Implement content parsing, normalization, chunking, and hashing
- [x] Task 17: Implement Gemini embedding service
- [x] Task 18: Implement protected ingestion sync
- [x] Task 19: Implement hybrid retrieval and ranking
- [x] Task 20: Implement assistant scope classification and guardrails
- [x] Task 21: Implement streaming chat generation endpoint
- [x] Task 22: Persist chat sessions, redacted messages, feedback, and source references
- [x] Task 23: Add AI quality evaluation fixtures and tests

### Checkpoint: Grounded Assistant Backend
- [ ] Public content indexes into pgvector against a live database with published content
- [x] Private/draft content is skipped
- [x] Streaming chat returns grounded answers
- [x] Unsupported or unsafe requests are refused or fall back correctly
- [x] Project/experience claims include source references

### Phase 5: Chat Frontend Experience
- [ ] Task 24: Implement frontend streaming chat API client and session persistence
- [ ] Task 25: Build accessible chat launcher, desktop panel, and mobile dialog
- [ ] Task 26: Add starter prompts, source cards, and feedback controls
- [ ] Task 27: Add loading, timeout, retry, unavailable, and reduced-motion states

### Checkpoint: Chat Experience
- [ ] Chat works across portfolio pages
- [ ] Current project context is passed from project detail pages
- [ ] Backend failure does not break the portfolio
- [ ] Chat is keyboard and screen-reader accessible

### Phase 6: Security, Operations, and Launch Readiness
- [ ] Task 28: Add PII redaction and persistence safeguards
- [ ] Task 29: Add CORS restrictions and layered application-level AI chat limits
- [ ] Task 30: Add AI budget controls and graceful degradation
- [ ] Task 31: Add Ubuntu 24.04 VPS deployment artifacts for Nginx and systemd
- [ ] Task 32: Add production smoke tests and operations runbook
- [ ] Task 33: Add GitHub Actions after local apps are stable
- [ ] Task 34: Add FastAPI Cloud deployment configuration later
- [ ] Task 35: Finalize real portfolio content and launch review

### Checkpoint: Ready for Launch
- [ ] Frontend standalone build succeeds
- [ ] Backend tests and AI evaluation suite pass
- [ ] Nginx/systemd deployment path is documented and smoke-tested
- [ ] Confidential details and unsupported claims are removed
- [ ] Rollback and recovery procedures are documented

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| AI invents unsupported claims | High | Grounded prompt, retrieval-only context, fallback behavior, source validation, evaluation suite |
| Confidential company details leak | High | Content visibility flags, ingestion skips private/draft content, disclosure review before launch |
| Chat costs exceed budget | Medium | Request/session limits, configurable model names, daily/monthly budget controls, graceful disable |
| Streaming implementation complicates UI/backend contract | Medium | Define streaming event contract before building UI; add timeout/error events |
| VPS deployment differs from local runtime | Medium | Use Next.js standalone early, provide systemd/Nginx templates, add smoke checks |
| Supabase pgvector query performance degrades | Medium | HNSW index, candidate limit, metadata filters, retrieval latency tests |
| Contact submission stores sensitive data | Medium | Separate table, validation, retention policy, no chat mixing, avoid logging raw submissions |
| Rate-limit identifiers become tracking identifiers | Medium | Use temporary HMAC-derived identifiers, expire counters automatically, never persist raw IP solely for rate limiting |
| Missing real project content delays AI quality | Medium | Build with placeholders but block launch until real content and evaluation pass |

## Deferred Inputs
- Exact public Google Drive résumé URL still needs to be provided/configured when implementing résumé download.
- Final three featured project files/slugs/titles will be added later by Abdul; implementation should prepare templates/folders without inventing project details.

## Resolved Contact and Assistant Details
- Email: `abdtirtayasa24@gmail.com`
- WhatsApp URL: `https://wa.me/6282121172378?text=Hi%20Abdul%2C%20I%20found%20your%20contact%20on%20your%20website.%20I%27m%20interested%20with%20your%20profile%2C%20so%20can%20we%20discuss%20more%3F`
- WhatsApp initial message: `Hi Abdul, I found your contact on your website. I'm interested with your profile, so can we discuss more?`
- Résumé public basename: `CV_Abdul-F-Tirtayasa`
- Assistant display name: `Tirtayasa AI`
