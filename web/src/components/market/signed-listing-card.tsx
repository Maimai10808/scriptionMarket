"use client";

import { useState } from "react";
import { SectionCard } from "@/components/shared/section-card";

type SignedListingCardProps = {
  signedJson: string;
};

export function SignedListingCard({ signedJson }: SignedListingCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyJson() {
    if (!signedJson) {
      return;
    }

    await navigator.clipboard.writeText(signedJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <SectionCard
      eyebrow="Output"
      title="Signed listing JSON"
      description="This payload is ready to paste into the marketplace buy flow."
      className="h-full"
    >
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 text-slate-100">
          <pre className="preformatted min-h-[320px] text-xs leading-6">
            {signedJson || "Sign a listing to see the generated JSON here."}
          </pre>
        </div>
        <button
          type="button"
          className="button-secondary rounded-full px-5 py-3"
          disabled={!signedJson}
          onClick={copyJson}
        >
          {copied ? "Copied" : "Copy Listing JSON"}
        </button>
      </div>
    </SectionCard>
  );
}
