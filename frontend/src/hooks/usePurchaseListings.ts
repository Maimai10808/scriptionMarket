/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useMemo } from "react";
import { useWaitForTransactionReceipt } from "wagmi";

import {
  useReadMscMarketV1ComputeFee,
  useWriteMscMarketV1MscBatchPurchase,
  useWriteMscMarketV1MscPurchase,
} from "@/generated/wagmi";
import { useListingStore } from "@/stores/listingStore";

export function usePurchaseListings() {
  const pendingPurchase = useListingStore((state) => state.pendingPurchase);
  const clearPendingPurchase = useListingStore(
    (state) => state.clearPendingPurchase,
  );
  const clearSelectedListings = useListingStore(
    (state) => state.clearSelectedListings,
  );

  const singlePurchase = useWriteMscMarketV1MscPurchase();
  const batchPurchase = useWriteMscMarketV1MscBatchPurchase();

  const listings = pendingPurchase?.listings ?? [];

  const totalPrice = useMemo(() => {
    return listings.reduce(
      (total, listing) => total + listing.marketStorage.price,
      BigInt(0),
    );
  }, [listings]);

  const feeQuery = useReadMscMarketV1ComputeFee({
    args: [totalPrice],
    query: {
      enabled: totalPrice > BigInt(0),
    },
  });

  const fee = feeQuery.data ?? BigInt(0);
  const totalPayable = totalPrice + fee;

  const activeHash = singlePurchase.data ?? batchPurchase.data;

  const receiptQuery = useWaitForTransactionReceipt({
    hash: activeHash,
    query: {
      enabled: Boolean(activeHash),
    },
  });

  const isWriting = singlePurchase.isPending || batchPurchase.isPending;
  const isConfirming = receiptQuery.isLoading;
  const isSuccess = receiptQuery.isSuccess;

  const error =
    singlePurchase.error ||
    batchPurchase.error ||
    receiptQuery.error ||
    feeQuery.error;

  const purchaseSingle = async () => {
    if (!pendingPurchase || pendingPurchase.type !== "single") return;

    const listing = pendingPurchase.listings[0];

    await singlePurchase.writeContractAsync({
      args: [listing.marketStorage, listing.signature],
      value: totalPayable,
    });
  };

  const purchaseBatch = async () => {
    if (!pendingPurchase || pendingPurchase.type !== "batch") return;

    const marketStorages = pendingPurchase.listings.map(
      (listing) => listing.marketStorage,
    );
    const signatures = pendingPurchase.listings.map(
      (listing) => listing.signature,
    );

    await batchPurchase.writeContractAsync({
      args: [marketStorages, signatures, totalPrice],
      value: totalPayable,
    });
  };

  const confirmPurchase = async () => {
    if (!pendingPurchase) return;

    if (pendingPurchase.type === "single") {
      await purchaseSingle();
      return;
    }

    await purchaseBatch();
  };

  const closeAfterSuccess = () => {
    clearPendingPurchase();
    clearSelectedListings();
  };

  return {
    pendingPurchase,
    listings,

    totalPrice,
    fee,
    totalPayable,

    transactionHash: activeHash,
    receipt: receiptQuery.data,

    isFeeLoading: feeQuery.isLoading,
    isWriting,
    isConfirming,
    isSuccess,
    error,

    confirmPurchase,
    closeAfterSuccess,
    clearPendingPurchase,
  };
}
