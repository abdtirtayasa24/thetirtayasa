import type { Metadata } from "next";

import { SectionLabel } from "@/components/SectionLabel";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Download Abdul F. Tirtayasa's résumé.",
};

export default function ResumePage() {
  const hasResumeUrl = siteConfig.resume.url.length > 0;

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-surface p-8">
        <SectionLabel>Résumé</SectionLabel>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">Download résumé</h1>
        <p className="mt-5 leading-7 text-text-secondary">
          The résumé is provided as a downloadable PDF only. The public filename is {siteConfig.resume.basename}.
        </p>
        {hasResumeUrl ? (
          <a className="mt-8 inline-flex min-h-11 items-center rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-[#071009]" href={siteConfig.resume.url}>
            Download {siteConfig.resume.basename}
          </a>
        ) : (
          <p className="mt-8 rounded-lg border border-border bg-background/60 p-4 text-sm text-text-secondary">
            The public Google Drive résumé URL is not configured yet.
          </p>
        )}
      </div>
    </main>
  );
}
