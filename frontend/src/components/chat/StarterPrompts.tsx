const starterPrompts = [
  { label: "Ask about analytics automation", prompt: "How can Abdul help with analytics automation?" },
  { label: "Ask about skills", prompt: "What are Abdul's strongest technical skills?" },
  { label: "Ask about projects", prompt: "Which projects best show Abdul's work?" },
  { label: "Ask about architecture", prompt: "How does Abdul think about solution architecture?" },
  { label: "Ask about availability", prompt: "Is Abdul available for new opportunities?" },
  { label: "Ask about contact", prompt: "How can I contact Abdul?" },
];

type StarterPromptsProps = {
  disabled: boolean;
  onSelect: (prompt: string) => void;
};

export function StarterPrompts({ disabled, onSelect }: StarterPromptsProps) {
  return (
    <div className="grid gap-2" aria-label="Starter prompts">
      {starterPrompts.map((item) => (
        <button
          key={item.prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(item.prompt)}
          className="rounded-lg border border-border bg-background/50 px-3 py-2 text-left text-sm text-text-secondary transition hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
