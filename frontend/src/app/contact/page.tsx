import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { SectionLabel } from "@/components/SectionLabel";
import { getProfile } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Abdul F. Tirtayasa for data analytics, automation, and AI solutions.",
};

export default function ContactPage() {
  const profile = getProfile();
  const professionalLinks = [
    { label: "GitHub", href: profile.contact.githubUrl },
    { label: "LinkedIn", href: profile.contact.linkedinUrl },
  ].filter((link): link is { label: string; href: string } => Boolean(link.href));

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <section>
          <SectionLabel>Contact</SectionLabel>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">Discuss data, automation, or AI needs.</h1>
          <p className="mt-5 leading-7 text-text-secondary">
            Use email, WhatsApp, or the contact form to discuss data, automation, and AI enablement needs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="inline-flex min-h-11 items-center rounded-md border border-accent bg-accent px-4 py-2 text-sm font-semibold text-[#071009]" href={`mailto:${siteConfig.contact.email}`}>
              Email Abdul
            </a>
            <a className="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-text-primary" href={siteConfig.contact.whatsappUrl}>
              WhatsApp
            </a>
            {professionalLinks.map((link) => (
              <a key={link.label} className="inline-flex min-h-11 items-center rounded-md border border-border px-4 py-2 text-sm font-semibold text-text-primary" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          {professionalLinks.length === 0 ? (
            <p className="mt-4 text-sm text-text-secondary">
              Public GitHub and LinkedIn links are not available on this profile.
            </p>
          ) : null}
        </section>

        <ContactForm />
      </div>
    </main>
  );
}
