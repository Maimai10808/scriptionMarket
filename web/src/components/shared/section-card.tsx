type SectionCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  className = "",
  children,
}: SectionCardProps) {
  return (
    <section className={`panel material-elevated material-enter rounded-[1.75rem] p-6 lg:p-8 ${className}`}>
      <div className="mb-6 space-y-2">
        {eyebrow ? (
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--primary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-[1.7rem] font-semibold tracking-tight text-slate-950">{title}</h2>
        {description ? <p className="max-w-3xl text-sm leading-6 text-[color:var(--muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
