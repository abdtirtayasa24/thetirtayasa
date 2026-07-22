"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navigation = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Résumé" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-text-primary">
          Abdul F. Tirtayasa
        </Link>

        <nav className="hidden md:block" aria-label="Primary navigation">
          <ul className="flex flex-wrap gap-2 text-sm text-text-secondary">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-md px-3 py-2 transition hover:text-accent focus-visible:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Dialog.Root>
          <Dialog.Trigger className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-text-primary transition hover:border-accent/60 hover:text-accent md:hidden" aria-label="Open navigation menu">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden" />
            <Dialog.Content className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-xl border border-border bg-surface-elevated p-5 shadow-2xl shadow-black/30 md:hidden">
              <div className="flex items-center justify-between gap-4">
                <Dialog.Title className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-text-primary">
                  Navigation
                </Dialog.Title>
                <Dialog.Close className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border text-text-primary transition hover:border-accent/60 hover:text-accent" aria-label="Close navigation menu">
                  <X className="h-5 w-5" aria-hidden="true" />
                </Dialog.Close>
              </div>
              <nav className="mt-5" aria-label="Mobile navigation">
                <ul className="grid gap-2 text-sm text-text-secondary">
                  {navigation.map((item) => (
                    <li key={item.href}>
                      <Dialog.Close asChild>
                        <Link
                          href={item.href}
                          className="flex min-h-11 items-center justify-center rounded-md border border-border bg-background/50 px-4 py-2 text-center transition hover:border-accent/60 hover:text-accent"
                        >
                          {item.label}
                        </Link>
                      </Dialog.Close>
                    </li>
                  ))}
                </ul>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
