import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const sourceRoot = path.join(process.cwd(), "src");
const visibleCopyFiles = [
  "app/page.tsx",
  "app/contact/page.tsx",
  "app/notes/page.tsx",
  "app/projects/page.tsx",
  "app/about/page.tsx",
  "app/experience/page.tsx",
  "app/resume/page.tsx",
  "components/EmptyState.tsx",
  "components/ContactForm.tsx",
  "components/chat/ChatPanel.tsx",
  "components/chat/ChatProvider.tsx",
].map((file) => path.join(sourceRoot, file));

const nonProductionPhrases = [
  "once the backend RAG pipeline is implemented",
  "after the portfolio MVP",
  "ready for your content",
  "backend-stored contact form",
  "will appear when",
  "draft placeholders",
];

describe("frontend production copy", () => {
  it("does not expose implementation-progress wording in visible UI text", () => {
    const source = visibleCopyFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");

    for (const phrase of nonProductionPhrases) {
      expect(source).not.toContain(phrase);
    }
  });
});
