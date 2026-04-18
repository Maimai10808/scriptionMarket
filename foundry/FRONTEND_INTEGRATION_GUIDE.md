# Frontend Integration Guide for `MscMarketV1`

This document is for integrating the frontend or any external client with the smart contract part of this repository only. It focuses on what must be configured, how to construct signatures, how to call the contract on-chain, and what read/write methods are available.

The contract covered here is `foundry/src/MscMarketV1.sol`.

## 1. What This Contract Does

`MscMarketV1` is an upgradeable marketplace settlement contract for MSC-style listings.

The integration model is:

- the seller signs a listing off-chain using EIP-712 typed data
- the buyer submits that listing plus the seller signature on-chain
- the contract verifies the signature
- the contract pays the seller minus fee
- the contract emits a transfer-style marketplace event

This means your frontend needs both:

- a wallet-side signing flow for sellers
- a transaction submission flow for buyers

## 2. Important Integration Model

For frontend integration, always interact with the **proxy address**, not the implementation address.

The deployment script creates:

1. an implementation contract
2. an `ERC1967Proxy`
3. an `initialize(adminAddress, feeBps)` call through the proxy

So your frontend contract instance should always use the deployed proxy address together with the `MscMarketV1` ABI.

## 3. Known Deployed Proxy Addresses

These addresses are derived from the existing `broadcast` artifacts in this repo.

- MXC test network (`chainId: 5167003`): `0xAF6CA440dE0c70d27843b8Aa1cf0d3fC112b1B16`
- MXC main network (`chainId: 18686`): `0xe596CC861D0406ce9a9Bd4bD9C4367469019D790`

You should still verify these before using them in production, but they are the latest proxy addresses recorded in:

- `foundry/broadcast/DeployMscMarketV1.s.sol/5167003/run-latest.json`
- `foundry/broadcast/DeployMscMarketV1.s.sol/18686/run-latest.json`

## 4. What the Frontend Must Configure

At minimum, the frontend should have one config object per chain:

```ts
export const marketConfig = {
  5167003: {
    chainId: 5167003,
    chainName: "MXC Testnet",
    rpcUrl: process.env.NEXT_PUBLIC_MXC_TEST_RPC_URL!,
    marketAddress: "0xAF6CA440dE0c70d27843b8Aa1cf0d3fC112b1B16",
    abi: MscMarketV1Abi,
  },
  18686: {
    chainId: 18686,
    chainName: "MXC Mainnet",
    rpcUrl: process.env.NEXT_PUBLIC_MXC_MAIN_RPC_URL!,
    marketAddress: "0xe596CC861D0406ce9a9Bd4bD9C4367469019D790",
    abi: MscMarketV1Abi,
  },
}
```

Recommended environment variables:

```env
NEXT_PUBLIC_MXC_TEST_RPC_URL=
NEXT_PUBLIC_MXC_MAIN_RPC_URL=
NEXT_PUBLIC_MARKET_TEST_ADDRESS=0xAF6CA440dE0c70d27843b8Aa1cf0d3fC112b1B16
NEXT_PUBLIC_MARKET_MAIN_ADDRESS=0xe596CC861D0406ce9a9Bd4bD9C4367469019D790
```

The ABI is already available in:

- `foundry/abis/MscMarketV1.json`

## 5. Contract Data Structures

The key struct used by purchase calls is:

```solidity
struct MarketStorage {
    uint256 number;
    address maker;
    uint256 time;
    uint256 amount;
    uint256 price;
    string tick;
}
```

This same payload must be used consistently in:

- the seller's off-chain typed-data signature
- the buyer's on-chain transaction payload

## 6. EIP-712 Signing Specification

The contract verifies a typed-data message using:

- domain name: `MscMarketV1`
- version: `1.0`
- verifying contract: the proxy address
- chain ID: the active network chain ID

The type being signed is:

```text
Listing(address maker,uint256 time,uint256 amount,uint256 price,string tick)
```

Important detail:

- `number` exists in `MarketStorage`, but it is **not included** in the signed EIP-712 payload

That means the frontend must sign exactly the fields below, in this exact order:

```ts
const types = {
  Listing: [
    { name: "maker", type: "address" },
    { name: "time", type: "uint256" },
    { name: "amount", type: "uint256" },
    { name: "price", type: "uint256" },
    { name: "tick", type: "string" },
  ],
}
```

