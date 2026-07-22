from app.ai.gemini_embeddings import GeminiEmbeddingService


class FakeEmbeddingClient:
    def __init__(self) -> None:
        self.calls: list[dict[str, object]] = []

    def embed_content(self, *, model: str, contents: str, config: dict[str, object]) -> object:
        self.calls.append({"model": model, "contents": contents, "config": config})
        return type("EmbeddingResponse", (), {"embeddings": [type("Embedding", (), {"values": [0.1, 0.2]})()]})()


def test_document_embeddings_use_retrieval_document_task_type() -> None:
    client = FakeEmbeddingClient()
    service = GeminiEmbeddingService(client=client, model="embedding-model", dimensions=768)

    embedding = service.embed_document("portfolio content")

    assert embedding == [0.1, 0.2]
    assert client.calls[0]["config"] == {
        "task_type": "RETRIEVAL_DOCUMENT",
        "output_dimensionality": 768,
    }


def test_query_embeddings_use_retrieval_query_task_type() -> None:
    client = FakeEmbeddingClient()
    service = GeminiEmbeddingService(client=client, model="embedding-model", dimensions=768)

    service.embed_query("Which projects use SQL?")

    assert client.calls[0]["config"]["task_type"] == "RETRIEVAL_QUERY"
