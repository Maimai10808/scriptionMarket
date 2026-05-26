import { formatEther } from "viem";

import { isPurchasableListing, type SignedListing } from "@/stores/listingStore";
import type { ListingRow } from "./listing-marketplace.types";

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function buildListingRows(listings: SignedListing[]): ListingRow[] {
  return listings.map((listing) => ({
    id: listing.id,
    tick: listing.marketStorage.tick,
    amount: listing.marketStorage.amount.toString(),
    price: `${formatEther(listing.marketStorage.price)} ETH`,
    priceRaw: listing.marketStorage.price,
    seller: listing.marketStorage.maker,
    orderNumber: listing.marketStorage.number.toString(),
    status: listing.status,
    canPurchase: isPurchasableListing(listing),
    createdAt: listing.createdAt,
    listing,
  }));
}

export function getTotalListingsPrice(listings: SignedListing[]) {
  return listings.reduce(
    (total, listing) => total + listing.marketStorage.price,
    BigInt(0),
  );
}
