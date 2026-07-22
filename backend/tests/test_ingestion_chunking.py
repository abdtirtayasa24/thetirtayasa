from pathlib import Path

from app.ingestion.chunker import chunk_documents
from app.ingestion.hash import content_hash
from app.ingestion.parser import load_public_ingestion_documents


def write_project(path: Path, slug: str, status: str = "published", visibility: str = "public") -> None:
    path.write_text(
        "---\n"
        f"id: {slug}\n"
        f"slug: {slug}\n"
        f"title: {slug.title()}\n"
        "summary: Public automation project.\n"
        "featured: true\n"
        f"status: {status}\n"
        f"visibility: {visibility}\n"
        "year: 2026\n"
        "categories:\n  - Automation\n"
        "technologies:\n  - Python\n  - SQL\n"
        "deployment: []\n"
        "metrics: []\n"
        "---\n\n"
        "## Problem\nManual reporting.\n\n"
        "## Results\nFaster reporting.\n",
        encoding="utf-8",
    )


def test_load_public_ingestion_documents_ignores_drafts_and_private_content(tmp_path: Path) -> None:
    write_project(tmp_path / "published.md", "published")
    write_project(tmp_path / "draft.md", "draft", status="draft")
    write_project(tmp_path / "private.md", "private", visibility="private")

    documents = load_public_ingestion_documents(tmp_path)

    assert [document.slug for document in documents] == ["published"]
    assert documents[0].source_type == "project"
    assert documents[0].metadata["technologies"] == ["Python", "SQL"]


def test_chunk_documents_retains_metadata_and_stable_hash(tmp_path: Path) -> None:
    write_project(tmp_path / "published.md", "published")
    document = load_public_ingestion_documents(tmp_path)[0]

    chunks = chunk_documents([document], target_tokens=12, overlap_tokens=3, max_tokens=20)

    assert chunks
    assert chunks[0].source_slug == "published"
    assert chunks[0].title == "Published"
    assert chunks[0].visibility == "public"
    assert chunks[0].metadata["year"] == 2026
    assert chunks[0].content_hash == content_hash(chunks[0].content)
    assert content_hash(chunks[0].content) == content_hash(chunks[0].content)
