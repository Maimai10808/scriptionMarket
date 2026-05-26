"use client";

import { formatEther } from "viem";
import {
  CircleDollarSign,
  PackageSearch,
  ShoppingCart,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ListingMarketplaceSummaryProps = {
  listingsCount: number;
  selectedCount: number;
  totalSelectedPrice: bigint;
};

export function ListingMarketplaceSummary({
  listingsCount,
  selectedCount,
  totalSelectedPrice,
}: ListingMarketplaceSummaryProps) {
  return (
    <Card className="mb-4 overflow-hidden border-zinc-800 bg-zinc-950 text-white shadow-xl">
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
              <PackageSearch className="h-3.5 w-3.5 text-blue-300" />
              Local Listing Marketplace
            </div>

            <CardTitle className="text-2xl">Marketplace Listings</CardTitle>
            <CardDescription className="mt-2 text-zinc-400">
              Browse locally signed listings. Each row contains marketStorage
              and signature, ready for mscPurchase.
            </CardDescription>
          </div>

          <Badge variant="secondary">
            {listingsCount} Listing{listingsCount === 1 ? "" : "s"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            label="Total Listings"
            value={String(listingsCount)}
            icon={<PackageSearch className="h-4 w-4" />}
          />
          <SummaryCard
            label="Selected"
            value={String(selectedCount)}
            icon={<ShoppingCart className="h-4 w-4" />}
          />
          <SummaryCard
            label="Selected Value"
            value={`${formatEther(totalSelectedPrice)} ETH`}
            icon={<CircleDollarSign className="h-4 w-4" />}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-zinc-800 bg-zinc-900 text-white">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs text-zinc-500">{label}</div>
          <div className="mt-1 text-lg font-semibold">{value}</div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-zinc-400">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
