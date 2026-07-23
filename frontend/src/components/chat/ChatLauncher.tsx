import { Bot } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

type ChatLauncherProps = {
  isOpen: boolean;
  onClick: () => void;
};

export function ChatLauncher({ isOpen, onClick }: ChatLauncherProps) {
  return (
    <button
      type="button"
      aria-label={isOpen ? `Close ${siteConfig.assistantName} chat` : `Open ${siteConfig.assistantName} chat`}
      aria-expanded={isOpen}
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center gap-3 rounded-full border border-accent/40 bg-surface-elevated px-4 py-3 text-sm font-semibold text-text-primary shadow-2xl shadow-black/30 transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:bottom-6 sm:right-6"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-muted text-accent">
        <Bot className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="hidden sm:inline">Ask {siteConfig.assistantName}</span>
    </button>
  );
}
