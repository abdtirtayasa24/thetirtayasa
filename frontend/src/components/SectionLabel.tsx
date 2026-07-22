type SectionLabelProps = {
  children: React.ReactNode;
};

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-accent">
      {children} <span className="text-border" aria-hidden="true">─────</span>
    </p>
  );
}
