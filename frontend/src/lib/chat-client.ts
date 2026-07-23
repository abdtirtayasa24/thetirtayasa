import { siteConfig } from "./site-config";
import { storeChatSessionId } from "./chat-session";

export type ChatSource = {
  title: string;
  url: string;
  section?: string;
};

export type ChatStreamEvent =
  | { type: "token"; content: string }
  | { type: "sources"; sources: ChatSource[] }
  | { type: "done"; session_id: string; message_id?: string }
  | { type: "error"; message: string };

export type ChatMessageInput = {
  message: string;
  sessionId: string | null;
  currentProject: string | null;
};

type Fetcher = (url: string, init: RequestInit) => Promise<Response>;

type SendChatMessageOptions = {
  fetcher?: Fetcher;
  onEvent?: (event: ChatStreamEvent) => void;
  timeoutMs?: number;
};

export type ChatMessageResult = {
  sessionId: string | null;
  messageId: string | null;
};

const unavailableMessage = "Tirtayasa AI is unavailable right now. Please try again later.";

function parseSseChunk(buffer: string): { events: ChatStreamEvent[]; remaining: string } {
  const blocks = buffer.split("\n\n");
  const remaining = blocks.pop() ?? "";
  const events: ChatStreamEvent[] = [];

  for (const block of blocks) {
    const dataLine = block
      .split("\n")
      .find((line) => line.startsWith("data:"));
    if (!dataLine) {
      continue;
    }

    try {
      events.push(JSON.parse(dataLine.slice(5).trim()) as ChatStreamEvent);
    } catch {
      events.push({ type: "error", message: unavailableMessage });
    }
  }

  return { events, remaining };
}

export async function sendChatMessage(
  input: ChatMessageInput,
  options: SendChatMessageOptions = {},
): Promise<ChatMessageResult> {
  const fetcher = options.fetcher ?? fetch;
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), options.timeoutMs ?? 30_000);
  let sessionId: string | null = null;
  let messageId: string | null = null;

  try {
    const response = await fetcher(`${siteConfig.backendApiUrl}/v1/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: input.message,
        session_id: input.sessionId || undefined,
        current_project: input.currentProject || undefined,
      }),
      signal: controller.signal,
    });

    if (!response.ok || !response.body) {
      throw new Error(unavailableMessage);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseChunk(buffer);
      buffer = parsed.remaining;

      for (const event of parsed.events) {
        options.onEvent?.(event);
        if (event.type === "done") {
          sessionId = event.session_id;
          messageId = event.message_id ?? null;
          storeChatSessionId(event.session_id);
        }
      }
    }

    return { sessionId, messageId };
  } catch (error) {
    if (error instanceof Error && error.message === unavailableMessage) {
      throw error;
    }
    throw new Error(unavailableMessage);
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}

export async function submitChatFeedback(
  messageId: string,
  rating: 1 | -1,
  reason?: string,
  fetcher: Fetcher = fetch,
): Promise<void> {
  const response = await fetcher(`${siteConfig.backendApiUrl}/v1/chat/feedback`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message_id: messageId, rating, reason }),
  });

  if (!response.ok) {
    throw new Error("Feedback could not be submitted.");
  }
}
