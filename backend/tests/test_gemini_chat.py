import asyncio

from app.ai.gemini_chat import GeminiChatService


class FakeChatClient:
    def __init__(self) -> None:
        self.request: dict[str, object] | None = None

    def generate_content(self, *, model: str, contents: str, config: dict[str, object]) -> object:
        self.request = {"model": model, "contents": contents, "config": config}
        return type("GenerateResponse", (), {"text": "Generated Gemini response"})()


def test_gemini_chat_service_uses_system_prompt_and_context() -> None:
    client = FakeChatClient()
    service = GeminiChatService(client=client, model="gemini-test-model")

    answer = asyncio.run(
        service.generate_grounded_answer(
            message="What does Abdul build?",
            context="Source: Abdul builds analytics automation.",
        )
    )

    assert answer == "Generated Gemini response"
    assert client.request is not None
    assert client.request["model"] == "gemini-test-model"
    assert "You are Tirtayasa AI" in str(client.request["contents"])
    assert "Source: Abdul builds analytics automation" in str(client.request["contents"])
    assert "What does Abdul build?" in str(client.request["contents"])
