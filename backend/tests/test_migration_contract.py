from pathlib import Path


def test_initial_migration_contains_required_tables_and_vector_index() -> None:
    migration_path = next(
        (Path(__file__).resolve().parents[1] / "alembic" / "versions").glob(
            "*_initial_schema.py"
        )
    )
    migration = migration_path.read_text(encoding="utf-8")

    assert "CREATE EXTENSION IF NOT EXISTS vector" in migration
    assert "portfolio_documents" in migration
    assert "embedding extensions.vector(768)" in migration
    assert "USING hnsw (embedding extensions.vector_cosine_ops)" in migration
    assert "chat_sessions" in migration
    assert "chat_messages" in migration
    assert "chat_feedback" in migration
    assert "contact_submissions" in migration
    assert "ai_rate_limit_counters" in migration
    assert "visitor_identifier" in migration
    assert "raw_ip" not in migration.lower()