The domain should be:

```ts
const domain = {
  name: "MscMarketV1",
  version: "1.0",
  chainId,
  verifyingContract: marketAddress,
}
```

The message should be:

```ts
const message = {
  maker,
  time,
  amount,
  price,
  tick,
}
```

## 7. Seller Signing Flow

The seller flow should look like this:

1. Seller opens the listing UI
2. Frontend builds the listing object
3. Frontend asks the seller wallet to sign EIP-712 typed data
4. Frontend stores the resulting `signature`
5. Frontend or backend exposes the listing payload plus signature to buyers

Example with `ethers` v6:

```ts
import { BrowserProvider } from "ethers"

const provider = new BrowserProvider(window.ethereum)
const signer = await provider.getSigner()

const signature = await signer.signTypedData(domain, types, message)
```

The signed object your app should persist can look like:

```ts
const order = {
  marketStorage: {
    number,
    maker,
    time,
    amount,
    price,
    tick,
  },
  signature,
}
```

## 8. Buyer Purchase Flow

The buyer flow is:

1. Fetch order data and seller signature
2. Confirm the frontend wallet is connected to the correct chain
3. Call `mscPurchase(marketStorage, signature)`
4. Send `value >= marketStorage.price`

Example with `ethers` v6:

```ts
import { BrowserProvider, Contract } from "ethers"
import MscMarketV1Abi from "./MscMarketV1.json"

const provider = new BrowserProvider(window.ethereum)
const signer = await provider.getSigner()
const contract = new Contract(marketAddress, MscMarketV1Abi, signer)

const tx = await contract.mscPurchase(order.marketStorage, order.signature, {
  value: order.marketStorage.price,
})

await tx.wait()
```

## 9. Batch Purchase Flow

The contract also supports:

```solidity
mscBatchPurchase(MarketStorage[] marketStorages, bytes[] signatures, uint256 totalPrice)
```

Frontend requirements for batch purchase:

- `marketStorages.length` must equal `signatures.length`
- `msg.value` must be at least `totalPrice`
- `totalPrice` should be the total payment your frontend wants to send for the batch

Example:

```ts
const tx = await contract.mscBatchPurchase(marketStorages, signatures, totalPrice, {
  value: totalPrice,
})

await tx.wait()
```

Note that the batch function skips invalid or already-processed items instead of reverting the entire batch in those cases.

## 10. Read Methods the Frontend Can Use

These are the main read methods useful to the frontend:

### Basic config and metadata

- `getAdminAddress() -> address`
- `getFeeBps() -> uint96`
- `getFeatureStatus(feature: string) -> bool`
- `getVersion() -> uint256`
- `getDomainSeparator() -> bytes32`

### Order and failure tracking

- `getFailureOrder(address seller) -> uint256`
- `getOrderStatus(address processingAddress, uint256 number) -> uint8`

Order status enum:

- `0 = Listing`
- `1 = Canceled`
- `2 = Sold`

Example with a read-only provider:

```ts
const feeBps = await contract.getFeeBps()
const buyEnabled = await contract.getFeatureStatus("buy")
const orderStatus = await contract.getOrderStatus(maker, number)
```

## 11. Write Methods and Who Should Use Them

### Buyer-facing methods

- `mscPurchase(...)`
- `mscBatchPurchase(...)`

### Seller-facing or recovery-related

- `manualGetIncome(address seller)`

This can be used if the contract recorded a failed payout for a seller.

### Owner/admin-only operations

- `mscWithdraw()`
- `setFeeBps(uint96 newFeeBps)`
- `setFeatureStatus(string feature, bool enabled)`
- `setAllFeatuteStatus(bool enabled)`
- upgrade operations through the proxy owner

The frontend should usually separate:

- public trading UI
- admin dashboard UI

## 12. Required Frontend Validations

Before asking a buyer to submit a transaction, the frontend should validate:

- connected chain matches the order chain
- contract address is configured for the current chain
- signature is present
- `maker` is a valid address
- `price > 0`
- `amount > 0`
- `tick` is present
- current order status is still `Listing`
- feature `buy` is enabled

Useful preflight reads:

