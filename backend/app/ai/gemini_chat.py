class GeminiChatService:
    async def generate_grounded_answer(self, message: str, context: str) -> str:
        if not context:
            return "I do not have verified information about that topic. Please contact the portfolio owner directly for clarification."
        return context
