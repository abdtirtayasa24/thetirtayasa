type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div role="status" className="rounded-lg border border-border bg-surface p-8 text-center">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl leading-7 text-text-secondary">{description}</p>
    </div>
  );
}
