# AI Evaluation Fixtures

These fixtures are intentionally small MVP evaluation cases for skills, projects, experience, availability, compensation, unsupported, and security behavior.

Default tests run without live Gemini credentials by exercising deterministic guardrail logic and mocked/stubbed services.

For a live credentialed evaluation later:

1. Configure backend environment variables, including `GEMINI_API_KEY`, `GEMINI_CHAT_MODEL`, `GEMINI_EMBEDDING_MODEL`, and database settings.
2. Ensure approved public portfolio content has been ingested.
3. Run the future live evaluation command from `backend/.venv` after the Gemini/RAG production path is fully enabled.
