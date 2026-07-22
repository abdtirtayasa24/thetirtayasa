from fastapi.testclient import TestClient

from app.main import app


def test_local_frontend_origin_is_allowed_for_contact_requests() -> None:
    client = TestClient(app)

    response = client.options(
        "/v1/contact",
        headers={
            "origin": "http://127.0.0.1:3030",
            "access-control-request-method": "POST",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:3030"
