import type { SignedListing } from "@/stores/listingStore";

export type ListingRow = {
  id: string;
  tick: string;
  amount: string;
  price: string;
  priceRaw: bigint;
  seller: string;
  orderNumber: string;
  signatureStatus: "signed" | "missing";
  createdAt: number;
  listing: SignedListing;
};
