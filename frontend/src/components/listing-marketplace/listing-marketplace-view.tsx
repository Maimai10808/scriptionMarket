"use client";

import {
  flexRender,
  type Table as TanstackTable,
} from "@tanstack/react-table";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { ListingRow } from "./listing-marketplace.types";

type ListingMarketplaceViewProps = {
  table: TanstackTable<ListingRow>;
  columnsCount: number;
  selectedCount: number;
  onPrepareBatchPurchase: () => void;
};

export function ListingMarketplaceView({
  table,
  columnsCount,
  selectedCount,
  onPrepareBatchPurchase,
}: ListingMarketplaceViewProps) {
  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950 text-white shadow-xl">
      <CardContent className="space-y-4 p-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-zinc-800 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-zinc-400">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-zinc-800 hover:bg-zinc-800/40"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableCell
                    colSpan={columnsCount}
                    className="h-32 text-center text-zinc-500"
                  >
                    No signed listings yet. Create one from the listing form
                    first.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-500">
            Selected listings can be used later for batch purchase.
          </p>

          <Button
            variant="secondary"
            disabled={selectedCount === 0}
            onClick={onPrepareBatchPurchase}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Prepare Batch Purchase
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
