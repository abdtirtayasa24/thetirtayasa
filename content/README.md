# Portfolio Content

This directory is the source of truth for public portfolio pages and Tirtayasa AI retrieval context.

Rules:

- Keep public claims verifiable and safe to display.
- Use `status: draft` for incomplete project content.
- Use `status: archived` for public content that should no longer render or be indexed.
- Use `visibility: private` for content that must never render or be indexed.
- Do not include internal URLs, source code, customer data, secrets, tokens, credentials, or confidential infrastructure details.
- After changing public content, rerun backend ingestion so `portfolio_documents` matches the repository content.
