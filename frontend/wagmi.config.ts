import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import type { Abi } from "viem";

import mscMarketV1Abi from "./src/contracts/abi/MscMarketV1.json";
import { MSC_MARKET_V1_ADDRESS } from "./src/constants/contracts";

export default defineConfig({
  out: "src/generated/wagmi.ts",
  contracts: [
    {
      name: "MscMarketV1",
      abi: mscMarketV1Abi as Abi,
      address: {
        // Local Anvil
        31337: MSC_MARKET_V1_ADDRESS as `0x${string}`,

        // 如果以后部署 Sepolia，可以加：
        // 11155111: MSC_MARKET_V1_ADDRESS as `0x${string}`,
      },
    },
  ],
  plugins: [react()],
});
