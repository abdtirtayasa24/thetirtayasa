import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { getStoredChatSessionId, storeChatSessionId } from "./chat-session";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://127.0.0.1:3030",
});

describe("chat session storage", () => {
  beforeEach(() => {
    globalThis.localStorage = dom.window.localStorage;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("persists the normalized session id returned by the backend", () => {
    storeChatSessionId("1d0b2d6a-4c4d-4f53-a5ee-2dd62508694c");

    expect(getStoredChatSessionId()).toBe("1d0b2d6a-4c4d-4f53-a5ee-2dd62508694c");
  });

  it("ignores malformed session ids from browser storage", () => {
    localStorage.setItem("tirtayasa-ai-session-id", "not-a-session");

    expect(getStoredChatSessionId()).toBeNull();
  });
});
