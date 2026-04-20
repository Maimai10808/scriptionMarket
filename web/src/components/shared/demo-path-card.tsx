"use client";

import Link from "next/link";

type DemoPathCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export function DemoPathCard({
  eyebrow,
  title,
  description,
  href,
  cta,
}: DemoPathCardProps) {
  return (
    <article className="dashboard-module material-surface material-enter rounded-[1.6rem] p-6 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--elevation-2)]">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[color:var(--primary)]">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{description}</p>
      <Link
        href={href}
        className="button-outlined material-ripple mt-auto inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-slate-900"
      >
        {cta}
      </Link>
    </article>
  );
}
