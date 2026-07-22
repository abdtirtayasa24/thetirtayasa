from dataclasses import dataclass
from typing import Any

from app.ingestion.hash import content_hash
from app.ingestion.parser import IngestionDocument


@dataclass(frozen=True)
class IngestionChunk:
    source_type: str
    source_id: str
    source_slug: str
    title: str
    section: str
    content: str
    source_url: str
    visibility: str
    metadata: dict[str, Any]
    content_hash: str


def chunk_documents(
    documents: list[IngestionDocument],
    target_tokens: int = 450,
    overlap_tokens: int = 60,
    max_tokens: int = 700,
) -> list[IngestionChunk]:
    chunks: list[IngestionChunk] = []
    for document in documents:
        for section, content in _split_sections(document.body):
            for chunk_content in _chunk_text(content, target_tokens, overlap_tokens, max_tokens):
                chunks.append(
                    IngestionChunk(
                        source_type=document.source_type,
                        source_id=document.source_id,
                        source_slug=document.slug,
                        title=document.title,
                        section=section,
                        content=chunk_content,
                        source_url=document.source_url,
                        visibility=document.visibility,
                        metadata=document.metadata,
                        content_hash=content_hash(chunk_content),
                    )
                )
    return chunks


def _split_sections(markdown: str) -> list[tuple[str, str]]:
    sections: list[tuple[str, str]] = []
    current_heading = "Overview"
    current_lines: list[str] = []

    for line in markdown.splitlines():
        if line.startswith("## "):
            if current_lines:
                sections.append((current_heading, "\n".join(current_lines).strip()))
            current_heading = line.removeprefix("## ").strip()
            current_lines = []
            continue
        current_lines.append(line)

    if current_lines:
        sections.append((current_heading, "\n".join(current_lines).strip()))

    return [(heading, content) for heading, content in sections if content]


def _chunk_text(text: str, target_tokens: int, overlap_tokens: int, max_tokens: int) -> list[str]:
    words = text.split()
    if not words:
        return []

    chunk_size = min(target_tokens, max_tokens)
    step = max(1, chunk_size - overlap_tokens)
    chunks = []

    for start in range(0, len(words), step):
        chunk_words = words[start : start + chunk_size]
        if chunk_words:
            chunks.append(" ".join(chunk_words))
        if start + chunk_size >= len(words):
            break

    return chunks
