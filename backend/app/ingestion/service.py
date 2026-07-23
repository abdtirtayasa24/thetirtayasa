from pathlib import Path

from app.ai.gemini_embeddings import GeminiEmbeddingService
from app.content.loader import CONTENT_ROOT
from app.ingestion.chunker import chunk_documents
from app.ingestion.parser import load_public_ingestion_documents
from app.repositories.documents import DocumentRepository


class IngestionService:
    def __init__(
        self,
        document_repository: DocumentRepository,
        embedding_service: GeminiEmbeddingService,
        content_root: Path = CONTENT_ROOT,
    ) -> None:
        self.document_repository = document_repository
        self.embedding_service = embedding_service
        self.content_root = content_root

    async def sync(self) -> dict[str, int]:
        documents = load_public_ingestion_documents(self.content_root)
        chunks = chunk_documents(documents)
        existing_hashes = await self.document_repository.existing_hashes()
        indexed = 0
        skipped = 0

        for chunk in chunks:
            if chunk.content_hash in existing_hashes:
                skipped += 1
                continue
            embedding = self.embedding_service.embed_document(chunk.content)
            await self.document_repository.upsert_chunk(chunk, embedding)
            indexed += 1

        deleted = await self.document_repository.remove_deleted_sources(
            {document.source_id for document in documents}
        )
        await self.document_repository.session.commit()
        return {"indexed": indexed, "skipped": skipped, "deleted": deleted}
