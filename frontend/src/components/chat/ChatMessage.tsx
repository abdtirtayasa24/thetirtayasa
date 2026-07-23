import { FeedbackButtons } from "./FeedbackButtons";
import { SourceCard } from "./SourceCard";
import type { ChatMessage as ChatMessageType } from "./types";

type ChatMessageProps = {
  message: ChatMessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <article className={isAssistant ? "self-start" : "self-end"} aria-label={isAssistant ? "Assistant message" : "Your message"}>
      <div
        className={
          isAssistant
            ? "max-w-[18rem] rounded-2xl rounded-tl-sm border border-border bg-surface px-4 py-3 text-sm leading-6 text-text-secondary sm:max-w-md"
            : "max-w-[18rem] rounded-2xl rounded-tr-sm bg-accent-muted px-4 py-3 text-sm leading-6 text-text-primary sm:max-w-md"
        }
      >
        {message.content}
      </div>
      {isAssistant && message.sources?.length ? (
        <div className="mt-3 grid gap-2" aria-label="Sources">
          {message.sources.map((source) => (
            <SourceCard key={`${source.url}-${source.section ?? source.title}`} source={source} />
          ))}
        </div>
      ) : null}
      {isAssistant && message.content ? <FeedbackButtons messageId={message.persistedMessageId} /> : null}
    </article>
  );
}
