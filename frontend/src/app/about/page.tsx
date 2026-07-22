import type { Metadata } from "next";

import { SectionLabel } from "@/components/SectionLabel";
import { getProfile, getSkillGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "About Abdul F. Tirtayasa and his Data Analyst & AI Enabler profile.",
};

export default function AboutPage() {
  const profile = getProfile();
  const skillGroups = getSkillGroups();

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>About</SectionLabel>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">{profile.headline}</h1>
        <p className="mt-6 text-lg leading-8 text-text-secondary">{profile.summary}</p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {skillGroups.map((group) => (
            <section key={group.name} className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-xl font-semibold text-text-primary">{group.name}</h2>
              <ul className="mt-4 space-y-2">
                {group.skills.map((skill) => (
                  <li key={skill} className="font-mono text-sm text-text-secondary">
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
