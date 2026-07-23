import uuid

from app.security.redaction import redact_sensitive_text


def normalize_session_id(session_id: str | None) -> str:
    try:
        return str(uuid.UUID(str(session_id)))
    except (TypeError, ValueError):
        return str(uuid.uuid4())


def redact_for_storage(content: str) -> str:
    return redact_sensitive_text(content)
