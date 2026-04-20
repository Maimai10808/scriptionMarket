import type { Address } from "viem";

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
  signature: `0x${string}`;
};

export type ListingFormValues = {
  number: string;
  maker: string;
  time: string;
  amount: string;
  price: string;
  tick: string;
};

export type MarketProtocolSummary = {
  owner: Address | null;
  adminAddress: Address | null;
  feeBps: bigint | null;
  version: bigint | null;
  buyEnabled: boolean | null;
  withdrawEnabled: boolean | null;
  domainSeparator: `0x${string}` | null;
};
