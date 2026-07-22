from app.chat.persistence import normalize_session_id, redact_for_storage


def test_normalize_session_id_replaces_invalid_browser_session_ids() -> None:
    normalized = normalize_session_id("not-a-uuid")

    assert normalized != "not-a-uuid"
    assert len(normalized) == 36


def test_redact_for_storage_removes_sensitive_values() -> None:
    redacted = redact_for_storage(
        "Email me at jane@example.com or call +62 821 2117 2378 with token sk-test-secret"
    )

    assert "jane@example.com" not in redacted
    assert "821" not in redacted
    assert "sk-test-secret" not in redacted
    assert "[REDACTED_EMAIL]" in redacted
