import { JSDOM } from "jsdom";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { ChatMessage } from "./ChatMessage";

const dom = new JSDOM("<!doctype html><html><body></body></html>");

describe("ChatMessage", () => {
  beforeEach(() => {
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
    globalThis.HTMLElement = dom.window.HTMLElement;
    dom.window.document.body.innerHTML = "";
  });

  it("renders assistant markdown bullet lists as semantic lists", () => {
    const view = render(
      <ChatMessage
        message={{
          id: "assistant-1",
          role: "assistant",
          content: "Abdul often helps with:\n- Analytics automation\n- AI enablement\n- Business reporting",
        }}
      />,
    );

    expect(view.getByText("Abdul often helps with:")).toBeTruthy();
    expect(view.getByRole("list")).toBeTruthy();
    expect(view.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Analytics automation",
      "AI enablement",
      "Business reporting",
    ]);
  });

  it("renders assistant markdown numbered lists as semantic lists", () => {
    const view = render(
      <ChatMessage
        message={{
          id: "assistant-2",
          role: "assistant",
          content: "A good next step:\n1. Review the projects\n2. Contact Abdul",
        }}
      />,
    );

    expect(view.getByRole("list").tagName).toBe("OL");
    expect(view.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Review the projects",
      "Contact Abdul",
    ]);
  });
});
