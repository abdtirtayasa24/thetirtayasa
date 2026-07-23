from sqlalchemy import DateTime

from app.database.base import (
    AiRateLimitCounter,
    ChatFeedback,
    ChatMessage,
    ChatSession,
    ContactSubmission,
    PortfolioDocument,
)


def assert_timezone_aware_timestamp(model: type, column_name: str) -> None:
    column_type = model.__table__.c[column_name].type

    assert isinstance(column_type, DateTime)
    assert column_type.timezone is True


def test_sqlalchemy_timestamp_columns_match_timestamptz_migration() -> None:
    for model, column_names in [
        (PortfolioDocument, ["created_at", "updated_at"]),
        (ChatSession, ["started_at", "expires_at"]),
        (ChatMessage, ["created_at"]),
        (ChatFeedback, ["created_at"]),
        (ContactSubmission, ["created_at"]),
        (AiRateLimitCounter, ["window_start", "expires_at", "created_at", "updated_at"]),
    ]:
        for column_name in column_names:
            assert_timezone_aware_timestamp(model, column_name)
