"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnect() {
  return (
    <div className="panel-dark rounded-full border border-white/10 px-2 py-2 shadow-[var(--elevation-3)]">
      <ConnectButton
        accountStatus={{ smallScreen: "avatar", largeScreen: "address" }}
        chainStatus={{ smallScreen: "icon", largeScreen: "name" }}
        showBalance={false}
        label="Connect Wallet"
      />
    </div>
  );
}
