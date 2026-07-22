# AGENTS.md

Guidelines for agents and contributors working in this repository.

Read this file before editing. For system design, read `docs/ARCHITECTURE.md`. For run commands and project status, read `README.md`.

## Working Principles

- Make small, focused changes that directly serve the requested task.
- Preserve existing behavior unless the task explicitly asks to change it.
- Inspect nearby code and tests before editing.
- Prefer existing utilities, patterns, and dependencies over new abstractions.
- Do not add speculative features, broad refactors, or unrelated formatting changes.
- Do not commit changes unless explicitly asked.
- Keep source code, `.env` files, credentials, logs, and private content sensitive.

## Repository Rules

### Package and runtime choices

- Frontend uses **Bun**. Use `frontend/bun.lock`; do not create `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`.
- Backend uses the repository-local virtual environment at `backend/.venv`.
- Backend package metadata and tool configuration live in `backend/pyproject.toml`.
- Backend database target is Supabase PostgreSQL with pgvector.
- Local development ports are fixed unless the user asks otherwise:
  - Frontend: `3030`
  - Backend: `8888`

### Naming conventions

- Frontend component files use **PascalCase** and should match the exported component name:
  - Good: `ProjectCard.tsx`, `ContactForm.tsx`, `ChatLauncher.tsx`
  - Avoid: `project-card.tsx`, `contact-form.tsx`
- Frontend non-component utility files use kebab-case where the codebase already does:
  - Example: `contact-client.ts`, `site-config.ts`
- Backend Python modules use snake_case:
  - Example: `gemini_embeddings.py`, `chat_feedback.py`
- Backend classes use PascalCase; functions, variables, and methods use snake_case.
- Tests should follow existing names and live near the layer they verify:
  - Backend: `backend/tests/test_*.py`
  - Frontend: colocated `*.test.ts` / `*.test.tsx` files under `frontend/src`

## Frontend Standards

- Use Next.js App Router under `frontend/src/app`.
- Use TypeScript, React, Tailwind CSS, Radix UI primitives, and `lucide-react` icons.
- Follow `DESIGN.md` for visual choices. Keep the dark technical style restrained, accessible, and production-ready.
- Use `var(--font-manrope)` for sans typography and `var(--font-jetbrains-mono)` for mono typography.
- Keep public pages usable if the AI assistant or backend is unavailable.
- Preserve accessibility basics:
  - semantic controls
  - visible focus states
  - keyboard-accessible dialogs/menus/forms
  - screen-reader labels for icon-only controls
  - reduced-motion support where animation is introduced
- Do not introduce another UI library unless the user explicitly approves it.
- Do not expose backend-only environment variables to browser code. Only `NEXT_PUBLIC_*` values may be used client-side.

## Backend Standards

- Use FastAPI with typed route models and dependency injection.
- Use Pydantic models at API boundaries.
- Use SQLAlchemy async sessions and repository classes for database operations.
- Keep route handlers thin; put ingestion, retrieval, chat, and persistence behavior in layer-specific modules.
- Use Alembic for schema changes. Do not modify the live database schema manually and leave migrations behind.
- Use parameterized SQLAlchemy operations; do not build SQL with untrusted string interpolation.
- Do not log raw contact submissions, chat payloads, tokens, credentials, cookies, private content, or API keys.
- AI behavior must remain guarded:
  - refuse prompt disclosure, secret exposure, destructive requests, and code-generation requests
  - redirect compensation questions to direct contact
  - answer factual portfolio claims only from verified public content and sources
  - skip draft/private content during ingestion

## Content Rules

- `content/` is the source of truth for public portfolio content and future RAG indexing.
- Do not invent project metrics, client names, confidential details, dates, or outcomes.
- Use `status: draft` for incomplete content.
- Use `visibility: private` for content that must never render or be indexed.
- Public content should be safe to display and safe to use as AI retrieval context.

## Testing and Verification

Run the smallest relevant checks during development, then run full checks before completion when practical.

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

When changing database migrations, also run the applicable Alembic check or SQL generation command from `backend/.venv`.

If a check cannot be run because of missing credentials, unavailable Supabase, or another environment issue, report the exact blocker and the command that should be run later.

## Do Not

- Do not commit secrets or replace `.env.example` placeholders with real values.
- Do not create alternate frontend lockfiles.
- Do not use global Python tooling when `backend/.venv` is available.
- Do not index draft/private content.
- Do not weaken CORS, validation, AI guardrails, or credential boundaries for convenience.
- Do not change public contact details, assistant name, domain, or local ports unless the user explicitly asks.
- Do not rewrite the spec documents as part of normal implementation; update focused docs only when behavior or architecture changes.
