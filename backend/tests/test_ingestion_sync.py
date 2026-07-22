from fastapi.testclient import TestClient

from app.api.ingestion import get_ingestion_service
from app.core.config import get_settings
from app.main import app


class FakeIngestionService:
    async def sync(self) -> dict[str, int]:
        return {"indexed": 2, "skipped": 1, "deleted": 0}


def test_ingestion_sync_requires_internal_secret() -> None:
    client = TestClient(app)

    response = client.post("/internal/ingestion/sync")

    assert response.status_code == 401


def test_ingestion_sync_runs_when_secret_matches(monkeypatch) -> None:  # noqa: ANN001
    monkeypatch.setenv("INGESTION_SECRET", "test-ingestion-secret")
    get_settings.cache_clear()
    app.dependency_overrides[get_ingestion_service] = lambda: FakeIngestionService()
    client = TestClient(app)

    response = client.post(
        "/internal/ingestion/sync",
        headers={"x-ingestion-secret": "test-ingestion-secret"},
    )

    app.dependency_overrides.clear()
    get_settings.cache_clear()

    assert response.status_code == 200
    assert response.json() == {"indexed": 2, "skipped": 1, "deleted": 0}
