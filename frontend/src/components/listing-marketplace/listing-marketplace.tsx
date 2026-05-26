"use client";

import { useMemo, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { MotionReveal } from "@/components/animations/MotionReveal";

import { ListingMarketplaceSummary } from "./listing-marketplace-summary";
import { createListingMarketplaceColumns } from "./listing-marketplace-columns";
import { ListingMarketplaceView } from "./listing-marketplace-view";
import type { ListingRow } from "./listing-marketplace.types";

type ListingMarketplaceProps = {
  rows: ListingRow[];
  listingsCount: number;
  selectedListingIds: string[];
  totalSelectedPrice: bigint;
  onToggleSelectedListing: (id: string) => void;
  onSetSelectedListingIds: (ids: string[]) => void;
  onClearSelectedListings: () => void;
  onRemoveListing: (id: string) => void;
  onBuyListing: (id: string) => void;
  onPrepareBatchPurchase: () => void;
};

export function ListingMarketplace({
  rows,
  listingsCount,
  selectedListingIds,
  totalSelectedPrice,
  onToggleSelectedListing,
  onSetSelectedListingIds,
  onClearSelectedListings,
  onRemoveListing,
  onBuyListing,
  onPrepareBatchPurchase,
}: ListingMarketplaceProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () =>
      createListingMarketplaceColumns({
        rows,
        selectedListingIds,
        onToggleSelectedListing,
        onSetSelectedListingIds,
        onClearSelectedListings,
        onRemoveListing,
        onBuyListing,
      }),
    [
      rows,
      selectedListingIds,
      onToggleSelectedListing,
      onSetSelectedListingIds,
      onClearSelectedListings,
      onRemoveListing,
      onBuyListing,
    ],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <MotionReveal y={16} duration={0.35} className="w-full">
      <ListingMarketplaceSummary
        listingsCount={listingsCount}
        selectedCount={selectedListingIds.length}
        totalSelectedPrice={totalSelectedPrice}
      />

      <ListingMarketplaceView
        table={table}
        columnsCount={columns.length}
        selectedCount={selectedListingIds.length}
        onPrepareBatchPurchase={onPrepareBatchPurchase}
      />
    </MotionReveal>
  );
}