```ts
const [buyEnabled, orderStatus, feeBps] = await Promise.all([
  contract.getFeatureStatus("buy"),
  contract.getOrderStatus(order.marketStorage.maker, order.marketStorage.number),
  contract.getFeeBps(),
])
```

## 13. Event Subscription

The main settlement event is:

```solidity
event mxcscriptions_protocol_TransferMSC20Token(
    address indexed from,
    address indexed buyer,
    uint256 indexed number,
    uint256 amount
);
```

Frontend or indexer can listen for it to update UI state.

Example:

```ts
contract.on("mxcscriptions_protocol_TransferMSC20Token", (from, buyer, number, amount) => {
  console.log({ from, buyer, number, amount })
})
```

## 14. Fee Handling

The contract computes fee as:

```solidity
fee = (price * feeBps) / 100
```

Important integration note:

- although the variable is named `feeBps`, the current contract calculates against `100`, not `10000`
- so if `feeBps = 2`, the effective fee is `2%`

Your frontend should display the fee based on the actual contract formula, not the variable name convention.

## 15. Suggested Frontend Utility Functions

You will likely want these helpers:

```ts
export function computeProtocolFee(price: bigint, feeBps: bigint) {
  return (price * feeBps) / 100n
}

export function computeSellerReceivable(price: bigint, feeBps: bigint) {
  return price - computeProtocolFee(price, feeBps)
}
```

And a typed-data builder:

```ts
export function buildListingTypedData({
  chainId,
  marketAddress,
  maker,
  time,
  amount,
  price,
  tick,
}: {
  chainId: number
  marketAddress: string
  maker: string
  time: bigint
  amount: bigint
  price: bigint
  tick: string
}) {
  return {
    domain: {
      name: "MscMarketV1",
      version: "1.0",
      chainId,
      verifyingContract: marketAddress,
    },
    types: {
      Listing: [
        { name: "maker", type: "address" },
        { name: "time", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "tick", type: "string" },
      ],
    },
    message: {
      maker,
      time,
      amount,
      price,
      tick,
    },
  }
}
```

## 16. Recommended Integration Architecture

For a cleaner app design, split responsibilities like this:

- seller UI: creates order payload and signs typed data
- backend or storage layer: stores signed listings
- buyer UI: fetches listing and submits purchase tx
- indexer or listener: watches events and updates order state
- admin UI: manages fee, withdrawals, and feature flags

This contract is a settlement layer. It does not provide a full order book or listing database by itself.

## 17. Important Caveats

These are integration caveats from the current implementation:

- `number` is used in order-status tracking, but it is not part of the signed typed-data payload
- `getOrderStatus` defaults to `Listing` for unseen mappings because enum default is `0`
- fee naming uses `feeBps`, but formula behaves like percent over 100
- the contract emits a transfer-style event, but it does not itself transfer an external asset contract

Your frontend should treat this contract as the payment-and-verification layer, not as a full asset transfer engine.

## 18. Minimal Checklist for Frontend Setup

Before integrating, make sure you have:

- proxy contract address per chain
- `MscMarketV1` ABI
- RPC URL per chain
- typed-data signing helper
- buyer transaction helper
- fee display helper
- order status checker
- event listener or polling logic
- admin wallet separation for owner-only actions

## 19. File References

- Contract: [foundry/src/MscMarketV1.sol](/Users/mac/Desktop/Web/open/scriptionMarket/foundry/src/MscMarketV1.sol:1)
- ABI: [foundry/abis/MscMarketV1.json](/Users/mac/Desktop/Web/open/scriptionMarket/foundry/abis/MscMarketV1.json:1)
- Deployment script: [foundry/script/DeployMscMarketV1.s.sol](/Users/mac/Desktop/Web/open/scriptionMarket/foundry/script/DeployMscMarketV1.s.sol:1)
- Network config: [foundry/script/HelperConfig.s.sol](/Users/mac/Desktop/Web/open/scriptionMarket/foundry/script/HelperConfig.s.sol:1)
- Signing reference: [foundry/test/utils/SigUtils.sol](/Users/mac/Desktop/Web/open/scriptionMarket/foundry/test/utils/SigUtils.sol:1)
- Tests: [foundry/test/unit/MscMarketV1Test.t.sol](/Users/mac/Desktop/Web/open/scriptionMarket/foundry/test/unit/MscMarketV1Test.t.sol:1)
