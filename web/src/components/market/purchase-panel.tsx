"use client";

import { useMemo, useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { TxResultCard } from "@/components/market/tx-result-card";
import { usePurchase } from "@/hooks/use-purchase";
import {
  formatBigInt,
  formatTimestamp,
  formatWei,
  parseSignedListingJson,
  serializeSignedListing,
} from "@/lib/contracts/formatters";
import { loadSignedListings } from "@/lib/contracts/local-listings";
import type { SignedListing } from "@/lib/contracts/types";

export function PurchasePanel() {
  const { purchase, txHash, status, errorMessage } = usePurchase();
  const [textareaValue, setTextareaValue] = useState("");
  const [storedListings] = useState<SignedListing[]>(() => loadSignedListings());
  const [parsedListing, setParsedListing] = useState<SignedListing | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const previewRows = useMemo(
    () =>
      parsedListing
        ? [
            ["Order Number", formatBigInt(parsedListing.marketStorage.number)],
            ["Maker", parsedListing.marketStorage.maker],
            ["Time", formatTimestamp(parsedListing.marketStorage.time)],
            ["Amount", formatBigInt(parsedListing.marketStorage.amount)],
            ["Price", formatWei(parsedListing.marketStorage.price)],
            ["Tick", parsedListing.marketStorage.tick],
          ]
        : [],
    [parsedListing],
  );

  function parseListing() {
    try {
      const listing = parseSignedListingJson(textareaValue);
      setParsedListing(listing);
      setParseError(null);
    } catch (error) {
      setParsedListing(null);
      setParseError(error instanceof Error ? error.message : "Failed to parse listing JSON");
    }
  }

  async function onBuy() {
    if (!parsedListing) {
      return;
    }

    await purchase(parsedListing);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <SectionCard
        eyebrow="Buyer Flow"
        title="Paste or select a listing"
        description="The first version keeps listing data local. You can paste JSON directly or load a signed listing saved from the seller flow."
      >
        <div className="space-y-4">
          <textarea
            className="field min-h-[280px] rounded-3xl"
            placeholder="Paste signed listing JSON here..."
            value={textareaValue}
            onChange={(event) => setTextareaValue(event.target.value)}
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="button-primary rounded-full px-5 py-3" onClick={parseListing}>
              Parse Listing
            </button>
            <button
              type="button"
              className="button-secondary rounded-full px-5 py-3"
              disabled={!parsedListing}
              onClick={onBuy}
            >
              Buy Listing
            </button>
          </div>
          {parseError ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {parseError}
            </p>
          ) : null}
          {previewRows.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {previewRows.map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </SectionCard>
      <div className="grid gap-6">
        <SectionCard
          eyebrow="Saved Listings"
          title="Local cache"
          description="Listings signed in this browser are saved locally for quick replay."
        >
          <div className="space-y-3">
            {storedListings.length === 0 ? (
              <p className="text-sm text-slate-600">No saved listings yet.</p>
            ) : null}
            {storedListings.map((listing) => {
              const serialized = serializeSignedListing(listing);

              return (
                <button
                  key={`${listing.marketStorage.maker}-${listing.marketStorage.number.toString()}`}
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white/82 p-4 text-left transition hover:border-slate-300"
                  onClick={() => {
                    setTextareaValue(serialized);
                    setParsedListing(listing);
                    setParseError(null);
                  }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                    {listing.marketStorage.tick}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    #{listing.marketStorage.number.toString()} · {formatWei(listing.marketStorage.price)}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {listing.marketStorage.maker}
                  </p>
                </button>
              );
            })}
          </div>
        </SectionCard>
        <TxResultCard
          title="Purchase result"
          status={status}
          txHash={txHash}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}
