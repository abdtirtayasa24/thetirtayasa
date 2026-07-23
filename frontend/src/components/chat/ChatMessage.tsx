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
        {isAssistant ? <AssistantMarkdown content={message.content} /> : message.content}
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

type MarkdownBlock =
  | { type: "paragraph"; lines: string[] }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] };

function AssistantMarkdown({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "unordered-list") {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5 marker:text-accent">
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ordered-list") {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-5 marker:text-accent">
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index}>
            {block.lines.map((line, lineIndex) => (
              <span key={`${index}-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function parseMarkdownBlocks(content: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  let currentParagraph: string[] = [];
  let currentList: Extract<MarkdownBlock, { type: "unordered-list" | "ordered-list" }> | null = null;

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({ type: "paragraph", lines: currentParagraph });
      currentParagraph = [];
    }
  }

  function flushList() {
    if (currentList && currentList.items.length > 0) {
      blocks.push(currentList);
      currentList = null;
    }
  }

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
    const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (unorderedMatch) {
      flushParagraph();
      if (currentList?.type !== "unordered-list") {
        flushList();
        currentList = { type: "unordered-list", items: [] };
      }
      currentList.items.push(unorderedMatch[1]);
      continue;
    }

    if (orderedMatch) {
      flushParagraph();
      if (currentList?.type !== "ordered-list") {
        flushList();
        currentList = { type: "ordered-list", items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      continue;
    }

    flushList();
    currentParagraph.push(rawLine);
  }

  flushParagraph();
  flushList();

  return blocks;
}
