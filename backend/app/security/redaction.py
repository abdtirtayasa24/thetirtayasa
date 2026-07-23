import re

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+?\d[\d\s().-]{7,}\d)")
IP_RE = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
TOKEN_RE = re.compile(r"\b(?:sk|pk|AIza)[A-Za-z0-9_-]+\b")
SECRET_URL_RE = re.compile(r"https?://\S*(?:token|key|secret|signature|code)=\S+", re.IGNORECASE)
ACCOUNT_RE = re.compile(r"\b(?:acct|account|customer|cust|user)_[A-Za-z0-9_-]+\b", re.IGNORECASE)


def redact_sensitive_text(content: str) -> str:
    redacted = SECRET_URL_RE.sub("[REDACTED_URL]", content)
    redacted = ACCOUNT_RE.sub("[REDACTED_ACCOUNT]", redacted)
    redacted = EMAIL_RE.sub("[REDACTED_EMAIL]", redacted)
    redacted = IP_RE.sub("[REDACTED_IP]", redacted)
    redacted = TOKEN_RE.sub("[REDACTED_TOKEN]", redacted)
    return PHONE_RE.sub("[REDACTED_PHONE]", redacted)
