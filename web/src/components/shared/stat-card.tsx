"use client";

type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  tone?: "default" | "dark" | "accent";
  valueClassName?: string;
  detailClassName?: string;
  valueTitle?: string;
  detailTitle?: string;
  className?: string;
};

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "border-[color:var(--border)] bg-[color:var(--surface)] text-slate-950 shadow-[var(--elevation-1)]",
  dark: "border-white/8 bg-[color:var(--surface-dark-raised)] text-white shadow-[var(--elevation-2)]",
  accent: "border-transparent bg-[color:var(--primary-soft)] text-slate-950 shadow-[var(--elevation-1)]",
};

export function StatCard({
  label,
  value,
  detail,
  tone = "default",
  valueClassName = "",
  detailClassName = "",
  valueTitle,
  detailTitle,
  className = "",
}: StatCardProps) {
  return (
    <article
      className={`dashboard-module material-enter min-w-0 rounded-[1.35rem] border p-5 transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--elevation-2)] ${toneClasses[tone]} ${className}`}
    >
      <div className="flex h-full flex-col">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] opacity-60">{label}</p>
        <p title={valueTitle} className={`mt-3 text-lg font-semibold ${valueClassName}`}>
          {value}
        </p>
        {detail ? (
          <p
            title={detailTitle}
            className={`mt-2 text-sm leading-5 opacity-75 ${detailClassName}`}
          >
            {detail}
          </p>
        ) : null}
      </div>
    </article>
  );
}
