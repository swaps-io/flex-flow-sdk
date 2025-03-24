import {
  FLEX_SEND_EVENT_SIGNATURE,
  FLEX_SEND_FAIL_EVENT_SIGNATURE,
  FlexConfirmTokenData,
  FlexConfirmTokenProofData,
  FlexHex,
  FlexReceiveTokenData,
  FlexRefundTokenData,
  FlexRefundTokenProofData,
  FlexToHexValue,
  flexCalcConfirmTokenHash,
  flexCalcConfirmTokenProofHash,
  flexCalcReceiveTokenFromHash,
  flexCalcRefundTokenHash,
  flexCalcRefundTokenProofHash,
  flexEncodeConfirmTokenData,
  flexEncodeConfirmTokenProofData,
  flexEncodeReceiveTokenFromData,
  flexEncodeRefundTokenData,
  flexEncodeRefundTokenProofData,
} from '@swaps-io/flex-sdk';

import { FlexFlowBase } from '../base';

/**
 * TODO
 *
 * @category Receive • Token From
 */
export interface FlexEncodeReceiveTokenFromFlowParams {
  sender: FlexToHexValue;
  senderContract: boolean;
  senderNoMessageWrap?: boolean;
  senderNoRetryAsContract?: boolean;

  receiver: FlexToHexValue;

  token: FlexToHexValue;
  amount: FlexToHexValue;
  deadline: FlexToHexValue;
  nonce: FlexToHexValue;

  confirmReceiver?: FlexToHexValue;
  refundReceiver?: FlexToHexValue;

  confirmKeyHash: FlexToHexValue;
  refundKeyHash: FlexToHexValue;

  proofEventChain: FlexToHexValue;
  confirmProofEventSignature?: FlexToHexValue;
  refundProofEventSignature?: FlexToHexValue;

  receiveTokenDomain: FlexToHexValue;
  settleTokenDomain: FlexToHexValue;
  settleTokenProofDomain: FlexToHexValue;
}

/**
 * TODO
 *
 * @category Receive • Token From
 */
export interface FlexReceiveTokenFromFlow extends FlexFlowBase {
  receiveTokenData: FlexReceiveTokenData;
  receiveTokenHash: FlexHex;

  confirmTokenData: FlexConfirmTokenData;
  confirmTokenHash: FlexHex;

  refundTokenData: FlexRefundTokenData;
  refundTokenHash: FlexHex;

  confirmTokenProofData: FlexConfirmTokenProofData;
  confirmTokenProofHash: FlexHex;

  refundTokenProofData: FlexRefundTokenProofData;
  refundTokenProofHash: FlexHex;
}

/**
 * TODO
 *
 * Encodes receive token from flow:
 * - receive token from
 * - key based confirm/refund
 * - proof based confirm/refund (as fallback)
 *
 * @param params Flow encode {@link FlexEncodeReceiveTokenFromFlowParams | params}
 *
 * @returns Encoded {@link FlexReceiveTokenFromFlow | flow}
 *
 * @category Receive • Token From
 */
export function flexEncodeReceiveTokenFromFlow(params: FlexEncodeReceiveTokenFromFlowParams): FlexReceiveTokenFromFlow {
  const receiveTokenData = flexEncodeReceiveTokenFromData({
    sender: params.sender,
    senderContract: params.senderContract,
    senderNoMessageWrap: params.senderNoMessageWrap,
    senderNoRetryAsContract: params.senderNoRetryAsContract,
    receiver: params.receiver,
    token: params.token,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
  });
  const receiveTokenHash = flexCalcReceiveTokenFromHash({
    data: receiveTokenData,
    domain: params.receiveTokenDomain,
  });

  const confirmTokenData = flexEncodeConfirmTokenData({
    receiver: params.receiver,
    receiverContract: params.senderContract,
    receiverNoMessageWrap: params.senderNoMessageWrap,
    receiverNoRetryAsContract: params.senderNoRetryAsContract,
    token: params.token,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
    keyHash: params.confirmKeyHash,
    confirmReceiver: params.confirmReceiver ?? params.receiver,
  });
  const confirmTokenHash = flexCalcConfirmTokenHash({
    data: confirmTokenData,
    domain: params.settleTokenDomain,
  });

  const refundTokenData = flexEncodeRefundTokenData({
    receiver: params.receiver,
    receiverContract: params.senderContract,
    receiverNoMessageWrap: params.senderNoMessageWrap,
    receiverNoRetryAsContract: params.senderNoRetryAsContract,
    token: params.token,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
    keyHash: params.refundKeyHash,
    refundReceiver: params.refundReceiver ?? params.sender,
  });
  const refundTokenHash = flexCalcRefundTokenHash({
    data: refundTokenData,
    domain: params.settleTokenDomain,
  });

  const confirmTokenProofData = flexEncodeConfirmTokenProofData({
    receiver: params.receiver,
    receiverContract: params.senderContract,
    receiverNoMessageWrap: params.senderNoMessageWrap,
    receiverNoRetryAsContract: params.senderNoRetryAsContract,
    token: params.token,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
    eventChain: params.proofEventChain,
    eventSignature: params.confirmProofEventSignature ?? FLEX_SEND_EVENT_SIGNATURE,
    confirmReceiver: params.confirmReceiver ?? params.receiver,
  });
  const confirmTokenProofHash = flexCalcConfirmTokenProofHash({
    data: confirmTokenProofData,
    domain: params.settleTokenProofDomain,
  });

  const refundTokenProofData = flexEncodeRefundTokenProofData({
    receiver: params.receiver,
    receiverContract: params.senderContract,
    receiverNoMessageWrap: params.senderNoMessageWrap,
    receiverNoRetryAsContract: params.senderNoRetryAsContract,
    token: params.token,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
    eventChain: params.proofEventChain,
    eventSignature: params.refundProofEventSignature ?? FLEX_SEND_FAIL_EVENT_SIGNATURE,
    refundReceiver: params.refundReceiver ?? params.sender,
  });
  const refundTokenProofHash = flexCalcRefundTokenProofHash({
    data: refundTokenProofData,
    domain: params.settleTokenProofDomain,
  });

  const flow: FlexReceiveTokenFromFlow = {
    receiveTokenData,
    receiveTokenHash,
    confirmTokenData,
    confirmTokenHash,
    refundTokenData,
    refundTokenHash,
    confirmTokenProofData,
    confirmTokenProofHash,
    refundTokenProofData,
    refundTokenProofHash,
    componentHashes: [receiveTokenHash, confirmTokenHash, refundTokenHash, confirmTokenProofHash, refundTokenProofHash],
  };
  return flow;
}
