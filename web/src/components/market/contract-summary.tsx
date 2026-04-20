"use client";

import {
  formatAddress,
  formatBigInt,
  formatFileName,
  formatIsoToCompact,
  formatTimestamp,
  formatTimestampCompact,
} from "@/lib/contracts/formatters";
import { marketGeneratedAt, type MscMarketDeployment } from "@/lib/contracts/market";
import type { MarketProtocolSummary } from "@/lib/contracts/types";
import { StatCard } from "@/components/shared/stat-card";

type ContractSummaryProps = {
  walletAddress: `0x${string}` | undefined;
  chainId: number;
  chainName: string;
  marketAddress: `0x${string}` | null;
  summary: MarketProtocolSummary;
  deployment: MscMarketDeployment | null;
  supportState: "ready" | "missing-rpc" | "missing-deployment" | "unsupported-chain";
  isLoading: boolean;
};

export function ContractSummary({
  walletAddress,
  chainId,
  chainName,
  marketAddress,
  summary,
  deployment,
  supportState,
  isLoading,
}: ContractSummaryProps) {
  const readinessLabel =
    supportState === "ready"
      ? "Ready"
      : supportState === "missing-rpc"
        ? "Missing RPC"
      : supportState === "missing-deployment"
          ? "No Deployment"
          : "Unsupported";

  const deploymentFileName = formatFileName(deployment?.source);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-slate-400">
          active session
        </p>
        <div className="mt-5 grid gap-4">
          <StatCard
            label="Wallet"
            value={walletAddress ? formatAddress(walletAddress) : "Not connected"}
            detail={walletAddress ?? "Connect a wallet to sign listings, buy, or manage protocol settings."}
            tone="dark"
            valueClassName="break-words"
            detailClassName="break-all text-slate-300/80"
          />
          <StatCard
            label="Chain"
            value={`${chainName} (${chainId || "--"})`}
            detail={`Frontend sync state: ${readinessLabel}`}
            tone="dark"
            valueClassName="break-words"
          />
          <StatCard
            label="Proxy address"
            value={marketAddress ? formatAddress(marketAddress) : "No synced proxy address"}
            detail="The UI always targets the proxy, never the implementation."
            tone="dark"
            valueClassName="break-words text-base sm:text-lg"
            detailClassName="text-slate-300/80"
            valueTitle={marketAddress ?? undefined}
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <div className="grid min-w-0 gap-4">
          <StatCard
            label="Implementation"
            value={
              deployment?.implementationAddress
                ? formatAddress(deployment.implementationAddress)
                : "Unavailable"
            }
            detail={
              deployment?.source
                ? `${deploymentFileName} · synced from Foundry broadcast`
                : "No deployment artifact is currently synced for this chain."
            }
            valueClassName="break-words text-base sm:text-lg"
            detailClassName="break-words"
            valueTitle={deployment?.implementationAddress ?? undefined}
          />
          <StatCard
            label="Deployment time"
            value={
              deployment?.deploymentTimestamp
                ? formatTimestampCompact(BigInt(deployment.deploymentTimestamp))
                : "--"
            }
            detail={deployment?.deployedAt ?? "Waiting for a deployment artifact."}
            valueClassName="break-words"
            detailClassName="break-words"
            valueTitle={
              deployment?.deploymentTimestamp
                ? formatTimestamp(BigInt(deployment.deploymentTimestamp))
                : undefined
            }
          />
          <StatCard
            label="ABI sync"
            value={formatIsoToCompact(marketGeneratedAt)}
            detail="Generated contract metadata timestamp used by the frontend."
            valueClassName="break-words"
            valueTitle={new Date(marketGeneratedAt).toLocaleString()}
          />
        </div>

        <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard
            label="Owner"
            value={isLoading ? "Loading..." : summary.owner ? formatAddress(summary.owner) : "--"}
            detail={summary.owner ?? "Owner not available until reads complete."}
            valueClassName="break-words"
            detailClassName="break-all"
            valueTitle={summary.owner ?? undefined}
            detailTitle={summary.owner ?? undefined}
          />
          <StatCard
            label="Admin"
            value={
              isLoading ? "Loading..." : summary.adminAddress ? formatAddress(summary.adminAddress) : "--"
            }
            detail={summary.adminAddress ?? "Admin address not available until reads complete."}
            valueClassName="break-words"
            detailClassName="break-all"
            valueTitle={summary.adminAddress ?? undefined}
            detailTitle={summary.adminAddress ?? undefined}
          />
          <StatCard
            label="Protocol fee"
            value={
              isLoading
                ? "Loading..."
                : summary.feeBps !== null
                  ? `${formatBigInt(summary.feeBps)} (contract units)`
                  : "--"
            }
            detail="Current contract formula is price * feeBps / 100."
            tone="accent"
            valueClassName="break-words"
          />
        </div>
      </div>
    </div>
  );
}
