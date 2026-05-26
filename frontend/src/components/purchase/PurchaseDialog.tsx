"use client";

import { formatEther } from "viem";
import {
  BadgeCheck,
  CircleAlert,
  Loader2,
  ReceiptText,
  ShoppingCart,
  X,
} from "lucide-react";

import { usePurchaseListings } from "@/hooks/usePurchaseListings";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function PurchaseDialog() {
  const {
    pendingPurchase,
    listings,
    totalPrice,
    fee,
    sellerReceives,
    totalPayable,
    transactionHash,
    isFeeLoading,
    isWriting,
    isConfirming,
    isSuccess,
    error,
    confirmPurchase,
    closeAfterSuccess,
    clearPendingPurchase,
  } = usePurchaseListings();

  const isOpen = Boolean(pendingPurchase);
  const isBusy = isWriting || isConfirming;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isBusy) {
          clearPendingPurchase();
        }
      }}
    >
      <DialogContent className="border-zinc-800 bg-zinc-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-300" />
            Confirm Purchase
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Review price, protocol fee, payable amount, and selected listings
            before submitting the on-chain transaction.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <CircleAlert className="h-4 w-4" />
            <AlertTitle>Purchase failed</AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-100">
            <BadgeCheck className="h-4 w-4" />
            <AlertTitle>Purchase confirmed</AlertTitle>
            <AlertDescription>
              The transaction has been confirmed on-chain.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3 md:grid-cols-4">
          <PurchaseMetric
            label="Goods Price"
            value={`${formatEther(totalPrice)} ETH`}
          />
          <PurchaseMetric
            label="Protocol Fee"
            value={isFeeLoading ? "Loading..." : `${formatEther(fee)} ETH`}
          />
          <PurchaseMetric
            label="Seller Receives"
            value={`${formatEther(sellerReceives)} ETH`}
          />
          <PurchaseMetric
            label="Buyer Pays"
            value={`${formatEther(totalPayable)} ETH`}
          />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-300">
              Selected Listings
            </div>
            <Badge variant="secondary">
              {pendingPurchase?.type === "batch" ? "Batch" : "Single"}
            </Badge>
          </div>

          <div className="max-h-64 space-y-2 overflow-auto">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-mono text-sm text-zinc-100">
                      {listing.marketStorage.tick}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Order #{listing.marketStorage.number.toString()}
                    </div>
                  </div>

                  <div className="text-sm text-zinc-300">
                    {listing.marketStorage.amount.toString()} ·{" "}
                    {formatEther(listing.marketStorage.price)} ETH
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {transactionHash && (
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-400">
              <ReceiptText className="h-4 w-4" />
              Transaction Hash
            </div>
            <div className="break-all font-mono text-xs text-zinc-200">
              {transactionHash}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {isSuccess ? (
            <Button type="button" onClick={closeAfterSuccess}>
              Close
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                disabled={isBusy}
                onClick={clearPendingPurchase}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>

              <Button
                type="button"
                disabled={isBusy || listings.length === 0}
                onClick={confirmPurchase}
              >
                {isBusy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isWriting ? "Submitting..." : "Confirming..."}
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Confirm Purchase
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PurchaseMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="mt-2 break-all text-base font-semibold text-zinc-100">
        {value}
      </div>
    </div>
  );
}
