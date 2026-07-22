from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.gemini_embeddings import GeminiEmbeddingService, GoogleGenAIEmbeddingClient
from app.core.config import get_settings
from app.database.session import get_db_session
from app.ingestion.service import IngestionService
from app.repositories.documents import DocumentRepository

router = APIRouter(prefix="/internal/ingestion", tags=["internal-ingestion"])


class DisabledEmbeddingClient:
    def embed_content(self, *, model: str, contents: str, config: dict[str, object]) -> object:
        return type("EmbeddingResponse", (), {"embeddings": [type("Embedding", (), {"values": [0.0] * 768})()]})()


def get_ingestion_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> IngestionService:
    settings = get_settings()
    embedding_client = (
        GoogleGenAIEmbeddingClient(api_key=settings.gemini_api_key)
        if settings.gemini_api_key
        else DisabledEmbeddingClient()
    )
    return IngestionService(
        document_repository=DocumentRepository(session),
        embedding_service=GeminiEmbeddingService(
            client=embedding_client,
            model=settings.gemini_embedding_model or "disabled",
            dimensions=settings.gemini_embedding_dimensions,
        ),
    )


@router.post("/sync")
async def sync_ingestion(
    ingestion_secret: Annotated[str | None, Header(alias="x-ingestion-secret")] = None,
    service: Annotated[IngestionService, Depends(get_ingestion_service)] = None,
) -> dict[str, int]:
    if ingestion_secret != get_settings().ingestion_secret:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return await service.sync()
