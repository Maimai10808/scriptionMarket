import {
  MSC_MARKET_ABI,
  MSC_MARKET_CHAIN_REGISTRY,
  MSC_MARKET_DEPLOYMENT_CHAIN_IDS,
  MSC_MARKET_DEPLOYMENTS,
  MSC_MARKET_GENERATED_AT,
  type MscMarketChain,
  type MscMarketDeployment,
} from "@/lib/contracts/generated/msc-market";

export const marketAbi = MSC_MARKET_ABI;
export const marketChainRegistry = MSC_MARKET_CHAIN_REGISTRY;
export const marketDeployments = MSC_MARKET_DEPLOYMENTS;
export const marketDeploymentChainIds = MSC_MARKET_DEPLOYMENT_CHAIN_IDS;
export const marketGeneratedAt = MSC_MARKET_GENERATED_AT;
export type { MscMarketDeployment, MscMarketChain } from "@/lib/contracts/generated/msc-market";

export function getMarketDeployment(chainId?: number | null): MscMarketDeployment | null {
  if (!chainId) {
    return null;
  }

  return marketDeployments[chainId as keyof typeof marketDeployments] ?? null;
}

export function getMarketAddress(chainId?: number | null) {
  return getMarketDeployment(chainId)?.address ?? null;
}

export function getKnownMarketChain(chainId?: number | null): MscMarketChain | null {
  if (!chainId) {
    return null;
  }

  return marketChainRegistry[chainId as keyof typeof marketChainRegistry] ?? null;
}
