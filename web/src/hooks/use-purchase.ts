"use client";

import { useState } from "react";
import { BaseError } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";
import { marketAbi } from "@/lib/contracts/market";
import type { SignedListing } from "@/lib/contracts/types";
import { useMarketConfig } from "@/hooks/use-market-config";

type PurchaseState = "idle" | "pending" | "success" | "error";

export function usePurchase() {
  const { marketAddress, isSupportedChain } = useMarketConfig();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [status, setStatus] = useState<PurchaseState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function purchase(listing: SignedListing) {
    setErrorMessage(null);

    if (!marketAddress || !isSupportedChain) {
      throw new Error("Current chain is not configured for market purchases");
    }

    if (!publicClient) {
      throw new Error("Public client is not ready");
    }

    try {
      setStatus("pending");
      const hash = await writeContractAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: "mscPurchase",
        args: [listing.marketStorage, listing.signature],
        value: listing.marketStorage.price,
      });

      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      setStatus("success");
      return hash;
    } catch (error) {
      const message =
        error instanceof BaseError
          ? error.shortMessage
          : error instanceof Error
            ? error.message
            : "Purchase failed";

      setErrorMessage(message);
      setStatus("error");
      throw error;
    }
  }

  return {
    purchase,
    txHash,
    status,
    errorMessage,
    reset() {
      setTxHash(null);
      setStatus("idle");
      setErrorMessage(null);
    },
  };
}
