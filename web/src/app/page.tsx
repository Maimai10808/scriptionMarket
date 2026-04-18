"use client";

import { PageHero } from "@/components/shared/page-hero";
import { SectionCard } from "@/components/shared/section-card";
import { ContractSummary } from "@/components/market/contract-summary";
import { useMarketRead } from "@/hooks/use-market-read";
import { useAccount } from "wagmi";

export default function Home() {
  const { address } = useAccount();
  const { chainId, chain, marketAddress, summary, isLoading, isSupportedChain } =
    useMarketRead();

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Dashboard"
        title="Protocol status, wallet context, and live proxy reads"
        description="This page reads the deployed proxy directly and surfaces the protocol values needed to verify the frontend is wired to the correct chain, address, ABI, and ownership state."
      />

      <SectionCard
        eyebrow="Health Check"
        title="Connection summary"
        description={
          isSupportedChain
            ? "The current chain is configured for market reads and writes."
            : "Connect a configured chain and provide RPC URLs for MXC networks to enable reads and writes."
        }
      >
        <ContractSummary
          walletAddress={address}
          chainId={chainId}
          chainName={chain?.name ?? "Unsupported chain"}
          marketAddress={marketAddress}
          summary={summary}
          isLoading={isLoading}
        />
      </SectionCard>
    </div>
  );
}
