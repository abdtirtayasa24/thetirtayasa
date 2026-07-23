from datetime import UTC, datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import AiRateLimitCounter


class RateLimitRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def increment_and_check(
        self,
        *,
        identifier: str,
        scope: str,
        limit: int,
        window_seconds: int,
        now: datetime | None = None,
    ) -> bool:
        current_time = now or datetime.now(UTC)
        expires_at = current_time + timedelta(seconds=window_seconds)
        counter = await self.session.get(AiRateLimitCounter, {"visitor_identifier": identifier, "scope": scope})

        if counter is None or counter.expires_at <= current_time:
            if counter is None:
                counter = AiRateLimitCounter(
                    visitor_identifier=identifier,
                    scope=scope,
                    window_start=current_time,
                    expires_at=expires_at,
                    request_count=1,
                )
                self.session.add(counter)
            else:
                counter.window_start = current_time
                counter.expires_at = expires_at
                counter.request_count = 1
                counter.updated_at = current_time
            await self.session.commit()
            return True

        if counter.request_count >= limit:
            return False

        counter.request_count += 1
        counter.updated_at = current_time
        await self.session.commit()
        return True
