# Msc 铭文交易市场

一个基于 EVM 的铭文交易市场示例项目，包含 **Foundry 智能合约工程** 和 **Next.js DApp 前端**，演示完整的 “卖家离线签名挂单 -> 买家链上购买 -> 协议状态查询/管理” 闭环。

这个仓库适合：

- 想学习 **Solidity + Foundry + Next.js + wagmi + viem** 如何联调的新手
- 想做 **Web3 前端接入** 的开发者
- 想理解 **Upgradeable Proxy / EIP-712 / 前端自动同步 ABI 与地址** 的开发者

---

## 1. 项目简介

### 一句话介绍

这是一个支持 **EIP-712 离线签名挂单、代理合约升级、前端自动同步 ABI/部署地址** 的铭文交易市场项目。

### 这个项目解决什么问题

在很多 Web3 项目里，合约部署完之后，前端还要手动改 ABI、地址、链配置，既容易出错，也不利于演示和维护。这个仓库把这几件事尽量串起来：

- 合约负责市场结算逻辑
- 前端负责签名、购买和状态展示
- 部署脚本负责把 **proxy 地址 + ABI + 链信息** 自动同步到前端

目标是让你尽量少手工复制粘贴配置文件。

### 核心业务流程

1. 卖家在前端填写 listing 信息
2. 前端基于 EIP-712 让卖家钱包离线签名
3. 买家把 listing JSON 粘贴到市场页并发起购买
4. 合约校验签名，完成 settlement
5. 前端展示协议状态、订单状态和交易结果

---

## 2. 项目特性

- **Upgradeable market contract**
  使用 UUPS + `ERC1967Proxy`，前端始终连接代理合约地址。

- **EIP-712 listing signature**
  卖家离线签名，买家链上提交，合约验证签名是否匹配。

- **Single purchase + batch purchase**
  支持 `mscPurchase(...)` 和 `mscBatchPurchase(...)`。

- **Protocol fee management**
  支持协议费读取与更新，当前合约计算方式是 `price * feeBps / 100`。

- **Feature flags**
  支持 `buy` / `withdraw` 等功能开关。

- **Failure order tracking**
  对失败打款订单做记录，可在协议页查询。

- **Protocol admin UI**
  前端可直接读取 `owner`、`adminAddress`、`feeBps`、`version`、feature 状态，并在 owner/admin 钱包下执行基础管理操作。

- **Frontend always targets proxy**
  前端不会连 implementation 地址，避免升级后接错合约。

- **ABI / 地址自动同步**
  Foundry 部署产物会同步生成到前端的统一合约配置文件中，这是本仓库非常重要的工程能力。

- **适合演示的 DApp 流程**
  首页看协议状态，签名页做 listing，市场页购买，协议页查状态/管理员操作。

---

## 3. 技术栈

### 合约侧

- **Solidity**
  编写市场合约 `MscMarketV1.sol`

- **Foundry**
  负责构建、测试、脚本部署、升级和广播产物输出

- **OpenZeppelin Upgradeable**
  提供 `OwnableUpgradeable`、`EIP712Upgradeable`、`UUPSUpgradeable`、`ReentrancyGuardUpgradeable`

### 前端侧

- **Next.js App Router**
  用于构建 DApp 页面结构

- **TypeScript**
  约束链交互、listing 数据结构和 hooks 类型

- **wagmi**
  负责钱包连接、签名、合约读写、等待交易回执

- **viem**
  提供 ABI 类型、地址/BigInt 处理、链配置定义

- **RainbowKit**
  提供钱包连接 UI

### 工程化与同步

- **Foundry broadcast 输出**
  作为部署地址和 implementation 地址来源

- **`web/scripts/sync-contracts-to-web.ts`**
  读取 Foundry ABI 和部署产物，生成前端统一合约配置

- **Root / web / foundry 多层脚本**
  用来简化本地启动、部署和同步流程

---

## 4. 仓库结构说明

先建立一个整体地图：

```text
.
├── README.md                    # 根文档，建议从这里开始
├── package.json                 # 根命令入口（启动本地链、部署、启动前端）
├── foundry/                     # 智能合约工程
└── web/                         # Next.js 前端 DApp
```

