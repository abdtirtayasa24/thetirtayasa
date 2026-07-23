import { describe, expect, it } from "vitest";

import {
  getAboutSections,
  getAllProjects,
  getExperienceItems,
  getFeaturedProjects,
  getLinkedInCertifications,
  getLinkedInSections,
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

  it("accepts simple string metrics and normalizes them for project data", () => {
    const project = parseProjectMarkdown(
      "string-metrics.md",
      publishedProject.replace(
        "metrics: []",
        "metrics:\n  - Hourly lead anomaly detection\n  - Daily funnel-health reporting",
      ),
    );

    expect(project.metrics).toEqual([
      { label: "Hourly lead anomaly detection", value: "", public: true },
      { label: "Daily funnel-health reporting", value: "", public: true },
    ]);
  });

  it("loads published public repository projects only", () => {
    const projects = getAllProjects();

    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every((project) => project.status === "published")).toBe(true);
    expect(projects.every((project) => project.visibility === "public")).toBe(true);
    expect(getFeaturedProjects().every((project) => project.featured)).toBe(true);
    expect(getProjectBySlug(projects[0].slug)?.slug).toBe(projects[0].slug);
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

  it("returns sorted unique categories from published public projects only", () => {
    const expectedCategories = Array.from(
      new Set(getAllProjects().flatMap((project) => project.categories)),
    ).sort();

    expect(getProjectCategories()).toEqual(expectedCategories);
  });

  it("loads about page sections from repository markdown content", () => {
    const sections = getAboutSections();

    expect(sections.map((section) => section.heading)).toEqual(["About Me"]);
    expect(sections[0].content).toContain("I turn operational problems into practical data");
    expect(sections[0].content).toContain("**Understand the problem. Use the data. Build what is useful. Measure the result.**");
  });

  it("loads real experience items from repository content", () => {
    const items = getExperienceItems();

    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toMatchObject({
      title: "Sr. Data Analyst & Business Support",
      organization: "Dolpheen Indonesia",
      startDate: "Jun 2024",
      endDate: "Present",
    });
    expect(items[0].summary).toContain("C-level stakeholders");
  });

  it("loads LinkedIn profile sections from markdown content", () => {
    const sections = getLinkedInSections();

    expect(sections.map((section) => section.heading)).toContain("About");
    expect(sections.map((section) => section.heading)).toContain("Licences and Certifications");
    expect(sections.find((section) => section.heading === "About")?.content).toContain("DOLPHEEN INDONESIA");
  });

  it("parses LinkedIn certifications with issuer, issued date, and credential", () => {
    const certifications = getLinkedInCertifications();

    expect(certifications.length).toBeGreaterThan(0);
    expect(certifications[0]).toEqual({
      title: "Data Cleaning",
      issuer: "Kaggle",
      issued: "Dec 2024",
      credential: "https://www.kaggle.com/learn/certification/abdtirtayasa24/data-cleaning",
    });
  });
});
