from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import ContactSubmission


class ContactRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, submission: dict[str, Any]) -> dict[str, Any]:
        contact_submission = ContactSubmission(**submission)
        self.session.add(contact_submission)
        await self.session.commit()
        await self.session.refresh(contact_submission)
        return {
            "id": str(contact_submission.id),
            "name": contact_submission.name,
            "email": contact_submission.email,
            "message": contact_submission.message,
            "engagement_type": contact_submission.engagement_type,
        }
