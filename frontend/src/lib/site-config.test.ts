import { describe, expect, it } from "vitest";

import { siteConfig } from "./site-config";

describe("siteConfig", () => {
  it("uses the approved public contact and assistant details", () => {
    expect(siteConfig.ownerName).toBe("Abdul F. Tirtayasa");
    expect(siteConfig.assistantName).toBe("Tirtayasa AI");
    expect(siteConfig.contact.email).toBe("abdtirtayasa24@gmail.com");
    expect(siteConfig.contact.whatsappUrl).toContain("wa.me/6282121172378");
    expect(siteConfig.resume.basename).toBe("CV_Abdul-F-Tirtayasa");
  });
});
