import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MscMarketV1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const mscMarketV1Abi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1967InvalidImplementation',
  },
  { type: 'error', inputs: [], name: 'ERC1967NonPayable' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'InvalidInitialization' },
  {
    type: 'error',
    inputs: [{ name: 'featurePoint', internalType: 'string', type: 'string' }],
    name: 'MscMarketV1__FeatureDisabled',
  },
  { type: 'error', inputs: [], name: 'MscMarketV1__InvalidSignature' },
  { type: 'error', inputs: [], name: 'MscMarketV1__LengthNotEqual' },
  { type: 'error', inputs: [], name: 'MscMarketV1__NotFailureOrder' },
  { type: 'error', inputs: [], name: 'MscMarketV1__OrderIsProcessing' },
  { type: 'error', inputs: [], name: 'MscMarketV1__PurchaseFailed' },
  { type: 'error', inputs: [], name: 'MscMarketV1__WithdrawFailed' },
  { type: 'error', inputs: [], name: 'NotInitializing' },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  { type: 'error', inputs: [], name: 'UUPSUnauthorizedCallContext' },
  {
    type: 'error',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'UUPSUnsupportedProxiableUUID',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'version',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'buyer',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'number',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'mxcscriptions_protocol_TransferMSC20Token',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'price', internalType: 'uint256', type: 'uint256' }],
    name: 'computeFee',
    outputs: [{ name: 'fee', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAdminAddress',
    outputs: [
      { name: 'adminAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getDomainSeparator',
    outputs: [
      { name: 'domainSeparator', internalType: 'bytes32', type: 'bytes32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'failureAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getFailureOrder',
    outputs: [
      { name: 'failureAmount', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'feature', internalType: 'string', type: 'string' }],
    name: 'getFeatureStatus',
    outputs: [{ name: 'isEnabled', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getFeeBps',
    outputs: [{ name: 'feeBps', internalType: 'uint96', type: 'uint96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'processingAddress', internalType: 'address', type: 'address' },
      { name: 'number', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getOrderStatus',
    outputs: [
      {
        name: 'status',
        internalType: 'enum MscMarketV1.OrderStatus',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getVersion',
    outputs: [{ name: 'version', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'adminAddress', internalType: 'address', type: 'address' },
      { name: 'feeBps', internalType: 'uint96', type: 'uint96' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'seller', internalType: 'address', type: 'address' }],
    name: 'manualGetIncome',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'marketStorages',
        internalType: 'struct MscMarketV1.MarketStorage[]',
        type: 'tuple[]',
        components: [
          { name: 'number', internalType: 'uint256', type: 'uint256' },
          { name: 'maker', internalType: 'address', type: 'address' },
          { name: 'time', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'tick', internalType: 'string', type: 'string' },
        ],
      },
      { name: 'signatures', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'totalPrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mscBatchPurchase',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'marketStorage',
        internalType: 'struct MscMarketV1.MarketStorage',
        type: 'tuple',
        components: [
          { name: 'number', internalType: 'uint256', type: 'uint256' },
          { name: 'maker', internalType: 'address', type: 'address' },
          { name: 'time', internalType: 'uint256', type: 'uint256' },
          { name: 'amount', internalType: 'uint256', type: 'uint256' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          { name: 'tick', internalType: 'string', type: 'string' },
        ],
      },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mscPurchase',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'mscWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newAdminAddress', internalType: 'address', type: 'address' },
    ],
    name: 'setAdminAddress',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'enabled', internalType: 'bool', type: 'bool' }],
    name: 'setAllFeatuteStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feature', internalType: 'string', type: 'string' },
      { name: 'enabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setFeatureStatus',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newFeeBps', internalType: 'uint96', type: 'uint96' }],
    name: 'setFeeBps',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 *
 */
export const mscMarketV1Address = {
  31337: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
} as const

/**
 *
 */
export const mscMarketV1Config = {
  address: mscMarketV1Address,
  abi: mscMarketV1Abi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__
 *
 *
 */
export const useReadMscMarketV1 = /*#__PURE__*/ createUseReadContract({
  abi: mscMarketV1Abi,
  address: mscMarketV1Address,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"UPGRADE_INTERFACE_VERSION"`
 *
 *
 */
export const useReadMscMarketV1UpgradeInterfaceVersion =
  /*#__PURE__*/ createUseReadContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'UPGRADE_INTERFACE_VERSION',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"computeFee"`
 *
 *
 */
export const useReadMscMarketV1ComputeFee = /*#__PURE__*/ createUseReadContract(
  {
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'computeFee',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"eip712Domain"`
 *
 *
 */
export const useReadMscMarketV1Eip712Domain =
  /*#__PURE__*/ createUseReadContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"getAdminAddress"`
 *
 *
 */
export const useReadMscMarketV1GetAdminAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'getAdminAddress',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"getDomainSeparator"`
 *
 *
 */
export const useReadMscMarketV1GetDomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'getDomainSeparator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"getFailureOrder"`
 *
 *
 */
export const useReadMscMarketV1GetFailureOrder =
  /*#__PURE__*/ createUseReadContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'getFailureOrder',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"getFeatureStatus"`
 *
 *
 */
export const useReadMscMarketV1GetFeatureStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'getFeatureStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"getFeeBps"`
 *
 *
 */
export const useReadMscMarketV1GetFeeBps = /*#__PURE__*/ createUseReadContract({
  abi: mscMarketV1Abi,
  address: mscMarketV1Address,
  functionName: 'getFeeBps',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"getOrderStatus"`
 *
 *
 */
export const useReadMscMarketV1GetOrderStatus =
  /*#__PURE__*/ createUseReadContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'getOrderStatus',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"getVersion"`
 *
 *
 */
export const useReadMscMarketV1GetVersion = /*#__PURE__*/ createUseReadContract(
  {
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'getVersion',
  },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"owner"`
 *
 *
 */
export const useReadMscMarketV1Owner = /*#__PURE__*/ createUseReadContract({
  abi: mscMarketV1Abi,
  address: mscMarketV1Address,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"proxiableUUID"`
 *
 *
 */
export const useReadMscMarketV1ProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'proxiableUUID',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__
 *
 *
 */
export const useWriteMscMarketV1 = /*#__PURE__*/ createUseWriteContract({
  abi: mscMarketV1Abi,
  address: mscMarketV1Address,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"initialize"`
 *
 *
 */
export const useWriteMscMarketV1Initialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"manualGetIncome"`
 *
 *
 */
export const useWriteMscMarketV1ManualGetIncome =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'manualGetIncome',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"mscBatchPurchase"`
 *
 *
 */
export const useWriteMscMarketV1MscBatchPurchase =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'mscBatchPurchase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"mscPurchase"`
 *
 *
 */
export const useWriteMscMarketV1MscPurchase =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'mscPurchase',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"mscWithdraw"`
 *
 *
 */
export const useWriteMscMarketV1MscWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'mscWithdraw',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useWriteMscMarketV1RenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"setAdminAddress"`
 *
 *
 */
export const useWriteMscMarketV1SetAdminAddress =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'setAdminAddress',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"setAllFeatuteStatus"`
 *
 *
 */
export const useWriteMscMarketV1SetAllFeatuteStatus =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'setAllFeatuteStatus',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"setFeatureStatus"`
 *
 *
 */
export const useWriteMscMarketV1SetFeatureStatus =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'setFeatureStatus',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"setFeeBps"`
 *
 *
 */
export const useWriteMscMarketV1SetFeeBps =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'setFeeBps',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useWriteMscMarketV1TransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 *
 */
export const useWriteMscMarketV1UpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__
 *
 *
 */
export const useSimulateMscMarketV1 = /*#__PURE__*/ createUseSimulateContract({
  abi: mscMarketV1Abi,
  address: mscMarketV1Address,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"initialize"`
 *
 *
 */
export const useSimulateMscMarketV1Initialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"manualGetIncome"`
 *
 *
 */
export const useSimulateMscMarketV1ManualGetIncome =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'manualGetIncome',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"mscBatchPurchase"`
 *
 *
 */
export const useSimulateMscMarketV1MscBatchPurchase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'mscBatchPurchase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"mscPurchase"`
 *
 *
 */
export const useSimulateMscMarketV1MscPurchase =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'mscPurchase',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"mscWithdraw"`
 *
 *
 */
export const useSimulateMscMarketV1MscWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'mscWithdraw',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useSimulateMscMarketV1RenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"setAdminAddress"`
 *
 *
 */
export const useSimulateMscMarketV1SetAdminAddress =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'setAdminAddress',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"setAllFeatuteStatus"`
 *
 *
 */
export const useSimulateMscMarketV1SetAllFeatuteStatus =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'setAllFeatuteStatus',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"setFeatureStatus"`
 *
 *
 */
export const useSimulateMscMarketV1SetFeatureStatus =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'setFeatureStatus',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"setFeeBps"`
 *
 *
 */
export const useSimulateMscMarketV1SetFeeBps =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'setFeeBps',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useSimulateMscMarketV1TransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link mscMarketV1Abi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 *
 */
export const useSimulateMscMarketV1UpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    functionName: 'upgradeToAndCall',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mscMarketV1Abi}__
 *
 *
 */
export const useWatchMscMarketV1Event =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mscMarketV1Abi}__ and `eventName` set to `"EIP712DomainChanged"`
 *
 *
 */
export const useWatchMscMarketV1Eip712DomainChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mscMarketV1Abi}__ and `eventName` set to `"Initialized"`
 *
 *
 */
export const useWatchMscMarketV1InitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mscMarketV1Abi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 *
 */
export const useWatchMscMarketV1OwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mscMarketV1Abi}__ and `eventName` set to `"Upgraded"`
 *
 *
 */
export const useWatchMscMarketV1UpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    eventName: 'Upgraded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link mscMarketV1Abi}__ and `eventName` set to `"mxcscriptions_protocol_TransferMSC20Token"`
 *
 *
 */
export const useWatchMscMarketV1MxcscriptionsProtocolTransferMsc20TokenEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: mscMarketV1Abi,
    address: mscMarketV1Address,
    eventName: 'mxcscriptions_protocol_TransferMSC20Token',
  })
