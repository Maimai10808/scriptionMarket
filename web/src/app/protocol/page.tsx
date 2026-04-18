import { PageHero } from "@/components/shared/page-hero";
import { ProtocolAdminPanel } from "@/components/protocol/protocol-admin-panel";

export default function ProtocolPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Protocol"
        title="Query live protocol state and submit admin writes"
        description="Read failure-order balances and order status, then use owner/admin actions for fee changes, feature toggles, and withdrawals."
      />
      <ProtocolAdminPanel />
    </div>
  );
}
