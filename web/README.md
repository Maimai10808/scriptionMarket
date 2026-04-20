# MSC Market Web

This frontend is a Next.js App Router DApp for the upgradeable `MscMarketV1` proxy.

## What it does

- reads live protocol state from the synced proxy deployment
- signs seller listings using EIP-712
- executes buyer purchases through `mscPurchase`
- exposes owner/admin protocol operations

## Single source of truth

The frontend does **not** maintain market addresses manually anymore.

ABI, proxy addresses, implementation addresses, chain metadata, and deployment timestamps are generated into:

- `src/lib/contracts/generated/msc-market.ts`

That file is produced by:

- `scripts/sync-contracts-to-web.ts`

The sync script reads:

- `../foundry/abis/MscMarketV1.json`
- `../foundry/broadcast/DeployMscMarketV1.s.sol/**/run-latest.json`

## Automatic sync behavior

The frontend auto-syncs contract metadata in three places:

1. `foundry/Makefile`
   `make deploy` and `make upgrade` both trigger `cd ../web && npm run sync:contracts`

2. `npm run dev`
   `predev` runs `npm run sync:contracts` before starting Next.js

3. `npm run build`
   `prebuild` runs `npm run sync:contracts` before building

That means you usually do not need to edit any address file by hand after a deployment.

## Environment

Copy `.env.example` to `.env.local` and fill in the RPC URLs you want the frontend to support:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_LOCAL_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_MXC_TEST_RPC_URL=
NEXT_PUBLIC_MXC_MAIN_RPC_URL=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

Notes:

- local RPC has a default value, so local demos work with minimal setup
- market addresses are synced from Foundry deployments, not from env vars
- if `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set, RainbowKit can expose its full wallet list

## Commands

Install:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

Force a manual sync:

```bash
npm run sync:contracts
```

## Demo flow

Once the frontend is running:

- `/` shows the current chain, synced proxy deployment, ABI sync timestamp, fee, owner/admin, and demo readiness
- `/create-listing` is the seller signing flow
- `/marketplace` is the buyer settlement flow
- `/protocol` is the read/admin operations flow