### 根目录

- [`package.json`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/package.json:1)
  提供最常用的跨目录命令，例如：
  - `npm run contracts:anvil`
  - `npm run contracts:deploy`
  - `npm run web:dev`

### `foundry/`

合约、测试、部署、升级都在这里。

- [`foundry/src/MscMarketV1.sol`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/src/MscMarketV1.sol:1)
  核心市场合约

- [`foundry/script/DeployMscMarketV1.s.sol`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/script/DeployMscMarketV1.s.sol:1)
  部署 implementation + proxy，并通过 proxy 调用 `initialize(...)`

- [`foundry/script/UpgradeMarket.s.sol`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/script/UpgradeMarket.s.sol:1)
  升级脚本

- [`foundry/script/HelperConfig.s.sol`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/script/HelperConfig.s.sol:1)
  根据链 ID 加载部署账户、admin 地址、fee 配置

- [`foundry/test/unit/`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/test/unit)
  单元测试与升级测试

- [`foundry/abis/MscMarketV1.json`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/abis/MscMarketV1.json:1)
  前端同步 ABI 的来源

- [`foundry/broadcast/DeployMscMarketV1.s.sol/`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/broadcast/DeployMscMarketV1.s.sol)
  Foundry 部署广播产物，前端同步地址会读取这里的 `run-latest.json`

- [`foundry/Makefile`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/Makefile:1)
  合约侧快捷命令；`make deploy` / `make upgrade` 已经内置前端同步

### `web/`

前端 DApp 在这里。

- [`web/src/app/`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/app)
  页面入口
  - `/` Dashboard
  - `/create-listing`
  - `/marketplace`
  - `/protocol`

- [`web/src/components/`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/components)
  钱包、市场、协议、共享 UI 组件

- [`web/src/hooks/`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/hooks)
  封装链交互逻辑
  - `use-market-read`
  - `use-sign-listing`
  - `use-purchase`
  - `use-protocol-admin`
  - `use-order-status`

- [`web/src/lib/contracts/`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/lib/contracts)
  合约 ABI、typed data、格式化、listing 处理、自动生成配置

- [`web/src/lib/contracts/generated/msc-market.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/lib/contracts/generated/msc-market.ts:1)
  前端合约配置的**单一真实来源**

- [`web/scripts/sync-contracts-to-web.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/scripts/sync-contracts-to-web.ts:1)
  把 Foundry 部署产物同步成前端可直接 import 的 TypeScript 模块

### 需要注意的点

仓库里还能看到一些历史兼容或过渡文件，例如：

- `web/src/lib/contracts/deployments/*.json`
- `web/src/config/market.ts`
- `web/src/contracts/abi/MscMarketV1.ts`
- `web/src/domain/market/*`

从当前代码路径来看，**前端主流程已经切到 `web/src/lib/contracts/generated/msc-market.ts` 这套配置**。新手阅读时，优先看：

- `web/src/lib/contracts/generated/msc-market.ts`
- `web/src/lib/contracts/market.ts`
- `web/src/hooks/*`

---

## 5. 项目核心实现思路

这一节尽量用通俗语言解释。

### 5.1 卖家如何创建 listing

卖家在前端的 [`/create-listing`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/app/create-listing/page.tsx:1) 页面输入：

- `number`
- `maker`
- `time`
- `amount`
- `price`
- `tick`

然后前端调用：

- [`web/src/lib/contracts/eip712.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/lib/contracts/eip712.ts:1)
- [`web/src/hooks/use-sign-listing.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/hooks/use-sign-listing.ts:1)

构造 EIP-712 typed data，并让卖家钱包签名，最终生成：

```json
{
  "marketStorage": {
    "number": "...",
    "maker": "0x...",
    "time": "...",
    "amount": "...",
    "price": "...",
    "tick": "..."
  },
  "signature": "0x..."
}
```

### 5.2 EIP-712 在这里扮演什么角色

它的作用是：让卖家**离线签名订单**，而不是让卖家自己发一笔上链挂单交易。

