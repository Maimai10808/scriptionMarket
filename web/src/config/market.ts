export const MARKET_CONFIG = {
  5167003: {
    chainId: 5167003,
    chainName: "MXC Testnet",
    marketAddress: process.env.NEXT_PUBLIC_MARKET_TEST_ADDRESS as `0x${string}`,
  },
  18686: {
    chainId: 18686,
    chainName: "MXC Mainnet",
    marketAddress: process.env.NEXT_PUBLIC_MARKET_MAIN_ADDRESS as `0x${string}`,
  },
} as const;
