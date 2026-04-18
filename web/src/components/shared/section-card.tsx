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
    <section className={`panel rounded-3xl p-6 lg:p-8 ${className}`}>
      <div className="mb-6 space-y-2">
        {eyebrow ? (
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
        {description ? <p className="max-w-3xl text-sm text-slate-600">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