好处是：

- 卖家不需要先上链挂单
- 买家拿到签名后的 listing JSON 就可以直接成交
- 合约可以验证“这个订单确实是卖家本人签的”

### 5.3 买家如何发起购买

买家在 [`/marketplace`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/app/marketplace/page.tsx:1) 页面：

1. 粘贴 listing JSON
2. 前端解析 JSON
3. 调用 `mscPurchase(marketStorage, signature)`
4. 同时附带 `value = price`

对应代码主要在：

- [`web/src/hooks/use-purchase.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/hooks/use-purchase.ts:1)

### 5.4 合约如何验证签名

合约在 [`foundry/src/MscMarketV1.sol`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/src/MscMarketV1.sol:1) 的 `mscPurchase(...)` / `mscBatchPurchase(...)` 中：

1. 根据 listing 里的字段重新构造 EIP-712 hash
2. 用 `ECDSA.recover` 恢复签名者地址
3. 检查该地址是否等于 `marketStorage.maker`

如果不一致，就会 revert `MscMarketV1__InvalidSignature()`

### 5.5 为什么前端必须连接 proxy 地址

因为这个项目用了 UUPS + `ERC1967Proxy`。

真正对外稳定的入口是 **proxy address**：

- 升级时，implementation 会变
- 但 proxy address 不变
- 用户、前端、钱包、页面都应该连 proxy

这也是为什么前端同步脚本会同时记录：

- `proxyAddress`
- `implementationAddress`

但前端业务读写时始终用 proxy 地址。

### 5.6 前端 ABI 和地址怎么同步过来

同步脚本是：

- [`web/scripts/sync-contracts-to-web.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/scripts/sync-contracts-to-web.ts:1)

它会读取：

- [`foundry/abis/MscMarketV1.json`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/abis/MscMarketV1.json:1)
- [`foundry/broadcast/DeployMscMarketV1.s.sol/**/run-latest.json`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/broadcast/DeployMscMarketV1.s.sol)

然后生成：

