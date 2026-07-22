import { describe, expect, it } from "vitest";

import { submitContactForm } from "./contact-client";

describe("submitContactForm", () => {
  it("posts contact submissions to the backend contact endpoint", async () => {
    const calls: Array<{ url: string; init: RequestInit }> = [];
    const fetcher = async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: "contact-1", status: "received" }), {
        status: 201,
        headers: { "content-type": "application/json" },
      });
    };

    const result = await submitContactForm(
      {
        name: "Jane Founder",
        email: "jane@example.com",
        message: "I want to discuss analytics automation.",
        engagementType: "consulting",
      },
      fetcher,
    );

    expect(result).toEqual({ id: "contact-1", status: "received" });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toMatch(/\/v1\/contact$/);
    expect(calls[0].init.method).toBe("POST");
    expect(calls[0].init.body).toBe(
      JSON.stringify({
        name: "Jane Founder",
        email: "jane@example.com",
        message: "I want to discuss analytics automation.",
        engagement_type: "consulting",
      }),
    );
  });

  it("throws a friendly error when the backend rejects the submission", async () => {
    const fetcher = async () => new Response("{}", { status: 500 });

    await expect(
      submitContactForm(
        {
          name: "Jane Founder",
          email: "jane@example.com",
          message: "I want to discuss analytics automation.",
        },
        fetcher,
      ),
    ).rejects.toThrow("Contact submission failed");
  });
});
