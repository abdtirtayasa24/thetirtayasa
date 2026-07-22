from typing import Any

from fastapi.testclient import TestClient

from app.api.chat_feedback import get_chat_repository
from app.main import app


class FakeChatRepository:
    def __init__(self) -> None:
        self.feedback: list[dict[str, Any]] = []

    async def create_feedback(self, feedback: dict[str, Any]) -> dict[str, str]:
        self.feedback.append(feedback)
        return {"id": "feedback-1"}


def test_feedback_endpoint_stores_helpful_rating() -> None:
    repository = FakeChatRepository()
    app.dependency_overrides[get_chat_repository] = lambda: repository
    client = TestClient(app)

    response = client.post(
        "/v1/chat/feedback",
        json={"message_id": "00000000-0000-0000-0000-000000000001", "rating": 1, "reason": "Helpful"},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 201
    assert response.json() == {"id": "feedback-1", "status": "received"}
    assert repository.feedback[0]["rating"] == 1
