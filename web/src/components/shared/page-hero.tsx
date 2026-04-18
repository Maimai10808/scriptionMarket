type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div className="page-copy mb-8 pt-2 text-white">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.35em] text-slate-300">
        {eyebrow}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-7 text-slate-200 sm:text-lg">{description}</p>
    </div>
  );
}
