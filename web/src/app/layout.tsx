import type { Metadata } from "next";
import "@rainbow-me/rainbowkit/styles.css";
import Link from "next/link";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { WalletConnect } from "@/components/wallet/wallet-connect";

export const metadata: Metadata = {
  title: "MSC Market DApp",
  description: "Next.js frontend for the MSC inscription market protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <Providers>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(91,91,214,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(0,169,183,0.12),_transparent_28%),linear-gradient(180deg,_#2d3748_0%,_#273245_28%,_#eef2f7_28%,_#eef2f7_100%)] text-slate-950">
            <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-10">
              <div className="space-y-2">
                <Link href="/" className="inline-flex items-center gap-3 no-underline">
                  <span className="rounded-full border border-white/10 bg-white/12 px-3 py-1 font-mono text-xs uppercase tracking-[0.3em] text-white shadow-sm">
                    MSC
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-300/90">
                      inscription market
                    </p>
                    <h1 className="text-xl font-semibold text-white">Settlement Workspace</h1>
                  </div>
                </Link>
              </div>
              <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-200">
                <Link className="nav-link" href="/">
                  Dashboard
                </Link>
                <Link className="nav-link" href="/create-listing">
                  Create Listing
                </Link>
                <Link className="nav-link" href="/marketplace">
                  Marketplace
                </Link>
                <Link className="nav-link" href="/protocol">
                  Protocol
                </Link>
              </nav>
              <WalletConnect />
            </header>
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-16 pt-2 lg:px-10">
              {children}
            </main>
            <div className="pointer-events-none fixed bottom-6 right-6 z-40 flex justify-end">
              <Link
                href="/create-listing"
                className="fab-button material-ripple pointer-events-auto"
              >
                <span className="text-xl leading-none">+</span>
                <span className="text-sm font-medium">New Listing</span>
              </Link>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
