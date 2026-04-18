type TxStatusProps = {
  label: string;
  value: string;
};

export function TxStatus({ label, value }: TxStatusProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
