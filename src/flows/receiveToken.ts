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
  flexCalcReceiveTokenHash,
  flexCalcRefundTokenHash,
  flexCalcRefundTokenProofHash,
  flexEncodeConfirmTokenData,
  flexEncodeConfirmTokenProofData,
  flexEncodeReceiveTokenData,
  flexEncodeRefundTokenData,
  flexEncodeRefundTokenProofData,
} from '@swaps-io/flex-sdk';

import { FlexFlowBase } from '../base';

export interface FlexEncodeReceiveTokenFlowParams {
  sender: FlexToHexValue;

  receiver: FlexToHexValue;
  receiverContract: boolean;
  receiverNoMessageWrap?: boolean;
  receiverNoRetryAsContract?: boolean;

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

export interface FlexReceiveTokenFlow extends FlexFlowBase {
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
 * Encodes receive token flow:
 * - receive token
 * - key based confirm/refund
 * - proof based confirm/refund (as fallback)
 *
 * @param params Flow encode {@link FlexEncodeReceiveTokenFlowParams | params}
 *
 * @returns Encoded {@link FlexReceiveTokenFlow | flow}
 */
export function flexEncodeReceiveTokenFlow(params: FlexEncodeReceiveTokenFlowParams): FlexReceiveTokenFlow {
  const receiveTokenData = flexEncodeReceiveTokenData({
    sender: params.sender,
    receiver: params.receiver,
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
    token: params.token,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
  });
  const receiveTokenHash = flexCalcReceiveTokenHash({
    data: receiveTokenData,
    domain: params.receiveTokenDomain,
  });

  const confirmTokenData = flexEncodeConfirmTokenData({
    receiver: params.receiver,
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
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
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
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
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
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
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
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

  const flow: FlexReceiveTokenFlow = {
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
