import { ProtocolStatus } from "@/components/ProtocolStatus";
import { CreateListingForm } from "@/components/CreateListingForm";
import { ListingMarketplace } from "@/components/listing-marketplace";
import { PurchaseDialog } from "@/components/purchase/PurchaseDialog";
import { TradeEventsPanel } from "@/components/purchase/TradeEventsPanel";
import { AdminConsole } from "@/components/admin/AdminConsole";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <ProtocolStatus />
         <AdminConsole />
        <CreateListingForm />
        <ListingMarketplace />
        <TradeEventsPanel />
      </div>

      <PurchaseDialog />
    </main>
  );
}
