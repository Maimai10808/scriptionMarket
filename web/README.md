# MSC Market Web

This frontend is a Next.js App Router DApp for the upgradeable `MscMarketV1` proxy.

## Core flows

- `Dashboard`: wallet context + live protocol reads
- `Create Listing`: seller EIP-712 signing flow
- `Marketplace`: paste signed listing JSON and call `mscPurchase`
- `Protocol`: query order status / failure order and run admin writes

## Commands

```bash
npm install
npm run sync:contracts
npm run dev
```

## Contract sync

The frontend contract config is auto-generated in:

`src/lib/contracts/generated/msc-market.ts`

It is produced from Foundry deployment artifacts by:

```bash
npm run sync:contracts
```

If you deploy through Foundry, the updated `foundry/Makefile` now runs contract sync automatically after `make deploy`.

## Environment

Copy `.env.example` to `.env.local` and fill in the MXC RPC URLs you want the frontend to support.
