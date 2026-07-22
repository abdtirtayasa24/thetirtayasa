import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Project } from "@/lib/content-types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-lg border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-accent/50 hover:bg-surface-elevated">
      <div className="flex flex-wrap gap-2">
        {project.categories.map((category) => (
          <span key={category} className="rounded-sm border border-border bg-background/70 px-2 py-1 font-mono text-xs text-text-secondary">
            {category}
          </span>
        ))}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-text-primary">{project.title}</h3>
      <p className="mt-3 flex-1 leading-7 text-text-secondary">{project.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.slice(0, 5).map((technology) => (
          <span key={technology} className="font-mono text-xs text-text-secondary">
            {technology}
          </span>
        ))}
      </div>
      <Link href={`/projects/${project.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent underline-offset-4 group-hover:underline">
        Read case study
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </article>
  );
}
