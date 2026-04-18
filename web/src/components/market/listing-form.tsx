"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { SectionCard } from "@/components/shared/section-card";
import { SignedListingCard } from "@/components/market/signed-listing-card";
import { useSignListing } from "@/hooks/use-sign-listing";
import type { ListingFormValues } from "@/lib/contracts/types";

type ListingFormProps = {
  title?: string;
  description?: string;
};

export function ListingForm({
  title = "Create and sign a listing",
  description = "This signs the exact EIP-712 payload expected by the proxy contract. The generated JSON can be copied into the marketplace page and executed by a buyer.",
}: ListingFormProps) {
  const { address } = useAccount();
  const { defaultValues, signListing, signedJson, errorMessage, isSigning } =
    useSignListing();
  const [values, setValues] = useState<ListingFormValues>(() => ({
    ...defaultValues,
    maker: address ?? defaultValues.maker,
  }));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signListing(values);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <SectionCard eyebrow="Seller Flow" title={title} description={description}>
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
              className="button-primary rounded-full px-5 py-3 font-medium"
              disabled={isSigning}
            >
              {isSigning ? "Signing..." : "Sign Listing"}
            </button>
            <button
              type="button"
              className="button-secondary rounded-full px-5 py-3"
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
              className="button-secondary rounded-full px-5 py-3"
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
      </SectionCard>
      <SignedListingCard signedJson={signedJson} />
    </div>
  );
}
