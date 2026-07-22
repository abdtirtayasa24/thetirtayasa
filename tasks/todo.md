# Task Breakdown: Data Analyst & AI Enabler Portfolio

## Task 1: Create monorepo structure and safe environment templates

**Description:** Create the root project layout for `frontend/`, `backend/`, `content/`, `deployment/`, and supporting documentation/config placeholders without adding real secrets.

**Acceptance criteria:**
- [x] Repository contains the agreed top-level directories.
- [x] `.env.example` files document required frontend/backend variables with placeholders only, including the backend rate-limit HMAC secret placeholder.
- [x] `.gitignore` excludes local env files, build output, Python caches, Node modules, and generated secrets.

**Verification:**
- [x] Manual check: no real Supabase or Gemini secrets are committed; public email/WhatsApp contact values are intentional configuration.
- [x] Manual check: directory structure matches the spec.

**Dependencies:** None

**Files likely touched:**
- `.gitignore`
- `frontend/.env.example`
- `backend/.env.example`
- `content/README.md`

**Estimated scope:** Small: 3-5 files

---

## Task 2: Scaffold Next.js App Router frontend with Tailwind, Radix, and lucide-react

**Description:** Initialize the frontend app using Next.js App Router, TypeScript, npm, Tailwind CSS, Radix UI dependencies, and lucide-react icons.

**Acceptance criteria:**
- [x] Frontend uses Next.js App Router under `frontend/src/app`.
- [x] Tailwind is configured and applied globally.
- [x] `lucide-react` and Radix UI packages are installed.
- [x] `next.config.ts` uses standalone output and disables `poweredByHeader`.

**Verification:**
- [x] Tests/checks pass: `cd frontend && npm run lint`
- [x] Build succeeds: `cd frontend && npm run build`
- [x] Manual check: `cd frontend && npm run dev` serves the starter app.

**Dependencies:** Task 1

**Files likely touched:**
- `frontend/package.json`
- `frontend/next.config.ts`
- `frontend/src/app/layout.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/app/globals.css`

**Estimated scope:** Medium: 3-5 files

---

## Task 3: Scaffold FastAPI backend with settings, health endpoint, and test harness

**Description:** Initialize the backend app with Python 3.12+, FastAPI, pydantic-settings, pytest, and a health endpoint.

**Acceptance criteria:**
- [x] Backend dependencies are declared in `pyproject.toml`.
- [x] Settings load from environment variables without hardcoded secrets.
- [x] `GET /health` returns a stable success response.
- [x] Test harness can run a basic API test.

**Verification:**
- [x] Tests pass: `cd backend && pytest`
- [x] Manual check: backend can start locally with documented command.

**Dependencies:** Task 1

**Files likely touched:**
- `backend/pyproject.toml`
- `backend/app/main.py`
- `backend/app/core/config.py`
- `backend/tests/test_health.py`

**Estimated scope:** Medium: 3-5 files

---

## Task 4: Define content schemas and placeholder content layout

**Description:** Add YAML/Markdown content structure and validation schemas for profile, skills, experience, availability, and projects, using placeholders until real project content is supplied.

**Acceptance criteria:**
- [x] Content directories and placeholder files exist.
- [x] Project metadata supports featured status, visibility, categories, technologies, metrics, deployment, and confidentiality flags.
- [x] Invalid required fields fail validation.
- [x] Draft/private content can be represented.

**Verification:**
- [x] Tests pass: content validation command added by implementation.
- [x] Manual check: placeholders do not claim unverified outcomes.

**Dependencies:** Task 1

**Files likely touched:**
- `content/profile.yaml`
- `content/skills.yaml`
- `content/experience.yaml`
- `content/availability.yaml`
- `content/projects/project-01.md`
- `content/projects/project-02.md`
- `content/projects/project-03.md`
- `backend/app/content/schemas.py`
- `backend/tests/test_content_validation.py`

**Estimated scope:** Medium: 3-5 implementation files plus content placeholders

---

## Checkpoint: Foundation

- [x] Frontend starts locally.
- [x] Backend health endpoint responds locally.
- [x] No secrets are committed.
- [x] Placeholder content validates.
- [x] Human review before building portfolio pages.

---

## Task 5: Implement frontend content loading and typed project/profile models

**Description:** Add frontend utilities to read version-controlled content at build time and expose typed project/profile data for pages.

**Acceptance criteria:**
- [ ] Published public projects load from Markdown/YAML.
- [ ] Draft/private projects are excluded from public page data.
- [ ] Featured projects sort by year descending and respect `featured_project_limit`.

