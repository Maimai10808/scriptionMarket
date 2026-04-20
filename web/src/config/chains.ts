import { defineChain } from "viem";
import { marketChainRegistry } from "@/lib/contracts/market";

function resolveRpcUrl(chainId: number) {
  if (chainId === 31337) {
    return process.env.NEXT_PUBLIC_LOCAL_RPC_URL ?? "http://127.0.0.1:8545";
  }

  if (chainId === 5167003) {
    return process.env.NEXT_PUBLIC_MXC_TEST_RPC_URL;
  }

  if (chainId === 18686) {
    return process.env.NEXT_PUBLIC_MXC_MAIN_RPC_URL;
  }

  return undefined;
}

function buildConfiguredChain(chainId: number) {
  const config = marketChainRegistry[chainId as keyof typeof marketChainRegistry];
  const rpcUrl = resolveRpcUrl(chainId);

  if (!config || !rpcUrl) {
    return null;
  }

  return defineChain({
    id: config.chainId,
    name: config.chainName,
    nativeCurrency: config.nativeCurrency,
    rpcUrls: {
      default: {
        http: [rpcUrl],
      },
    },
    blockExplorers: {
      default: {
        name: `${config.chainName} Explorer`,
        url: config.blockExplorerUrl,
      },
    },
  });
}

export const knownMarketChains = Object.values(marketChainRegistry);
export const configuredChains = knownMarketChains
  .map((chain) => buildConfiguredChain(chain.chainId))
  .filter((chain): chain is NonNullable<typeof chain> => chain !== null);

export const configuredChainIds = configuredChains.map((chain) => chain.id);

export const chainMetadataById = new Map<number, (typeof configuredChains)[number]>(
  configuredChains.map((chain) => [chain.id, chain] as const),
);

export const knownChainMetadataById = new Map<number, (typeof knownMarketChains)[number]>(
  knownMarketChains.map((chain) => [chain.chainId, chain] as const),
);

export function getConfiguredChain(chainId?: number | null) {
  if (!chainId) {
    return null;
  }

  return chainMetadataById.get(chainId) ?? null;
}

export function getKnownChain(chainId?: number | null) {
  if (!chainId) {
    return null;
  }

  return knownChainMetadataById.get(chainId) ?? null;
}
