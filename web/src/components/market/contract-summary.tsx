"use client";

import { formatAddress, formatBigInt } from "@/lib/contracts/formatters";
import type { MarketProtocolSummary } from "@/lib/contracts/types";

type ContractSummaryProps = {
  walletAddress: `0x${string}` | undefined;
  chainId: number;
  chainName: string;
  marketAddress: `0x${string}` | null;
  summary: MarketProtocolSummary;
  isLoading: boolean;
};

const STAT_ITEMS = [
  { label: "Owner", key: "owner" },
  { label: "Admin", key: "adminAddress" },
  { label: "Fee Bps", key: "feeBps" },
  { label: "Version", key: "version" },
  { label: "Buy Enabled", key: "buyEnabled" },
  { label: "Withdraw Enabled", key: "withdrawEnabled" },
] as const;

export function ContractSummary({
  walletAddress,
  chainId,
  chainName,
  marketAddress,
  summary,
  isLoading,
}: ContractSummaryProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1.8fr]">
      <div className="rounded-3xl bg-slate-950 p-6 text-white">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
          wallet session
        </p>
        <div className="mt-6 grid gap-4">
          <div>
            <p className="text-sm text-slate-400">Connected Wallet</p>
            <p className="mt-1 break-all text-base font-medium">
              {walletAddress ? formatAddress(walletAddress) : "Not connected"}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Network</p>
            <p className="mt-1 text-base font-medium">
              {chainName} ({chainId})
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Proxy Address</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-200">
              {marketAddress ?? "Unavailable"}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {STAT_ITEMS.map((item) => {
          const value = summary[item.key];
          const renderedValue =
            typeof value === "boolean"
              ? value
                ? "Enabled"
                : "Disabled"
              : typeof value === "bigint"
                ? formatBigInt(value)
                : typeof value === "string"
                  ? formatAddress(value)
                  : "--";

          return (
            <article
              key={item.key}
              className="rounded-2xl border border-slate-200/80 bg-white/72 p-5"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-950">
                {isLoading ? "Loading..." : renderedValue}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
