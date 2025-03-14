
## Examples

### EVM Token (Lock) to EVM Native

In this example, account `0x1010..1010` gives `123` of token `0xe0e0..e0e0` (`6` decimals) to account `0x2020..2020`
in the receive chain. In return that accounts gives `2.5` of native crypto (`18` decimals) back in the send chain.

Received token is stored in contract waiting for settlement - either confirm (requires key kept by `0x1010..1010`)
or refund (requires key kept by `0x2020..2020`). As a fallback to the key settlement (imagine one of the parties going
offline), similar proof settlement components are added to the order (TODO).

```ts
import {
  flexEncodeReceiveTokenData,
  flexEncodeSendNativeData,
  flexEncodeConfirmTokenData,
  flexEncodeRefundTokenData,
  flexCalcReceiveTokenHash,
  flexCalcSendNativeHash,
  flexCalcConfirmTokenHash,
  flexCalcRefundTokenHash,
  flexCalcTree,
  flexCalcTreeHash,
  flexCalcBranch,
} from '@swaps-io/flex-sdk';

// Flex contract instances on target chains
const flexOnReceiveChain: FlexStandalone = ...;
const flexOnSendChain: FlexStandalone = ...;

// Time in seconds
const now = BigInt(new Date().getTime()) / 1000n;
const timeToReceive = 2n * 60n;
const timeToSend = 10n * 60n;

// Encode receive token component
const receiveTokenData = flexEncodeReceiveTokenData({
  sender: '0x1010101010101010101010101010101010101010',
  receiver: '0x2020202020202020202020202020202020202020',
  receiverContract: true,
  token: '0xe0e0e0e0e0e0e0ee0e0e0e0e0e0e0ee0e0e0e0e0',
  amount: 123_000000n,
  deadline: now + timeToReceive,
  nonce: 123n,
});
const receiveTokenDomain = await flexOnReceiveChain.read.flexReceiveTokenDomain();
const receiveTokenHash = flexCalcReceiveTokenHash({
  domain: receiveTokenDomain,
  data: receiveTokenData,
});

// Encode send native component
const sendNativeData = flexEncodeSendNativeData({
  sender: '0x2020202020202020202020202020202020202020',
  receiver: '0x1010101010101010101010101010101010101010',
  amount: 2_500000000_000000000n,
  start: now,
  duration: timeToSend,
  group: 0n,
});
const sendNativeDomain = await flexOnSendChain.read.flexSendNativeTokenDomain();
const sendNativeHash = flexCalcSendNativeHash({
  domain: sendNativeDomain,
  data: sendNativeData,
});

// Encode key settle with confirm component
const confirmTokenData = flexEncodeConfirmTokenData({
  // Same as receive token params
  receiver: '0x2020202020202020202020202020202020202020',
  receiverContract: true,
  token: '0xe0e0e0e0e0e0e0ee0e0e0e0e0e0e0ee0e0e0e0e0',
  amount: 123_000000n,
  deadline: now + timeToReceive,
  nonce: 123n,

  // Original random confirm key is kept by 0x1010..1010
  keyHash: '0x9e5077555fd13cabbb8c0b93e6dbdc52bc018c208595cdba5808a886b93935b4',
  confirmReceiver: '0x2020202020202020202020202020202020202020',
});
const settleTokenDomain = await flexOnReceiveChain.read.flexSettleTokenDomain();
const confirmTokenHash = flexCalcConfirmTokenHash({
  domain: settleTokenDomain,
  data: confirmTokenData,
});

// Encode key settle with refund component
const refundTokenData = flexEncodeRefundTokenData({
  // Same as receive token params
  receiver: '0x2020202020202020202020202020202020202020',
  receiverContract: true,
  token: '0xe0e0e0e0e0e0e0ee0e0e0e0e0e0e0ee0e0e0e0e0',
  amount: 123_000000n,
  deadline: now + timeToReceive,
  nonce: 123n,

  // Original random refund key is kept by 0x2020..2020
  keyHash: '0x474bbf551e597e41f8f7de7844d97405f67f4e89608019511b71730a1470353e',
  refundReceiver: '0x1010101010101010101010101010101010101010',
});
const refundTokenHash = flexCalcRefundTokenHash({
  domain: settleTokenDomain,
  data: refundTokenData,
});

// Build order tree & calc hash
const componentHashes = [receiveTokenHash, sendNativeHash, confirmTokenHash, refundTokenHash];
const orderTree = flexCalcTree({ leaves: componentHashes });
const orderHash = flexCalcTreeHash({ tree: orderTree });

// Order branches to use during facet interaction
const receiveTokenBranch = flexCalcBranch({ tree: orderTree, leaf: receiveTokenHash });
const sendNativeBranch = flexCalcBranch({ tree: orderTree, leaf: sendNativeHash });
const confirmTokenBranch = flexCalcBranch({ tree: orderTree, leaf: confirmTokenHash });
const refundTokenBranch = flexCalcBranch({ tree: orderTree, leaf: refundTokenHash });
```
