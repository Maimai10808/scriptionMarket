"use client";

import { createAppKit, type Metadata } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  arbitrumSepolia,
  sepolia,
  mainnet,
  arbitrum,
} from "@reown/appkit/networks";
import type { Config } from "wagmi";

/**
 * Reown Cloud Project ID。
 *
 * 需要在 Reown Cloud 创建项目后获取：
 * https://cloud.reown.com/
 */
export const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

/**
 * 当前应用网络类型。
 *
 * testnet：开发 / 测试环境
 * mainnet：正式环境
 */
export const APP_NET_TYPE = process.env.NEXT_PUBLIC_APP_NET_TYPE ?? "testnet";

/**
 * 当前业务主链 ID。
 *
 * 你的合约如果部署在 Sepolia，就填 11155111。
 * 如果部署在 Arbitrum Sepolia，就填 421614。
 */
export const APP_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_APP_CHAIN_ID ?? 11155111,
);

/**
 * 当前市场合约地址。
 *
 * 注意：
 * 你的合约是 UUPS 可升级架构，前端这里必须填 Proxy Address，
 * 不是 Implementation Address。
 */
export const MSC_MARKET_ADDRESS = process.env.NEXT_PUBLIC_MSC_MARKET_ADDRESS as
  | `0x${string}`
  | undefined;

/**
 * 钱包弹窗里展示的应用信息。
 *
 * metadata.url 在生产环境建议换成真实域名；
 * 本地开发可以先用 localhost。
 */
export const metadata: Metadata = {
  name: "Scription Market",
  description: "Off-chain signed listing marketplace for MSC inscriptions.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  icons: ["/icons/logo.png"],
};

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not defined");
}

/**
 * 根据环境返回 AppKit 支持的链。
 *
 * 先给测试版保留 Sepolia + Arbitrum Sepolia。
 * 后面如果你的合约只部署在某一条链，可以只保留那一条。
 */
export const getChains = () => {
  if (APP_NET_TYPE === "testnet") {
    return [sepolia, arbitrumSepolia] as const;
  }

  if (APP_NET_TYPE === "mainnet") {
    return [mainnet, arbitrum] as const;
  }

  throw new Error(`Invalid NEXT_PUBLIC_APP_NET_TYPE: ${APP_NET_TYPE}`);
};

export const chains = getChains();

export type ChainId = 1 | 11155111 | 42161 | 421614;

/**
 * 当前业务主链。
 *
 * 这个值用于 defaultNetwork，也可以用于判断当前钱包是否切到正确网络。
 */
export const APP_CHAIN =
  chains.find((chain) => chain.id === APP_CHAIN_ID) ?? chains[0];

/**
 * 创建 WagmiAdapter。
 *
 * Reown 官方示例里，Next.js / SSR 场景通常建议开启 ssr。
 * 这样能减少 Next.js hydration mismatch 相关问题。
 */
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [...chains],
  ssr: true,
});

/**
 * 创建 Reown AppKit 钱包弹窗。
 *
 * 这里先做测试版配置：
 * - 允许的钱包网络来自 chains
 * - 不允许停留在不支持的链
 * - 关闭 swaps / onramp / email / socials
 * - 保留 WalletConnect，方便移动端钱包扫码连接
 */
export const appKitModal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [...chains],
  projectId,
  metadata,

  allowUnsupportedChain: false,
  defaultNetwork: APP_CHAIN,

  features: {
    swaps: false,
    onramp: false,
    email: false,
    socials: false,
    analytics: false,
  },
});

/**
 * 监听 AppKit 当前 CAIP 网络变化。
 *
 * 这个主要用于调试钱包切链行为。
 * 后面你可以把它接到 Zustand，用来展示当前网络状态。
 */
appKitModal.subscribeCaipNetworkChange((caip) => {
  const id = Number(caip?.id) as ChainId;
  console.log("[AppKit] CAIP network changed:", id);
});

/**
 * 导出 wagmi config，供 WagmiProvider 使用。
 */
export const config = wagmiAdapter.wagmiConfig as Config;

/**
 * 给 wagmi 注册全局 config 类型。
 *
 * 这样项目里的 wagmi hooks 可以推导出你当前配置的 chains / connectors / transports。
 */
declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
