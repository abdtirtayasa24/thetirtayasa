import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import type {
  AboutSection,
  ExperienceItem,
  LinkedInCertification,
  LinkedInSection,
  Profile,
  Project,
  ProjectSection,
  SkillGroup,
} from "./content-types";
import { siteConfig } from "./site-config";

const contentDirectory = path.join(process.cwd(), "..", "content");
const projectsDirectory = path.join(contentDirectory, "projects");

const projectMetricSchema = z.union([
  z.object({
    label: z.string(),
    value: z.string(),
    public: z.boolean().default(true),
  }),
  z.string().transform((metric) => ({ label: metric, value: "", public: true })),
]);

const projectSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  visibility: z.enum(["public", "private"]).default("public"),
  year: z.number(),
  categories: z.array(z.string().min(1)).min(1),
  technologies: z.array(z.string().min(1)).min(1),
  deployment: z.array(z.string()).default([]),
  metrics: z.array(projectMetricSchema).default([]),
  company: z
    .object({
      name: z.string().nullable().optional(),
      disclose_name: z.boolean().default(false),
    })
    .default({ disclose_name: false }),
});

const profileSchema = z.object({
  name: z.string(),
  headline: z.string(),
  location: z.string().optional(),
  summary: z.string(),
  contact: z.object({
    email: z.string(),
    whatsapp_url: z.string(),
    github_url: z.string().optional().default(""),
    linkedin_url: z.string().optional().default(""),
  }),
  assistant: z.object({
    display_name: z.string(),
  }),
});

const skillsSchema = z.object({
  groups: z.array(
    z.object({
      name: z.string(),
      skills: z.array(z.string()),
    }),
  ),
});

const experienceSchema = z.object({
  items: z.array(
    z.object({
      title: z.string().min(1),
      organization: z.string().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
      summary: z.string().optional(),
    }),
  ),
});

export function parseProjectMarkdown(fileName: string, markdown: string): Project {
  const parsed = matter(markdown);
  const frontMatter = projectSchema.parse(parsed.data);

  return {
    id: frontMatter.id,
    slug: frontMatter.slug,
    title: frontMatter.title,
    summary: frontMatter.summary,
    featured: frontMatter.featured,
    status: frontMatter.status,
    visibility: frontMatter.visibility,
    year: frontMatter.year,
    categories: frontMatter.categories,
    technologies: frontMatter.technologies,
    deployment: frontMatter.deployment,
    metrics: frontMatter.metrics.filter((metric) => metric.public),
    company: {
      name: frontMatter.company.name ?? null,
      discloseName: frontMatter.company.disclose_name,
    },
    sections: parseMarkdownSections(parsed.content),
    sourcePath: fileName,
  };
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(projectsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const filePath = path.join(projectsDirectory, fileName);
      return parseProjectMarkdown(fileName, fs.readFileSync(filePath, "utf8"));
    })
    .filter((project) => project.status === "published" && project.visibility === "public")
    .sort((a, b) => b.year - a.year);
}

export function getFeaturedProjects(): Project[] {
  return selectFeaturedProjects(getAllProjects(), siteConfig.featuredProjectLimit);
}

export function selectFeaturedProjects(projects: Project[], limit: number): Project[] {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => b.year - a.year)
    .slice(0, limit);
}

export function getProjectBySlug(slug: string): Project | null {
  return getAllProjects().find((project) => project.slug === slug) ?? null;
}

export function getProjectCategories(): string[] {
  return Array.from(new Set(getAllProjects().flatMap((project) => project.categories))).sort();
}

export function getProfile(): Profile {
  const profile = profileSchema.parse(readYamlLikeFile("profile.yaml"));

  return {
    name: profile.name,
    headline: profile.headline,
    location: profile.location,
    summary: profile.summary,
    contact: {
      email: profile.contact.email,
      whatsappUrl: profile.contact.whatsapp_url,
      githubUrl: profile.contact.github_url,
      linkedinUrl: profile.contact.linkedin_url,
    },
    assistant: {
      displayName: profile.assistant.display_name,
    },
  };
}

export function getSkillGroups(): SkillGroup[] {
  return skillsSchema.parse(readYamlLikeFile("skills.yaml")).groups;
}

export function getAboutSections(): AboutSection[] {
  const filePath = path.join(contentDirectory, "about.md");
  return parseMarkdownSections(fs.readFileSync(filePath, "utf8"));
}

export function getExperienceItems(): ExperienceItem[] {
  return experienceSchema.parse(readYamlLikeFile("experience.yaml")).items.map((item) => ({
    title: item.title,
    organization: item.organization,
    startDate: item.start_date,
    endDate: item.end_date,
    summary: item.summary,
  }));
}

export function getLinkedInSections(): LinkedInSection[] {
  const filePath = path.join(contentDirectory, "linkedin.md");
  return parseMarkdownSections(fs.readFileSync(filePath, "utf8"));
}

export function getLinkedInCertifications(): LinkedInCertification[] {
  const certifications = getLinkedInSections().find(
    (section) => section.heading === "Licences and Certifications",
  );
  if (!certifications) {
    return [];
  }

  const entries = certifications.content.split(/\n(?=- \*\*)/g);
  return entries
    .map((entry) => {
      const title = entry.match(/^- \*\*([^*]+)\*\*/)?.[1]?.trim();
      const issuer = entry.match(/\* Issuer:\s*(.+)/)?.[1]?.trim();
      const issued = entry.match(/\* Issued:\s*(.+)/)?.[1]?.trim();
      const credential = entry.match(/\* Credential:\s*(.+)/)?.[1]?.replace(/`/g, "").trim();

      if (!title || !issuer || !issued || !credential) {
        return null;
      }

      return { title, issuer, issued, credential };
    })
    .filter((entry): entry is LinkedInCertification => entry !== null);
}

function readYamlLikeFile(fileName: string): unknown {
  const filePath = path.join(contentDirectory, fileName);
  return matter(`---\n${fs.readFileSync(filePath, "utf8")}\n---`).data;
}

function parseMarkdownSections(markdown: string): ProjectSection[] {
  const sections: ProjectSection[] = [];
  let currentHeading: string | null = null;
  let currentContent: string[] = [];

  for (const line of markdown.split("\n")) {
    if (line.startsWith("## ")) {
      if (currentHeading) {
        sections.push({ heading: currentHeading, content: currentContent.join("\n").trim() });
      }

      currentHeading = line.replace(/^##\s+/, "").trim();
      currentContent = [];
      continue;
    }

    currentContent.push(line);
  }

  if (currentHeading) {
    sections.push({ heading: currentHeading, content: currentContent.join("\n").trim() });
  }

  return sections;
}
