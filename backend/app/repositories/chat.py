from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import ChatFeedback


class ChatRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_feedback(self, feedback: dict[str, Any]) -> dict[str, str]:
        chat_feedback = ChatFeedback(**feedback)
        self.session.add(chat_feedback)
        await self.session.commit()
        await self.session.refresh(chat_feedback)
        return {"id": str(chat_feedback.id)}
