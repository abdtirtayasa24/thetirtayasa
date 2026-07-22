from dataclasses import dataclass
from typing import Any


@dataclass
class RetrievalCandidate:
    document_id: str
    content: str
    semantic_similarity: float
    source_slug: str | None
    metadata: dict[str, Any]
    final_score: float = 0.0


def rank_candidates(
    candidates: list[RetrievalCandidate],
    query: str,
    current_project: str | None,
    limit: int,
) -> list[RetrievalCandidate]:
    query_terms = {term.lower() for term in query.split()}
    ranked: list[RetrievalCandidate] = []

    for candidate in candidates:
        keywords = {str(keyword).lower() for keyword in candidate.metadata.get("keywords", [])}
        content_terms = {term.strip(".,:;!?()[]").lower() for term in candidate.content.split()}
        keyword_match = 1.0 if query_terms & (keywords | content_terms) else 0.0
        current_project_boost = 1.0 if current_project and candidate.source_slug == current_project else 0.0
        featured_boost = 1.0 if candidate.metadata.get("featured") else 0.0
        candidate.final_score = (
            candidate.semantic_similarity * 0.70
            + keyword_match * 0.15
            + current_project_boost * 0.10
            + featured_boost * 0.05
        )
        ranked.append(candidate)

    return sorted(ranked, key=lambda item: item.final_score, reverse=True)[:limit]
