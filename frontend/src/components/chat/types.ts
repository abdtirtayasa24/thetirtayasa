import type { ChatSource } from "@/lib/chat-client";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  persistedMessageId?: string | null;
  status?: "sending" | "sent" | "error";
};
