"use client";

import { isAddress } from "viem";
import { useReadContracts } from "wagmi";
import { useMarketConfig } from "@/hooks/use-market-config";
import { marketAbi } from "@/lib/contracts/market";

export function useOrderStatus(params: {
  seller: string;
  orderNumber: string;
  failureSeller: string;
}) {
  const { marketAddress, isSupportedChain } = useMarketConfig();

  const sellerValid = isAddress(params.seller);
  const failureSellerValid = isAddress(params.failureSeller);
  const hasOrderNumber = params.orderNumber.trim() !== "";
  const contracts: {
    address: `0x${string}`;
    abi: typeof marketAbi;
    functionName: "getOrderStatus" | "getFailureOrder";
    args: readonly [`0x${string}`, bigint] | readonly [`0x${string}`];
  }[] = [];

  if (marketAddress && isSupportedChain) {
    if (sellerValid && hasOrderNumber) {
      contracts.push({
        address: marketAddress,
        abi: marketAbi,
        functionName: "getOrderStatus",
        args: [params.seller as `0x${string}`, BigInt(params.orderNumber)] as const,
      });
    }

    if (failureSellerValid) {
      contracts.push({
        address: marketAddress,
        abi: marketAbi,
        functionName: "getFailureOrder",
        args: [params.failureSeller as `0x${string}`] as const,
      });
    }
  }

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts,
    query: {
      enabled: Boolean(marketAddress && isSupportedChain),
    },
  });

  return {
    orderStatus:
      sellerValid && hasOrderNumber ? (data?.[0]?.result as bigint | undefined) ?? null : null,
    failureOrder:
      failureSellerValid
        ? (data?.[(sellerValid && hasOrderNumber ? 1 : 0)]?.result as bigint | undefined) ??
          null
        : null,
    isLoading,
    error,
    refetch,
  };
}
