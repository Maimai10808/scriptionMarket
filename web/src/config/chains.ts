import { defineChain } from "viem";

function buildOptionalChain(config: {
  id: number;
  name: string;
  rpcUrl: string | undefined;
  blockExplorer: string;
}) {
  if (!config.rpcUrl) {
    return null;
  }

  return defineChain({
    id: config.id,
    name: config.name,
    nativeCurrency: {
      name: "MXC",
      symbol: "MXC",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [config.rpcUrl],
      },
    },
    blockExplorers: {
      default: {
        name: `${config.name} Explorer`,
        url: config.blockExplorer,
      },
    },
  });
}

export const anvilChain = defineChain({
  id: 31337,
  name: "Anvil Local",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_LOCAL_RPC_URL ?? "http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: {
      name: "Localhost",
      url: "http://127.0.0.1:8545",
    },
  },
});

export const optionalChains = [
  buildOptionalChain({
    id: 5167003,
    name: "MXC Testnet",
    rpcUrl: process.env.NEXT_PUBLIC_MXC_TEST_RPC_URL,
    blockExplorer: "https://explorer.mxc.com",
  }),
  buildOptionalChain({
    id: 18686,
    name: "MXC Mainnet",
    rpcUrl: process.env.NEXT_PUBLIC_MXC_MAIN_RPC_URL,
    blockExplorer: "https://explorer.mxc.com",
  }),
].filter((chain): chain is NonNullable<typeof chain> => chain !== null);

export const configuredChains = [anvilChain, ...optionalChains] as const;

export const configuredChainIds = configuredChains.map((chain) => chain.id);

export const chainMetadataById = new Map(
  configuredChains.map((chain) => [chain.id, chain] as const),
);

export function getConfiguredChain(chainId?: number | null) {
  if (!chainId) {
    return null;
  }

  return chainMetadataById.get(chainId) ?? null;
}
