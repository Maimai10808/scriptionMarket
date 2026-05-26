import { create } from "zustand";
import type { Address, Hex } from "viem";

export type MarketStorage = {
  number: bigint;
  maker: Address;
  time: bigint;
  amount: bigint;
  price: bigint;
  tick: string;
};

export type ListingStatus = "draft" | "signed" | "mock";

export type SignedListing = {
  id: string;
  marketStorage: MarketStorage;
  signature?: Hex;
  status: ListingStatus;
  createdAt: number;
};

export function isPurchasableListing(
  listing: SignedListing,
): listing is SignedListing & { signature: Hex; status: "signed" } {
  return listing.status === "signed" && Boolean(listing.signature);
}

export type PendingListingDraft = {
  tick: string;
  amount: string;
  price: string;
  orderNumber: string;
  deadline: string;
};

export type PendingPurchase =
  | {
      type: "single";
      listings: [SignedListing];
    }
  | {
      type: "batch";
      listings: SignedListing[];
    };

type ListingState = {
  listings: SignedListing[];
  selectedListingIds: string[];

  pendingDraft: PendingListingDraft | null;
  isConfirmDialogOpen: boolean;

  pendingPurchase: PendingPurchase | null;
  isPurchaseDialogOpen: boolean;

  setPendingDraft: (draft: PendingListingDraft) => void;
  openConfirmDialog: () => void;
  closeConfirmDialog: () => void;
  clearPendingDraft: () => void;

  openSinglePurchase: (listing: SignedListing) => void;
  openBatchPurchase: (listings: SignedListing[]) => void;
  closePurchaseDialog: () => void;
  clearPendingPurchase: () => void;

  addListing: (listing: SignedListing) => void;
  removeListing: (id: string) => void;
  clearListings: () => void;

  toggleSelectedListing: (id: string) => void;
  setSelectedListingIds: (ids: string[]) => void;
  clearSelectedListings: () => void;
};

export const useListingStore = create<ListingState>((set) => ({
  listings: [],
  selectedListingIds: [],

  pendingDraft: null,
  isConfirmDialogOpen: false,

  pendingPurchase: null,
  isPurchaseDialogOpen: false,

  setPendingDraft: (draft) =>
    set({
      pendingDraft: draft,
      isConfirmDialogOpen: true,
    }),

  openConfirmDialog: () => set({ isConfirmDialogOpen: true }),

  closeConfirmDialog: () => set({ isConfirmDialogOpen: false }),

  clearPendingDraft: () =>
    set({
      pendingDraft: null,
      isConfirmDialogOpen: false,
    }),

  openSinglePurchase: (listing) => {
    if (!isPurchasableListing(listing)) return;

    set({
      pendingPurchase: {
        type: "single",
        listings: [listing],
      },
      isPurchaseDialogOpen: true,
    });
  },

  openBatchPurchase: (listings) => {
    const signedListings = listings.filter(isPurchasableListing);

    if (signedListings.length === 0) return;

    set({
      pendingPurchase: {
        type: "batch",
        listings: signedListings,
      },
      isPurchaseDialogOpen: true,
    });
  },

  closePurchaseDialog: () => set({ isPurchaseDialogOpen: false }),

  clearPendingPurchase: () =>
    set({
      pendingPurchase: null,
      isPurchaseDialogOpen: false,
    }),

  addListing: (listing) =>
    set((state) => ({
      listings: [listing, ...state.listings],
    })),

  removeListing: (id) =>
    set((state) => ({
      listings: state.listings.filter((listing) => listing.id !== id),
      selectedListingIds: state.selectedListingIds.filter(
        (selectedId) => selectedId !== id,
      ),
    })),

  clearListings: () =>
    set({
      listings: [],
      selectedListingIds: [],
    }),

  toggleSelectedListing: (id) =>
    set((state) => {
      const exists = state.selectedListingIds.includes(id);

      return {
        selectedListingIds: exists
          ? state.selectedListingIds.filter((selectedId) => selectedId !== id)
          : [...state.selectedListingIds, id],
      };
    }),

  setSelectedListingIds: (ids) => set({ selectedListingIds: ids }),

  clearSelectedListings: () => set({ selectedListingIds: [] }),
}));