**Verification:**
- [ ] Tests pass: `cd frontend && npm test` or equivalent configured test command.
- [ ] Build succeeds: `cd frontend && npm run build`.

**Dependencies:** Tasks 2, 4

**Files likely touched:**
- `frontend/src/lib/content.ts`
- `frontend/src/lib/content-types.ts`
- `frontend/src/lib/site-config.ts`
- `frontend/src/lib/content.test.ts`

**Estimated scope:** Medium: 3-5 files

---

## Task 6: Build global layout, navigation, footer, and design tokens

**Description:** Implement the dark technical visual foundation from `DESIGN.md`, including Tailwind theme tokens, sticky navigation, footer CTAs, focus states, and reduced-motion support.

**Acceptance criteria:**
- [ ] Core color, spacing, typography, radius, and motion tokens are available.
- [ ] Desktop and mobile navigation are keyboard accessible.
- [ ] Contact CTAs include `mailto:abdtirtayasa24@gmail.com` and WhatsApp `wa.me/6282121172378` with the approved prefilled message.
- [ ] Reduced-motion CSS is implemented.

**Verification:**
- [ ] Lint passes: `cd frontend && npm run lint`.
- [ ] Manual check: keyboard tab order and visible focus states.
- [ ] Manual check: mobile navigation opens/closes accessibly.

**Dependencies:** Task 2

**Files likely touched:**
- `frontend/tailwind.config.ts`
- `frontend/src/app/globals.css`
- `frontend/src/components/site-header.tsx`
- `frontend/src/components/site-footer.tsx`
- `frontend/src/lib/site-config.ts`

**Estimated scope:** Medium: 3-5 files

---

## Task 7: Build homepage with identity, capabilities, featured projects, and CTAs

**Description:** Build the homepage information hierarchy: technical identity, capability grid, three featured projects, transition timeline preview, AI assistant intro, and contact/résumé actions.

**Acceptance criteria:**
- [ ] Hero positions Abdul F. Tirtayasa as a Data Analyst & AI Enabler.
- [ ] Core capabilities emphasize Python, Pandas, NumPy, FastAPI, SQL, advanced Google Sheets, data visualization, analytics, data automation, and Agentic Engineering.
- [ ] Copy communicates Abdul's prior sales team lead background and business-goal-aligned perspective.
- [ ] Exactly three featured published projects render by default when available.
- [ ] CTAs include View My Work, Ask My AI Assistant, Download Résumé, contact, GitHub, and LinkedIn.

**Verification:**
- [ ] Build succeeds: `cd frontend && npm run build`.
- [ ] Manual check: desktop and mobile homepage layout.

**Dependencies:** Tasks 5, 6

**Files likely touched:**
- `frontend/src/app/page.tsx`
- `frontend/src/components/hero-section.tsx`
- `frontend/src/components/capability-grid.tsx`
- `frontend/src/components/project-card.tsx`
- `frontend/src/components/contact-cta.tsx`

**Estimated scope:** Medium: 3-5 files

---

## Task 8: Build projects index with category filtering

**Description:** Add `/projects` page with configurable project listing and filters for AI Agents, Data Engineering, Analytics, Automation, and other configured categories.

**Acceptance criteria:**
- [ ] Only published public projects appear.
- [ ] Category filters work without page reload when JavaScript is available.
- [ ] Additional categories from content do not require layout code changes.
- [ ] Empty filtered states are clear and accessible.

**Verification:**
- [ ] Build succeeds: `cd frontend && npm run build`.
- [ ] Manual check: filter interactions with keyboard and mouse.

**Dependencies:** Tasks 5, 6

**Files likely touched:**
- `frontend/src/app/projects/page.tsx`
- `frontend/src/components/project-filter.tsx`
- `frontend/src/components/project-card.tsx`
- `frontend/src/lib/content.ts`

**Estimated scope:** Medium: 3-5 files

---

## Task 9: Build dynamic project detail pages

**Description:** Add `/projects/[slug]` pages that render problem, context, role, architecture, implementation, technical decisions, results, lessons learned, technology stack, and deployment model.

**Acceptance criteria:**
- [ ] Published public project pages generate from content slugs.
- [ ] Draft/private project slugs return not found.
- [ ] Architecture and metadata sections follow the design system.
- [ ] Current project slug is available to the future chat UI.

**Verification:**
- [ ] Build succeeds: `cd frontend && npm run build`.
- [ ] Manual check: sample project page on desktop and mobile.

**Dependencies:** Tasks 5, 6

