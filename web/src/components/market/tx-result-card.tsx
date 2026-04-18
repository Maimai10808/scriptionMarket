"use client";

import { SectionCard } from "@/components/shared/section-card";

type TxResultCardProps = {
  title: string;
  status: "idle" | "pending" | "success" | "error";
  txHash: `0x${string}` | null;
  errorMessage?: string | null;
};

export function TxResultCard({
  title,
  status,
  txHash,
  errorMessage,
}: TxResultCardProps) {
  const label =
    status === "pending"
      ? "Transaction pending"
      : status === "success"
        ? "Transaction confirmed"
        : status === "error"
          ? "Transaction failed"
          : "Waiting for action";

  return (
    <SectionCard eyebrow="Transaction" title={title}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Status
          </p>
          <p className="mt-2 text-base font-semibold text-slate-950">{label}</p>
        </div>
        {txHash ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Tx Hash
            </p>
            <p className="mt-2 break-all font-mono text-xs text-slate-800">{txHash}</p>
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
