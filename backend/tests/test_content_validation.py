from pathlib import Path

import pytest
from pydantic import ValidationError

from app.content.loader import load_project_file
from app.content.schemas import (
    AvailabilityContent,
    CompanyDisclosure,
    ExperienceContent,
    ProfileContent,
    ProjectFrontMatter,
    SkillsContent,
)


def test_profile_skills_experience_and_availability_schemas_accept_placeholder_content() -> None:
    profile = ProfileContent(
        name="Abdul F. Tirtayasa",
        headline="Data Analyst & AI Enabler",
        location="Indonesia",
        summary="Provides data analytics, automation, and AI solutions for business needs.",
        contact={"email": "abdtirtayasa24@gmail.com"},
        assistant={"display_name": "Tirtayasa AI"},
    )
    skills = SkillsContent(groups=[{"name": "Data", "skills": ["Python", "PostgreSQL"]}])
    experience = ExperienceContent(items=[])
    availability = AvailabilityContent(status="available_for_discussion", message="Contact Abdul.")

    assert profile.name == "Abdul F. Tirtayasa"
    assert skills.groups[0].skills == ["Python", "PostgreSQL"]
    assert experience.items == []
    assert availability.status == "available_for_discussion"


def test_project_front_matter_accepts_public_project_metadata() -> None:
    project = ProjectFrontMatter(
        id="document-processing-agent",
        slug="document-processing-agent",
        title="Document Processing AI Agent",
        company=CompanyDisclosure(name="Example Company", disclose_name=True),
        summary="Extracts, validates, and routes internal business documents.",
        featured=True,
        status="published",
        visibility="public",
        year=2026,
        categories=["AI Agent", "Data Automation"],
        technologies=["Python", "FastAPI", "PostgreSQL"],
        deployment=["GCP", "On-premise"],
        metrics=["Hourly lead anomaly detection", "Daily funnel-health reporting"],
    )

    assert project.slug == "document-processing-agent"
    assert project.featured is True
    assert project.metrics[0].label == "Hourly lead anomaly detection"
    assert project.metrics[0].value == ""


def test_project_front_matter_rejects_missing_required_fields() -> None:
    with pytest.raises(ValidationError):
        ProjectFrontMatter(
            id="missing-title",
            slug="missing-title",
            summary="This should be invalid because title is required.",
            year=2026,
            categories=["AI Agent"],
            technologies=["Python"],
        )


def test_all_repository_projects_validate() -> None:
    content_root = Path(__file__).resolve().parents[2] / "content" / "projects"

    projects = [load_project_file(path) for path in sorted(content_root.glob("*.md"))]

    assert len(projects) >= 3
    assert all(project.metadata.slug for project in projects)
    assert all(project.metadata.title for project in projects)
    assert all(project.metadata.metrics for project in projects)


def test_project_loader_reads_markdown_front_matter(tmp_path: Path) -> None:
    project_file = tmp_path / "project.md"
    project_file.write_text(
        "---\n"
        "id: placeholder-project\n"
        "slug: placeholder-project\n"
        "title: Placeholder Project\n"
        "summary: A safe placeholder that makes no production claims.\n"
        "featured: false\n"
        "status: draft\n"
        "visibility: public\n"
        "year: 2026\n"
        "categories:\n"
        "  - AI Agent\n"
        "technologies:\n"
        "  - Python\n"
        "deployment: []\n"
        "---\n"
        "\n"
        "## Problem\n"
        "Placeholder problem statement.\n",
        encoding="utf-8",
    )

    loaded = load_project_file(project_file)

    assert loaded.metadata.slug == "placeholder-project"
    assert loaded.body.startswith("## Problem")
