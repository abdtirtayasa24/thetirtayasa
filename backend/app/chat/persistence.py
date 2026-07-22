import re
import uuid

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+?\d[\d\s-]{7,}\d)")
TOKEN_RE = re.compile(r"\b(?:sk|pk|AIza)[A-Za-z0-9_-]+\b")


def normalize_session_id(session_id: str | None) -> str:
    try:
        return str(uuid.UUID(str(session_id)))
    except (TypeError, ValueError):
        return str(uuid.uuid4())


def redact_for_storage(content: str) -> str:
    redacted = EMAIL_RE.sub("[REDACTED_EMAIL]", content)
    redacted = PHONE_RE.sub("[REDACTED_PHONE]", redacted)
    return TOKEN_RE.sub("[REDACTED_TOKEN]", redacted)
