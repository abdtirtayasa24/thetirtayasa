import { JSDOM } from "jsdom";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { RichText } from "./RichText";

const dom = new JSDOM("<!doctype html><html><body></body></html>");

describe("RichText", () => {
  beforeEach(() => {
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
    globalThis.HTMLElement = dom.window.HTMLElement;
    dom.window.document.body.innerHTML = "";
  });

  it("renders paragraphs and bold markdown safely", () => {
    const view = render(<RichText content={"First paragraph.\n\n**Important sentence.**"} />);

    expect(view.getByText("First paragraph.")).toBeTruthy();
    expect(view.getByText("Important sentence.").tagName).toBe("STRONG");
  });
});
