type ExperienceSummaryBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

function parseBullet(line: string): string | null {
  const trimmed = line.trim();
  if (trimmed.startsWith("• ")) {
    return trimmed.slice(2).trim();
  }
  if (trimmed.startsWith("- ")) {
    return trimmed.slice(2).trim();
  }
  return null;
}

export function parseExperienceSummaryBlocks(summary: string): ExperienceSummaryBlock[] {
  const blocks: ExperienceSummaryBlock[] = [];
  let currentList: string[] = [];

  function flushList() {
    if (currentList.length > 0) {
      blocks.push({ type: "list", items: currentList });
      currentList = [];
    }
  }

  for (const rawLine of summary.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    const bullet = parseBullet(line);
    if (bullet) {
      currentList.push(bullet);
      continue;
    }

    flushList();
    blocks.push({ type: "paragraph", text: line });
  }

  flushList();
  return blocks;
}

export function ExperienceSummary({ summary }: { summary: string }) {
  const blocks = parseExperienceSummaryBlocks(summary);

  return (
    <div className="mt-5 space-y-4 text-text-secondary">
      {blocks.map((block, index) => {
        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="space-y-2 pl-5 leading-7">
              {block.items.map((item) => (
                <li key={item} className="list-disc marker:text-accent">
                  {item}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="leading-7">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
