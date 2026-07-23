import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { submitChatFeedback } from "@/lib/chat-client";

type FeedbackButtonsProps = {
  messageId?: string | null;
};

export function FeedbackButtons({ messageId }: FeedbackButtonsProps) {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function handleFeedback(rating: 1 | -1) {
    if (!messageId) {
      return;
    }

    try {
      await submitChatFeedback(messageId, rating);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
      <span>Was this helpful?</span>
      <button
        type="button"
        disabled={!messageId || status === "sent"}
        onClick={() => void handleFeedback(1)}
        aria-label="Mark answer as helpful"
        className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-md border border-border transition hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        disabled={!messageId || status === "sent"}
        onClick={() => void handleFeedback(-1)}
        aria-label="Mark answer as not helpful"
        className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-md border border-border transition hover:border-error/70 hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <span role="status" aria-live="polite">
        {status === "sent" ? "Feedback received." : null}
        {status === "error" ? "Feedback could not be sent." : null}
      </span>
    </div>
  );
}
