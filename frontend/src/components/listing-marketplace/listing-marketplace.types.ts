import type { SignedListing } from "@/stores/listingStore";

export type ListingRow = {
  id: string;
  tick: string;
  amount: string;
  price: string;
  priceRaw: bigint;
  seller: string;
  orderNumber: string;
  status: "draft" | "signed" | "mock";
  canPurchase: boolean;
  createdAt: number;
  listing: SignedListing;
};
