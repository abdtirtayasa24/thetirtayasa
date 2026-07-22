from unittest.mock import AsyncMock

from app.repositories.chat import ChatRepository
from app.repositories.contact import ContactRepository
from app.repositories.documents import DocumentRepository
from app.repositories.rate_limits import RateLimitRepository


def test_repository_classes_keep_async_session_boundary() -> None:
    session = AsyncMock()

    assert DocumentRepository(session).session is session
    assert ChatRepository(session).session is session
    assert ContactRepository(session).session is session
    assert RateLimitRepository(session).session is session
