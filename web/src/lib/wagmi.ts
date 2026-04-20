"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import { http } from "wagmi";
import { configuredChains } from "@/config/chains";

const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "msc-market-local-demo";

const transports = Object.fromEntries(
  configuredChains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])]),
) as Record<(typeof configuredChains)[number]["id"], ReturnType<typeof http>>;

export const wagmiConfig = getDefaultConfig({
  appName: "MSC Market",
  appDescription: "MSC inscription market DApp frontend",
  appUrl: "https://github.com/Maimai10808/scriptionMarket",
  projectId: walletConnectProjectId,
  chains: configuredChains as [
    (typeof configuredChains)[number],
    ...Array<(typeof configuredChains)[number]>,
  ],
  ssr: true,
  transports,
});

export const queryClient = new QueryClient();