- [`web/src/lib/contracts/generated/msc-market.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/lib/contracts/generated/msc-market.ts:1)

这个生成文件里会包含：

- ABI
- chainId
- chainName
- proxy address
- implementation address
- deployedAt
- deploymentTimestamp

### 5.7 为什么升级合约时前端最好不要手动改很多地方

因为升级后的 implementation 地址会变，但 proxy 地址通常不变。如果你把前端的地址和 ABI 分散写在多个文件里，升级后很容易漏改。

当前仓库已经把这个问题收敛成：

- Foundry 部署/升级后生成产物
- 同步脚本统一写入 `generated/msc-market.ts`
- 前端 hooks 和配置统一从这个文件读

这就是本项目比较关键的工程价值之一。

---

## 6. 快速开始

这一节面向第一次 clone 仓库的新手。

### 6.1 环境要求

请先安装：

- **Node.js**：建议 20+
- **npm**
- **Foundry**
  安装文档：[https://book.getfoundry.sh/getting-started/installation](https://book.getfoundry.sh/getting-started/installation)

### 6.2 第一次 clone 后先做什么

先安装前端依赖：

```bash
cd web
npm install
```

然后回到仓库根目录：

```bash
cd ..
```

如果你是第一次用 Foundry，也需要在 `foundry/` 下安装依赖：

```bash
cd foundry
forge install
cd ..
```

### 6.3 环境变量

这个仓库有两套环境变量：

#### A. 前端环境变量

复制：

```bash
cp web/.env.example web/.env.local
```

内容如下：

```env
NEXT_PUBLIC_LOCAL_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_MXC_TEST_RPC_URL=
NEXT_PUBLIC_MXC_MAIN_RPC_URL=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

它们分别用于：

- `NEXT_PUBLIC_LOCAL_RPC_URL`
  本地 Anvil 链 RPC，默认已经可用，本地演示基本必须

- `NEXT_PUBLIC_MXC_TEST_RPC_URL`
  前端连接 MXC 测试网时使用

- `NEXT_PUBLIC_MXC_MAIN_RPC_URL`
  前端连接 MXC 主网时使用

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
  RainbowKit / WalletConnect 使用；本地演示可以先不填，但钱包列表能力会受限

#### B. 合约部署环境变量

复制：

```bash
cp foundry/.env.example foundry/.env
```

`foundry/.env.example` 当前包含：

```env
TESTNETWORK_PRIVATE_KEY=xxx
TESTNETWORK_ADMIN_ADDRESS=xxx
MAINNETWORK_PRIVATE_KEY=xxx
MAINNETWORK_ADMIN_ADDRESS=xxx
WANNSEE_RPC_URL=https://wannsee-rpc.mxc.com
MXC_MAIN_RPC_URL=https://rpc.mxc.com
```

它们用于测试网/主网部署。

注意：

- **本地 Anvil 开发不要求你填写这些变量**
- 因为本地部署会走 `HelperConfig` 里的默认 Anvil 账户和默认 admin 地址

### 6.4 本地开发最小流程

如果你的目标只是本地把项目跑起来并演示完整 DApp 流程，最小步骤是：

1. 启动本地链
2. 部署合约
3. 启动前端

也就是：

```bash
npm run contracts:anvil
```

另开一个终端：

```bash
npm run contracts:deploy
```

再开一个终端：

```bash
npm run web:dev
```

打开：

- [http://localhost:3000](http://localhost:3000)

---

## 7. 启动命令

这一节明确区分：

- **当前仓库已经存在的命令**
- **后续建议新增的命令**

### 7.1 当前仓库已存在的根命令

来自 [`package.json`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/package.json:1)：

```bash
npm run contracts:anvil
npm run contracts:deploy
npm run contracts:deploy:testnet
npm run contracts:deploy:mainnet
npm run contracts:sync
npm run web:dev
npm run web:build
```

它们分别做什么：

- `npm run contracts:anvil`
  启动本地 Anvil 节点

- `npm run contracts:deploy`
  向本地链部署合约，并自动同步前端配置

- `npm run contracts:deploy:testnet`
  部署到 MXC 测试网，并自动同步前端配置

- `npm run contracts:deploy:mainnet`
  部署到 MXC 主网，并自动同步前端配置

- `npm run contracts:sync`
  手动执行一次前端合约配置同步

- `npm run web:dev`
  启动前端开发服务器

- `npm run web:build`
  构建前端

### 7.2 当前仓库已存在的前端命令

来自 [`web/package.json`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/package.json:1)：

```bash
cd web
npm run dev
npm run build
npm run lint
npm run sync:contracts
npm run deploy:and-sync
```

补充说明：

- `npm run dev`
  运行前会自动执行 `predev -> npm run sync:contracts`

- `npm run build`
  运行前会自动执行 `prebuild -> npm run sync:contracts`

- `npm run deploy:and-sync`
  实际上是 `cd ../foundry && make deploy`

### 7.3 当前最简启动方式

**当前真实情况：还没有做到两步启动。**

如果你要完整演示本地链 + 合约 + 前端，当前最简方式是 **3 个命令**：

```bash
npm run contracts:anvil
npm run contracts:deploy
npm run web:dev
```

如果本地链已经在跑，而且之前已经部署过合约，那么下一次只需要：

```bash
npm run web:dev
```

前提是：

- 当前链还是同一条
- 部署产物还有效
- 前端同步文件已经生成

### 7.4 推荐但当前还不存在的命令

这些命令**现在仓库里还没有**，这里只是建议：

- `npm run bootstrap`
  一次性安装 `web` 依赖 + Foundry 依赖 + 复制示例环境变量

- `npm run dev:contracts`
  启动本地链并自动部署

- `npm run dev:stack`
  一次拉起本地链、部署、前端

- `npm run deploy:local`
  更明确地表达“部署到本地 Anvil”

README 下面的“后续优化建议”会继续说明这些建议。

---

## 8. ABI / 地址自动同步机制

这是本项目最重要的工程化部分之一。

### 8.1 当前仓库已经有自动同步吗？

**有。**

同步脚本是：

- [`web/scripts/sync-contracts-to-web.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/scripts/sync-contracts-to-web.ts:1)

它会扫描：

- `foundry/abis/MscMarketV1.json`
- `foundry/broadcast/DeployMscMarketV1.s.sol/<chainId>/run-latest.json`

然后生成：

- `web/src/lib/contracts/generated/msc-market.ts`

### 8.2 什么时候会自动触发

当前自动触发点有 3 个：

1. Foundry 部署后
   [`foundry/Makefile`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/Makefile:1) 里的：
   - `make deploy`
   - `make upgrade`

   都会在最后执行：

   ```bash
   cd ../web && npm run sync:contracts
   ```

2. 前端启动前
   `web/package.json` 里的 `predev`

3. 前端 build 前
   `web/package.json` 里的 `prebuild`

### 8.3 部署后前端如何拿到最新地址和 ABI

正常流程下，你不需要手工改地址文件。

例如本地部署：

```bash
npm run contracts:deploy
```

这个命令最终会调用：

```bash
cd foundry && make deploy
```

而 `make deploy` 结尾已经包含：

```bash
cd ../web && npm run sync:contracts
```

所以部署完成后，前端的 [`web/src/lib/contracts/generated/msc-market.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/lib/contracts/generated/msc-market.ts:1) 会被刷新。

### 8.4 如果我重新部署合约，新手应该做什么

最安全的做法是：

1. 重新部署合约

```bash
npm run contracts:deploy
```

2. 确认同步文件已更新

```bash
cd web
npm run sync:contracts
```

3. 启动或重启前端

```bash
npm run dev
```

### 8.5 当前流程还不够顺滑的地方

当前已经比“手动复制地址和 ABI”顺畅很多，但还不算真正的一键化。主要瓶颈是：

- 本地链、部署、前端启动还需要分开执行
- 根目录还没有 `bootstrap` / `dev:stack` 这类统一入口
- `foundry/.env.example` 的格式还不够规范，新手容易直接照抄出空格问题

---

## 9. 演示流程

如果你想给别人快速演示“这个项目是活的”，推荐按下面来。

### 9.1 启动

1. 启动本地链

```bash
npm run contracts:anvil
```

2. 部署合约并同步前端

```bash
npm run contracts:deploy
```

3. 启动前端

```bash
npm run web:dev
```

### 9.2 页面演示顺序

#### 第一步：Dashboard

打开：

- `/`

这里可以先展示：

- 当前连接钱包
- 当前网络 / chainId
- proxy address
- implementation address
- owner / admin
- feeBps
- buy / withdraw 状态

#### 第二步：Create Listing

打开：

- `/create-listing`

操作：

1. 连接卖家钱包
2. 使用默认表单或手动改 `number / amount / price / tick`
3. 点击 `Sign Listing`
4. 得到 listing JSON
5. 复制 JSON

#### 第三步：Marketplace

打开：

- `/marketplace`

操作：

1. 粘贴刚才的 listing JSON
2. 点击 `Parse Listing`
3. 点击 `Buy Listing`
4. 展示交易 hash / 交易状态

#### 第四步：Protocol

打开：

- `/protocol`

操作：

1. 查询订单状态
2. 查询失败订单金额
3. 如果当前钱包是 owner/admin，可测试：
   - `setFeeBps`
   - `setFeatureStatus`
   - `mscWithdraw`

---

## 10. 常见问题 / 踩坑指南

### Q1. 为什么前端连不上合约，或者读不到协议状态？

优先检查这几件事：

1. 钱包当前链是不是正确
2. 前端 `.env.local` 里对应 RPC 是否已配置
3. 当前链是否已有同步后的部署产物

相关逻辑见：

- [`web/src/hooks/use-market-config.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/hooks/use-market-config.ts:1)

### Q2. 为什么前端不能连接 implementation 地址？

因为这个项目用的是 Proxy 模式，业务合约实例应该始终对着 proxy。implementation 只是在升级时替换逻辑代码，不是用户和前端的稳定入口。

### Q3. 重新部署后，前端为什么还是旧地址？

可能原因：

- 你部署后没有跑同步
- 或者前端还没重启
- 或者你看的不是 `run-latest.json`

最稳妥的处理方式：

```bash
npm run contracts:deploy
cd web && npm run sync:contracts
```

### Q4. 钱包连上了，但签名或购买还报错？

常见原因：

- 钱包链 ID 和前端当前支持链不一致
- `verifyingContract` 不是 proxy 地址
- EIP-712 domain 参数不一致
- listing JSON 里的价格、数量不是整数

可重点检查：

- [`web/src/lib/contracts/eip712.ts`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/src/lib/contracts/eip712.ts:1)
- [`foundry/src/MscMarketV1.sol`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/src/MscMarketV1.sol:1)

### Q5. 为什么我部署到测试网/主网时报环境变量错误？

因为测试网/主网部署依赖 `foundry/.env`，尤其是：

- `TESTNETWORK_PRIVATE_KEY`
- `TESTNETWORK_ADMIN_ADDRESS`
- `MAINNETWORK_PRIVATE_KEY`
- `MAINNETWORK_ADMIN_ADDRESS`

本地链不依赖这些变量，但测试网/主网需要。

### Q6. ABI 不匹配会发生什么？

如果 ABI 旧了、地址新了，或者地址旧了、ABI 新了，前端会出现：

- 读不到字段
- 写入函数报错
- 参数编码失败

这个仓库当前已经尽量通过同步脚本避免这种情况，所以**不要手动维护多份 ABI 文件**。

---

## 11. 后续优化建议

从“对新手友好的开源项目”角度，这个仓库已经有不错的基础，但还有几件事非常值得继续做。

### 11.1 一键启动 / 两步启动

当前本地完整演示需要 3 个命令：

```bash
npm run contracts:anvil
npm run contracts:deploy
npm run web:dev
```

更理想的方向是把它收敛成：

1. `npm run bootstrap`
2. `npm run dev:stack`

这样新手 clone 下来更不容易迷路。

### 11.2 统一 bootstrap

建议增加一个根脚本，用来自动完成：

- `cd web && npm install`
- `cd foundry && forge install`
- 检查或复制示例环境变量

### 11.3 更明确的本地部署命名

建议把本地部署命令显式命名为：

- `contracts:deploy:local`

这样和 testnet/mainnet 更对称。

### 11.4 提供演示用示例数据

建议增加：

- `docs/demo-script.md`
- `docs/sample-listing.json`

让第一次看项目的人不用自己先研究一遍表单值。

### 11.5 环境变量示例更规范

当前 `foundry/.env.example` 里有一个：

```env
TESTNETWORK_ADMIN_ADDRESS =xxx
```

中间带空格，新手容易直接照抄出问题。建议顺手修掉。

### 11.6 新手导向文档分层

建议后续把文档拆成：

- `README.md`
  面向第一次进入仓库的人

- `docs/architecture.md`
  解释 proxy、EIP-712、同步机制

- `docs/demo.md`
  只写演示流程

### 11.7 前端 UI 继续增强

当前前端已经具备完整演示闭环，但从开源项目体验角度，后续还可以继续补：

- 更明确的 loading / error guidance
- 交易成功后的事件展示
- 批量购买 UI
- 更系统化的空状态和表单帮助文案

---

## 12. 参考文档

如果你想继续往下读：

- 合约说明：[`foundry/README.md`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/README.md:1)
- 前端说明：[`web/README.md`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/web/README.md:1)
- 前端接入说明：[`foundry/FRONTEND_INTEGRATION_GUIDE.md`](/Volumes/DevDisk/Dev/projects/Web/open/scriptionMarket/foundry/FRONTEND_INTEGRATION_GUIDE.md:1)

---

## 13. 当前最短结论

如果你现在只想最快把项目跑起来，请直接执行：

```bash
npm run contracts:anvil
```

另开一个终端：

```bash
npm run contracts:deploy
```

再开一个终端：

```bash
npm run web:dev
```

然后打开：

- [http://localhost:3000](http://localhost:3000)

这是当前仓库的**真实最简启动方式**。
