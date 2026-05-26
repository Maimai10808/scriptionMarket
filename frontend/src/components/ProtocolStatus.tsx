"use client";

import { useState } from "react";
import { formatEther } from "viem";

import { useProtocolStatus } from "@/hooks/useProtocolStatus";

const DEFAULT_FEATURE = "purchase";

export function ProtocolStatus() {
  const [featureName, setFeatureName] = useState(DEFAULT_FEATURE);
  const [priceInput, setPriceInput] = useState("1");

  const {
    proxyAddress,
    version,
    feeBps,
    adminAddress,
    featureEnabled,
    computedFee,
    isLoading,
    error,
  } = useProtocolStatus({
    featureName,
    priceInput,
  });

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-white">
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Protocol Status</h2>
        <p className="text-sm text-zinc-400">
          Read MscMarketV1 protocol status from the deployed proxy contract.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          Contract read failed. Please check your wallet network, RPC, and the
          generated contract address.
        </div>
      )}

      {isLoading && (
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
          Loading protocol status...
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <StatusCard title="Proxy Address" value={proxyAddress} mono />

        <StatusCard
          title="Contract Version"
          value={version !== undefined ? version.toString() : "-"}
        />

        <StatusCard title="Admin Address" value={adminAddress ?? "-"} mono />

        <StatusCard
          title="Fee Bps"
          value={feeBps !== undefined ? feeBps.toString() : "-"}
          description="Basis points. 100 bps = 1%."
        />

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Feature Status</div>

          <input
            value={featureName}
            onChange={(event) => setFeatureName(event.target.value)}
            placeholder="purchase"
            className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-zinc-400"
          />

          <div className="mt-3 text-lg font-medium">
            {featureEnabled === undefined
              ? "-"
              : featureEnabled
                ? "Enabled"
                : "Disabled"}
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            Calls getFeatureStatus(feature).
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="text-sm text-zinc-400">Compute Fee</div>

          <input
            value={priceInput}
            onChange={(event) => setPriceInput(event.target.value)}
            placeholder="1"
            className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-zinc-400"
          />

          <div className="mt-3 text-lg font-medium">
            {computedFee !== undefined
              ? `${formatEther(computedFee)} ETH`
              : "-"}
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            Calls computeFee(price). Input unit is ETH.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatusCard({
  title,
  value,
  description,
  mono,
}: {
  title: string;
  value: string;
  description?: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="text-sm text-zinc-400">{title}</div>

      <div
        className={[
          "mt-3 break-all text-lg font-medium text-white",
          mono ? "font-mono text-sm" : "",
        ].join(" ")}
      >
        {value}
      </div>

      {description && (
        <p className="mt-2 text-xs text-zinc-500">{description}</p>
      )}
    </div>
  );
}
