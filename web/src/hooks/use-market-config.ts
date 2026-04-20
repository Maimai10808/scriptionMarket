"use client";

import { useChainId } from "wagmi";
import { getConfiguredChain, getKnownChain } from "@/config/chains";
import {
  getMarketAddress,
  getMarketDeployment,
  getKnownMarketChain,
} from "@/lib/contracts/market";

export function useMarketConfig() {
  const chainId = useChainId();
  const deployment = getMarketDeployment(chainId);
  const marketAddress = getMarketAddress(chainId);
  const chain = getConfiguredChain(chainId);
  const knownChain = getKnownChain(chainId) ?? getKnownMarketChain(chainId);
  const hasDeployment = Boolean(deployment?.proxyAddress);
  const hasConfiguredRpc = Boolean(chain);

  let supportState: "ready" | "missing-rpc" | "missing-deployment" | "unsupported-chain";
  let statusMessage: string;

  if (!knownChain) {
    supportState = "unsupported-chain";
    statusMessage =
      "The connected wallet is on a chain this demo does not support. Switch to a configured local, testnet, or mainnet deployment.";
  } else if (!hasConfiguredRpc) {
    supportState = "missing-rpc";
    statusMessage = `The wallet is on ${knownChain.chainName}, but the required RPC URL (${knownChain.rpcEnvVar}) is not configured in the frontend environment.`;
  } else if (!hasDeployment) {
    supportState = "missing-deployment";
    statusMessage = `The wallet is on ${knownChain.chainName}, but no synced proxy deployment was found for this chain. Deploy the contract, then run the sync step.`;
  } else {
    supportState = "ready";
    statusMessage =
      "The frontend has a configured RPC endpoint and a synced proxy deployment for the current chain.";
  }

  return {
    chainId,
    chain,
    knownChain,
    deployment,
    marketAddress,
    hasDeployment,
    hasConfiguredRpc,
    supportState,
    statusMessage,
    isSupportedChain: Boolean(marketAddress && deployment && chain),
  };
}
