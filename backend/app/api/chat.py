import json
from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.gemini_chat import (
    DisabledChatClient,
    GeminiChatService,
    GoogleGenAIChatClient,
)
from app.ai.gemini_embeddings import GeminiEmbeddingService, GoogleGenAIEmbeddingClient
from app.chat.orchestrator import ChatOrchestrator
from app.core.config import get_settings
from app.database.session import get_db_session
from app.models.chat import ChatRequest
from app.repositories.chat import ChatRepository
from app.repositories.documents import DocumentRepository
from app.retrieval.repository import RetrievalRepository
from app.retrieval.service import RetrievalService

router = APIRouter(prefix="/v1/chat", tags=["chat"])


class DisabledEmbeddingClient:
    def embed_content(self, *, model: str, contents: str, config: dict[str, object]) -> object:
        return type("EmbeddingResponse", (), {"embeddings": [type("Embedding", (), {"values": [0.0] * 768})()]})()


def get_chat_orchestrator(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> ChatOrchestrator:
    settings = get_settings()
    embedding_client = (
        GoogleGenAIEmbeddingClient(api_key=settings.gemini_api_key)
        if settings.gemini_api_key and settings.gemini_embedding_model
        else DisabledEmbeddingClient()
    )
    chat_client = (
        GoogleGenAIChatClient(api_key=settings.gemini_api_key)
        if settings.gemini_api_key and settings.gemini_chat_model
        else DisabledChatClient()
    )
    document_repository = DocumentRepository(session)
    retrieval_service = RetrievalService(
        repository=RetrievalRepository(document_repository),
        embedding_service=GeminiEmbeddingService(
            client=embedding_client,
            model=settings.gemini_embedding_model or "disabled",
            dimensions=settings.gemini_embedding_dimensions,
        ),
    )
    return ChatOrchestrator(
        retrieval_service=retrieval_service,
        chat_service=GeminiChatService(client=chat_client, model=settings.gemini_chat_model or "disabled"),
        chat_repository=ChatRepository(session),
    )


@router.post("")
async def chat(
    payload: ChatRequest,
    orchestrator: Annotated[ChatOrchestrator, Depends(get_chat_orchestrator)],
) -> StreamingResponse:
    async def event_stream() -> AsyncIterator[str]:
        async for event in orchestrator.stream_answer(
            message=payload.message,
            session_id=payload.session_id,
            current_project=payload.current_project,
        ):
            event_type = str(event["type"])
            yield f"event: {event_type}\n"
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
