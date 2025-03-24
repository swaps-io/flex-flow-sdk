import {
  FLEX_SEND_EVENT_SIGNATURE,
  FLEX_SEND_FAIL_EVENT_SIGNATURE,
  FlexConfirmNativeData,
  FlexConfirmNativeProofData,
  FlexHex,
  FlexReceiveNativeData,
  FlexRefundNativeData,
  FlexRefundNativeProofData,
  FlexToHexValue,
  flexCalcConfirmNativeHash,
  flexCalcConfirmNativeProofHash,
  flexCalcReceiveNativeHash,
  flexCalcRefundNativeHash,
  flexCalcRefundNativeProofHash,
  flexEncodeConfirmNativeData,
  flexEncodeConfirmNativeProofData,
  flexEncodeReceiveNativeData,
  flexEncodeRefundNativeData,
  flexEncodeRefundNativeProofData,
} from '@swaps-io/flex-sdk';

import { FlexFlowBase } from '../base';

/**
 * TODO
 *
 * @category Receive • Native
 */
export interface FlexEncodeReceiveNativeFlowParams {
  sender: FlexToHexValue;

  receiver: FlexToHexValue;
  receiverContract: boolean;
  receiverNoMessageWrap?: boolean;
  receiverNoRetryAsContract?: boolean;

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

  receiveNativeDomain: FlexToHexValue;
  settleNativeDomain: FlexToHexValue;
  settleNativeProofDomain: FlexToHexValue;
}

/**
 * TODO
 *
 * @category Receive • Native
 */
export interface FlexReceiveNativeFlow extends FlexFlowBase {
  receiveNativeData: FlexReceiveNativeData;
  receiveNativeHash: FlexHex;

  confirmNativeData: FlexConfirmNativeData;
  confirmNativeHash: FlexHex;

  refundNativeData: FlexRefundNativeData;
  refundNativeHash: FlexHex;

  confirmNativeProofData: FlexConfirmNativeProofData;
  confirmNativeProofHash: FlexHex;

  refundNativeProofData: FlexRefundNativeProofData;
  refundNativeProofHash: FlexHex;
}

/**
 * TODO
 *
 * Encodes receive native flow:
 * - receive native
 * - key based confirm/refund
 * - proof based confirm/refund (as fallback)
 *
 * @param params Flow encode {@link FlexEncodeReceiveNativeFlowParams | params}
 *
 * @returns Encoded {@link FlexReceiveNativeFlow | flow}
 *
 * @category Receive • Native
 */
export function flexEncodeReceiveNativeFlow(params: FlexEncodeReceiveNativeFlowParams): FlexReceiveNativeFlow {
  const receiveNativeData = flexEncodeReceiveNativeData({
    sender: params.sender,
    receiver: params.receiver,
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
  });
  const receiveNativeHash = flexCalcReceiveNativeHash({
    data: receiveNativeData,
    domain: params.receiveNativeDomain,
  });

  const confirmNativeData = flexEncodeConfirmNativeData({
    receiver: params.receiver,
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
    keyHash: params.confirmKeyHash,
    confirmReceiver: params.confirmReceiver ?? params.receiver,
  });
  const confirmNativeHash = flexCalcConfirmNativeHash({
    data: confirmNativeData,
    domain: params.settleNativeDomain,
  });

  const refundNativeData = flexEncodeRefundNativeData({
    receiver: params.receiver,
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
    keyHash: params.refundKeyHash,
    refundReceiver: params.refundReceiver ?? params.sender,
  });
  const refundNativeHash = flexCalcRefundNativeHash({
    data: refundNativeData,
    domain: params.settleNativeDomain,
  });

  const confirmNativeProofData = flexEncodeConfirmNativeProofData({
    receiver: params.receiver,
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
    eventChain: params.proofEventChain,
    eventSignature: params.confirmProofEventSignature ?? FLEX_SEND_EVENT_SIGNATURE,
    confirmReceiver: params.confirmReceiver ?? params.receiver,
  });
  const confirmNativeProofHash = flexCalcConfirmNativeProofHash({
    data: confirmNativeProofData,
    domain: params.settleNativeProofDomain,
  });

  const refundNativeProofData = flexEncodeRefundNativeProofData({
    receiver: params.receiver,
    receiverContract: params.receiverContract,
    receiverNoMessageWrap: params.receiverNoMessageWrap,
    receiverNoRetryAsContract: params.receiverNoRetryAsContract,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
    eventChain: params.proofEventChain,
    eventSignature: params.refundProofEventSignature ?? FLEX_SEND_FAIL_EVENT_SIGNATURE,
    refundReceiver: params.refundReceiver ?? params.sender,
  });
  const refundNativeProofHash = flexCalcRefundNativeProofHash({
    data: refundNativeProofData,
    domain: params.settleNativeProofDomain,
  });

  const flow: FlexReceiveNativeFlow = {
    receiveNativeData,
    receiveNativeHash,
    confirmNativeData,
    confirmNativeHash,
    refundNativeData,
    refundNativeHash,
    confirmNativeProofData,
    confirmNativeProofHash,
    refundNativeProofData,
    refundNativeProofHash,
    componentHashes: [
      receiveNativeHash,
      confirmNativeHash,
      refundNativeHash,
      confirmNativeProofHash,
      refundNativeProofHash,
    ],
  };
  return flow;
}
