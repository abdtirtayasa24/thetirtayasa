import { JSDOM } from "jsdom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "./ContactForm";

const dom = new JSDOM("<!doctype html><html><body></body></html>");

describe("ContactForm", () => {
  beforeEach(() => {
    globalThis.window = dom.window as unknown as Window & typeof globalThis;
    globalThis.document = dom.window.document;
    globalThis.HTMLElement = dom.window.HTMLElement;
    globalThis.FormData = dom.window.FormData;
  });

  afterEach(() => {
    dom.window.document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("shows the success message after the backend accepts the submission", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ id: "contact-1", status: "received" }), {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    ) as unknown as typeof fetch;

    const view = render(<ContactForm />);

    fireEvent.change(view.getByLabelText("Name"), { target: { value: "Jane Founder" } });
    fireEvent.change(view.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(view.getByLabelText("Message"), {
      target: { value: "I want to discuss analytics automation." },
    });
    fireEvent.click(view.getByRole("button", { name: "Submit inquiry" }));

    await waitFor(() => {
      expect(view.getByText("Thank you. Your message has been received.")).toBeTruthy();
    });
    expect(
      view.queryByText("The message could not be submitted. Please use email or WhatsApp instead."),
    ).toBeNull();
  });
});
