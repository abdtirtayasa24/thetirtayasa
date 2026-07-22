import json
from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.chat.orchestrator import ChatOrchestrator
from app.models.chat import ChatRequest

router = APIRouter(prefix="/v1/chat", tags=["chat"])


def get_chat_orchestrator() -> ChatOrchestrator:
    return ChatOrchestrator()


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
