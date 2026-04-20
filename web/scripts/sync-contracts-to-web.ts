import { promises as fs } from "node:fs";
import path from "node:path";

type ChainRegistryEntry = {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrl: string;
  rpcEnvVar: string;
  kind: "local" | "testnet" | "mainnet";
};

type BroadcastTransaction = {
  contractAddress?: string;
  contractName?: string;
  transactionType?: string;
};

type BroadcastFile = {
  chain?: number;
  timestamp?: number;
  transactions?: BroadcastTransaction[];
  returns?: {
    mscMarketV1?: {
      value?: string;
    };
  };
};

type DeploymentRecord = {
  contractName: "MscMarketV1";
  chainId: number;
  chainName: string;
  address: string;
  proxyAddress: string;
  implementationAddress: string | null;
  deployedAt: string | null;
  deploymentTimestamp: number | null;
  source: string;
};

const CHAIN_REGISTRY: Record<number, ChainRegistryEntry> = {
  31337: {
    chainId: 31337,
    chainName: "Anvil Local",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrl: "http://127.0.0.1:8545",
    rpcEnvVar: "NEXT_PUBLIC_LOCAL_RPC_URL",
    kind: "local",
  },
  5167003: {
    chainId: 5167003,
    chainName: "MXC Testnet",
    nativeCurrency: {
      name: "MXC",
      symbol: "MXC",
      decimals: 18,
    },
    blockExplorerUrl: "https://explorer.mxc.com",
    rpcEnvVar: "NEXT_PUBLIC_MXC_TEST_RPC_URL",
    kind: "testnet",
  },
  18686: {
    chainId: 18686,
    chainName: "MXC Mainnet",
    nativeCurrency: {
      name: "MXC",
      symbol: "MXC",
      decimals: 18,
    },
    blockExplorerUrl: "https://explorer.mxc.com",
    rpcEnvVar: "NEXT_PUBLIC_MXC_MAIN_RPC_URL",
    kind: "mainnet",
  },
};

async function readJson<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

