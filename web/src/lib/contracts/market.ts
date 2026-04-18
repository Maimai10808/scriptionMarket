import {
  MSC_MARKET_ABI,
  MSC_MARKET_DEPLOYMENTS,
  type MscMarketDeployment,
} from "@/lib/contracts/generated/msc-market";

export const marketAbi = MSC_MARKET_ABI;
export const marketDeployments = MSC_MARKET_DEPLOYMENTS;

export function getMarketDeployment(chainId?: number | null): MscMarketDeployment | null {
  if (!chainId) {
    return null;
  }

  return marketDeployments[chainId as keyof typeof marketDeployments] ?? null;
}

export function getMarketAddress(chainId?: number | null) {
  return getMarketDeployment(chainId)?.address ?? null;
}
