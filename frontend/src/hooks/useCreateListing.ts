"use client";

import { useMemo, useState } from "react";
import { useAccount, useChainId, useSignTypedData } from "wagmi";
import { parseEther, type Address } from "viem";

import {
  buildMarketListingTypedData,
  MARKET_LISTING_TYPES,
} from "@/lib/eip712/marketListing";
import {
  type MarketStorage,
  type PendingListingDraft,
  type SignedListing,
  useListingStore,
} from "@/stores/listingStore";

function toUnixSeconds(dateValue: string) {
  const timestamp = new Date(dateValue).getTime();

  if (!Number.isFinite(timestamp)) {
    throw new Error("Invalid deadline");
  }

  return BigInt(Math.floor(timestamp / 1000));
}

export function useCreateListing() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { signTypedDataAsync, isPending } = useSignTypedData();

  const addListing = useListingStore((state) => state.addListing);
  const clearPendingDraft = useListingStore((state) => state.clearPendingDraft);

  const [latestListing, setLatestListing] = useState<SignedListing | null>(
    null,
  );

  const canSign = useMemo(() => {
    return isConnected && Boolean(address);
  }, [isConnected, address]);

  const createListing = async (draft: PendingListingDraft) => {
    if (!address) {
      throw new Error("Please connect wallet first.");
    }

    const marketStorage: MarketStorage = {
      number: BigInt(draft.orderNumber),
      maker: address as Address,
      time: toUnixSeconds(draft.deadline),
      amount: BigInt(draft.amount),
      price: parseEther(draft.price),
      tick: draft.tick.trim().toUpperCase(),
    };

    const typedData = buildMarketListingTypedData({
      chainId,
      marketStorage,
    });

    const signature = await signTypedDataAsync({
      domain: typedData.domain,
      types: MARKET_LISTING_TYPES,
      primaryType: typedData.primaryType,
      message: typedData.message,
    });

    const listing: SignedListing = {
      id: `${marketStorage.maker}-${marketStorage.number.toString()}`,
      marketStorage,
      signature,
      status: "signed",
      createdAt: Date.now(),
    };

    addListing(listing);
    setLatestListing(listing);
    clearPendingDraft();

    return listing;
  };

  return {
    createListing,
    latestListing,
    isSigning: isPending,
    canSign,
    walletAddress: address,
    chainId,
  };
}
