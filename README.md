# Flex Flow SDK

SDK for interaction with Flex protocol [contracts](https://github.com/swaps-io/flex-contracts) flows. See:

- [usage examples](#usage-examples) for a good starting point for working with the SDK
- [installation](#installation) for instructions on how to setup SDK in a project
- [modules](./modules.html) for all available SDK classes/types/etc

## Development

### Installation

The SDK installation process assumes that the project to integrate the SDK into is already initialized.

1. Install `@swaps-io/flex-flow-sdk` as a package dependency of the project:
   - `npm install @swaps-io/flex-flow-sdk`
   - or `yarn add @swaps-io/flex-flow-sdk`
   - or using other package manager of choice
2. Install `@swaps-io/flex-sdk` peer dependency. Note that this package needs `@noble/hashes`
   [peer dependency](https://github.com/swaps-io/flex-sdk/blob/main/README.md#installation) provided.

> [!NOTE]
>
> Both ESM and CJS module systems are supported by the SDK.

### Usage Examples

#### _Native (EVM) to token (EVM)_

```ts
import {
  flexEncodeReceiveNativeFlow,
  flexEncodeSendTokenFlow,
  flexJoinFlows,
} from '@swaps-io/flex-flow-sdk';

import {
  flexCalcTree,
  flexCalcTreeHash,
  flexCalcBranch,
} from '@swaps-io/flex-sdk';

// From Flex contracts deploy info
const FLEX_DOMAINS = {
  999: {
    receiveNative: '0xd0d0d01010101010',
    settleNative: '0xd0d0d02020202020',
    settleProofNative: '0xd0d0d03030303030',
  },
  133337: {
    sendToken: '0xd0d0d04040404040',
  },
} as const;

// Actor who gives native to get the token
const nativeActor = '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';

// Actor who gives token to get the native
const tokenActor = '0xc001c0dec001c0dec001c0dec001c0dec001c0de';
const tokenActorContract = true;
const tokenActorNonce = 666_777_888;
const tokenActorGroup = 451;

const nativeChainId = 999;
const tokenChainId = 133337;

const nativeAmount = 1_500000000_000000000n; // 1.5 (18 decimals)
const token = '0x701e85701e85701e85701e85701e85701e85701e';
const tokenAmount = 92_100000n; // 92.1 (6 decimals)

// Time in seconds
const startTime = BigInt(new Date().getTime()) / 1000n;
const receiveDuration = 3n * 60n;
const sendDuration = 15n * 60n;

// Native actor holds original confirm key value, token actor - the refund one
const nativeActorConfirmKeyHash = '0x0123456701234567012345670123456701234567012345670123456701234567';
const tokenActorRefundKeyHash = '0x9876543210987654321098765432109876543210987654321098765432109876';

const receiveNativeDomain = FLEX_DOMAINS[nativeChainId].receiveNative;
const settleNativeDomain = FLEX_DOMAINS[nativeChainId].settleNative;
const settleNativeProofDomain = FLEX_DOMAINS[nativeChainId].settleProofNative;
const sendTokenDomain = FLEX_DOMAINS[tokenChainId].sendToken;

const flow = flexJoinFlows([
  flexEncodeReceiveNativeFlow({
    sender: nativeActor,
    receiver: tokenActor,
    receiverContract: tokenActorContract,
    amount: nativeAmount,
    deadline: startTime + receiveDuration,
    nonce: tokenActorNonce,
    confirmKeyHash: nativeActorConfirmKeyHash,
    refundKeyHash: tokenActorRefundKeyHash,
    proofEventChain: tokenChainId,
    receiveNativeDomain,
    settleNativeDomain,
    settleNativeProofDomain,
  }),
  flexEncodeSendTokenFlow({
    sender: tokenActor,
    receiver: nativeActor,
    token,
    amount: tokenAmount,
    start: startTime,
    duration: sendDuration,
    group: tokenActorGroup,
    sendTokenDomain,
  }),
]);

const orderTree = flexCalcTree({ leaves: flow.componentHashes });
const orderHash = flexCalcTreeHash({ tree: orderTree });
console.log(`Order ${orderHash} is ready to use`);

const receiveNativeBranch = flexCalcBranch({ tree: orderTree, leaf: flow.receiveNativeHash });
console.log('Receive native:');
console.log(`  - hash: ${flow.receiveNativeHash}`);
console.log(`  - branch: ${JSON.stringify(receiveNativeBranch)}`);
console.log(`  - data: ${JSON.stringify(flow.receiveNativeData)}`);
```
