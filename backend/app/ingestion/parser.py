from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

from app.content.loader import load_project_file

EXCLUDED_TOP_LEVEL_FILES = {"README.md"}


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


def load_public_ingestion_documents(content_root: Path) -> list[IngestionDocument]:
    if not content_root.exists():
        return []

    documents = [*_load_top_level_content_documents(content_root), *_load_project_documents(content_root)]
    return sorted(documents, key=lambda document: (document.source_type, document.slug))


def _load_project_documents(content_root: Path) -> list[IngestionDocument]:
    project_paths = sorted((content_root / "projects").glob("*.md")) if (content_root / "projects").exists() else sorted(content_root.glob("*.md"))
    documents: list[IngestionDocument] = []

    for path in project_paths:
        if path.name in EXCLUDED_TOP_LEVEL_FILES:
            continue
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
                body=_project_body(metadata.model_dump(), project.body),
                source_url=f"/projects/{metadata.slug}",
                visibility=metadata.visibility,
                metadata={
                    "company": metadata.company.model_dump(),
                    "categories": metadata.categories,
                    "technologies": metadata.technologies,
                    "year": metadata.year,
                    "featured": metadata.featured,
                    "metrics": [metric.model_dump() for metric in metadata.metrics],
                },
            )
        )

    return documents


def _load_top_level_content_documents(content_root: Path) -> list[IngestionDocument]:
    if not (content_root / "projects").exists():
        return []

    documents: list[IngestionDocument] = []
    for path in sorted([*content_root.glob("*.yaml"), *content_root.glob("*.yml"), *content_root.glob("*.md")]):
        if path.name in EXCLUDED_TOP_LEVEL_FILES:
            continue
        document = _load_yaml_document(path) if path.suffix in {".yaml", ".yml"} else _load_markdown_document(path)
        if document is not None:
            documents.append(document)

    return documents


def _load_yaml_document(path: Path) -> IngestionDocument | None:
    parsed = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    if not isinstance(parsed, dict) or _is_not_public(parsed):
        return None

    source_type = path.stem
    return IngestionDocument(
        source_type=source_type,
        source_id=source_type,
        slug=source_type,
        title=_title_for_source(source_type, parsed),
        body=_yaml_body(source_type, parsed),
        source_url=_source_url_for_source(source_type),
        visibility=str(parsed.get("visibility", "public")),
        metadata={"content_file": path.name},
    )


def _load_markdown_document(path: Path) -> IngestionDocument | None:
    markdown = path.read_text(encoding="utf-8").strip()
    metadata: dict[str, Any] = {}
    body = markdown

    if markdown.startswith("---\n"):
        metadata, body = _split_front_matter(markdown)
        if _is_not_public(metadata):
            return None

    source_type = path.stem
    return IngestionDocument(
        source_type=source_type,
        source_id=source_type,
        slug=source_type,
        title=_title_for_source(source_type, metadata),
        body=body.strip(),
        source_url=_source_url_for_source(source_type),
        visibility=str(metadata.get("visibility", "public")),
        metadata={"content_file": path.name, **metadata},
    )


def _is_not_public(metadata: dict[str, Any]) -> bool:
    return metadata.get("visibility") == "private" or metadata.get("status") in {"draft", "archived"}


def _split_front_matter(markdown: str) -> tuple[dict[str, Any], str]:
    _, remainder = markdown.split("---\n", 1)
    front_matter_text, body = remainder.split("---\n", 1)
    parsed = yaml.safe_load(front_matter_text) or {}
    return parsed if isinstance(parsed, dict) else {}, body


def _title_for_source(source_type: str, metadata: dict[str, Any]) -> str:
    if isinstance(metadata.get("title"), str):
        return str(metadata["title"])
    if source_type == "profile" and isinstance(metadata.get("name"), str):
        return str(metadata["name"])
    return source_type.replace("_", " ").replace("-", " ").title()


def _source_url_for_source(source_type: str) -> str:
    return {
        "availability": "/contact",
        "experience": "/experience",
        "linkedin": "/experience",
        "profile": "/about",
        "resume": "/resume",
        "skills": "/about",
    }.get(source_type, f"/{source_type}")


def _yaml_body(source_type: str, data: dict[str, Any]) -> str:
    if source_type == "profile":
        return _profile_body(data)
    if source_type == "skills":
        return _skills_body(data)
    if source_type == "experience":
        return _experience_body(data)
    if source_type == "availability":
        return _availability_body(data)
    return f"## {source_type.replace('_', ' ').title()}\n\n{yaml.safe_dump(data, sort_keys=False, allow_unicode=True)}"


def _profile_body(data: dict[str, Any]) -> str:
    contact = data.get("contact") if isinstance(data.get("contact"), dict) else {}
    lines = [
        "## Profile",
        f"Name: {data.get('name', '')}",
        f"Headline: {data.get('headline', '')}",
        f"Location: {data.get('location', '')}",
        f"Summary: {data.get('summary', '')}",
        f"Email: {contact.get('email', '')}",
        f"LinkedIn: {contact.get('linkedin_url', '')}",
        f"GitHub: {contact.get('github_url', '')}",
    ]
    return "\n".join(line for line in lines if not line.endswith(": "))


def _skills_body(data: dict[str, Any]) -> str:
    sections = ["## Skills"]
    for group in data.get("groups", []):
        if not isinstance(group, dict):
            continue
        sections.append(f"\n### {group.get('name', 'Skill Group')}")
        for skill in group.get("skills", []):
            sections.append(f"- {skill}")
    return "\n".join(sections)


def _experience_body(data: dict[str, Any]) -> str:
    sections = ["## Experience"]
    for item in data.get("items", []):
        if not isinstance(item, dict):
            continue
        sections.append(f"\n### {item.get('title', 'Experience')}")
        if item.get("organization"):
            sections.append(f"Organization: {item['organization']}")
        date_range = " — ".join(str(value) for value in [item.get("start_date"), item.get("end_date")] if value)
        if date_range:
            sections.append(f"Dates: {date_range}")
        if item.get("summary"):
            sections.append(str(item["summary"]))
    return "\n".join(sections)


def _availability_body(data: dict[str, Any]) -> str:
    return f"## Availability\nStatus: {data.get('status', '')}\nMessage: {data.get('message', '')}"


def _project_body(metadata: dict[str, Any], body: str) -> str:
    metadata_lines = [
        "## Project Metadata",
        f"Title: {metadata.get('title', '')}",
        f"Summary: {metadata.get('summary', '')}",
        f"Year: {metadata.get('year', '')}",
        f"Categories: {', '.join(metadata.get('categories', []))}",
        f"Technologies: {', '.join(metadata.get('technologies', []))}",
        f"Deployment: {', '.join(metadata.get('deployment', []))}",
    ]
    metrics = metadata.get("metrics", [])
    if metrics:
        metadata_lines.append("Metrics:")
        for metric in metrics:
            if isinstance(metric, dict):
                value = f": {metric.get('value')}" if metric.get("value") else ""
                metadata_lines.append(f"- {metric.get('label', '')}{value}")
    metadata_body = "\n".join(metadata_lines)
    return f"{metadata_body}\n\n{body}"
