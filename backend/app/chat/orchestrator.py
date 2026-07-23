from collections.abc import AsyncIterator
from typing import Protocol

from app.ai.gemini_chat import FALLBACK_ANSWER
from app.chat.persistence import normalize_session_id, redact_for_storage
from app.chat.policy import classify_message
from app.core.config import get_settings
from app.retrieval.ranking import RetrievalCandidate


class RetrievalServiceProtocol(Protocol):
    async def retrieve(self, query: str, current_project: str | None = None) -> list[RetrievalCandidate]: ...


class ChatServiceProtocol(Protocol):
    async def generate_grounded_answer(self, message: str, context: str) -> str: ...


class ChatRepositoryProtocol(Protocol):
    async def ensure_session(self, session_id: str, current_project: str | None) -> str: ...

    async def create_message(
        self,
        *,
        session_id: str,
        role: str,
        content: str,
        referenced_document_ids: list[str] | None = None,
    ) -> str: ...


class ChatOrchestrator:
    def __init__(
        self,
        retrieval_service: RetrievalServiceProtocol | None = None,
        chat_service: ChatServiceProtocol | None = None,
        chat_repository: ChatRepositoryProtocol | None = None,
    ) -> None:
        self.retrieval_service = retrieval_service
        self.chat_service = chat_service
        self.chat_repository = chat_repository

    async def stream_answer(
        self,
        message: str,
        session_id: str | None,
        current_project: str | None,
    ) -> AsyncIterator[dict[str, object]]:
        decision = classify_message(message)
        normalized_session_id = normalize_session_id(session_id)
        persisted_session_id = await self._ensure_session(normalized_session_id, current_project)
        await self._persist_message(
            session_id=persisted_session_id,
            role="user",
            content=redact_for_storage(message),
        )

        if decision.action in {"refuse", "compensation_redirect", "brief_safe_answer"}:
            assistant_message_id = await self._persist_message(
                session_id=persisted_session_id,
                role="assistant",
                content=decision.message,
            )
            yield {"type": "token", "content": decision.message}
            yield {"type": "done", "session_id": persisted_session_id, "message_id": assistant_message_id}
            return

        candidates = await self._retrieve(message, current_project)
        context = self._format_context(candidates)
        answer = await self._generate_answer(message, context)
        source_events = self._format_sources(candidates)
        assistant_message_id = await self._persist_message(
            session_id=persisted_session_id,
            role="assistant",
            content=redact_for_storage(answer),
            referenced_document_ids=[candidate.document_id for candidate in candidates] or None,
        )

        yield {"type": "token", "content": answer}
        yield {"type": "sources", "sources": source_events}
        yield {"type": "done", "session_id": persisted_session_id, "message_id": assistant_message_id}

    async def _ensure_session(self, session_id: str, current_project: str | None) -> str:
        if self.chat_repository is None:
            return session_id
        return await self.chat_repository.ensure_session(session_id, current_project)

    async def _persist_message(
        self,
        *,
        session_id: str,
        role: str,
        content: str,
        referenced_document_ids: list[str] | None = None,
    ) -> str | None:
        if self.chat_repository is None:
            return None
        return await self.chat_repository.create_message(
            session_id=session_id,
            role=role,
            content=content,
            referenced_document_ids=referenced_document_ids,
        )

    async def _retrieve(self, message: str, current_project: str | None) -> list[RetrievalCandidate]:
        if self.retrieval_service is None:
            return []
        return await self.retrieval_service.retrieve(message, current_project=current_project)

    async def _generate_answer(self, message: str, context: str) -> str:
        if self.chat_service is None:
            return FALLBACK_ANSWER
        return await self.chat_service.generate_grounded_answer(message, context)

    def _format_context(self, candidates: list[RetrievalCandidate]) -> str:
        return "\n\n".join(
            (
                f"Source ID: {candidate.document_id}\n"
                f"Title: {candidate.title or candidate.metadata.get('title') or candidate.source_slug or 'Portfolio source'}\n"
                f"Section: {candidate.section or candidate.metadata.get('section') or 'General'}\n"
                f"URL: {candidate.source_url or candidate.metadata.get('source_url') or self._source_url(candidate)}\n"
                f"Content: {candidate.content}"
            )
            for candidate in candidates
        )

    def _format_sources(self, candidates: list[RetrievalCandidate]) -> list[dict[str, str]]:
        sources: list[dict[str, str]] = []
        seen: set[tuple[str, str]] = set()
        maximum_sources = get_settings().chat_maximum_source_cards
        for candidate in candidates:
            title = str(candidate.title or candidate.metadata.get("title") or candidate.source_slug or "Portfolio source")
            section = str(candidate.section or candidate.metadata.get("section") or "General")
            url = str(candidate.source_url or candidate.metadata.get("source_url") or self._source_url(candidate))
            key = (url, section)
            if key in seen:
                continue
            seen.add(key)
            sources.append(
                {
                    "document_id": candidate.document_id,
                    "title": title,
                    "url": url,
                    "section": section,
                }
            )
            if len(sources) >= maximum_sources:
                break
        return sources

    def _source_url(self, candidate: RetrievalCandidate) -> str:
        if candidate.source_slug:
            return f"/projects/{candidate.source_slug}"
        return "/about"