function toIsoTimestamp(timestamp?: number) {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

function formatDeploymentRecord(
  chainId: number,
  source: string,
  broadcast: BroadcastFile,
): DeploymentRecord | null {
  const transactions = broadcast.transactions ?? [];
  const implementationTx = transactions.find(
    (tx) => tx.contractName === "MscMarketV1" && tx.transactionType === "CREATE",
  );
  const proxyTx = transactions.find(
    (tx) =>
      tx.contractName === "ERC1967Proxy" && tx.transactionType === "CREATE",
  );

  const proxyAddress =
    broadcast.returns?.mscMarketV1?.value ?? proxyTx?.contractAddress ?? null;

  if (!proxyAddress) {
    return null;
  }

  return {
    contractName: "MscMarketV1",
    chainId,
    chainName: CHAIN_REGISTRY[chainId]?.chainName ?? `Chain ${chainId}`,
    address: proxyAddress,
    proxyAddress,
    implementationAddress: implementationTx?.contractAddress ?? null,
    deployedAt: toIsoTimestamp(broadcast.timestamp),
    deploymentTimestamp: broadcast.timestamp ?? null,
    source,
  };
}

async function collectFoundryDeployments(repoRoot: string) {
  const deployRoot = path.join(
    repoRoot,
    "foundry",
    "broadcast",
    "DeployMscMarketV1.s.sol",
  );

  const deployments: DeploymentRecord[] = [];

  try {
    await fs.access(deployRoot);
  } catch {
    console.warn(
      `No Foundry deployment directory found at ${path.relative(repoRoot, deployRoot)}. Generating an empty deployment manifest.`,
    );
    return deployments;
  }

  const entries = await fs.readdir(deployRoot, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const chainId = Number(entry.name);
    if (Number.isNaN(chainId)) continue;

    const runLatestPath = path.join(deployRoot, entry.name, "run-latest.json");

    try {
      const broadcast = await readJson<BroadcastFile>(runLatestPath);
      const deployment = formatDeploymentRecord(chainId, runLatestPath, broadcast);
      if (deployment) {
        deployments.push(deployment);
      }
    } catch (error) {
      console.warn(`Skipping ${runLatestPath}:`, error);
    }
  }

  return deployments.sort((left, right) => left.chainId - right.chainId);
}

function buildGeneratedModule(abi: unknown, deployments: DeploymentRecord[]) {
  const chainEntries = Object.values(CHAIN_REGISTRY)
    .map((chain) => {
      return `  ${chain.chainId}: {
    chainId: ${chain.chainId},
    chainName: "${chain.chainName}",
    nativeCurrency: {
      name: "${chain.nativeCurrency.name}",
      symbol: "${chain.nativeCurrency.symbol}",
      decimals: ${chain.nativeCurrency.decimals},
    },
    blockExplorerUrl: "${chain.blockExplorerUrl}",
    rpcEnvVar: "${chain.rpcEnvVar}",
    kind: "${chain.kind}",
  },`;
    })
    .join("\n");

  const deploymentEntries = deployments
    .map((deployment) => {
      const implementationAddress = deployment.implementationAddress
        ? `"${deployment.implementationAddress}" as Address`
        : "null";
      const deployedAt = deployment.deployedAt ? `"${deployment.deployedAt}"` : "null";
      const deploymentTimestamp =
        deployment.deploymentTimestamp === null
          ? "null"
          : String(deployment.deploymentTimestamp);

      return `  ${deployment.chainId}: {
    contractName: "${deployment.contractName}",
    chainId: ${deployment.chainId},
    chainName: "${deployment.chainName}",
    address: "${deployment.address}" as Address,
    proxyAddress: "${deployment.proxyAddress}" as Address,
    implementationAddress: ${implementationAddress},
    deployedAt: ${deployedAt},
    deploymentTimestamp: ${deploymentTimestamp},
    source: "${deployment.source.replaceAll("\\", "\\\\")}",
  },`;
    })
    .join("\n");

  return `// This file is auto-generated by scripts/sync-contracts-to-web.ts.
// Do not edit it by hand.

import type { Abi, Address } from "viem";

export const MSC_MARKET_ABI = ${JSON.stringify(abi, null, 2)} as const satisfies Abi;

export const MSC_MARKET_GENERATED_AT = "${new Date().toISOString()}";

export const MSC_MARKET_CHAIN_REGISTRY = {
${chainEntries}
} as const;

export const MSC_MARKET_DEPLOYMENTS = {
${deploymentEntries}
} as const;

export const MSC_MARKET_DEPLOYMENT_CHAIN_IDS = Object.keys(
  MSC_MARKET_DEPLOYMENTS,
).map((chainId) => Number(chainId)) as Array<keyof typeof MSC_MARKET_CHAIN_REGISTRY>;

export type MscMarketDeployment =
  (typeof MSC_MARKET_DEPLOYMENTS)[keyof typeof MSC_MARKET_DEPLOYMENTS];

export type MscMarketChain =
  (typeof MSC_MARKET_CHAIN_REGISTRY)[keyof typeof MSC_MARKET_CHAIN_REGISTRY];
`;
}

async function main() {
  const webRoot = process.cwd();
  const repoRoot = path.resolve(webRoot, "..");
  const abiPath = path.join(repoRoot, "foundry", "abis", "MscMarketV1.json");
  const outputPath = path.join(
    webRoot,
    "src",
    "lib",
    "contracts",
    "generated",
    "msc-market.ts",
  );

  const abi = await readJson<unknown>(abiPath);
  const deployments = await collectFoundryDeployments(repoRoot);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, buildGeneratedModule(abi, deployments), "utf8");

  console.log(
    `Synced ${deployments.length} deployment(s) to ${path.relative(webRoot, outputPath)}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
