"use client";

import { parseEther } from "viem";

import {
  useReadMscMarketV1GetVersion,
  useReadMscMarketV1GetFeeBps,
  useReadMscMarketV1GetAdminAddress,
  useReadMscMarketV1GetFeatureStatus,
  useReadMscMarketV1ComputeFee,
  mscMarketV1Address,
} from "@/generated/wagmi";

type UseProtocolStatusParams = {
  featureName: string;
  priceInput: string;
};

function safeParseEther(value: string) {
  try {
    return parseEther(value || "0");
  } catch {
    return BigInt(0);
  }
}

export function useProtocolStatus({
  featureName,
  priceInput,
}: UseProtocolStatusParams) {
  const priceWei = safeParseEther(priceInput);

  const versionQuery = useReadMscMarketV1GetVersion();

  const feeBpsQuery = useReadMscMarketV1GetFeeBps();

  const adminAddressQuery = useReadMscMarketV1GetAdminAddress();

  const featureStatusQuery = useReadMscMarketV1GetFeatureStatus({
    args: [featureName],
    query: {
      enabled: Boolean(featureName),
    },
  });

  const computedFeeQuery = useReadMscMarketV1ComputeFee({
    args: [priceWei],
    query: {
      enabled: priceWei > BigInt(0),
    },
  });

  const isLoading =
    versionQuery.isLoading ||
    feeBpsQuery.isLoading ||
    adminAddressQuery.isLoading ||
    featureStatusQuery.isLoading ||
    computedFeeQuery.isLoading;

  const error =
    versionQuery.error ||
    feeBpsQuery.error ||
    adminAddressQuery.error ||
    featureStatusQuery.error ||
    computedFeeQuery.error;

  return {
    proxyAddress: mscMarketV1Address[31337],
    priceWei,

    version: versionQuery.data,
    feeBps: feeBpsQuery.data,
    adminAddress: adminAddressQuery.data,
    featureEnabled: featureStatusQuery.data,
    computedFee: computedFeeQuery.data,

    isLoading,
    error,

    queries: {
      versionQuery,
      feeBpsQuery,
      adminAddressQuery,
      featureStatusQuery,
      computedFeeQuery,
    },
  };
}
