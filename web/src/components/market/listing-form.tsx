"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { SectionCard } from "@/components/shared/section-card";
import { SignedListingCard } from "@/components/market/signed-listing-card";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBanner } from "@/components/shared/status-banner";
import { useMarketConfig } from "@/hooks/use-market-config";
import { useSignListing } from "@/hooks/use-sign-listing";
import { formatAddress } from "@/lib/contracts/formatters";
import type { ListingFormValues } from "@/lib/contracts/types";

type ListingFormProps = {
  title?: string;
  description?: string;
};

export function ListingForm({
  title = "Create and sign a listing",
  description = "This signs the exact EIP-712 payload expected by the proxy contract. The generated JSON can be copied into the marketplace page and executed by a buyer.",
}: ListingFormProps) {
  const { address, isConnected } = useAccount();
  const { chain, marketAddress, isSupportedChain, statusMessage } = useMarketConfig();
  const { defaultValues, signListing, signedJson, errorMessage, isSigning } =
    useSignListing();
  const [values, setValues] = useState<ListingFormValues>(() => ({
    ...defaultValues,
    maker: address ?? defaultValues.maker,
  }));

  const banner = useMemo(() => {
    if (!isConnected) {
      return {
        tone: "warning" as const,
        title: "Connect a seller wallet first",
        description: "The seller flow signs typed data from the connected wallet.",
      };
    }

    if (!isSupportedChain) {
      return {
        tone: "warning" as const,
        title: "Chain or deployment not ready",
        description: statusMessage,
      };
    }

    return {
      tone: "success" as const,
      title: "Seller flow is ready",
      description:
        "The current chain has a synced proxy deployment and the listing will be signed against that proxy address.",
    };
  }, [isConnected, isSupportedChain, statusMessage]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signListing(values);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <SectionCard eyebrow="Seller Flow" title={title} description={description}>
        <div className="space-y-5">
          <StatusBanner
            tone={banner.tone}
            title={banner.title}
            description={banner.description}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Connected wallet"
              value={address ? formatAddress(address) : "Not connected"}
              detail={
                address
                  ? `${address} · Used as the seller when you click “Use Connected Wallet”.`
                  : "Used as the seller when you click “Use Connected Wallet”."
              }
              valueTitle={address}
              detailTitle={address}
              valueClassName="break-words"
              detailClassName="break-all text-xs leading-5"
            />
            <StatCard
              label="Active chain"
              value={chain?.name ?? "Unknown / unsupported"}
              detail="Typed-data signatures must match the current chain ID."
              valueClassName="break-words"
              detailClassName="text-xs leading-5"
            />
            <StatCard
              label="Proxy target"
              value={marketAddress ? formatAddress(marketAddress) : "No synced proxy address"}
              detail={
                marketAddress
                  ? `${marketAddress} · The verifying contract for seller signatures.`
                  : "The verifying contract for seller signatures."
              }
              valueTitle={marketAddress ?? undefined}
              detailTitle={marketAddress ?? undefined}
              valueClassName="break-words"
              detailClassName="break-all text-xs leading-5"
            />
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Order Number</span>
            <input
              className="field rounded-2xl"
              value={values.number}
              onChange={(event) =>
                setValues((current) => ({ ...current, number: event.target.value }))
              }
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Maker</span>
            <input
              className="field rounded-2xl"
              value={values.maker}
              onChange={(event) =>
                setValues((current) => ({ ...current, maker: event.target.value }))
              }
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Timestamp</span>
            <input
              className="field rounded-2xl"
              value={values.time}
              onChange={(event) =>
                setValues((current) => ({ ...current, time: event.target.value }))
              }
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Amount</span>
            <input
              className="field rounded-2xl"
              value={values.amount}
              onChange={(event) =>
                setValues((current) => ({ ...current, amount: event.target.value }))
              }
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Price (wei)</span>
            <input
              className="field rounded-2xl"
              value={values.price}
              onChange={(event) =>
                setValues((current) => ({ ...current, price: event.target.value }))
              }
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Tick</span>
            <input
              className="field rounded-2xl"
              value={values.tick}
              onChange={(event) =>
                setValues((current) => ({ ...current, tick: event.target.value }))
              }
            />
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="button-contained rounded-full px-5 py-3 font-medium"
              disabled={isSigning || !isSupportedChain || !isConnected}
            >
              {isSigning ? "Signing..." : "Sign Listing"}
            </button>
            <button
              type="button"
              className="button-outlined rounded-full px-5 py-3"
              disabled={!address}
              onClick={() =>
                address &&
                setValues((current) => ({
                  ...current,
                  maker: address,
                }))
              }
            >
              Use Connected Wallet
            </button>
            <button
              type="button"
              className="button-text rounded-full px-4 py-3"
              onClick={() => setValues(defaultValues)}
            >
              Reset
            </button>
          </div>
          {errorMessage ? (
            <p className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
          </form>
        </div>
      </SectionCard>
      <SignedListingCard signedJson={signedJson} />
    </div>
  );
}
