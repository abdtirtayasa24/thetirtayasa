from app.retrieval.ranking import RetrievalCandidate, rank_candidates


def test_rank_candidates_applies_keyword_current_project_and_featured_boosts() -> None:
    candidates = [
        RetrievalCandidate(
            document_id="general",
            content="Python automation for reporting",
            semantic_similarity=0.80,
            source_slug="general-project",
            metadata={"featured": False, "keywords": ["python"]},
        ),
        RetrievalCandidate(
            document_id="current",
            content="SQL automation for sales analytics",
            semantic_similarity=0.75,
            source_slug="sales-automation",
            metadata={"featured": True, "keywords": ["sql", "automation"]},
        ),
    ]

    ranked = rank_candidates(
        candidates,
        query="SQL automation",
        current_project="sales-automation",
        limit=1,
        minimum_similarity=0.0,
    )

    assert ranked[0].document_id == "current"
    assert ranked[0].final_score > candidates[1].semantic_similarity


def test_rank_candidates_filters_below_similarity_threshold_before_boosting() -> None:
    candidates = [
        RetrievalCandidate(
            document_id="low-similarity-featured-project",
            content="analytics automation project",
            semantic_similarity=0.40,
            source_slug="featured-project",
            metadata={"featured": True, "keywords": ["analytics", "automation"]},
        ),
        RetrievalCandidate(
            document_id="relevant-profile",
            content="Abdul works on analytics and AI enablement",
            semantic_similarity=0.72,
            source_slug="profile",
            metadata={"featured": False},
        ),
    ]

    ranked = rank_candidates(
        candidates,
        query="analytics automation",
        current_project=None,
        limit=5,
        minimum_similarity=0.60,
    )

    assert [candidate.document_id for candidate in ranked] == ["relevant-profile"]
