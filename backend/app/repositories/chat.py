from sqlalchemy.ext.asyncio import AsyncSession


class ChatRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
