import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import ChatFeedback, ChatMessage, ChatSession


class ChatRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def ensure_session(self, session_id: str, current_project: str | None) -> str:
        session_uuid = uuid.UUID(session_id)
        existing = await self.session.get(ChatSession, session_uuid)
        if existing:
            return str(existing.id)

        chat_session = ChatSession(
            id=session_uuid,
            current_project_slug=current_project,
            expires_at=datetime.now(UTC) + timedelta(days=90),
        )
        self.session.add(chat_session)
        await self.session.commit()
        return str(chat_session.id)

    async def create_message(
        self,
        *,
        session_id: str,
        role: str,
        content: str,
        referenced_document_ids: list[str] | None = None,
    ) -> str:
        chat_message = ChatMessage(
            session_id=uuid.UUID(session_id),
            role=role,
            content=content,
            referenced_document_ids=[uuid.UUID(document_id) for document_id in referenced_document_ids]
            if referenced_document_ids
            else None,
        )
        self.session.add(chat_message)
        await self.session.commit()
        await self.session.refresh(chat_message)
        return str(chat_message.id)

    async def create_feedback(self, feedback: dict[str, Any]) -> dict[str, str]:
        chat_feedback = ChatFeedback(**feedback)
        self.session.add(chat_feedback)
        await self.session.commit()
        await self.session.refresh(chat_feedback)
        return {"id": str(chat_feedback.id)}

    async def message_exists(self, message_id: uuid.UUID) -> bool:
        result = await self.session.execute(select(ChatMessage.id).where(ChatMessage.id == message_id))
        return result.scalar_one_or_none() is not None

    async def count_session_messages(self, session_id: str) -> int:
        result = await self.session.execute(
            select(func.count()).select_from(ChatMessage).where(ChatMessage.session_id == uuid.UUID(session_id))
        )
        return int(result.scalar_one())
