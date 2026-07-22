import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionLabel } from "@/components/SectionLabel";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <SectionLabel>Case study</SectionLabel>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">{project.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">{project.summary}</p>

        <dl className="mt-8 grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-secondary">Year</dt>
            <dd className="mt-2 text-text-primary">{project.year}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-secondary">Categories</dt>
            <dd className="mt-2 text-text-primary">{project.categories.join(", ")}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.18em] text-text-secondary">Stack</dt>
            <dd className="mt-2 text-text-primary">{project.technologies.join(", ")}</dd>
          </div>
        </dl>

        <div className="mt-10 space-y-6">
          {project.sections.map((section) => (
            <section key={section.heading} className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-2xl font-semibold text-text-primary">{section.heading}</h2>
              <p className="mt-4 whitespace-pre-line leading-7 text-text-secondary">{section.content}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
