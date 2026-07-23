import json
from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.gemini_chat import (
    DisabledChatClient,
    GeminiChatService,
    GoogleGenAIChatClient,
)
from app.ai.gemini_embeddings import GeminiEmbeddingService, GoogleGenAIEmbeddingClient
from app.chat.budget import BudgetService
from app.chat.limits import ChatLimitService, LimitDecision
from app.chat.orchestrator import ChatOrchestrator
from app.core.config import get_settings
from app.database.session import get_db_session
from app.models.chat import ChatRequest
from app.repositories.chat import ChatRepository
from app.repositories.documents import DocumentRepository
from app.repositories.rate_limits import RateLimitRepository
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


def get_limit_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> ChatLimitService:
    settings = get_settings()
    chat_repository = ChatRepository(session)
    return ChatLimitService(
        rate_repository=RateLimitRepository(session),
        chat_repository=chat_repository,
        hmac_secret=settings.rate_limit_hmac_secret,
        requests_per_minute_per_visitor=settings.chat_requests_per_minute_per_visitor,
        requests_per_hour_per_session=settings.chat_requests_per_hour_per_session,
        maximum_conversation_messages=settings.chat_maximum_conversation_messages,
    )


def get_budget_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> BudgetService:
    settings = get_settings()
    return BudgetService(
        rate_repository=RateLimitRepository(session),
        daily_request_limit=settings.ai_chat_daily_request_limit,
        enabled=settings.ai_chat_enabled,
    )


@router.post("")
async def chat(
    request: Request,
    payload: ChatRequest,
    orchestrator: Annotated[ChatOrchestrator, Depends(get_chat_orchestrator)],
    limit_service: Annotated[ChatLimitService, Depends(get_limit_service)],
    budget_service: Annotated[BudgetService, Depends(get_budget_service)],
) -> StreamingResponse:
    client_ip = request.client.host if request.client else "unknown"
    limit_decision = await limit_service.check(client_ip=client_ip, session_id=payload.session_id)
    if not limit_decision.allowed:
        return _unavailable_stream(limit_decision.reason or "rate_limited", _message_for_limit(limit_decision))

    budget_decision = await budget_service.check()
    if not budget_decision.allowed:
        return _unavailable_stream(
            budget_decision.reason or "budget_unavailable",
            "Tirtayasa AI is temporarily unavailable due to usage limits. You can still browse the portfolio or contact Abdul directly.",
        )

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


def _message_for_limit(decision: LimitDecision) -> str:
    if decision.reason == "conversation_limit":
        return "This chat session reached its conversation limit. Start a new session or contact Abdul directly."
    return "Tirtayasa AI is receiving too many requests right now. Please try again later."


def _unavailable_stream(code: str, message: str) -> StreamingResponse:
    async def event_stream() -> AsyncIterator[str]:
        yield "event: error\n"
        yield f"data: {json.dumps({'type': 'error', 'code': code, 'message': message})}\n\n"
        yield "event: done\n"
        yield f"data: {json.dumps({'type': 'done', 'session_id': None})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