**Files likely touched:**
- `frontend/src/app/projects/[slug]/page.tsx`
- `frontend/src/components/project-detail.tsx`
- `frontend/src/components/architecture-panel.tsx`
- `frontend/src/lib/content.ts`

**Estimated scope:** Medium: 3-5 files

---

## Task 10: Build experience, about, résumé, notes, and contact pages

**Description:** Implement the remaining public pages, keeping résumé as a downloadable PDF only and contact options as `mailto:abdtirtayasa24@gmail.com`, WhatsApp with the approved prefilled message, and contact form entry point.

**Acceptance criteria:**
- [ ] `/experience` renders professional timeline content.
- [ ] `/about` explains background and working style.
- [ ] `/resume` provides PDF download only, not a rendered résumé page; the public basename is `CV_Abdul-F-Tirtayasa` and the Google Drive URL is configurable.
- [ ] `/notes` exists and handles empty/no-notes MVP state.
- [ ] `/contact` includes `mailto:abdtirtayasa24@gmail.com`, WhatsApp `wa.me/6282121172378` with the approved prefilled message, and a form wired later to the backend.

**Verification:**
- [ ] Build succeeds: `cd frontend && npm run build`.
- [ ] Manual check: all routes load and are responsive.

**Dependencies:** Tasks 5, 6

**Files likely touched:**
- `frontend/src/app/experience/page.tsx`
- `frontend/src/app/about/page.tsx`
- `frontend/src/app/resume/page.tsx`
- `frontend/src/app/notes/page.tsx`
- `frontend/src/app/contact/page.tsx`

**Estimated scope:** Medium: 5 files

---

## Task 11: Add SEO metadata, sitemap, robots, and social metadata

**Description:** Add metadata for public routes, Open Graph/Twitter sharing, robots directives, and sitemap generation.

**Acceptance criteria:**
- [ ] Public pages have meaningful titles and descriptions.
- [ ] Sitemap includes published public routes only.
- [ ] Draft/private content is excluded from sitemap.
- [ ] Domain uses `https://thetirtayasa.my.id` via configuration.

**Verification:**
- [ ] Build succeeds: `cd frontend && npm run build`.
- [ ] Manual check: generated sitemap/robots output.

**Dependencies:** Tasks 5, 9, 10

**Files likely touched:**
- `frontend/src/app/layout.tsx`
- `frontend/src/app/sitemap.ts`
- `frontend/src/app/robots.ts`
- `frontend/src/lib/metadata.ts`

**Estimated scope:** Small: 3-4 files

---

## Checkpoint: Public Portfolio

- [ ] Exactly three projects are featured by default when configured.
- [ ] Additional published projects require no layout code changes.
- [ ] Draft/private content is hidden.
- [ ] Mobile and desktop layouts work.
- [ ] Human review before backend data work.

---

## Task 12: Add Alembic migrations for documents, chat, feedback, contact submissions, and AI rate limits

**Description:** Create repeatable migrations for pgvector, portfolio documents, chat sessions, chat messages, chat feedback, contact submissions, and expiring AI-chat rate-limit counters.

**Acceptance criteria:**
- [ ] pgvector extension is enabled in the `extensions` schema.
- [ ] Documents table includes `embedding extensions.vector(768)` and HNSW index.
- [ ] Chat tables match retention/source-reference needs.
- [ ] Contact submissions are stored separately from chat data.
- [ ] Rate-limit counters store only temporary HMAC-derived identifiers, counts, window metadata, and expiry timestamps; raw IP addresses are not stored.
- [ ] RLS posture is documented; no anonymous public policies are added.

**Verification:**
- [ ] Migration check: `cd backend && alembic upgrade head` against a local/Supabase-compatible database.
- [ ] Migration repeatability check: downgrade/upgrade if supported by implementation.

**Dependencies:** Task 3

**Files likely touched:**
- `backend/alembic.ini`
- `backend/alembic/env.py`
- `backend/alembic/versions/<revision>_initial_schema.py`
- `backend/app/database/base.py`

**Estimated scope:** Medium: 3-5 files

---

## Task 13: Implement async SQLAlchemy database setup and repositories

**Description:** Add async engine/session setup and repository classes for documents, chat, feedback, contact submissions, and AI-chat rate-limit counters.

**Acceptance criteria:**
- [ ] Database URL loads from backend environment settings.
- [ ] Repositories use parameterized SQLAlchemy operations.
- [ ] Tests can run with a test database or mocked repository boundary.
- [ ] No Supabase service credentials appear in frontend code.

**Verification:**
- [ ] Tests pass: `cd backend && pytest`.
- [ ] Static check: no server env variable is referenced from `frontend/`.

