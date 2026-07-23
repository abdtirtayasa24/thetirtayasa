from app.security.redaction import redact_sensitive_text


def test_redaction_removes_email_phone_ip_tokens_secret_urls_and_account_ids() -> None:
    redacted = redact_sensitive_text(
        "Email jane@example.com, phone +62 821 2117 2378, IP 192.168.1.50, "
        "token sk-live-secret, key AIzaSySecret, secret URL https://example.com/callback?token=abc123, "
        "account acct_1234567890."
    )

    assert "jane@example.com" not in redacted
    assert "821" not in redacted
    assert "192.168.1.50" not in redacted
    assert "sk-live-secret" not in redacted
    assert "AIzaSySecret" not in redacted
    assert "token=abc123" not in redacted
    assert "acct_1234567890" not in redacted
    assert "[REDACTED_EMAIL]" in redacted
    assert "[REDACTED_PHONE]" in redacted
    assert "[REDACTED_IP]" in redacted
    assert "[REDACTED_TOKEN]" in redacted
    assert "[REDACTED_URL]" in redacted
    assert "[REDACTED_ACCOUNT]" in redacted
