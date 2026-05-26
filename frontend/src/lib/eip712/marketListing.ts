import type { Address } from "viem";
import { mscMarketV1Address } from "@/generated/wagmi";
import type { MarketStorage } from "@/stores/listingStore";

export const MARKET_LISTING_TYPES = {
  Listing: [
    { name: "number", type: "uint256" },
    { name: "maker", type: "address" },
    { name: "time", type: "uint256" },
    { name: "amount", type: "uint256" },
    { name: "price", type: "uint256" },
    { name: "tick", type: "string" },
  ],
} as const;

type BuildMarketListingTypedDataParams = {
  chainId: number;
  marketStorage: MarketStorage;
};

export function buildMarketListingTypedData({
  chainId,
  marketStorage,
}: BuildMarketListingTypedDataParams) {
  const verifyingContract =
    mscMarketV1Address[chainId as keyof typeof mscMarketV1Address];

  if (!verifyingContract) {
    throw new Error(`MscMarketV1 is not deployed on chain ${chainId}.`);
  }

  return {
    domain: {
      name: "MscMarketV1",
      version: "1.0",
      chainId,
      verifyingContract: verifyingContract as Address,
    },
    types: MARKET_LISTING_TYPES,
    primaryType: "Listing",
    message: {
      number: marketStorage.number,
      maker: marketStorage.maker,
      time: marketStorage.time,
      amount: marketStorage.amount,
      price: marketStorage.price,
      tick: marketStorage.tick,
    },
  } as const;
}
