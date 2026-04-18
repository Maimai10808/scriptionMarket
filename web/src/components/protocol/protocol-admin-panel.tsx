"use client";

import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";
import { TxResultCard } from "@/components/market/tx-result-card";
import { useOrderStatus } from "@/hooks/use-order-status";
import { useProtocolAdmin } from "@/hooks/use-protocol-admin";
import { useMarketRead } from "@/hooks/use-market-read";
import {
  formatBigInt,
  formatWei,
  getOrderStatusLabel,
} from "@/lib/contracts/formatters";

export function ProtocolAdminPanel() {
  const { summary } = useMarketRead();
  const admin = useProtocolAdmin();
  const [feeBps, setFeeBps] = useState(summary.feeBps?.toString() ?? "2");
  const [feature, setFeature] = useState("buy");
  const [featureEnabled, setFeatureEnabled] = useState(true);
  const [orderSeller, setOrderSeller] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [failureSeller, setFailureSeller] = useState("");
  const { orderStatus, failureOrder } = useOrderStatus({
    seller: orderSeller,
    orderNumber,
    failureSeller,
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="grid gap-6">
        <SectionCard
          eyebrow="Protocol Queries"
          title="Read protocol state"
          description="Query order status and failed seller payouts directly from the proxy contract."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Order Seller</span>
              <input
                className="field rounded-2xl"
                value={orderSeller}
                onChange={(event) => setOrderSeller(event.target.value)}
                placeholder="0x..."
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Order Number</span>
              <input
                className="field rounded-2xl"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="1"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Failure Order Seller</span>
              <input
                className="field rounded-2xl"
                value={failureSeller}
                onChange={(event) => setFailureSeller(event.target.value)}
                placeholder="0x..."
              />
            </label>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Order Status
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {getOrderStatusLabel(orderStatus)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Failure Order Amount
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {failureOrder !== null ? formatWei(failureOrder) : "--"}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Admin Writes"
          title="Protocol operations"
          description="These calls still rely on contract-side access control. The panel only exposes buttons when the connected wallet matches owner or admin."
        >
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white/80 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Access Check
            </p>
            <p className="mt-2 text-sm text-slate-700">
              {admin.canManageProtocol
                ? "Current wallet can submit admin transactions."
                : "Current wallet is not owner/admin. Read actions still work."}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">New Fee Bps</span>
              <input
                className="field rounded-2xl"
                value={feeBps}
                onChange={(event) => setFeeBps(event.target.value)}
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                className="button-primary w-full rounded-2xl px-5 py-3"
                disabled={!admin.canManageProtocol}
                onClick={() => admin.setFeeBps(BigInt(feeBps))}
              >
                Update Fee Bps
              </button>
            </div>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Feature</span>
              <select
                className="field rounded-2xl"
                value={feature}
                onChange={(event) => setFeature(event.target.value)}
              >
                <option value="buy">buy</option>
                <option value="withdraw">withdraw</option>
                <option value="list">list</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Enabled</span>
              <select
                className="field rounded-2xl"
                value={featureEnabled ? "true" : "false"}
                onChange={(event) => setFeatureEnabled(event.target.value === "true")}
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="button"
                className="button-primary rounded-full px-5 py-3"
                disabled={!admin.canManageProtocol}
                onClick={() => admin.setFeatureStatus(feature, featureEnabled)}
              >
                Set Feature Status
              </button>
              <button
                type="button"
                className="button-secondary rounded-full px-5 py-3"
                disabled={!admin.canManageProtocol}
                onClick={() => admin.withdraw()}
              >
                Withdraw Protocol Balance
              </button>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6">
        <SectionCard eyebrow="Live Summary" title="Current protocol values">
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Fee Bps
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {formatBigInt(summary.feeBps)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Buy Feature
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {summary.buyEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                Withdraw Feature
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {summary.withdrawEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </SectionCard>
        <TxResultCard
          title="Admin transaction result"
          status={admin.status}
          txHash={admin.txHash}
          errorMessage={admin.errorMessage}
        />
      </div>
    </div>
  );
}
