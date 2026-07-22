from sqlalchemy.ext.asyncio import AsyncSession


class RateLimitRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
