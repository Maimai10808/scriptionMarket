"use client";

import { useMemo } from "react";
import { isAddress, type Address } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";

import {
  mscMarketV1Address,
  useReadMscMarketV1GetAdminAddress,
  useReadMscMarketV1GetFeeBps,
  useReadMscMarketV1GetFeatureStatus,
  useReadMscMarketV1Owner,
  useWriteMscMarketV1SetAdminAddress,
  useWriteMscMarketV1SetAllFeatuteStatus,
  useWriteMscMarketV1SetFeatureStatus,
  useWriteMscMarketV1SetFeeBps,
} from "@/generated/wagmi";

export function useAdminConsole() {
  const { address } = useAccount();

  const ownerQuery = useReadMscMarketV1Owner();
  const adminAddressQuery = useReadMscMarketV1GetAdminAddress();
  const feeBpsQuery = useReadMscMarketV1GetFeeBps();

  const buyFeatureQuery = useReadMscMarketV1GetFeatureStatus({
    args: ["buy"],
  });

  const listFeatureQuery = useReadMscMarketV1GetFeatureStatus({
    args: ["list"],
  });

  const withdrawFeatureQuery = useReadMscMarketV1GetFeatureStatus({
    args: ["withdraw"],
  });

  const setFeeBpsWrite = useWriteMscMarketV1SetFeeBps();
  const setAdminAddressWrite = useWriteMscMarketV1SetAdminAddress();
  const setFeatureStatusWrite = useWriteMscMarketV1SetFeatureStatus();
  const setAllFeatureStatusWrite = useWriteMscMarketV1SetAllFeatuteStatus();

  const activeHash =
    setFeeBpsWrite.data ??
    setAdminAddressWrite.data ??
    setFeatureStatusWrite.data ??
    setAllFeatureStatusWrite.data;

  const receiptQuery = useWaitForTransactionReceipt({
    hash: activeHash,
    query: {
      enabled: Boolean(activeHash),
    },
  });

  const isOwner = useMemo(() => {
    if (!address || !ownerQuery.data) return false;
    return address.toLowerCase() === ownerQuery.data.toLowerCase();
  }, [address, ownerQuery.data]);

  const isWriting =
    setFeeBpsWrite.isPending ||
    setAdminAddressWrite.isPending ||
    setFeatureStatusWrite.isPending ||
    setAllFeatureStatusWrite.isPending;

  const isConfirming = receiptQuery.isLoading;

  const error =
    ownerQuery.error ||
    adminAddressQuery.error ||
    feeBpsQuery.error ||
    buyFeatureQuery.error ||
    listFeatureQuery.error ||
    withdrawFeatureQuery.error ||
    setFeeBpsWrite.error ||
    setAdminAddressWrite.error ||
    setFeatureStatusWrite.error ||
    setAllFeatureStatusWrite.error ||
    receiptQuery.error;

  const setFeeBps = async (feeBps: number) => {
    if (!Number.isInteger(feeBps) || feeBps < 0) {
      throw new Error("Fee bps must be a non-negative integer.");
    }

    await setFeeBpsWrite.writeContractAsync({
      args: [BigInt(feeBps)],
    });
  };

  const setAdminAddress = async (newAdminAddress: string) => {
    if (!isAddress(newAdminAddress)) {
      throw new Error("Invalid admin address.");
    }

    await setAdminAddressWrite.writeContractAsync({
      args: [newAdminAddress as Address],
    });
  };

  const setBuyFeatureStatus = async (enabled: boolean) => {
    await setFeatureStatusWrite.writeContractAsync({
      args: ["buy", enabled],
    });
  };

  const setListFeatureStatus = async (enabled: boolean) => {
    await setFeatureStatusWrite.writeContractAsync({
      args: ["list", enabled],
    });
  };

  const setWithdrawFeatureStatus = async (enabled: boolean) => {
    await setFeatureStatusWrite.writeContractAsync({
      args: ["withdraw", enabled],
    });
  };

  const setAllFeatureStatus = async (enabled: boolean) => {
    await setAllFeatureStatusWrite.writeContractAsync({
      args: [enabled],
    });
  };

  return {
    proxyAddress: mscMarketV1Address[31337],

    connectedAddress: address,
    owner: ownerQuery.data,
    adminAddress: adminAddressQuery.data,
    feeBps: feeBpsQuery.data,

    buyEnabled: buyFeatureQuery.data,
    listEnabled: listFeatureQuery.data,
    withdrawEnabled: withdrawFeatureQuery.data,

    isOwner,
    isReading:
      ownerQuery.isLoading ||
      adminAddressQuery.isLoading ||
      feeBpsQuery.isLoading ||
      buyFeatureQuery.isLoading ||
      listFeatureQuery.isLoading ||
      withdrawFeatureQuery.isLoading,

    isWriting,
    isConfirming,
    isSuccess: receiptQuery.isSuccess,
    transactionHash: activeHash,
    error,

    refetch: () => {
      ownerQuery.refetch();
      adminAddressQuery.refetch();
      feeBpsQuery.refetch();
      buyFeatureQuery.refetch();
      listFeatureQuery.refetch();
      withdrawFeatureQuery.refetch();
    },

    setFeeBps,
    setAdminAddress,
    setBuyFeatureStatus,
    setListFeatureStatus,
    setWithdrawFeatureStatus,
    setAllFeatureStatus,
  };
}
