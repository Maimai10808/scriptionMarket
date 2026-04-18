"use client";

import { useMemo } from "react";
import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { configuredChains } from "@/config/chains";
import { formatAddress } from "@/lib/contracts/formatters";

export function WalletConnect() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const activeChain = useMemo(
    () => configuredChains.find((chain) => chain.id === chainId) ?? null,
    [chainId],
  );

  if (!isConnected) {
    const primaryConnector = connectors[0];

    return (
      <button
        type="button"
        className="button-primary rounded-full px-5 py-3 text-sm font-medium"
        disabled={!primaryConnector || isPending}
        onClick={() => primaryConnector && connect({ connector: primaryConnector })}
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  return (
    <div className="panel-dark flex flex-wrap items-center gap-3 rounded-full px-3 py-3 text-sm text-white">
      <div className="space-y-1 px-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
          wallet
        </p>
        <p className="font-medium">{formatAddress(address)}</p>
      </div>
      <div className="space-y-1 rounded-full border border-white/10 bg-white/5 px-4 py-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">
          chain
        </p>
        <select
          className="bg-transparent text-sm text-white outline-none"
          disabled={isSwitchingChain}
          value={activeChain?.id ?? ""}
          onChange={(event) => switchChain({ chainId: Number(event.target.value) })}
        >
          {configuredChains.map((chain) => (
            <option key={chain.id} value={chain.id} className="bg-slate-950">
              {chain.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:text-white"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
}
