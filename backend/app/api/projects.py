from fastapi import APIRouter, HTTPException, status

from app.content.loader import (
    LoadedProject,
    get_public_project_by_slug,
    load_public_projects,
)
from app.models.projects import ProjectResponse

router = APIRouter(prefix="/v1/projects", tags=["projects"])


@router.get("", response_model=list[ProjectResponse])
async def list_projects() -> list[ProjectResponse]:
    return [_to_project_response(project, include_body=False) for project in load_public_projects()]


@router.get("/{slug}", response_model=ProjectResponse)
async def get_project(slug: str) -> ProjectResponse:
    project = get_public_project_by_slug(slug)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return _to_project_response(project, include_body=True)


def _to_project_response(project: LoadedProject, include_body: bool) -> ProjectResponse:
    metadata = project.metadata
    return ProjectResponse(
        id=metadata.id,
        slug=metadata.slug,
        title=metadata.title,
        company=metadata.company,
        summary=metadata.summary,
        featured=metadata.featured,
        status=metadata.status,
        visibility=metadata.visibility,
        year=metadata.year,
        categories=metadata.categories,
        technologies=metadata.technologies,
        deployment=metadata.deployment,
        metrics=metadata.metrics,
        body=project.body if include_body else None,
    )
