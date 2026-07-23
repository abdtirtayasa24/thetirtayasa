import asyncio
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from app.chat.limits import ChatLimitService
from app.security.ip_identity import visitor_identifier_for_ip


class FakeRateLimitRepository:
    def __init__(self) -> None:
        self.calls: list[tuple[str, str, int, int]] = []
        self.allowed = True

    async def increment_and_check(
        self,
        *,
        identifier: str,
        scope: str,
        limit: int,
        window_seconds: int,
        now: datetime | None = None,
    ) -> bool:
        self.calls.append((identifier, scope, limit, window_seconds))
        return self.allowed


class FakeChatRepository:
    def __init__(self, count: int) -> None:
        self.count = count

    async def count_session_messages(self, session_id: str) -> int:
        return self.count


def test_visitor_identifier_is_deterministic_without_exposing_raw_ip() -> None:
    now = datetime(2026, 7, 23, tzinfo=UTC)

    first = visitor_identifier_for_ip("203.0.113.10", "secret", now=now)
    second = visitor_identifier_for_ip("203.0.113.10", "secret", now=now + timedelta(hours=1))
    next_day = visitor_identifier_for_ip("203.0.113.10", "secret", now=now + timedelta(days=1))

    assert first == second
    assert first != next_day
    assert "203.0.113.10" not in first
    assert len(first) == 64


def test_chat_limit_service_enforces_visitor_and_session_scopes() -> None:
    rate_repository = FakeRateLimitRepository()
    service = ChatLimitService(
        rate_repository=rate_repository,
        chat_repository=FakeChatRepository(count=3),
        hmac_secret="secret",  # noqa: S106
        requests_per_minute_per_visitor=10,
        requests_per_hour_per_session=50,
        maximum_conversation_messages=20,
    )

    decision = asyncio.run(
        service.check(
            client_ip="203.0.113.10",
            session_id=str(uuid4()),
            now=datetime(2026, 7, 23, tzinfo=UTC),
        )
    )

    assert decision.allowed is True
    assert [call[1] for call in rate_repository.calls] == ["visitor:minute", "session:hour"]


def test_chat_limit_service_blocks_when_conversation_message_limit_is_reached() -> None:
    service = ChatLimitService(
        rate_repository=FakeRateLimitRepository(),
        chat_repository=FakeChatRepository(count=20),
        hmac_secret="secret",  # noqa: S106
        requests_per_minute_per_visitor=10,
        requests_per_hour_per_session=50,
        maximum_conversation_messages=20,
    )

    decision = asyncio.run(service.check(client_ip="203.0.113.10", session_id=str(uuid4())))

    assert decision.allowed is False
    assert decision.reason == "conversation_limit"
