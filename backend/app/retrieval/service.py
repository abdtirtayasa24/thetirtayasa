from app.ai.gemini_embeddings import GeminiEmbeddingService
from app.core.config import get_settings
from app.retrieval.ranking import RetrievalCandidate, rank_candidates
from app.retrieval.repository import RetrievalRepository


class RetrievalService:
    def __init__(self, repository: RetrievalRepository, embedding_service: GeminiEmbeddingService) -> None:
        self.repository = repository
        self.embedding_service = embedding_service

    async def retrieve(self, query: str, current_project: str | None = None) -> list[RetrievalCandidate]:
        query_embedding = self.embedding_service.embed_query(query)
        candidates = await self.repository.semantic_candidates(query_embedding, limit=12)
        return rank_candidates(
            candidates,
            query=query,
            current_project=current_project,
            limit=get_settings().maximum_context_chunks,
        )
