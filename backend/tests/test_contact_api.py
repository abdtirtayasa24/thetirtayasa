from typing import Any

from fastapi.testclient import TestClient

from app.api.contact import get_contact_repository
from app.main import app


class FakeContactRepository:
    def __init__(self) -> None:
        self.created: list[dict[str, Any]] = []

    async def create(self, submission: dict[str, Any]) -> dict[str, Any]:
        self.created.append(submission)
        return {"id": "00000000-0000-0000-0000-000000000001", **submission}


def test_contact_submission_validates_and_persists_without_logging_payload() -> None:
    repository = FakeContactRepository()
    app.dependency_overrides[get_contact_repository] = lambda: repository
    client = TestClient(app)

    response = client.post(
        "/v1/contact",
        json={
            "name": "Jane Founder",
            "email": "jane@example.com",
            "message": "I want to discuss analytics automation.",
            "engagement_type": "consulting",
        },
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201
    assert response.json() == {
        "id": "00000000-0000-0000-0000-000000000001",
        "status": "received",
    }
    assert repository.created == [
        {
            "name": "Jane Founder",
            "email": "jane@example.com",
            "message": "I want to discuss analytics automation.",
            "engagement_type": "consulting",
        }
    ]


def test_contact_submission_rejects_invalid_email() -> None:
    client = TestClient(app)

    response = client.post(
        "/v1/contact",
        json={"name": "Jane", "email": "not-email", "message": "Hello there"},
    )

    assert response.status_code == 422
