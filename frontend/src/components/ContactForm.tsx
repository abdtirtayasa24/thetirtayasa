"use client";

import { useState } from "react";

import { submitContactForm } from "@/lib/contact-client";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await submitContactForm({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
        engagementType: String(formData.get("engagement_type") ?? "") || undefined,
      });
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form className="rounded-xl border border-border bg-surface p-6" onSubmit={handleSubmit}>
      <div className="grid gap-5">
        <div>
          <label className="block text-sm font-medium text-text-primary" htmlFor="name">
            Name
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3 text-text-primary"
            id="name"
            name="name"
            type="text"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary" htmlFor="email">
            Email
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3 text-text-primary"
            id="email"
            name="email"
            type="email"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary" htmlFor="engagement_type">
            Engagement type <span className="text-text-secondary">(optional)</span>
          </label>
          <input
            className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3 text-text-primary"
            id="engagement_type"
            name="engagement_type"
            type="text"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary" htmlFor="message">
            Message
          </label>
          <textarea
            className="mt-2 min-h-32 w-full rounded-md border border-border bg-background p-3 text-text-primary"
            id="message"
            name="message"
            required
            minLength={10}
            disabled={isSubmitting}
          />
        </div>
        <button
          className="inline-flex min-h-11 w-fit items-center rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-[#071009] disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Submit inquiry"}
        </button>
        {status === "success" ? (
          <p role="status" className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-accent">
            Thank you. Your message has been received.
          </p>
        ) : null}
        {status === "error" ? (
          <p role="alert" className="rounded-lg border border-error/40 bg-error/10 p-4 text-sm text-error">
            The message could not be submitted. Please use email or WhatsApp instead.
          </p>
        ) : null}
      </div>
    </form>
  );
}
