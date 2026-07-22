from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.models.chat import ChatFeedbackRequest, ChatFeedbackResponse
from app.repositories.chat import ChatRepository

router = APIRouter(prefix="/v1/chat/feedback", tags=["chat-feedback"])


def get_chat_repository(session: Annotated[AsyncSession, Depends(get_db_session)]) -> ChatRepository:
    return ChatRepository(session)


@router.post("", response_model=ChatFeedbackResponse, status_code=status.HTTP_201_CREATED)
async def create_feedback(
    payload: ChatFeedbackRequest,
    repository: Annotated[ChatRepository, Depends(get_chat_repository)],
) -> ChatFeedbackResponse:
    created = await repository.create_feedback(payload.model_dump())
    return ChatFeedbackResponse(id=created["id"])
