import type { Metadata } from "next";

import { ExperienceSummary } from "@/components/ExperienceSummary";
import { SectionLabel } from "@/components/SectionLabel";
import { getExperienceItems, getLinkedInCertifications, getLinkedInSections } from "@/lib/content";
import type { LinkedInSection } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Experience",
  description: "Professional background and business perspective of Abdul F. Tirtayasa.",
};

function sectionByHeading(sections: LinkedInSection[], heading: string) {
  return sections.find((section) => section.heading === heading);
}

function cleanMarkdownText(content: string) {
  return content
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .trim();
}

export default function ExperiencePage() {
  const experienceItems = getExperienceItems();
  const linkedInSections = getLinkedInSections();
  const linkedInAbout = sectionByHeading(linkedInSections, "About");
  const linkedInSkills = sectionByHeading(linkedInSections, "Featured Skills / Keywords");
  const linkedInAwards = sectionByHeading(linkedInSections, "Honours and Awards");
  const certifications = getLinkedInCertifications();

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionLabel>Experience</SectionLabel>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-text-primary">
          Data execution shaped by sales, operations, and business support.
        </h1>
        {linkedInAbout ? (
          <p className="mt-6 max-w-4xl whitespace-pre-line text-lg leading-8 text-text-secondary">
            {cleanMarkdownText(linkedInAbout.content)}
          </p>
        ) : null}

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section aria-labelledby="experience-timeline-title">
            <h2 id="experience-timeline-title" className="text-2xl font-semibold text-text-primary">
              Work history
            </h2>
            <div className="mt-6 space-y-5">
              {experienceItems.map((item) => (
                <article key={`${item.title}-${item.startDate}`} className="rounded-xl border border-border bg-surface p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-text-primary">{item.title}</h3>
                      {item.organization ? <p className="mt-2 text-text-secondary">{item.organization}</p> : null}
                    </div>
                    {item.startDate || item.endDate ? (
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
                        {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                      </p>
                    ) : null}
                  </div>
                  {item.summary ? <ExperienceSummary summary={item.summary} /> : null}
                </article>
              ))}
            </div>
          </section>

          <aside className="space-y-5" aria-label="LinkedIn profile highlights">
            {linkedInSkills ? (
              <section className="rounded-xl border border-border bg-surface p-5">
                <h2 className="text-xl font-semibold text-text-primary">Featured skills</h2>
                <p className="mt-4 whitespace-pre-line font-mono text-sm leading-7 text-text-secondary">
                  {cleanMarkdownText(linkedInSkills.content)}
                </p>
              </section>
            ) : null}

            {certifications.length > 0 ? (
              <section className="rounded-xl border border-border bg-surface p-5">
                <h2 className="text-xl font-semibold text-text-primary">Licences and certifications</h2>
                <div className="mt-4 space-y-4">
                  {certifications.map((certification) => (
                    <article key={`${certification.title}-${certification.issuer}`} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                      <h3 className="font-semibold text-text-primary">{certification.title}</h3>
                      <dl className="mt-2 space-y-1 text-sm text-text-secondary">
                        <div>
                          <dt className="inline font-mono text-xs uppercase tracking-[0.14em] text-text-secondary">Issuer: </dt>
                          <dd className="inline">{certification.issuer}</dd>
                        </div>
                        <div>
                          <dt className="inline font-mono text-xs uppercase tracking-[0.14em] text-text-secondary">Issued: </dt>
                          <dd className="inline">{certification.issued}</dd>
                        </div>
                        <div>
                          <dt className="inline font-mono text-xs uppercase tracking-[0.14em] text-text-secondary">Credential: </dt>
                          <dd className="inline break-all">
                            {certification.credential === "-" ? (
                              "Not public"
                            ) : (
                              <a href={certification.credential} className="text-accent underline-offset-4 hover:underline">
                                View credential
                              </a>
                            )}
                          </dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {linkedInAwards ? (
              <section className="rounded-xl border border-border bg-surface p-5">
                <h2 className="text-xl font-semibold text-text-primary">Honours and awards</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-text-secondary">
                  {cleanMarkdownText(linkedInAwards.content)}
                </p>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
