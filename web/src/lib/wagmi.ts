"use client";

import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { configuredChains } from "@/config/chains";

const transports = Object.fromEntries(
  configuredChains.map((chain) => [chain.id, http(chain.rpcUrls.default.http[0])]),
);

export const wagmiConfig = createConfig({
  chains: configuredChains,
  connectors: [injected()],
  ssr: true,
  transports,
});

export const queryClient = new QueryClient();
