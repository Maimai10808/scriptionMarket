"use client";

import { useMemo, useState } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { buildListingTypedData, normalizeListingForm } from "@/lib/contracts/eip712";
import { serializeSignedListing } from "@/lib/contracts/formatters";
import { saveSignedListing } from "@/lib/contracts/local-listings";
import type {
  ListingFormValues,
  SignedListing,
} from "@/lib/contracts/types";
import { useMarketConfig } from "@/hooks/use-market-config";

function buildDefaultFormValues(address?: `0x${string}`): ListingFormValues {
  const now = Math.floor(Date.now() / 1000).toString();

  return {
    number: now,
    maker: address ?? "",
    time: now,
    amount: "100",
    price: "10000000000000000",
    tick: "MSCMOCK",
  };
}

export function useSignListing() {
  const { address } = useAccount();
  const { chainId, marketAddress, isSupportedChain } = useMarketConfig();
  const { signTypedDataAsync, isPending } = useSignTypedData();
  const [signedListing, setSignedListing] = useState<SignedListing | null>(null);
  const [signedJson, setSignedJson] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues = useMemo(() => buildDefaultFormValues(address), [address]);

  async function signListing(values: ListingFormValues) {
    setErrorMessage(null);

    if (!marketAddress || !chainId || !isSupportedChain) {
      throw new Error("Current chain is not configured for the market contract");
    }

    const listing = normalizeListingForm(values);
    const typedData = buildListingTypedData({
      chainId,
      marketAddress,
      listing,
    });

    try {
      const signature = await signTypedDataAsync(typedData);
      const nextSignedListing: SignedListing = {
        marketStorage: listing,
        signature,
      };
      const json = serializeSignedListing(nextSignedListing);

      setSignedListing(nextSignedListing);
      setSignedJson(json);
      saveSignedListing(nextSignedListing);

      return nextSignedListing;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign listing";
      setErrorMessage(message);
      throw error;
    }
  }

  return {
    defaultValues,
    signedListing,
    signedJson,
    errorMessage,
    isSigning: isPending,
    signListing,
  };
}