**Dependencies:** Task 12

**Files likely touched:**
- `backend/app/database/session.py`
- `backend/app/repositories/documents.py`
- `backend/app/repositories/chat.py`
- `backend/app/repositories/contact.py`
- `backend/app/repositories/rate_limits.py`
- `backend/tests/test_repositories.py`

**Estimated scope:** Medium: 3-5 files

---

## Task 14: Implement project read API endpoints from approved content

**Description:** Expose `GET /v1/projects` and `GET /v1/projects/{slug}` using approved content, matching frontend visibility rules.

**Acceptance criteria:**
- [ ] List endpoint returns published public projects only.
- [ ] Detail endpoint returns one published public project by slug.
- [ ] Draft/private/missing slugs return appropriate errors.
- [ ] Response models are explicit and typed.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_projects_api.py`.

**Dependencies:** Tasks 3, 4

**Files likely touched:**
- `backend/app/api/projects.py`
- `backend/app/models/projects.py`
- `backend/app/content/loader.py`
- `backend/tests/test_projects_api.py`

**Estimated scope:** Medium: 3-5 files

---

## Task 15: Implement contact submission API endpoint

**Description:** Add backend contact submission validation and persistence to Supabase, while frontend contact can still offer mailto and WhatsApp alternatives.

**Acceptance criteria:**
- [ ] Endpoint validates name, email/contact channel, message, and optional engagement type.
- [ ] Contact submissions are stored in the contact table only.
- [ ] Raw contact submissions are not logged.
- [ ] Frontend contact form can submit successfully.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_contact_api.py`.
- [ ] Manual check: frontend form displays success and validation errors.

**Dependencies:** Tasks 10, 13

**Files likely touched:**
- `backend/app/api/contact.py`
- `backend/app/models/contact.py`
- `backend/app/repositories/contact.py`
- `frontend/src/app/contact/page.tsx`
- `backend/tests/test_contact_api.py`

**Estimated scope:** Medium: 3-5 files

---

## Checkpoint: Backend Data Foundation

- [ ] Migrations apply cleanly.
- [ ] API tests pass.
- [ ] Contact data is separated from chat data.
- [ ] Server credentials are not exposed to browsers.
- [ ] Human review before ingestion/RAG work.

---

## Task 16: Implement content parsing, normalization, chunking, and hashing

**Description:** Build backend ingestion utilities that parse approved YAML/Markdown, normalize Markdown, split into semantic chunks, and generate stable content hashes.

**Acceptance criteria:**
- [ ] Draft/private content is ignored.
- [ ] Chunks retain source type, slug, title, section, company, technologies, year, URL, visibility, and metadata.
- [ ] Chunk sizes follow target/overlap/max token settings.
- [ ] Unchanged chunks produce the same content hash.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_ingestion_chunking.py`.

**Dependencies:** Tasks 4, 13

**Files likely touched:**
- `backend/app/ingestion/parser.py`
- `backend/app/ingestion/chunker.py`
- `backend/app/ingestion/hash.py`
- `backend/tests/test_ingestion_chunking.py`

**Estimated scope:** Medium: 3-4 files

---

## Task 17: Implement Gemini embedding service

**Description:** Add a Gemini embedding client using `google-genai`, configurable model names, retrieval task types, timeouts, and retries.

**Acceptance criteria:**
- [ ] Document embeddings use `RETRIEVAL_DOCUMENT`.
- [ ] Query embeddings use `RETRIEVAL_QUERY`.
- [ ] Embedding dimensions are configurable and default to 768.
- [ ] API key is loaded only from backend environment.

**Verification:**
- [ ] Tests pass: mocked Gemini embedding tests.
- [ ] Optional manual check with real credentials: embedding request succeeds.

**Dependencies:** Task 3

**Files likely touched:**
- `backend/app/ai/gemini_embeddings.py`
- `backend/app/core/config.py`
- `backend/tests/test_gemini_embeddings.py`

**Estimated scope:** Small: 2-3 files

---

## Task 18: Implement protected ingestion sync

**Description:** Add `POST /internal/ingestion/sync` that indexes changed public content, skips unchanged chunks, and removes deleted sources.

**Acceptance criteria:**
- [ ] Endpoint requires an ingestion secret or equivalent backend-only auth.
- [ ] Changed chunks are embedded and upserted.
- [ ] Unchanged chunks are not re-embedded.
- [ ] Deleted public sources are removed from document/vector storage.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_ingestion_sync.py`.
- [ ] Manual check with real credentials indexes placeholder content.

**Dependencies:** Tasks 13, 16, 17

