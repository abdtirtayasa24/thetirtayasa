"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "./EmptyState";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/content-types";

export function ProjectFilter({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") {
      return projects;
    }

    return projects.filter((project) => project.categories.includes(activeCategory));
  }, [activeCategory, projects]);

  if (projects.length === 0) {
    return (
      <EmptyState
        title="Project case studies are being prepared"
        description="The project templates are ready, but published case studies are intentionally hidden until Abdul adds approved public details."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" aria-label="Project category filters">
        {["All", ...categories].map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              type="button"
              className={`min-h-11 rounded-md border px-4 py-2 font-mono text-xs transition ${
                isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-text-secondary hover:border-accent/50 hover:text-text-primary"
              }`}
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState title="No projects match this filter" description="Try another category to view available case studies." />
      )}
    </div>
  );
}
