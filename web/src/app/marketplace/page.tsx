import { PageHero } from "@/components/shared/page-hero";
import { PurchasePanel } from "@/components/market/purchase-panel";

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Marketplace"
        title="Paste a signed order and execute settlement"
        description="This buyer flow consumes the signed listing JSON, calls `mscPurchase`, sends the correct `value`, and surfaces the transaction result."
      />
      <PurchasePanel />
    </div>
  );
}
