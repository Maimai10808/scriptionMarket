"use client";

type StatusBannerProps = {
  tone: "info" | "success" | "warning" | "error";
  title: string;
  description: string;
};

const toneClasses: Record<StatusBannerProps["tone"], string> = {
  info: "border-[rgba(91,91,214,0.18)] bg-[rgba(248,249,255,0.92)] text-slate-950",
  success: "border-[rgba(22,131,95,0.2)] bg-[rgba(241,252,247,0.96)] text-slate-950",
  warning: "border-[rgba(180,107,0,0.2)] bg-[rgba(255,248,237,0.97)] text-slate-950",
  error: "border-[rgba(193,59,74,0.18)] bg-[rgba(255,243,245,0.97)] text-slate-950",
};

export function StatusBanner({ tone, title, description }: StatusBannerProps) {
  return (
    <div
      className={`material-enter rounded-[1.35rem] border px-5 py-4 shadow-[var(--elevation-2)] backdrop-blur-sm ${toneClasses[tone]}`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-slate-700">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700/90">{description}</p>
    </div>
  );
}
