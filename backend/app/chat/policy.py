from dataclasses import dataclass

COMPENSATION_RESPONSE = (
    "Compensation depends on the opportunity, responsibilities, and engagement model. "
    "Please use the contact form to discuss it directly."
)
REFUSAL_RESPONSE = "I can't help with that request. Please ask about Abdul's verified portfolio content."
BRIEF_SAFE_RESPONSE = "I can answer briefly, but my main purpose is Abdul's portfolio."


@dataclass(frozen=True)
class PolicyDecision:
    action: str
    message: str


def classify_message(message: str) -> PolicyDecision:
    normalized = message.lower()
    if any(term in normalized for term in ["salary", "compensation", "rate", "expected pay"]):
        return PolicyDecision("compensation_redirect", COMPENSATION_RESPONSE)
    if any(
        term in normalized
        for term in [
            "system prompt",
            "ignore previous",
            "reveal credentials",
            "show credentials",
            "api key",
            "secret",
            "delete database",
            "drop table",
            "write a python script",
            "generate code",
            "scrape a website",
        ]
    ):
        return PolicyDecision("refuse", REFUSAL_RESPONSE)
    if any(
        term in normalized
        for term in [
            "project",
            "skill",
            "experience",
            "availability",
            "contact",
            "python",
            "sql",
            "automation",
            "abdul",
        ]
    ):
        return PolicyDecision("answer", "")
    return PolicyDecision("brief_safe_answer", BRIEF_SAFE_RESPONSE)
