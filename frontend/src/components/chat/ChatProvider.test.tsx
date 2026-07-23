import { JSDOM } from "jsdom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ChatProvider } from "./ChatProvider";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://127.0.0.1:3030/projects/project-01",
});

function streamResponse() {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode('event: token\ndata: {"type":"token","content":"Abdul works on analytics automation."}\n\n'),
        );
        controller.enqueue(
          encoder.encode(
            'event: sources\ndata: {"type":"sources","sources":[{"title":"Project 01","url":"/projects/project-01","section":"Case study"}]}\n\n',
          ),
        );
        controller.enqueue(
          encoder.encode(
            'event: done\ndata: {"type":"done","session_id":"1d0b2d6a-4c4d-4f53-a5ee-2dd62508694c"}\n\n',
          ),
        );
        controller.close();
      },
    }),
    { status: 200, headers: { "content-type": "text/event-stream" } },
  );
}

describe("ChatProvider", () => {
  beforeEach(() => {
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
    globalThis.HTMLElement = dom.window.HTMLElement;
    globalThis.localStorage = dom.window.localStorage;
    (dom.window.HTMLElement.prototype as unknown as { attachEvent: () => void }).attachEvent = () => {};
    (dom.window.HTMLElement.prototype as unknown as { detachEvent: () => void }).detachEvent = () => {};
    localStorage.clear();
  });

  afterEach(() => {
    dom.window.document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("opens an accessible assistant panel and sends the current project context", async () => {
    const fetcher = vi.fn(async () => streamResponse());
    globalThis.fetch = fetcher as unknown as typeof fetch;

    const view = render(
      <ChatProvider>
        <main>Portfolio content</main>
      </ChatProvider>,
    );

    fireEvent.click(view.getByRole("button", { name: "Open Tirtayasa AI chat" }));
    expect(view.getByRole("dialog", { name: "Tirtayasa AI" })).toBeTruthy();

    fireEvent.click(view.getByRole("button", { name: "Ask about analytics automation" }));

    await waitFor(() => {
      expect(view.getByText("Abdul works on analytics automation.")).toBeTruthy();
    });
    expect(view.getByRole("link", { name: "Project 01 Case study" })).toBeTruthy();
    expect(JSON.parse(fetcher.mock.calls[0][1].body as string)).toMatchObject({
      current_project: "project-01",
    });
  });
});
