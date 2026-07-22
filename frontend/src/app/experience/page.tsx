import type { Metadata } from "next";

import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional background and business perspective of Abdul F. Tirtayasa.",
};

const timeline = [
  {
    title: "Data Analyst & AI Enabler",
    description:
      "Provides data analytics, automation, and AI solutions for business needs, with a focus on practical implementation and business-goal alignment.",
  },
  {
    title: "Sales Team Lead background",
    description:
      "Earlier sales leadership experience shaped a practical understanding of sales operations, stakeholder needs, and business outcomes.",
  },
];

export default function ExperiencePage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Experience</SectionLabel>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">Data execution with business context.</h1>
        <div className="mt-10 space-y-5">
          {timeline.map((item) => (
            <article key={item.title} className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-2xl font-semibold text-text-primary">{item.title}</h2>
              <p className="mt-4 leading-7 text-text-secondary">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
