import type { Metadata } from "next";

import { SectionLabel } from "@/components/SectionLabel";
import { getProfile, getSkillGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "About Abdul F. Tirtayasa and his Data Analyst & AI Enabler profile.",
};

const identityParagraphs = [
  "Abdul is a technical operator, data analyst, automation builder, and business support person working in a debt management company called Dolpheen Indonesia.",
  "He works closely with sales, operations, CRM data, Google Sheets, PostgreSQL, Python, Apps Script, Telegram bots, WhatsApp automation, dashboards, and AI agents.",
  "He is not only a coder. He is someone who connects business problems with technical solutions. He likes tools that save time, reduce manual work, and make non-technical teams able to use technical systems.",
];

export default function AboutPage() {
  const profile = getProfile();
  const skillGroups = getSkillGroups();

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>About</SectionLabel>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">{profile.headline}</h1>

        <section className="mt-8 rounded-xl border border-border bg-surface p-6">
          <h2 className="text-2xl font-semibold text-text-primary">Abdul&apos;s Identity</h2>
          <div className="mt-5 space-y-4 text-lg leading-8 text-text-secondary">
            {identityParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

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
