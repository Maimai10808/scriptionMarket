import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { WalletConnect } from "@/components/wallet/wallet-connect";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

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
    <html
      lang="zh-CN"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(18,52,86,0.18),_transparent_32%),linear-gradient(180deg,_#08111c_0%,_#0d1726_40%,_#f1efe8_40%,_#f1efe8_100%)] text-slate-950">
            <header className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-10">
              <div className="space-y-2">
                <Link href="/" className="inline-flex items-center gap-3 no-underline">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.3em] text-white">
                    MSC
                  </span>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.35em] text-slate-300">
                      inscription market
                    </p>
                    <h1 className="text-xl font-semibold text-white">Settlement Console</h1>
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
            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-16 lg:px-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
