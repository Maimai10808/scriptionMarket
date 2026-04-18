import { formatEther, isAddress } from "viem";
import type {
  ListingFormValues,
  MarketStorage,
  SignedListing,
} from "@/lib/contracts/types";

export function formatAddress(address?: string | null) {
  if (!address) {
    return "--";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimestamp(value?: bigint | number | null) {
  if (value === null || value === undefined) {
    return "--";
  }

  const timestamp = typeof value === "bigint" ? Number(value) : value;
  return new Date(timestamp * 1000).toLocaleString();
}

export function formatWei(value?: bigint | null) {
  if (value === null || value === undefined) {
    return "--";
  }

  return `${formatEther(value)} ETH`;
}

export function formatBigInt(value?: bigint | null) {
  if (value === null || value === undefined) {
    return "--";
  }

  return value.toString();
}

export function getOrderStatusLabel(status?: bigint | null) {
  if (status === null || status === undefined) {
    return "--";
  }

  if (status === 0n) return "Listing";
  if (status === 1n) return "Canceled";
  if (status === 2n) return "Sold";
  return `Unknown(${status.toString()})`;
}

export function listingToFormValues(listing: MarketStorage): ListingFormValues {
  return {
    number: listing.number.toString(),
    maker: listing.maker,
    time: listing.time.toString(),
    amount: listing.amount.toString(),
    price: listing.price.toString(),
    tick: listing.tick,
  };
}

export function serializeSignedListing(listing: SignedListing) {
  return JSON.stringify(
    {
      marketStorage: {
        number: listing.marketStorage.number.toString(),
        maker: listing.marketStorage.maker,
        time: listing.marketStorage.time.toString(),
        amount: listing.marketStorage.amount.toString(),
        price: listing.marketStorage.price.toString(),
        tick: listing.marketStorage.tick,
      },
      signature: listing.signature,
    },
    null,
    2,
  );
}

function requireBigIntField(value: unknown, field: string) {
  if (typeof value !== "string" && typeof value !== "number") {
    throw new Error(`${field} must be a stringified integer`);
  }

  return BigInt(value);
}

export function parseSignedListingJson(raw: string): SignedListing {
  const parsed = JSON.parse(raw) as {
    marketStorage?: {
      number?: string;
      maker?: string;
      time?: string;
      amount?: string;
      price?: string;
      tick?: string;
    };
    signature?: string;
  };

  if (!parsed.marketStorage) {
    throw new Error("marketStorage is required");
  }

  if (!parsed.signature?.startsWith("0x")) {
    throw new Error("signature is invalid");
  }

  if (!isAddress(parsed.marketStorage.maker ?? "")) {
    throw new Error("maker is invalid");
  }

  return {
    marketStorage: {
      number: requireBigIntField(parsed.marketStorage.number, "number"),
      maker: parsed.marketStorage.maker as `0x${string}`,
      time: requireBigIntField(parsed.marketStorage.time, "time"),
      amount: requireBigIntField(parsed.marketStorage.amount, "amount"),
      price: requireBigIntField(parsed.marketStorage.price, "price"),
      tick: parsed.marketStorage.tick?.trim() ?? "",
    },
    signature: parsed.signature as `0x${string}`,
  };
}
