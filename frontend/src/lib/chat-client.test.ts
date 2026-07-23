import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { sendChatMessage } from "./chat-client";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://127.0.0.1:3030",
});

function streamResponse(chunks: string[]) {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    }),
    { status: 200, headers: { "content-type": "text/event-stream" } },
  );
}

describe("sendChatMessage", () => {
  beforeEach(() => {
    globalThis.localStorage = dom.window.localStorage;
    localStorage.clear();
  });

  it("streams token, source, and done events while storing the returned session id", async () => {
    const fetcher = vi.fn(async () =>
      streamResponse([
        'event: token\ndata: {"type":"token","content":"Hello"}\n\n',
        'event: sources\ndata: {"type":"sources","sources":[{"title":"About","url":"/about","section":"Profile"}]}\n\n',
        'event: done\ndata: {"type":"done","session_id":"1d0b2d6a-4c4d-4f53-a5ee-2dd62508694c"}\n\n',
      ]),
    );
    const events: string[] = [];

    const result = await sendChatMessage(
      { message: "What can Abdul do?", sessionId: null, currentProject: "project-01" },
      {
        fetcher,
        onEvent(event) {
          events.push(event.type);
        },
      },
    );

    expect(events).toEqual(["token", "sources", "done"]);
    expect(result.sessionId).toBe("1d0b2d6a-4c4d-4f53-a5ee-2dd62508694c");
    expect(localStorage.getItem("tirtayasa-ai-session-id")).toBe(
      "1d0b2d6a-4c4d-4f53-a5ee-2dd62508694c",
    );
    expect(JSON.parse(fetcher.mock.calls[0][1].body as string)).toEqual({
      message: "What can Abdul do?",
      current_project: "project-01",
    });
  });

  it("returns a friendly unavailable error when the backend request fails", async () => {
    await expect(
      sendChatMessage(
        { message: "Hello", sessionId: null, currentProject: null },
        { fetcher: vi.fn(async () => new Response(null, { status: 503 })) },
      ),
    ).rejects.toThrow("Tirtayasa AI is unavailable right now. Please try again later.");
  });
});
