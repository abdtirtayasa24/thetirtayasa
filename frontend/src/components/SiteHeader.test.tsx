import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("renders a mobile menu button so navigation does not wrap in the header", () => {
    const markup = renderToStaticMarkup(<SiteHeader />);

    expect(markup).toContain("Open navigation menu");
    expect(markup).toContain("md:hidden");
  });

  it("keeps the mobile dialog compact with centered menu links", () => {
    const source = readFileSync(join(import.meta.dir, "SiteHeader.tsx"), "utf8");

    expect(source).toContain("max-w-sm");
    expect(source).toContain("justify-center");
    expect(source).toContain("text-center");
  });
});
