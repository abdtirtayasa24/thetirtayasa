from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

from app.content.schemas import ProjectFrontMatter

CONTENT_ROOT = Path(__file__).resolve().parents[3] / "content"
PROJECTS_ROOT = CONTENT_ROOT / "projects"


@dataclass(frozen=True)
class LoadedProject:
    metadata: ProjectFrontMatter
    body: str

    @property
    def is_public_published(self) -> bool:
        return self.metadata.status == "published" and self.metadata.visibility == "public"


def load_project_file(path: Path) -> LoadedProject:
    front_matter, body = _split_front_matter(path.read_text(encoding="utf-8"))
    metadata = ProjectFrontMatter.model_validate(front_matter)
    return LoadedProject(metadata=metadata, body=body.strip())


def load_public_projects(projects_root: Path = PROJECTS_ROOT) -> list[LoadedProject]:
    if not projects_root.exists():
        return []

    projects = [load_project_file(path) for path in sorted(projects_root.glob("*.md"))]
    return sorted(
        (project for project in projects if project.is_public_published),
        key=lambda project: project.metadata.year,
        reverse=True,
    )


def get_public_project_by_slug(slug: str) -> LoadedProject | None:
    return next(
        (project for project in load_public_projects() if project.metadata.slug == slug),
        None,
    )


def _split_front_matter(markdown: str) -> tuple[dict[str, Any], str]:
    if not markdown.startswith("---\n"):
        raise ValueError("Markdown file must start with YAML front matter")

    _, remainder = markdown.split("---\n", 1)
    front_matter_text, body = remainder.split("---\n", 1)
    parsed = yaml.safe_load(front_matter_text) or {}

    if not isinstance(parsed, dict):
        raise ValueError("YAML front matter must be a mapping")

    return parsed, body
