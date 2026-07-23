import asyncio
from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.api.chat import get_budget_service, get_chat_orchestrator, get_limit_service
from app.chat.budget import BudgetService
from app.chat.limits import LimitDecision
from app.main import app


class FakeRateLimitRepository:
    def __init__(self, allowed: bool) -> None:
        self.allowed = allowed

    async def increment_and_check(
        self,
        *,
        identifier: str,
        scope: str,
        limit: int,
        window_seconds: int,
        now: datetime | None = None,
    ) -> bool:
        return self.allowed


class AllowLimitService:
    async def check(self, *, client_ip: str, session_id: str | None, now: datetime | None = None) -> LimitDecision:
        return LimitDecision(True)


class FakeChatOrchestrator:
    async def stream_answer(self, message: str, session_id: str | None, current_project: str | None):
        yield {"type": "token", "content": "ok"}
        yield {"type": "done", "session_id": session_id or "new-session"}


def test_budget_service_defaults_to_500_daily_requests() -> None:
    service = BudgetService(rate_repository=FakeRateLimitRepository(allowed=True))

    assert service.daily_request_limit == 500


def test_budget_service_blocks_when_daily_limit_is_exhausted() -> None:
    service = BudgetService(rate_repository=FakeRateLimitRepository(allowed=False), daily_request_limit=500)

    decision = asyncio.run(service.check(now=datetime(2026, 7, 23, tzinfo=UTC)))

    assert decision.allowed is False
    assert decision.reason == "budget_exhausted"


def test_chat_endpoint_streams_machine_readable_budget_unavailable_event() -> None:
    app.dependency_overrides[get_limit_service] = lambda: AllowLimitService()
    app.dependency_overrides[get_budget_service] = lambda: BudgetService(
        rate_repository=FakeRateLimitRepository(allowed=False), daily_request_limit=500
    )
    app.dependency_overrides[get_chat_orchestrator] = lambda: FakeChatOrchestrator()
    client = TestClient(app)

    response = client.post("/v1/chat", json={"message": "Tell me about Abdul"})

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert "event: error" in response.text
    assert '"code": "budget_exhausted"' in response.text
    assert "event: done" in response.text
