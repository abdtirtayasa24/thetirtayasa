import asyncio

from app.chat.orchestrator import ChatOrchestrator
from app.retrieval.ranking import RetrievalCandidate


class FakeRetrievalService:
    async def retrieve(self, query: str, current_project: str | None = None) -> list[RetrievalCandidate]:
        return [
            RetrievalCandidate(
                document_id="7ef6f544-574b-497f-bb80-64069e46b823",
                content="Abdul builds Python automation and operational analytics workflows.",
                semantic_similarity=0.92,
                source_slug="automation-workflows",
                metadata={"title": "Automation Workflows", "section": "Impact", "source_url": "/projects/automation-workflows"},
            )
        ]


class FakeGeminiChatService:
    def __init__(self) -> None:
        self.context = ""

    async def generate_grounded_answer(self, message: str, context: str) -> str:
        self.context = context
        return "Gemini-grounded answer from retrieved context."


class FakeChatRepository:
    def __init__(self) -> None:
        self.messages: list[dict[str, object]] = []

    async def ensure_session(self, session_id: str, current_project: str | None) -> str:
        return session_id

    async def create_message(
        self,
        *,
        session_id: str,
        role: str,
        content: str,
        referenced_document_ids: list[str] | None = None,
    ) -> str:
        self.messages.append(
            {
                "session_id": session_id,
                "role": role,
                "content": content,
                "referenced_document_ids": referenced_document_ids,
            }
        )
        return "2af3316c-3936-4f0d-8832-4d17ed8c7aac"


def test_chat_orchestrator_uses_gemini_retrieval_and_persists_messages() -> None:
    chat_service = FakeGeminiChatService()
    chat_repository = FakeChatRepository()
    orchestrator = ChatOrchestrator(
        retrieval_service=FakeRetrievalService(),
        chat_service=chat_service,
        chat_repository=chat_repository,
    )

    async def collect_events() -> list[dict[str, object]]:
        return [
            event
            async for event in orchestrator.stream_answer(
                message="Email jane@example.com and tell me about Python automation",
                session_id="1d0b2d6a-4c4d-4f53-a5ee-2dd62508694c",
                current_project="automation-workflows",
            )
        ]

    events = asyncio.run(collect_events())

    assert events[0] == {"type": "token", "content": "Gemini-grounded answer from retrieved context."}
    assert events[1] == {
        "type": "sources",
        "sources": [
            {
                "document_id": "7ef6f544-574b-497f-bb80-64069e46b823",
                "title": "Automation Workflows",
                "url": "/projects/automation-workflows",
                "section": "Impact",
            }
        ],
    }
    assert events[2] == {
        "type": "done",
        "session_id": "1d0b2d6a-4c4d-4f53-a5ee-2dd62508694c",
        "message_id": "2af3316c-3936-4f0d-8832-4d17ed8c7aac",
    }
    assert "Python automation" in chat_service.context
    assert chat_repository.messages[0]["role"] == "user"
    assert "jane@example.com" not in str(chat_repository.messages[0]["content"])
    assert chat_repository.messages[1]["role"] == "assistant"
    assert chat_repository.messages[1]["referenced_document_ids"] == [
        "7ef6f544-574b-497f-bb80-64069e46b823"
    ]
