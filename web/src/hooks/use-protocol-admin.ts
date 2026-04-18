"use client";

import { useMemo, useState } from "react";
import { BaseError } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { marketAbi } from "@/lib/contracts/market";
import { useMarketConfig } from "@/hooks/use-market-config";
import { useMarketRead } from "@/hooks/use-market-read";

type AdminStatus = "idle" | "pending" | "success" | "error";

export function useProtocolAdmin() {
  const { address } = useAccount();
  const { marketAddress, isSupportedChain } = useMarketConfig();
  const { summary, refetch } = useMarketRead();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [status, setStatus] = useState<AdminStatus>("idle");
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canManageProtocol = useMemo(() => {
    if (!address) {
      return false;
    }

    return address === summary.owner || address === summary.adminAddress;
  }, [address, summary.adminAddress, summary.owner]);

  async function submitWrite(
    config:
      | {
          functionName: "setFeeBps";
          args: [bigint];
        }
      | {
          functionName: "setFeatureStatus";
          args: [string, boolean];
        }
      | {
          functionName: "mscWithdraw";
          args?: undefined;
        },
  ) {
    setErrorMessage(null);

    if (!marketAddress || !isSupportedChain) {
      throw new Error("Current chain is not configured for protocol admin");
    }

    if (!publicClient) {
      throw new Error("Public client is not ready");
    }

    try {
      setStatus("pending");
      const hash = await writeContractAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: config.functionName,
        args: config.args,
      });
      setTxHash(hash);
      await publicClient.waitForTransactionReceipt({ hash });
      await refetch();
      setStatus("success");
      return hash;
    } catch (error) {
      const message =
        error instanceof BaseError
          ? error.shortMessage
          : error instanceof Error
            ? error.message
            : "Protocol transaction failed";
      setErrorMessage(message);
      setStatus("error");
      throw error;
    }
  }

  return {
    canManageProtocol,
    status,
    txHash,
    errorMessage,
    setFeeBps(value: bigint) {
      return submitWrite({ functionName: "setFeeBps", args: [value] });
    },
    setFeatureStatus(feature: string, enabled: boolean) {
      return submitWrite({
        functionName: "setFeatureStatus",
        args: [feature, enabled],
      });
    },
    withdraw() {
      return submitWrite({ functionName: "mscWithdraw" });
    },
  };
}
