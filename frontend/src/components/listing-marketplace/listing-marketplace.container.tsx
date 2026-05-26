"use client";

import { useMemo } from "react";

import { isPurchasableListing, useListingStore } from "@/stores/listingStore";

import { ListingMarketplace } from "./listing-marketplace";
import {
  buildListingRows,
  getTotalListingsPrice,
} from "./listing-marketplace.utils";

export function ListingMarketplaceContainer() {
  const listings = useListingStore((state) => state.listings);
  const selectedListingIds = useListingStore((state) => state.selectedListingIds);

  const toggleSelectedListing = useListingStore(
    (state) => state.toggleSelectedListing,
  );
  const setSelectedListingIds = useListingStore(
    (state) => state.setSelectedListingIds,
  );
  const clearSelectedListings = useListingStore(
    (state) => state.clearSelectedListings,
  );
  const removeListing = useListingStore((state) => state.removeListing);

  const openSinglePurchase = useListingStore((state) => state.openSinglePurchase);
  const openBatchPurchase = useListingStore((state) => state.openBatchPurchase);

  const rows = useMemo(() => buildListingRows(listings), [listings]);

  const handleToggleSelectedListing = (listingId: string) => {
    const listing = listings.find((item) => item.id === listingId);

    if (!listing || !isPurchasableListing(listing)) return;

    toggleSelectedListing(listingId);
  };

  const handleSetSelectedListingIds = (ids: string[]) => {
    const purchasableIds = new Set(
      listings.filter(isPurchasableListing).map((listing) => listing.id),
    );

    setSelectedListingIds(ids.filter((id) => purchasableIds.has(id)));
  };

  const selectedListings = useMemo(() => {
    return listings.filter(
      (listing) =>
        selectedListingIds.includes(listing.id) &&
        isPurchasableListing(listing),
    );
  }, [listings, selectedListingIds]);

  const totalSelectedPrice = useMemo(() => {
    return getTotalListingsPrice(selectedListings);
  }, [selectedListings]);

  const handleBuyListing = (listingId: string) => {
    const listing = listings.find((item) => item.id === listingId);

    if (!listing) return;

    openSinglePurchase(listing);
  };

  const handlePrepareBatchPurchase = () => {
    if (selectedListings.length === 0) return;

    openBatchPurchase(selectedListings);
  };

  return (
    <ListingMarketplace
      rows={rows}
      listingsCount={listings.length}
      selectedListingIds={selectedListingIds}
      totalSelectedPrice={totalSelectedPrice}
      onToggleSelectedListing={handleToggleSelectedListing}
      onSetSelectedListingIds={handleSetSelectedListingIds}
      onClearSelectedListings={clearSelectedListings}
      onRemoveListing={removeListing}
      onBuyListing={handleBuyListing}
      onPrepareBatchPurchase={handlePrepareBatchPurchase}
    />
  );
}
