from uuid import UUID

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: str | None = None
    current_project: str | None = None


class ChatFeedbackRequest(BaseModel):
    message_id: UUID
    rating: int = Field(ge=-1, le=1)
    reason: str | None = Field(default=None, max_length=500)


class ChatFeedbackResponse(BaseModel):
    id: str
    status: str = "received"
