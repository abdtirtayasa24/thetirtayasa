from fastapi.testclient import TestClient

from app.content.loader import load_public_projects
from app.main import app


def test_projects_list_returns_published_public_projects() -> None:
    client = TestClient(app)

    response = client.get("/v1/projects")

    assert response.status_code == 200
    projects = response.json()
    assert len(projects) == len(load_public_projects())
    assert all(project["status"] == "published" for project in projects)
    assert all(project["visibility"] == "public" for project in projects)
    assert all(isinstance(metric, dict) for project in projects for metric in project["metrics"])


def test_project_detail_returns_published_project_body() -> None:
    client = TestClient(app)
    public_project = load_public_projects()[0]

    response = client.get(f"/v1/projects/{public_project.metadata.slug}")

    assert response.status_code == 200
    assert response.json()["slug"] == public_project.metadata.slug
    assert response.json()["body"]


def test_project_detail_returns_404_for_missing_project() -> None:
    client = TestClient(app)

    response = client.get("/v1/projects/not-a-project")

    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"
