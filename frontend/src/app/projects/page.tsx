import type { Metadata } from "next";

import { ProjectFilter } from "@/components/ProjectFilter";
import { SectionLabel } from "@/components/SectionLabel";
import { getAllProjects, getProjectCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Data analytics, automation, and AI project case studies by Abdul F. Tirtayasa.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getProjectCategories();

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Projects</SectionLabel>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-text-primary">
          Data automation, analytics, and AI case studies.
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-text-secondary">
          Published projects appear here automatically from approved Markdown content. Draft and private projects remain hidden from public pages.
        </p>
        <div className="mt-10">
          <ProjectFilter projects={projects} categories={categories} />
        </div>
      </div>
    </main>
  );
}
