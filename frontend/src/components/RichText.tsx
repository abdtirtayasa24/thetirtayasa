import type { ReactNode } from "react";

type RichTextProps = {
  content: string;
  className?: string;
  paragraphClassName?: string;
};

export function RichText({ content, className, paragraphClassName }: RichTextProps) {
  const paragraphs = content
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={paragraphClassName}>
          {renderInlineMarkdown(paragraph)}
        </p>
      ))}
    </div>
  );
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    nodes.push(
      <strong key={`${match.index}-${match[1]}`} className="font-semibold text-text-primary">
        {match[1]}
      </strong>,
    );
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
