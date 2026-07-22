import { describe, expect, it } from "vitest";

import {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectCategories,
  parseProjectMarkdown,
  selectFeaturedProjects,
} from "./content";

function projectMarkdown(slug: string, title: string, featured: boolean, year: number) {
  return `---
id: ${slug}
slug: ${slug}
title: ${title}
summary: Automates recurring business reporting.
featured: ${featured}
status: published
visibility: public
year: ${year}
categories:
  - Analytics
technologies:
  - Python
deployment: []
metrics: []
confidentiality:
  hide_internal_urls: true
  hide_source_code: true
  hide_customer_data: true
  anonymize_metrics: true
---

## Problem
Manual reporting took too much time.
`;
}

const publishedProject = `---
id: analytics-automation
slug: analytics-automation
title: Analytics Automation
summary: Automates recurring sales analytics reporting.
featured: true
status: published
visibility: public
year: 2025
categories:
  - Analytics
  - Automation
technologies:
  - Python
  - Google Sheets
deployment: []
metrics: []
confidentiality:
  hide_internal_urls: true
  hide_source_code: true
  hide_customer_data: true
  anonymize_metrics: true
---

## Problem
Manual reporting took too much time.

## Results
Reporting became faster.
`;

describe("content loading", () => {
  it("parses project front matter and markdown sections", () => {
    const project = parseProjectMarkdown("analytics-automation.md", publishedProject);

    expect(project.slug).toBe("analytics-automation");
    expect(project.categories).toEqual(["Analytics", "Automation"]);
    expect(project.sections.map((section) => section.heading)).toEqual(["Problem", "Results"]);
  });

  it("hides draft placeholder projects from public project lists", () => {
    expect(getAllProjects()).toEqual([]);
    expect(getFeaturedProjects()).toEqual([]);
    expect(getProjectBySlug("project-01")).toBeNull();
  });

  it("selects exactly three featured projects by newest year when configured", () => {
    const projects = [
      parseProjectMarkdown("older.md", projectMarkdown("older", "Older", true, 2023)),
      parseProjectMarkdown("newest.md", projectMarkdown("newest", "Newest", true, 2026)),
      parseProjectMarkdown("middle.md", projectMarkdown("middle", "Middle", true, 2025)),
      parseProjectMarkdown("extra.md", projectMarkdown("extra", "Extra", true, 2024)),
      parseProjectMarkdown("not-featured.md", projectMarkdown("not-featured", "Not Featured", false, 2027)),
    ];

    expect(selectFeaturedProjects(projects, 3).map((project) => project.slug)).toEqual([
      "newest",
      "middle",
      "extra",
    ]);
  });

  it("returns categories from published public projects only", () => {
    expect(getProjectCategories()).toEqual([]);
  });
});
