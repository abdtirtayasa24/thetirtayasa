import { describe, expect, it } from "vitest";

import { parseExperienceSummaryBlocks } from "./ExperienceSummary";

describe("parseExperienceSummaryBlocks", () => {
  it("keeps paragraphs and bullet lists in their original order", () => {
    const blocks = parseExperienceSummaryBlocks(
      "Intro paragraph.\n\nKey responsibilities include:\n• First responsibility.\n• Second responsibility.\n\nClosing paragraph.",
    );

    expect(blocks).toEqual([
      { type: "paragraph", text: "Intro paragraph." },
      { type: "paragraph", text: "Key responsibilities include:" },
      { type: "list", items: ["First responsibility.", "Second responsibility."] },
      { type: "paragraph", text: "Closing paragraph." },
    ]);
  });
});