**Files likely touched:**
- `backend/app/api/ingestion.py`
- `backend/app/ingestion/service.py`
- `backend/app/repositories/documents.py`
- `backend/tests/test_ingestion_sync.py`

**Estimated scope:** Medium: 3-4 files

---

## Task 19: Implement hybrid retrieval and ranking

**Description:** Retrieve semantic candidates from pgvector/Postgres and apply Python scoring boosts for keyword match, current project, and featured content.

**Acceptance criteria:**
- [ ] Query embedding retrieves up to 12 semantic candidates.
- [ ] Python ranking applies the documented weighted score.
- [ ] Current project boosts results but does not hard-filter them.
- [ ] Top context chunks are limited by configuration.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_retrieval.py`.
- [ ] Manual check: project-specific query ranks current project content higher.

**Dependencies:** Tasks 13, 17, 18

**Files likely touched:**
- `backend/app/retrieval/repository.py`
- `backend/app/retrieval/ranking.py`
- `backend/app/retrieval/service.py`
- `backend/tests/test_retrieval.py`

**Estimated scope:** Medium: 3-4 files

---

## Task 20: Implement assistant scope classification and guardrails

**Description:** Add policy logic that permits portfolio questions and brief harmless answers while refusing code generation, system prompt disclosure, destructive requests, prompt injection, and secret/data exposure.

**Acceptance criteria:**
- [ ] Portfolio, availability, contact, project, skill, and experience questions are allowed.
- [ ] Compensation questions redirect to direct contact.
- [ ] Code-generation and destructive/off-scope requests are refused.
- [ ] Attempts to reveal prompts, credentials, internal records, or private content are refused.
- [ ] Harmless non-portfolio questions receive brief safe answers without portfolio claims.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_chat_guardrails.py`.

**Dependencies:** Task 3

**Files likely touched:**
- `backend/app/chat/scope.py`
- `backend/app/chat/policy.py`
- `backend/app/prompts/system_prompt.py`
- `backend/tests/test_chat_guardrails.py`

**Estimated scope:** Medium: 3-4 files

---

## Task 21: Implement streaming chat generation endpoint

**Description:** Add `POST /v1/chat` with request validation, retrieval, grounded Gemini generation, token streaming, fallback behavior, and source attachment for project/experience claims.

**Acceptance criteria:**
- [ ] Endpoint streams answer tokens/events to the frontend.
- [ ] Request supports `message`, `session_id`, and `current_project`.
- [ ] Grounded answer uses retrieved verified context.
- [ ] Assistant identity/display name is configured as `Tirtayasa AI`.
- [ ] Missing evidence returns the configured fallback.
- [ ] Project/experience claims include source references.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_chat_api.py`.
- [ ] Manual check: streaming response appears incrementally with real or mocked Gemini.

**Dependencies:** Tasks 19, 20

**Files likely touched:**
- `backend/app/api/chat.py`
- `backend/app/chat/orchestrator.py`
- `backend/app/ai/gemini_chat.py`
- `backend/app/models/chat.py`
- `backend/tests/test_chat_api.py`

**Estimated scope:** Medium: 4-5 files

---

## Task 22: Persist chat sessions, redacted messages, feedback, and source references

**Description:** Store chat sessions/messages and feedback while redacting sensitive data before persistence and preserving referenced document IDs for assistant messages.

**Acceptance criteria:**
- [ ] Browser-provided session IDs are validated or replaced safely.
- [ ] Redacted user/assistant messages are persisted.
- [ ] Assistant messages store referenced document IDs where applicable.
- [ ] `POST /v1/chat/feedback` stores helpful/not-helpful feedback.
- [ ] Chat retention defaults to 90 days in configuration/docs.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_chat_persistence.py tests/test_feedback_api.py`.

**Dependencies:** Tasks 13, 21, 28 can refine redaction later

**Files likely touched:**
- `backend/app/api/chat_feedback.py`
- `backend/app/chat/persistence.py`
- `backend/app/repositories/chat.py`
- `backend/tests/test_chat_persistence.py`
- `backend/tests/test_feedback_api.py`

**Estimated scope:** Medium: 4-5 files

---

## Task 23: Add AI quality evaluation fixtures and tests

**Description:** Create version-controlled evaluation fixtures for skills, projects, experience, availability, compensation, unsupported, and security scenarios.

**Acceptance criteria:**
- [ ] Evaluation fixture directory matches the spec.
- [ ] Tests check fallback, refusal, compensation redirect, and source requirements.
- [ ] Evaluation can run without live Gemini by using mocks or recorded fixtures.
- [ ] Live evaluation path is documented for credentialed environments.

