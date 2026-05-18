export function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}
