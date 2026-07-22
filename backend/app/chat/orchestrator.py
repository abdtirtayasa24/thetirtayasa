from collections.abc import AsyncIterator

from app.chat.persistence import normalize_session_id
from app.chat.policy import classify_message


class ChatOrchestrator:
    async def stream_answer(
        self,
        message: str,
        session_id: str | None,
        current_project: str | None,
    ) -> AsyncIterator[dict[str, object]]:
        decision = classify_message(message)
        normalized_session_id = normalize_session_id(session_id)

        if decision.action in {"refuse", "compensation_redirect", "brief_safe_answer"}:
            yield {"type": "token", "content": decision.message}
            yield {"type": "done", "session_id": normalized_session_id}
            return

        answer = (
            "Abdul F. Tirtayasa is a Data Analyst & AI Enabler who delivers data analytics, "
            "automation, and AI solutions for business needs. Verified project-specific details "
            "will be available after public case studies are published."
        )
        yield {"type": "token", "content": answer}
        yield {
            "type": "sources",
            "sources": [
                {"title": "About", "url": "/about", "section": "Professional background"},
                {"title": "Experience", "url": "/experience", "section": "Current role"},
            ],
        }
        yield {"type": "done", "session_id": normalized_session_id}