**Verification:**
- [ ] Tests pass: `cd backend && pytest backend/tests/evaluation` or actual configured command.

**Dependencies:** Tasks 20, 21

**Files likely touched:**
- `backend/tests/evaluation/skills.yaml`
- `backend/tests/evaluation/projects.yaml`
- `backend/tests/evaluation/experience.yaml`
- `backend/tests/evaluation/security.yaml`
- `backend/tests/test_ai_evaluation.py`

**Estimated scope:** Medium: 5 files

---

## Checkpoint: Grounded Assistant Backend

- [ ] Public content indexes into pgvector.
- [ ] Private/draft content is skipped.
- [ ] Streaming chat returns grounded answers.
- [ ] Unsafe requests are refused.
- [ ] Project/experience claims include source references.
- [ ] Human review before chat UI integration.

---

## Task 24: Implement frontend streaming chat API client and session persistence

**Description:** Add frontend client code for POST-based streaming chat and persist `session_id` across reloads using browser storage.

**Acceptance criteria:**
- [ ] Chat client reads token/source/error/done events from the response stream.
- [ ] `session_id` persists across page reloads.
- [ ] Current project slug is sent when chat is opened from a project page.
- [ ] Network failures return a user-friendly unavailable state.

**Verification:**
- [ ] Tests pass: frontend unit tests for stream parsing/session behavior.
- [ ] Manual check: reload keeps the chat session ID.

**Dependencies:** Tasks 21, 22

**Files likely touched:**
- `frontend/src/lib/chat-client.ts`
- `frontend/src/lib/chat-session.ts`
- `frontend/src/lib/chat-client.test.ts`
- `frontend/src/components/chat/types.ts`

**Estimated scope:** Medium: 3-4 files

---

## Task 25: Build accessible chat launcher, desktop panel, and mobile dialog

**Description:** Add persistent AI assistant launcher and responsive chat container using Radix UI primitives where appropriate.

**Acceptance criteria:**
- [ ] Launcher is visible on all public pages.
- [ ] Desktop chat appears as a floating panel.
- [ ] Mobile chat appears as a full-width bottom sheet or near full-screen dialog.
- [ ] Assistant display name is `Tirtayasa AI`.
- [ ] Open/close behavior is keyboard accessible and manages focus correctly.
- [ ] Touch targets meet minimum size guidance.

**Verification:**
- [ ] Lint passes: `cd frontend && npm run lint`.
- [ ] Manual accessibility check: keyboard open, close, send, focus return.
- [ ] Manual responsive check: mobile and desktop chat layouts.

**Dependencies:** Tasks 6, 24

**Files likely touched:**
- `frontend/src/components/chat/chat-launcher.tsx`
- `frontend/src/components/chat/chat-panel.tsx`
- `frontend/src/components/chat/chat-dialog.tsx`
- `frontend/src/components/chat/chat-provider.tsx`
- `frontend/src/app/layout.tsx`

**Estimated scope:** Medium: 5 files

---

## Task 26: Add starter prompts, source cards, and feedback controls

**Description:** Complete chat content UI with suggested prompts, source links, and helpful/not-helpful feedback buttons.

**Acceptance criteria:**
- [ ] Starter prompts cover skills, projects, architecture, availability, and contact.
- [ ] Source cards render for project/experience claims.
- [ ] Feedback buttons submit rating to backend.
- [ ] Feedback controls are labeled for screen readers.

**Verification:**
- [ ] Tests pass: frontend chat component tests if configured.
- [ ] Manual check: source links navigate to portfolio pages.
- [ ] Manual check: feedback submit success/error states.

**Dependencies:** Tasks 22, 25

**Files likely touched:**
- `frontend/src/components/chat/starter-prompts.tsx`
- `frontend/src/components/chat/source-card.tsx`
- `frontend/src/components/chat/feedback-buttons.tsx`
- `frontend/src/components/chat/chat-message.tsx`

**Estimated scope:** Medium: 4 files

---

## Task 27: Add loading, timeout, retry, unavailable, and reduced-motion states

**Description:** Ensure chat gracefully handles backend latency, failures, AI budget exhaustion, and reduced-motion user preferences.

**Acceptance criteria:**
- [ ] Sending state is visible and does not block page navigation.
- [ ] Timeout and retry states are clear.
- [ ] AI unavailable/budget exhausted state directs users to project pages and contact.
- [ ] Reduced-motion users do not receive unnecessary animation.

**Verification:**
- [ ] Manual check with mocked backend failure.
- [ ] Manual check with reduced-motion browser setting.

