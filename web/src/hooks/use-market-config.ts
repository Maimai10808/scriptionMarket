"use client";

import { useChainId } from "wagmi";
import { getConfiguredChain } from "@/config/chains";
import { getMarketAddress, getMarketDeployment } from "@/lib/contracts/market";

export function useMarketConfig() {
  const chainId = useChainId();
  const deployment = getMarketDeployment(chainId);
  const marketAddress = getMarketAddress(chainId);
  const chain = getConfiguredChain(chainId);

  return {
    chainId,
    chain,
    deployment,
    marketAddress,
    isSupportedChain: Boolean(deployment && chain),
  };
}
