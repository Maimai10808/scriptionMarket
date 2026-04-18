# ScriptionMarket

ScriptionMarket is a Foundry-based Solidity project for deploying and maintaining an upgradeable MSC marketplace contract. The core contract, `MscMarketV1`, supports signature-based purchases, batch purchases, admin-controlled fee management, feature toggles, withdrawals, and UUPS upgrades.

## Overview

The repository contains:

- `src/MscMarketV1.sol`: the main upgradeable marketplace contract
- `script/DeployMscMarketV1.s.sol`: deployment script for the proxy-based market
- `script/UpgradeMarket.s.sol`: upgrade script for replacing the implementation behind the proxy
- `script/HelperConfig.s.sol`: network-specific configuration and environment variable loading
- `test/unit/MscMarketV1Test.t.sol`: unit tests for initialization, purchase flows, feature flags, and withdrawals
- `test/unit/DeployAndUpgradeTest.t.sol`: deployment and upgrade tests
- `abis/MscMarketV1.json`: exported ABI for integration work

## Contract Summary

`MscMarketV1` is built with:

- `OwnableUpgradeable`
- `ReentrancyGuardUpgradeable`
- `EIP712Upgradeable`
- `UUPSUpgradeable`

Main capabilities:

- Initialize the proxy with an admin address and fee basis points
- Execute single purchases with EIP-712 signature verification
- Execute batch purchases
- Track failed seller payouts for manual recovery
- Withdraw accumulated protocol balance to the configured admin address
- Enable or disable market features such as `buy` and `withdraw`
- Upgrade the implementation through the UUPS upgrade path

## Supported Networks

Network selection is handled in `script/HelperConfig.s.sol`.

- `31337`: local Anvil
- `5167003`: MXC test network
- `18686`: MXC main network

For local development, the project uses the default Anvil account and a default fee of `2`.

## Requirements

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Solidity compiler `0.8.20`

## Installation

Clone the repository and install dependencies:

```bash
forge install
```

If you prefer the repository's Makefile flow:

```bash
make install
```

## Environment Variables

Create a `.env` file in the project root. Depending on the target network, set the following variables:

```env
# MXC test network
TESTNETWORK_PRIVATE_KEY=
TESTNETWORK_ADMIN_ADDRESS=

# MXC main network
MAINNETWORK_PRIVATE_KEY=
MAINNETWORK_ADMIN_ADDRESS=

# RPC endpoints used by the Makefile
WANNSEE_RPC_URL=
MXC_MAIN_RPC_URL=
```

Notes:

- Local Anvil deployment does not require additional environment variables.
- `HelperConfig` reads `TESTNETWORK_PRIVATE_KEY`, `TESTNETWORK_ADMIN_ADDRESS`, `MAINNETWORK_PRIVATE_KEY`, and `MAINNETWORK_ADMIN_ADDRESS`.
- The Makefile switches RPC arguments based on `ARGS="--network wannsee"` or `ARGS="--network mainnet"`.

## Build

```bash
forge build
```

Or:

```bash
make build
```

## Test

```bash
forge test
```

Or:

```bash
make test
```

Current note: in this workspace, `forge test` did not complete because Foundry crashed while attempting to install `solc 0.8.20` on the local machine. That is an environment/tooling issue rather than a documented test failure in the project source itself.

## Local Development

Start a local Anvil node:

```bash
make anvil
```

Then deploy locally:

```bash
make deploy
```

The local deployment path uses:

- RPC URL: `http://localhost:8545`
- Default private key from the Makefile

## Deployment

Deploy to a local node:

```bash
forge script script/DeployMscMarketV1.s.sol:DeployMscMarketV1 \
  --rpc-url http://localhost:8545 \
  --private-key <PRIVATE_KEY> \
  --broadcast
```

Deploy through the Makefile:

```bash
make deploy
```

Deploy to the MXC test network:

```bash
make deploy ARGS="--network wannsee"
```

Deploy to the MXC main network:

```bash
make deploy ARGS="--network mainnet"
```

The deployment script:

1. Loads the active network configuration
2. Deploys `MscMarketV1`
3. Deploys an `ERC1967Proxy`
4. Calls `initialize(adminAddress, feeBps)` through the proxy

## Upgrade Flow

The project includes a UUPS upgrade script:

```bash
forge script script/UpgradeMarket.s.sol:UpgradeMarket \
  --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  --broadcast
```

The upgrade script:

1. Locates the most recently deployed proxy
2. Deploys a new implementation contract
3. Calls `upgradeToAndCall` on the proxy

## Project Structure

```text
.
├── src/
│   └── MscMarketV1.sol
├── script/
│   ├── DeployMscMarketV1.s.sol
│   ├── HelperConfig.s.sol
│   └── UpgradeMarket.s.sol
├── test/
│   ├── mock/
│   ├── unit/
│   └── utils/
├── abis/
├── broadcast/
├── foundry.toml
└── Makefile
```

## Development Notes

- The market relies on EIP-712 hashing for purchase authorization.
- Fees are computed as `price * feeBps / 100`.
- Failed seller payouts are stored and can be retried with `manualGetIncome`.
- Feature flags allow the owner to disable individual actions or all major actions.

## License

This repository currently uses Solidity source files marked with the MIT license.
