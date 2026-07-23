from fastapi.testclient import TestClient

from app.main import app, settings


def test_configured_frontend_origin_is_allowed_for_contact_requests() -> None:
    client = TestClient(app)
    allowed_origin = settings.cors_origins[0]

    response = client.options(
        "/v1/contact",
        headers={
            "origin": allowed_origin,
            "access-control-request-method": "POST",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == allowed_origin
