"use client";

import { useChainId, useReadContracts } from "wagmi";
import { getConfiguredChain } from "@/config/chains";
import { getMarketDeployment, marketAbi } from "@/lib/contracts/market";
import type { MarketProtocolSummary } from "@/lib/contracts/types";

export function useMarketRead() {
  const chainId = useChainId();
  const deployment = getMarketDeployment(chainId);
  const configuredChain = getConfiguredChain(chainId);
  const marketAddress = deployment?.proxyAddress ?? null;

  const enabled = Boolean(marketAddress && configuredChain);

  const { data, isLoading, isError, error, refetch } = useReadContracts({
    contracts: enabled
      ? [
          {
            address: marketAddress!,
            abi: marketAbi,
            functionName: "owner",
          },
          {
            address: marketAddress!,
            abi: marketAbi,
            functionName: "getAdminAddress",
          },
          {
            address: marketAddress!,
            abi: marketAbi,
            functionName: "getFeeBps",
          },
          {
            address: marketAddress!,
            abi: marketAbi,
            functionName: "getVersion",
          },
          {
            address: marketAddress!,
            abi: marketAbi,
            functionName: "getFeatureStatus",
            args: ["buy"],
          },
          {
            address: marketAddress!,
            abi: marketAbi,
            functionName: "getFeatureStatus",
            args: ["withdraw"],
          },
        ]
      : [],
    query: {
      enabled,
    },
  });

  const summary: MarketProtocolSummary = {
    owner: (data?.[0]?.result as `0x${string}` | undefined) ?? null,
    adminAddress: (data?.[1]?.result as `0x${string}` | undefined) ?? null,
    feeBps: (data?.[2]?.result as bigint | undefined) ?? null,
    version: (data?.[3]?.result as bigint | undefined) ?? null,
    buyEnabled: (data?.[4]?.result as boolean | undefined) ?? null,
    withdrawEnabled: (data?.[5]?.result as boolean | undefined) ?? null,
  };

  return {
    chainId,
    chain: configuredChain,
    deployment,
    marketAddress,
    marketAbi,
    summary,
    isLoading,
    isError,
    error,
    refetch,
    isSupportedChain: enabled,
  };
}
