"""initial schema

Revision ID: 202607230001
Revises:
Create Date: 2026-07-23 00:01:00.000000
"""

from collections.abc import Sequence

from alembic import op

revision: str = "202607230001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions")
    op.execute(
        """
        CREATE TABLE public.portfolio_documents (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            source_type TEXT NOT NULL,
            source_id TEXT NOT NULL,
            source_slug TEXT,
            title TEXT NOT NULL,
            section TEXT,
            content TEXT NOT NULL,
            source_url TEXT,
            visibility TEXT NOT NULL DEFAULT 'public',
            metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
            embedding extensions.vector(768),
            content_hash CHAR(64) NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            CONSTRAINT portfolio_documents_visibility_check
                CHECK (visibility IN ('public', 'private')),
            CONSTRAINT portfolio_documents_source_hash_unique
                UNIQUE (source_id, content_hash)
        )
        """
    )
    op.execute(
        """
        CREATE INDEX portfolio_documents_embedding_hnsw_idx
        ON public.portfolio_documents
        USING hnsw (embedding extensions.vector_cosine_ops)
        """
    )
    op.execute(
        """
        CREATE TABLE public.chat_sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            anonymous_visitor_hash CHAR(64),
            current_project_slug TEXT,
            started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            expires_at TIMESTAMPTZ NOT NULL
        )
        """
    )
    op.execute(
        """
        CREATE TABLE public.chat_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            session_id UUID NOT NULL
                REFERENCES public.chat_sessions(id)
                ON DELETE CASCADE,
            role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
            content TEXT NOT NULL,
            referenced_document_ids UUID[],
            latency_ms INTEGER,
            token_count INTEGER,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        """
        CREATE TABLE public.chat_feedback (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            message_id UUID NOT NULL
                REFERENCES public.chat_messages(id)
                ON DELETE CASCADE,
            rating SMALLINT NOT NULL CHECK (rating IN (-1, 1)),
            reason TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        """
        CREATE TABLE public.contact_submissions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            engagement_type TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute(
        """
        CREATE TABLE public.ai_rate_limit_counters (
            visitor_identifier CHAR(64) NOT NULL,
            scope TEXT NOT NULL,
            window_start TIMESTAMPTZ NOT NULL,
            expires_at TIMESTAMPTZ NOT NULL,
            request_count INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            PRIMARY KEY (visitor_identifier, scope)
        )
        """
    )
    op.execute(
        """
        CREATE INDEX ai_rate_limit_counters_expires_at_idx
        ON public.ai_rate_limit_counters (expires_at)
        """
    )
    op.execute("ALTER TABLE public.portfolio_documents ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY")
    op.execute("ALTER TABLE public.ai_rate_limit_counters ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS public.ai_rate_limit_counters")
    op.execute("DROP TABLE IF EXISTS public.contact_submissions")
    op.execute("DROP TABLE IF EXISTS public.chat_feedback")
    op.execute("DROP TABLE IF EXISTS public.chat_messages")
    op.execute("DROP TABLE IF EXISTS public.chat_sessions")
    op.execute("DROP TABLE IF EXISTS public.portfolio_documents")
