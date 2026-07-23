import type { ChatSource } from "@/lib/chat-client";

type SourceCardProps = {
  source: ChatSource;
};

export function SourceCard({ source }: SourceCardProps) {
  const accessibleLabel = source.section ? `${source.title} ${source.section}` : source.title;

  return (
    <a
      href={source.url}
      aria-label={accessibleLabel}
      className="rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-text-secondary transition hover:border-accent/60 hover:text-accent"
    >
      <span className="block font-medium text-text-primary">{source.title}</span>
      {source.section ? <span className="mt-1 block font-mono uppercase tracking-[0.14em]">{source.section}</span> : null}
    </a>
  );
}
