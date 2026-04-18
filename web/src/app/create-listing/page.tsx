import { PageHero } from "@/components/shared/page-hero";
import { ListingForm } from "@/components/market/listing-form";

export default function CreateListingPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Create Listing"
        title="Seller-side EIP-712 signing"
        description="Prepare the off-chain listing payload, sign it against the proxy address, and export a JSON object that a buyer can settle on-chain."
      />
      <ListingForm />
    </div>
  );
}
