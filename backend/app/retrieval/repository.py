from app.repositories.documents import DocumentRepository
from app.retrieval.ranking import RetrievalCandidate


class RetrievalRepository:
    def __init__(self, document_repository: DocumentRepository) -> None:
        self.document_repository = document_repository

    async def semantic_candidates(self, query_embedding: list[float], limit: int = 12) -> list[RetrievalCandidate]:
        rows = await self.document_repository.semantic_candidates(limit=limit)
        return [RetrievalCandidate(**row) for row in rows]
