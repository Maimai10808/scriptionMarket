import type { Address } from "viem";
import { mscMarketV1Address } from "@/generated/wagmi";
import type { MarketStorage } from "@/stores/listingStore";

export const MARKET_LISTING_TYPES = {
  MarketStorage: [
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

/**
 * 这里的 name / version 必须和合约里的 EIP712 初始化参数一致。
 * 如果你不确定，调用合约的 eip712Domain() 看 name 和 version。
 */
export function buildMarketListingTypedData({
  chainId,
  marketStorage,
}: BuildMarketListingTypedDataParams) {
  return {
    domain: {
      name: "MscMarketV1",
      version: "1",
      chainId,
      verifyingContract: mscMarketV1Address[31337] as Address,
    },
    types: MARKET_LISTING_TYPES,
    primaryType: "MarketStorage",
    message: marketStorage,
  } as const;
}
