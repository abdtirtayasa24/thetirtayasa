import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-text-secondary md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-text-primary">Data Analyst & AI Enabler</p>
          <p className="mt-2 max-w-xl">
            Data analytics, automation, and AI solutions aligned with business goals.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${siteConfig.contact.email}`}>
            Email
          </a>
          <a className="text-accent underline-offset-4 hover:underline" href={siteConfig.contact.whatsappUrl}>
            WhatsApp
          </a>
          <Link className="text-accent underline-offset-4 hover:underline" href="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
