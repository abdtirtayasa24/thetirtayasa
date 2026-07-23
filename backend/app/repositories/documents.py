from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.base import PortfolioDocument
from app.ingestion.chunker import IngestionChunk


class DocumentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def existing_hashes(self) -> set[str]:
        result = await self.session.execute(select(PortfolioDocument.content_hash))
        return set(result.scalars().all())

    async def upsert_chunk(self, chunk: IngestionChunk, embedding: list[float]) -> None:
        document = PortfolioDocument(
            source_type=chunk.source_type,
            source_id=chunk.source_id,
            source_slug=chunk.source_slug,
            title=chunk.title,
            section=chunk.section,
            content=chunk.content,
            source_url=chunk.source_url,
            visibility=chunk.visibility,
            document_metadata=chunk.metadata,
            embedding=embedding,
            content_hash=chunk.content_hash,
        )
        self.session.add(document)

    async def remove_deleted_sources(self, active_source_ids: set[str]) -> int:
        if not active_source_ids:
            return 0
        result = await self.session.execute(
            delete(PortfolioDocument).where(PortfolioDocument.source_id.not_in(active_source_ids))
        )
        return result.rowcount or 0

    async def semantic_candidates(self, limit: int = 12) -> list[dict[str, Any]]:
        result = await self.session.execute(select(PortfolioDocument).limit(limit))
        return [
            {
                "document_id": str(document.id),
                "content": document.content,
                "semantic_similarity": 0.0,
                "source_slug": document.source_slug,
                "metadata": document.document_metadata,
                "title": document.title,
                "section": document.section,
                "source_url": document.source_url,
            }
            for document in result.scalars().all()
        ]
