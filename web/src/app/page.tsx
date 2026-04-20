"use client";

import { useMemo } from "react";
import { useAccount } from "wagmi";
import { ContractSummary } from "@/components/market/contract-summary";
import { DemoPathCard } from "@/components/shared/demo-path-card";
import { PageHero } from "@/components/shared/page-hero";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBanner } from "@/components/shared/status-banner";
import { useMarketRead } from "@/hooks/use-market-read";

export default function Home() {
  const { address, isConnected } = useAccount();
  const {
    chainId,
    chain,
    deployment,
    marketAddress,
    summary,
    isLoading,
    isSupportedChain,
    supportState,
    statusMessage,
  } = useMarketRead();

  const heroStatus = useMemo(() => {
    if (!isConnected) {
      return {
        tone: "warning" as const,
        title: "Wallet not connected",
        description:
          "Connect a wallet to sign listings, execute purchases, and access protocol writes.",
      };
    }

    if (!isSupportedChain) {
      return {
        tone: supportState === "unsupported-chain" ? ("error" as const) : ("warning" as const),
        title: "Demo environment needs attention",
        description: statusMessage,
      };
    }

    return {
      tone: "success" as const,
      title: "Demo environment ready",
      description:
        "The wallet, synced proxy deployment, ABI, and chain configuration are aligned for live reads and writes.",
    };
  }, [isConnected, isSupportedChain, statusMessage, supportState]);

  const actorValue = useMemo(() => {
    if (!address) return "Connect wallet";
    if (address === summary.owner) return "Owner";
    if (address === summary.adminAddress) return "Admin";
    return "Trader";
  }, [address, summary.adminAddress, summary.owner]);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="MSC Settlement Demo"
        title="A proxy-first Web3 marketplace demo with synced contract intelligence"
        description="The dashboard shows the exact proxy deployment the frontend is wired to, highlights readiness issues before a live demo, and maps the fastest path through seller signing, buyer settlement, and protocol admin actions."
      />

      <StatusBanner
        tone={heroStatus.tone}
        title={heroStatus.title}
        description={heroStatus.description}
      />

      <SectionCard
        eyebrow="Control Room"
        title="What this frontend is connected to right now"
        description="This summary comes from the generated contract manifest plus live reads against the currently selected proxy deployment."
      >
        <ContractSummary
          walletAddress={address}
          chainId={chainId}
          chainName={chain?.name ?? "Unknown / unsupported chain"}
          marketAddress={marketAddress}
          summary={summary}
          deployment={deployment}
          supportState={supportState}
          isLoading={isLoading}
        />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionCard
          eyebrow="Demo Paths"
          title="Three clean flows to walk through live"
          description="These are the highest-value paths for showing the project as a complete DApp instead of a loose collection of contract calls."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            <DemoPathCard
              eyebrow="Seller"
              title="Create listing"
              description="Prepare market storage values, sign the EIP-712 payload against the proxy, and export a signed JSON order."
              href="/create-listing"
              cta="Open seller flow"
            />
            <DemoPathCard
              eyebrow="Buyer"
              title="Settle purchase"
              description="Load the signed JSON, preview the order, send `mscPurchase`, and confirm the on-chain settlement result."
              href="/marketplace"
              cta="Open buyer flow"
            />
            <DemoPathCard
              eyebrow="Protocol"
              title="Manage protocol"
              description="Read live order status or failed payouts, then toggle features, update fee, or withdraw protocol balance."
              href="/protocol"
              cta="Open protocol flow"
            />
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Operator"
          title="Current demo posture"
          description="Useful for narrating what the connected account can actually do."
        >
          <div className="grid gap-4">
            <StatCard
              label="Current role"
              value={actorValue}
              detail={
                actorValue === "Owner" || actorValue === "Admin"
                  ? "This account can demonstrate read flows and admin writes."
                  : "This account is best suited for seller signing and buyer purchase demos."
              }
            />
            <StatCard
              label="Buy feature"
              value={
                summary.buyEnabled === null
                  ? "Loading..."
                  : summary.buyEnabled
                    ? "Enabled"
                    : "Disabled"
              }
              detail="When disabled, buyer purchase calls will revert."
            />
            <StatCard
              label="Withdraw feature"
              value={
                summary.withdrawEnabled === null
                  ? "Loading..."
                  : summary.withdrawEnabled
                    ? "Enabled"
                    : "Disabled"
              }
              detail="Admins can only withdraw when this feature flag is enabled."
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
