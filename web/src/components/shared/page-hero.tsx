type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="hero-surface material-enter mb-8 rounded-[2rem] px-6 py-7 text-white sm:px-8 sm:py-9">
      <div className="page-copy">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-cyan-100/80">
          {eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-base leading-7 text-slate-200/92 sm:text-lg">{description}</p>
      </div>
    </section>
  );
}
