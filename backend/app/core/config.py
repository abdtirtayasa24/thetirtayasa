from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Data Analyst & AI Enabler Portfolio API"
    app_env: str = "local"
    backend_cors_origins: str = "http://127.0.0.1:3030,http://localhost:3030,https://thetirtayasa.my.id"
    database_url: str = "postgresql+asyncpg://portfolio_user:replace-with-password@localhost:5432/portfolio"
    gemini_api_key: str = ""
    gemini_chat_model: str = ""
    gemini_embedding_model: str = ""
    gemini_embedding_dimensions: int = 768
    ingestion_secret: str = ""
    rate_limit_hmac_secret: str = ""
    chat_requests_per_minute_per_visitor: int = Field(default=10, ge=1)
    chat_requests_per_hour_per_session: int = Field(default=50, ge=1)
    chat_maximum_message_characters: int = Field(default=2000, ge=1)
    chat_maximum_conversation_messages: int = Field(default=20, ge=1)
    maximum_context_chunks: int = Field(default=5, ge=1)

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
