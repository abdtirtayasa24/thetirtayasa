import { ArrowRight, BarChart3, Bot, Database, FileSpreadsheet, Server } from "lucide-react";

const capabilities = [
  { label: "Python, Pandas, NumPy", icon: Server },
  { label: "SQL", icon: Database },
  { label: "Advanced Google Sheets", icon: FileSpreadsheet },
  { label: "Data Visualization", icon: BarChart3 },
  { label: "Analytics", icon: BarChart3 },
  { label: "Agentic Engineering", icon: Bot },
];

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-16 sm:px-10 lg:px-12">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 rounded-xl border border-border bg-surface p-8 shadow-2xl shadow-black/20 lg:p-12">
        <div className="max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-accent">Tirtayasa AI</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Data Analyst & AI Enabler.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Delivering data analytics, automation, and AI solutions for business needs with Python, SQL, advanced Google Sheets, visualization, analytics, and Agentic Engineering.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability) => {
            const Icon = capability.icon;

            return (
              <div key={capability.label} className="rounded-lg border border-border bg-background/50 p-4">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <p className="mt-3 font-mono text-sm text-text-primary">{capability.label}</p>
              </div>
            );
          })}
        </div>

        <a
          href="/projects"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-accent bg-accent px-4 py-3 text-sm font-semibold text-[#071009] transition hover:brightness-110"
        >
          View My Work
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
