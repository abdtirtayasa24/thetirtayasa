from typing import Protocol

from google import genai
from google.genai import types


class EmbeddingClientProtocol(Protocol):
    def embed_content(self, *, model: str, contents: str, config: dict[str, object]) -> object: ...


class GoogleGenAIEmbeddingClient:
    def __init__(self, api_key: str) -> None:
        self.client = genai.Client(api_key=api_key)

    def embed_content(self, *, model: str, contents: str, config: dict[str, object]) -> object:
        return self.client.models.embed_content(
            model=model,
            contents=contents,
            config=types.EmbedContentConfig(**config),
        )


class GeminiEmbeddingService:
    def __init__(self, client: EmbeddingClientProtocol, model: str, dimensions: int) -> None:
        self.client = client
        self.model = model
        self.dimensions = dimensions

    def embed_document(self, content: str) -> list[float]:
        return self._embed(content, task_type="RETRIEVAL_DOCUMENT")

    def embed_query(self, query: str) -> list[float]:
        return self._embed(query, task_type="RETRIEVAL_QUERY")

    def _embed(self, content: str, task_type: str) -> list[float]:
        response = self.client.embed_content(
            model=self.model,
            contents=content,
            config={"task_type": task_type, "output_dimensionality": self.dimensions},
        )
        return list(response.embeddings[0].values)  # type: ignore[attr-defined]
