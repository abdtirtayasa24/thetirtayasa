from fastapi.testclient import TestClient

from app.api.chat import get_chat_orchestrator
from app.main import app


class FakeChatOrchestrator:
    async def stream_answer(self, message: str, session_id: str | None, current_project: str | None):
        yield {"type": "token", "content": "He works with Python."}
        yield {
            "type": "sources",
            "sources": [
                {"title": "Experience", "url": "/experience", "section": "Skills"},
            ],
        }
        yield {"type": "done", "session_id": session_id or "new-session"}


def test_chat_endpoint_streams_answer_events() -> None:
    app.dependency_overrides[get_chat_orchestrator] = lambda: FakeChatOrchestrator()
    client = TestClient(app)

    response = client.post(
        "/v1/chat",
        json={"message": "Which projects use Python?", "session_id": None, "current_project": None},
    )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert "event: token" in response.text
    assert "He works with Python" in response.text
    assert "event: sources" in response.text
    assert "event: done" in response.text
