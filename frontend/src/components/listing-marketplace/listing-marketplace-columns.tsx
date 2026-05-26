"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  BadgeCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { ListingRow } from "./listing-marketplace.types";
import { shortenAddress } from "./listing-marketplace.utils";

type CreateListingMarketplaceColumnsParams = {
  rows: ListingRow[];
  selectedListingIds: string[];
  onToggleSelectedListing: (id: string) => void;
  onSetSelectedListingIds: (ids: string[]) => void;
  onClearSelectedListings: () => void;
  onRemoveListing: (id: string) => void;
  onBuyListing: (id: string) => void;
};

export function createListingMarketplaceColumns({
  rows,
  selectedListingIds,
  onToggleSelectedListing,
  onSetSelectedListingIds,
  onClearSelectedListings,
  onRemoveListing,
  onBuyListing,
}: CreateListingMarketplaceColumnsParams): ColumnDef<ListingRow>[] {
  return [
    {
      id: "select",
      header: () => {
        const allSelected =
          rows.length > 0 &&
          rows.every((row) => selectedListingIds.includes(row.id));

        return (
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                onSetSelectedListingIds(rows.map((row) => row.id));
              } else {
                onClearSelectedListings();
              }
            }}
            aria-label="Select all listings"
          />
        );
      },
      cell: ({ row }) => {
        const listingId = row.original.id;

        return (
          <Checkbox
            checked={selectedListingIds.includes(listingId)}
            onCheckedChange={() => onToggleSelectedListing(listingId)}
            aria-label="Select listing"
          />
        );
      },
    },
    {
      accessorKey: "tick",
      header: "Tick",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono">
          {row.original.tick}
        </Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "priceRaw",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-zinc-300 hover:bg-transparent hover:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-zinc-100">{row.original.price}</span>
      ),
    },
    {
      accessorKey: "seller",
      header: "Seller",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-zinc-300">
          {shortenAddress(row.original.seller)}
        </span>
      ),
    },
    {
      accessorKey: "orderNumber",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.orderNumber}</span>
      ),
    },
    {
      accessorKey: "signatureStatus",
      header: "Signature",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.signatureStatus === "signed"
              ? "default"
              : "destructive"
          }
          className="gap-1"
        >
          {row.original.signatureStatus === "signed" && (
            <BadgeCheck className="h-3.5 w-3.5" />
          )}
          {row.original.signatureStatus === "signed" ? "Signed" : "Missing"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onBuyListing(row.original.id)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Buy
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onRemoveListing(row.original.id)}
          >
            <Trash2 className="h-4 w-4 text-zinc-400" />
          </Button>
        </div>
      ),
    },
  ];
}