**Dependencies:** Tasks 24, 25, 30

**Files likely touched:**
- `frontend/src/components/chat/chat-panel.tsx`
- `frontend/src/components/chat/chat-message.tsx`
- `frontend/src/lib/chat-client.ts`
- `frontend/src/app/globals.css`

**Estimated scope:** Medium: 3-4 files

---

## Checkpoint: Chat Experience

- [ ] Chat works across portfolio pages.
- [ ] Current project context is passed.
- [ ] Backend failure does not break portfolio browsing.
- [ ] Keyboard operation is complete.
- [ ] Human review before deployment/security hardening.

---

## Task 28: Add PII redaction and persistence safeguards

**Description:** Redact email addresses, telephone numbers, IP addresses, API keys, access tokens, secret URLs, and account identifiers before analytics/chat persistence; rate limiting may derive a temporary HMAC identifier from the request IP but must not persist the raw IP.

**Acceptance criteria:**
- [ ] Redaction runs before chat message persistence.
- [ ] Raw IP addresses are not persisted solely for rate limiting.
- [ ] Contact submissions remain separate and are not mixed into chat analytics.
- [ ] Logs do not include raw chat/contact payloads.
- [ ] Redaction behavior is covered by tests.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_redaction.py`.
- [ ] Manual log review during local chat/contact submissions.

**Dependencies:** Tasks 15, 22

**Files likely touched:**
- `backend/app/security/redaction.py`
- `backend/app/chat/persistence.py`
- `backend/app/api/contact.py`
- `backend/tests/test_redaction.py`

**Estimated scope:** Medium: 3-4 files

---

## Task 29: Add CORS restrictions and layered application-level AI chat limits

**Description:** Configure strict CORS allowlists and backend AI-chat usage limits that complement platform/Nginx rate limiting while preserving visitor privacy with temporary HMAC-derived IP identifiers.

**Acceptance criteria:**
- [ ] CORS allowed origins are environment-configurable and default-safe.
- [ ] Chat message length limit defaults to 2000 characters.
- [ ] Session hourly and conversation message limits are enforced.
- [ ] Backend enforces per-visitor AI-chat limits using a temporary HMAC-derived IP identifier.
- [ ] Raw IP addresses are not stored solely for rate limiting.
- [ ] Rate-limit counters expire automatically and expired counters are ignored or removed.
- [ ] Platform/Nginx rate limiting remains the first abuse-control layer where available.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_limits_and_cors.py`.
- [ ] Tests pass: HMAC identifiers are deterministic within the configured window but do not expose the raw IP.
- [ ] Manual check: unauthorized origin is rejected in configured environment.

**Dependencies:** Tasks 13, 21

**Files likely touched:**
- `backend/app/main.py`
- `backend/app/core/config.py`
- `backend/app/security/ip_identity.py`
- `backend/app/chat/limits.py`
- `backend/app/repositories/rate_limits.py`
- `backend/tests/test_limits_and_cors.py`

**Estimated scope:** Medium: 5 files

---

## Task 30: Add AI budget controls and graceful degradation

**Description:** Add configurable daily/monthly AI usage controls and responses that disable new generations while keeping the portfolio usable.

**Acceptance criteria:**
- [ ] Daily request limit defaults to 500.
- [ ] Budget exhaustion disables new AI generation.
- [ ] Chat endpoint returns a machine-readable unavailable/budget response.
- [ ] Frontend displays graceful chat-unavailable messaging.

**Verification:**
- [ ] Tests pass: `cd backend && pytest tests/test_budget_controls.py`.
- [ ] Manual check: forced budget-exhausted mode shows frontend fallback.

**Dependencies:** Tasks 21, 27

**Files likely touched:**
- `backend/app/chat/budget.py`
- `backend/app/core/config.py`
- `backend/app/api/chat.py`
- `frontend/src/components/chat/chat-panel.tsx`
- `backend/tests/test_budget_controls.py`

**Estimated scope:** Medium: 4-5 files

---

## Task 31: Add Ubuntu 24.04 VPS deployment artifacts for Nginx and systemd

**Description:** Add deployment templates for Next.js standalone on Ubuntu 24.04 using native systemd behind Nginx for `thetirtayasa.my.id`.

**Acceptance criteria:**
- [ ] systemd service runs Next.js on `127.0.0.1:3000`.
- [ ] Nginx terminates TLS and proxies to localhost.
- [ ] Nginx includes basic request rate limiting.
- [ ] Deployment docs avoid Docker for frontend.
- [ ] Environment files are referenced but not committed with secrets.

