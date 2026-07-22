import type { Metadata } from "next";

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
            Use email or WhatsApp for direct contact. A backend-stored contact form will be connected in the next implementation phase.
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
              GitHub and LinkedIn calls to action are ready and will appear when their public URLs are added to content/profile.yaml.
            </p>
          ) : null}
        </section>

        <form className="rounded-xl border border-border bg-surface p-6" aria-describedby="contact-form-note">
          <div className="grid gap-5">
            <div>
              <label className="block text-sm font-medium text-text-primary" htmlFor="name">Name</label>
              <input className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3 text-text-primary" id="name" name="name" type="text" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary" htmlFor="email">Email</label>
              <input className="mt-2 min-h-11 w-full rounded-md border border-border bg-background px-3 text-text-primary" id="email" name="email" type="email" disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary" htmlFor="message">Message</label>
              <textarea className="mt-2 min-h-32 w-full rounded-md border border-border bg-background p-3 text-text-primary" id="message" name="message" disabled />
            </div>
            <p id="contact-form-note" className="rounded-lg border border-border bg-background/60 p-4 text-sm leading-6 text-text-secondary">
              Form submission will be enabled when the Supabase-backed contact endpoint is implemented. For now, please use email or WhatsApp.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
