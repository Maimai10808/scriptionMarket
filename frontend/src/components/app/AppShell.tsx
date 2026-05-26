"use client";

import { useState } from "react";

import { ProtocolStatus } from "@/components/ProtocolStatus";
import { CreateListingForm } from "@/components/CreateListingForm";
import { ListingMarketplace } from "@/components/listing-marketplace";
import { PurchaseDialog } from "@/components/purchase/PurchaseDialog";
import { TradeEventsPanel } from "@/components/purchase/TradeEventsPanel";
import { AdminConsole } from "@/components/admin/AdminConsole";
import {
  AppNavigation,
  type AppView,
} from "@/components/layout/AppNavigation";

export function AppShell() {
  const [activeView, setActiveView] = useState<AppView>("market");

  return (
    <main className="min-h-screen bg-black">
      <AppNavigation activeView={activeView} onViewChange={setActiveView} />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        {activeView === "market" ? (
          <>
            <ProtocolStatus />
            <CreateListingForm />
            <ListingMarketplace />
            <TradeEventsPanel />
          </>
        ) : (
          <>
            <AdminConsole />
            <ProtocolStatus />
          </>
        )}
      </div>

      <PurchaseDialog />
    </main>
  );
}
