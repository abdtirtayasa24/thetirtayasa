import { Send, X } from "lucide-react";
import { type FormEvent, type RefObject } from "react";

import { siteConfig } from "@/lib/site-config";

import { ChatMessage } from "./ChatMessage";
import { StarterPrompts } from "./StarterPrompts";
import type { ChatMessage as ChatMessageType } from "./types";

type ChatPanelProps = {
  messages: ChatMessageType[];
  input: string;
  error: string | null;
  isSending: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInputChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPromptSelect: (prompt: string) => void;
  onRetry: () => void;
};

export function ChatPanel({
  messages,
  input,
  error,
  isSending,
  textareaRef,
  onInputChange,
  onClose,
  onSubmit,
  onPromptSelect,
  onRetry,
}: ChatPanelProps) {
  return (
    <section
      role="dialog"
      aria-label={siteConfig.assistantName}
      aria-modal="false"
      className="fixed inset-x-3 bottom-20 z-40 flex max-h-[min(42rem,calc(100vh-6rem))] flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl shadow-black/40 sm:inset-x-auto sm:right-6 sm:w-[25rem]"
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-text-primary">{siteConfig.assistantName}</h2>
          <p className="mt-1 text-xs text-text-secondary">Grounded portfolio assistant</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${siteConfig.assistantName} chat`}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-border text-text-primary transition hover:border-accent/60 hover:text-accent"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-sm leading-6 text-text-secondary">
              Ask about Abdul&apos;s skills, projects, availability, or how his analytics and AI work can support business goals.
            </p>
            <div className="mt-4">
              <StarterPrompts disabled={isSending} onSelect={onPromptSelect} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4" aria-live="polite">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}

        {isSending ? (
          <div role="status" className="text-sm text-text-secondary">
            {siteConfig.assistantName} is thinking…
          </div>
        ) : null}

        {error ? (
          <div role="alert" className="rounded-lg border border-error/40 bg-background/50 p-3 text-sm text-text-secondary">
            <p>{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-sm font-semibold text-accent hover:underline"
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="border-t border-border bg-surface p-3">
        <label htmlFor="chat-message" className="sr-only">
          Message for {siteConfig.assistantName}
        </label>
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            id="chat-message"
            value={input}
            disabled={isSending}
            rows={2}
            maxLength={2000}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="Ask about Abdul&apos;s work…"
            className="min-h-11 flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || input.trim().length === 0}
            aria-label="Send chat message"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-accent text-background transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}
