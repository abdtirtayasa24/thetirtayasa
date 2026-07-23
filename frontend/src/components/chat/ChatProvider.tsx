"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";

import { sendChatMessage } from "@/lib/chat-client";
import { getStoredChatSessionId } from "@/lib/chat-session";

import { ChatLauncher } from "./ChatLauncher";
import { ChatPanel } from "./ChatPanel";
import type { ChatMessage } from "./types";

type ChatProviderProps = {
  children: ReactNode;
};

function createClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function currentProjectFromPathname() {
  if (typeof window === "undefined") {
    return null;
  }

  const match = window.location.pathname.match(/^\/projects\/([^/]+)$/);
  return match?.[1] ?? null;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() => getStoredChatSessionId());
  const lastPromptRef = useRef<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  async function sendMessage(message: string) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createClientId(),
      role: "user",
      content: trimmedMessage,
      status: "sent",
    };
    const assistantId = createClientId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      sources: [],
      status: "sending",
    };

    lastPromptRef.current = trimmedMessage;
    setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const result = await sendChatMessage(
        {
          message: trimmedMessage,
          sessionId,
          currentProject: currentProjectFromPathname(),
        },
        {
          onEvent(event) {
            if (event.type === "token") {
              setMessages((currentMessages) =>
                currentMessages.map((chatMessage) =>
                  chatMessage.id === assistantId
                    ? { ...chatMessage, content: `${chatMessage.content}${event.content}` }
                    : chatMessage,
                ),
              );
            }

            if (event.type === "sources") {
              setMessages((currentMessages) =>
                currentMessages.map((chatMessage) =>
                  chatMessage.id === assistantId ? { ...chatMessage, sources: event.sources } : chatMessage,
                ),
              );
            }
          },
        },
      );

      if (result.sessionId) {
        setSessionId(result.sessionId);
      }
      setMessages((currentMessages) =>
        currentMessages.map((chatMessage) =>
          chatMessage.id === assistantId
            ? { ...chatMessage, persistedMessageId: result.messageId, status: "sent" }
            : chatMessage,
        ),
      );
    } catch (sendError) {
      const messageText = sendError instanceof Error ? sendError.message : "Tirtayasa AI is unavailable right now.";
      setError(messageText);
      setMessages((currentMessages) =>
        currentMessages.map((chatMessage) =>
          chatMessage.id === assistantId
            ? {
                ...chatMessage,
                content: "I could not reach the assistant service. You can still browse projects or contact Abdul directly.",
                status: "error",
              }
            : chatMessage,
        ),
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleRetry() {
    if (lastPromptRef.current) {
      void sendMessage(lastPromptRef.current);
    }
  }

  return (
    <>
      {children}
      <ChatLauncher isOpen={isOpen} onClick={() => setIsOpen((currentValue) => !currentValue)} />
      {isOpen ? (
        <ChatPanel
          messages={messages}
          input={input}
          error={error}
          isSending={isSending}
          textareaRef={textareaRef}
          onInputChange={setInput}
          onClose={() => setIsOpen(false)}
          onSubmit={handleSubmit}
          onPromptSelect={(prompt) => void sendMessage(prompt)}
          onRetry={handleRetry}
        />
      ) : null}
    </>
  );
}