**Verification:**
- [ ] Static check: templates match domain and localhost binding requirements.
- [ ] Manual check on VPS later: service starts and Nginx proxies successfully.

**Dependencies:** Task 2

**Files likely touched:**
- `deployment/systemd/portfolio-nextjs.service`
- `deployment/nginx/thetirtayasa.my.id.conf`
- `deployment/scripts/deploy-frontend.sh`
- `deployment/scripts/rollback-frontend.sh`
- `deployment/README.md`

**Estimated scope:** Medium: 5 files

---

## Task 32: Add production smoke tests and operations runbook

**Description:** Document and script smoke checks for frontend, backend health, chat degradation, résumé download, contact links/form, HTTPS, and rollback.

**Acceptance criteria:**
- [ ] Smoke tests include public homepage, project page, résumé PDF, contact page, and backend health.
- [ ] Runbook explains deploy, rollback, service logs, Nginx reload, and HTTPS renewal checks.
- [ ] AI backend unavailable scenario is included.
- [ ] No secrets are included in docs.

**Verification:**
- [ ] Manual check: smoke commands are copy-pasteable with placeholders where needed.
- [ ] Shell check if scripts are executable and syntax-valid.

**Dependencies:** Tasks 11, 21, 31

**Files likely touched:**
- `deployment/scripts/smoke-test.sh`
- `deployment/RUNBOOK.md`
- `deployment/README.md`

**Estimated scope:** Small: 2-3 files

---

## Task 33: Add GitHub Actions after local apps are stable

**Description:** Add CI workflows for linting, tests, builds, and eventually deployment after local app behavior is proven.

**Acceptance criteria:**
- [ ] CI runs frontend lint/build.
- [ ] CI runs backend tests.
- [ ] Secrets are referenced through GitHub Actions secrets only.
- [ ] Deployment jobs are gated and not accidentally triggered before configuration.

**Verification:**
- [ ] Local equivalent commands pass.
- [ ] GitHub Actions workflow syntax is valid.

**Dependencies:** Tasks 2, 3, 31

**Files likely touched:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-frontend.yml`
- `.github/workflows/deploy-backend.yml`

**Estimated scope:** Small: 2-3 files

---

## Task 34: Add FastAPI Cloud deployment configuration later

**Description:** Add FastAPI Cloud deployment configuration and documentation once backend routes, credentials, and health checks are stable.

**Acceptance criteria:**
- [ ] Production environment variables are documented.
- [ ] Health check endpoint is used by deployment.
- [ ] Gemini and Supabase credentials are configured outside the repository.
- [ ] Failed releases do not replace healthy versions where platform supports it.

**Verification:**
- [ ] Manual check: FastAPI Cloud deployment succeeds later.
- [ ] Manual check: production `/health` responds.

**Dependencies:** Tasks 21, 29, 30, 33

**Files likely touched:**
- `backend/README.md`
- `.github/workflows/deploy-backend.yml`
- `deployment/RUNBOOK.md`

**Estimated scope:** Small: 2-3 files

---

## Task 35: Finalize real portfolio content and launch review

**Description:** Replace placeholders with approved real profile, project, résumé link, LinkedIn/GitHub/contact, availability, disclosure, and architecture content before public launch.

**Acceptance criteria:**
- [ ] Three featured projects are complete and approved.
- [ ] Company-name disclosure is reviewed per project.
- [ ] Confidential URLs, source code, customer data, and private metrics are excluded.
- [ ] Résumé PDF is available for download from the configured public Google Drive URL with public basename `CV_Abdul-F-Tirtayasa`.
- [ ] AI evaluation thresholds pass against final content.

**Verification:**
- [ ] Content validation passes.
- [ ] Frontend build succeeds.
- [ ] Backend AI evaluation suite passes.
- [ ] Manual privacy/security review completed before launch.

**Dependencies:** Tasks 4, 11, 23, 32

**Files likely touched:**
- `content/profile.yaml`
- `content/skills.yaml`
- `content/experience.yaml`
- `content/availability.yaml`
- `content/projects/*.md`
- `frontend/src/lib/site-config.ts`
- configured résumé Google Drive URL

**Estimated scope:** Medium: content-focused, may be split per project if large

---

## Final Checkpoint: Ready for Launch

- [ ] All acceptance criteria from MVP milestones are met.
- [ ] Frontend standalone build succeeds.
- [ ] Backend tests pass.
- [ ] AI quality evaluation passes target thresholds.
- [ ] Deployment smoke tests pass.
- [ ] Rollback process is tested.
- [ ] Confidential information review is complete.
- [ ] Human approval received before public launch.
