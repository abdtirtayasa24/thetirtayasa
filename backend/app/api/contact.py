from typing import Annotated, Protocol

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.models.contact import ContactSubmissionCreate, ContactSubmissionResponse
from app.repositories.contact import ContactRepository

router = APIRouter(prefix="/v1/contact", tags=["contact"])


class ContactRepositoryProtocol(Protocol):
    async def create(self, submission: dict[str, object]) -> dict[str, object]: ...


def get_contact_repository(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> ContactRepository:
    return ContactRepository(session)


@router.post(
    "",
    response_model=ContactSubmissionResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_contact_submission(
    payload: ContactSubmissionCreate,
    repository: Annotated[ContactRepositoryProtocol, Depends(get_contact_repository)],
) -> ContactSubmissionResponse:
    created = await repository.create(payload.model_dump())
    return ContactSubmissionResponse(id=str(created["id"]))
