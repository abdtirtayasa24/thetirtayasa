from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.content.loader import load_project_file


@dataclass(frozen=True)
class IngestionDocument:
    source_type: str
    source_id: str
    slug: str
    title: str
    body: str
    source_url: str
    visibility: str
    metadata: dict[str, Any]


def load_public_ingestion_documents(projects_root: Path) -> list[IngestionDocument]:
    if not projects_root.exists():
        return []

    documents: list[IngestionDocument] = []
    for path in sorted(projects_root.glob("*.md")):
        project = load_project_file(path)
        if not project.is_public_published:
            continue

        metadata = project.metadata
        documents.append(
            IngestionDocument(
                source_type="project",
                source_id=metadata.id,
                slug=metadata.slug,
                title=metadata.title,
                body=project.body,
                source_url=f"/projects/{metadata.slug}",
                visibility=metadata.visibility,
                metadata={
                    "company": metadata.company.model_dump(),
                    "categories": metadata.categories,
                    "technologies": metadata.technologies,
                    "year": metadata.year,
                    "featured": metadata.featured,
                },
            )
        )

    return documents
