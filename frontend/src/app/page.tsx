import { ArrowRight, BarChart3, Bot, Database, FileSpreadsheet, Server } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { ProjectCard } from "@/components/ProjectCard";
import { RichText } from "@/components/RichText";
import { SectionLabel } from "@/components/SectionLabel";
import { getFeaturedProjects, getProfile, getSkillGroups } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

const capabilityIcons = [Server, Database, FileSpreadsheet, BarChart3, Bot];

export default function Home() {
  const profile = getProfile();
  const skillGroups = getSkillGroups();
  const featuredProjects = getFeaturedProjects();
  const highlightedSkills = skillGroups.flatMap((group) => group.skills).slice(0, 8);

  return (
    <main>
      <section className="technical-grid px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionLabel>{profile.assistant.displayName}</SectionLabel>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              {profile.headline}
            </h1>
            <RichText content={profile.summary} className="mt-6 max-w-3xl space-y-4 text-lg leading-8 text-text-secondary" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="inline-flex min-h-11 items-center gap-2 rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-[#071009] transition hover:brightness-110" href="/projects">
                View My Work
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link className="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent/60" href="#assistant">
                Ask My AI Assistant
              </Link>
              <Link className="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent/60" href="/resume">
                Download Résumé
              </Link>
              <Link className="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-text-primary transition hover:border-accent/60" href="/contact">
                Contact Abdul
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface/90 p-5 shadow-2xl shadow-black/20">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Core capability map</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {highlightedSkills.map((skill, index) => {
                const Icon = capabilityIcons[index % capabilityIcons.length];

                return (
                  <div key={skill} className="rounded-lg border border-border bg-background/60 p-4">
                    <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    <p className="mt-3 font-mono text-sm text-text-primary">{skill}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Featured projects</SectionLabel>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-text-primary">Production-minded case studies</h2>
              <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
                Selected public projects show how Abdul applies analytics, automation, and AI enablement to real business workflows.
              </p>
            </div>
            <Link className="text-sm font-semibold text-accent underline-offset-4 hover:underline" href="/projects">
              View all projects
            </Link>
          </div>

          <div className="mt-8">
            {featuredProjects.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-3">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No featured projects are available"
                description="Only approved public case studies are shown here. Explore the projects page for the full portfolio."
              />
            )}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-6">
            <SectionLabel>Business perspective</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold text-text-primary">Sales context meets data execution</h2>
            <p className="mt-4 leading-7 text-text-secondary">
              Abdul&apos;s earlier experience as a sales team lead helps him frame analytics and automation around business outcomes, not dashboards alone.
            </p>
          </div>
          <div id="assistant" className="scroll-mt-24 rounded-xl border border-border bg-surface p-6">
            <SectionLabel>Assistant</SectionLabel>
            <h2 className="mt-4 text-2xl font-semibold text-text-primary">Ask {siteConfig.assistantName}</h2>
            <p className="mt-4 leading-7 text-text-secondary">
              Tirtayasa AI answers questions from verified portfolio content and cites the sources it used.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
