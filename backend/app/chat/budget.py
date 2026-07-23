from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Protocol


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


@dataclass(frozen=True)
class BudgetDecision:
    allowed: bool
    reason: str | None = None


class BudgetService:
    def __init__(
        self,
        *,
        rate_repository: RateLimitRepositoryProtocol,
        daily_request_limit: int = 500,
        enabled: bool = True,
    ) -> None:
        self.rate_repository = rate_repository
        self.daily_request_limit = daily_request_limit
        self.enabled = enabled

    async def check(self, now: datetime | None = None) -> BudgetDecision:
        if not self.enabled or self.daily_request_limit <= 0:
            return BudgetDecision(False, "budget_disabled")

        current_time = now or datetime.now(UTC)
        allowed = await self.rate_repository.increment_and_check(
            identifier="global",
            scope=f"budget:daily:{current_time.date().isoformat()}",
            limit=self.daily_request_limit,
            window_seconds=86400,
            now=current_time,
        )
        if not allowed:
            return BudgetDecision(False, "budget_exhausted")
        return BudgetDecision(True)
