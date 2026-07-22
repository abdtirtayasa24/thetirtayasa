from fastapi.testclient import TestClient

from app.main import app


def test_projects_list_hides_draft_placeholders() -> None:
    client = TestClient(app)

    response = client.get("/v1/projects")

    assert response.status_code == 200
    assert response.json() == []


def test_project_detail_returns_404_for_draft_placeholder() -> None:
    client = TestClient(app)

    response = client.get("/v1/projects/project-01")

    assert response.status_code == 404
    assert response.json()["detail"] == "Project not found"
