import type { Metadata } from "next";

import { EmptyState } from "@/components/EmptyState";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Notes",
  description: "Technical notes by Abdul F. Tirtayasa.",
};

export default function NotesPage() {
  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Notes</SectionLabel>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary">Technical notes</h1>
        <div className="mt-10">
          <EmptyState
            title="Notes are planned after the portfolio MVP"
            description="This section is ready for future engineering articles or technical notes without affecting the core portfolio launch."
          />
        </div>
      </div>
    </main>
  );
}
