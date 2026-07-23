from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Protocol
from uuid import UUID

from app.security.ip_identity import visitor_identifier_for_ip


class RateLimitRepositoryProtocol(Protocol):
    async def increment_and_check(
        self,
        *,
        identifier: str,
        scope: str,
        limit: int,
        window_seconds: int,
        now: datetime | None = None,
    ) -> bool: ...


class ChatRepositoryProtocol(Protocol):
    async def count_session_messages(self, session_id: str) -> int: ...


@dataclass(frozen=True)
class LimitDecision:
    allowed: bool
    reason: str | None = None


class ChatLimitService:
    def __init__(
        self,
        *,
        rate_repository: RateLimitRepositoryProtocol,
        chat_repository: ChatRepositoryProtocol,
        hmac_secret: str,
        requests_per_minute_per_visitor: int,
        requests_per_hour_per_session: int,
        maximum_conversation_messages: int,
    ) -> None:
        self.rate_repository = rate_repository
        self.chat_repository = chat_repository
        self.hmac_secret = hmac_secret
        self.requests_per_minute_per_visitor = requests_per_minute_per_visitor
        self.requests_per_hour_per_session = requests_per_hour_per_session
        self.maximum_conversation_messages = maximum_conversation_messages

    async def check(
        self,
        *,
        client_ip: str,
        session_id: str | None,
        now: datetime | None = None,
    ) -> LimitDecision:
        current_time = now or datetime.now(UTC)
        visitor_identifier = visitor_identifier_for_ip(client_ip, self.hmac_secret, now=current_time)
        visitor_allowed = await self.rate_repository.increment_and_check(
            identifier=visitor_identifier,
            scope="visitor:minute",
            limit=self.requests_per_minute_per_visitor,
            window_seconds=60,
            now=current_time,
        )
        if not visitor_allowed:
            return LimitDecision(False, "visitor_rate_limit")

        if session_id:
            try:
                UUID(session_id)
            except ValueError:
                return LimitDecision(True)

            message_count = await self.chat_repository.count_session_messages(session_id)
            if message_count >= self.maximum_conversation_messages:
                return LimitDecision(False, "conversation_limit")

            session_allowed = await self.rate_repository.increment_and_check(
                identifier=session_id,
                scope="session:hour",
                limit=self.requests_per_hour_per_session,
                window_seconds=3600,
                now=current_time,
            )
            if not session_allowed:
                return LimitDecision(False, "session_rate_limit")

        return LimitDecision(True)
