from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

from app.content.schemas import ProjectFrontMatter


@dataclass(frozen=True)
class LoadedProject:
    metadata: ProjectFrontMatter
    body: str


def load_project_file(path: Path) -> LoadedProject:
    front_matter, body = _split_front_matter(path.read_text(encoding="utf-8"))
    metadata = ProjectFrontMatter.model_validate(front_matter)
    return LoadedProject(metadata=metadata, body=body.strip())


def _split_front_matter(markdown: str) -> tuple[dict[str, Any], str]:
    if not markdown.startswith("---\n"):
        raise ValueError("Markdown file must start with YAML front matter")

    _, remainder = markdown.split("---\n", 1)
    front_matter_text, body = remainder.split("---\n", 1)
    parsed = yaml.safe_load(front_matter_text) or {}

    if not isinstance(parsed, dict):
        raise ValueError("YAML front matter must be a mapping")

    return parsed, body
