import { isAddress } from "viem";
import type { Address } from "viem";
import type { ListingFormValues, MarketStorage } from "@/lib/contracts/types";

export const LISTING_PRIMARY_TYPE = "Listing";

export const LISTING_TYPES = {
  Listing: [
    { name: "maker", type: "address" },
    { name: "time", type: "uint256" },
    { name: "amount", type: "uint256" },
    { name: "price", type: "uint256" },
    { name: "tick", type: "string" },
  ],
} as const;

function parsePositiveBigInt(value: string, field: string) {
  try {
    const parsed = BigInt(value);
    if (parsed <= 0n) {
      throw new Error(`${field} must be greater than 0`);
    }

    return parsed;
  } catch {
    throw new Error(`${field} must be a valid integer`);
  }
}

export function normalizeListingForm(values: ListingFormValues): MarketStorage {
  if (!isAddress(values.maker)) {
    throw new Error("maker address is invalid");
  }

  if (!values.tick.trim()) {
    throw new Error("tick is required");
  }

  return {
    number: parsePositiveBigInt(values.number, "number"),
    maker: values.maker as Address,
    time: parsePositiveBigInt(values.time, "time"),
    amount: parsePositiveBigInt(values.amount, "amount"),
    price: parsePositiveBigInt(values.price, "price"),
    tick: values.tick.trim(),
  };
}

export function buildListingTypedData(params: {
  chainId: number;
  marketAddress: Address;
  listing: MarketStorage;
}) {
  const { chainId, marketAddress, listing } = params;

  return {
    domain: {
      name: "MscMarketV1",
      version: "1.0",
      chainId,
      verifyingContract: marketAddress,
    },
    primaryType: LISTING_PRIMARY_TYPE,
    types: LISTING_TYPES,
    message: {
      maker: listing.maker,
      time: listing.time,
      amount: listing.amount,
      price: listing.price,
      tick: listing.tick,
    },
  } as const;
}
