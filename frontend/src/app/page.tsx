import { CreateListingForm } from "@/components/CreateListingForm";
import { ListingMarketplace } from "@/components/listing-marketplace";
import { ProtocolStatus } from "@/components/ProtocolStatus";

export default function Home() {
  return (
    <>
      <ProtocolStatus />
      <CreateListingForm />
      <ListingMarketplace />
    </>
  );
}
