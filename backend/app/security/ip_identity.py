import hashlib
import hmac
from datetime import UTC, datetime


def visitor_identifier_for_ip(ip_address: str, hmac_secret: str, now: datetime | None = None) -> str:
    current_time = now or datetime.now(UTC)
    day_bucket = current_time.date().isoformat()
    secret = hmac_secret or "local-development-secret"
    message = f"{day_bucket}:{ip_address}".encode()
    return hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()
