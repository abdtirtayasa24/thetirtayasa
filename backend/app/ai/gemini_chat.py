import asyncio
from typing import Protocol

from google import genai
from google.genai import types

from app.prompts.system_prompt import GROUNDED_SYSTEM_PROMPT

FALLBACK_ANSWER = (
    "I do not have verified information about that topic. "
    "Please contact the portfolio owner directly for clarification."
)


class ChatClientProtocol(Protocol):
    def generate_content(self, *, model: str, contents: str, config: dict[str, object]) -> object: ...


class GoogleGenAIChatClient:
    def __init__(self, api_key: str) -> None:
        self.client = genai.Client(api_key=api_key)

    def generate_content(self, *, model: str, contents: str, config: dict[str, object]) -> object:
        return self.client.models.generate_content(
            model=model,
            contents=contents,
            config=types.GenerateContentConfig(**config),
        )


class DisabledChatClient:
    def generate_content(self, *, model: str, contents: str, config: dict[str, object]) -> object:
        return type("GenerateResponse", (), {"text": FALLBACK_ANSWER})()


class GeminiChatService:
    def __init__(self, client: ChatClientProtocol, model: str) -> None:
        self.client = client
        self.model = model

    async def generate_grounded_answer(self, message: str, context: str) -> str:
        contents = f"""{GROUNDED_SYSTEM_PROMPT}

## Retrieved Verified Portfolio Context

{context or "No retrieved portfolio context is available for this request."}

## Visitor Question

{message}
"""
        response = await asyncio.to_thread(
            self.client.generate_content,
            model=self.model or "disabled",
            contents=contents,
            config={"temperature": 0.2},
        )
        answer = str(getattr(response, "text", "")).strip()
        return answer or FALLBACK_ANSWER
