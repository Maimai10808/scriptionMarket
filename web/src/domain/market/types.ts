export type Address = `0x${string}`;

export type MarketStorage = {
  number: bigint;
  maker: Address;
  time: bigint;
  amount: bigint;
  price: bigint;
  tick: string;
};

export type SignedListing = {
  marketStorage: MarketStorage;
  signature: Address | `0x${string}`;
};

export type ContractSummary = {
  adminAddress: Address;
  feeBps: bigint;
  domainSeparator: `0x${string}`;
  buyEnabled: boolean;
  version: bigint;
};
