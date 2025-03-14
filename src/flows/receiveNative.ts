import {
  AsHexValue,
  FLEX_SEND_EVENT_SIGNATURE,
  FLEX_SEND_FAIL_EVENT_SIGNATURE,
  FlexConfirmNativeData,
  FlexConfirmNativeProofData,
  FlexReceiveNativeData,
  FlexRefundNativeData,
  FlexRefundNativeProofData,
  Hex,
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

export interface FlexEncodeReceiveNativeFlowParams {
  sender: AsHexValue;

  receiver: AsHexValue;
  receiverContract: boolean;
  receiverNoMessageWrap?: boolean;
  receiverNoRetryAsContract?: boolean;

  amount: AsHexValue;
  deadline: AsHexValue;
  nonce: AsHexValue;

  confirmReceiver?: AsHexValue;
  refundReceiver?: AsHexValue;

  confirmKeyHash: AsHexValue;
  refundKeyHash: AsHexValue;

  proofEventChain: AsHexValue;
  confirmProofEventSignature?: AsHexValue;
  refundProofEventSignature?: AsHexValue;

  receiveNativeDomain: AsHexValue;
  settleNativeDomain: AsHexValue;
  settleNativeProofDomain: AsHexValue;
}

export interface FlexReceiveNativeFlow extends FlexFlowBase {
  receiveNativeData: FlexReceiveNativeData;
  receiveNativeHash: Hex;

  confirmNativeData: FlexConfirmNativeData;
  confirmNativeHash: Hex;

  refundNativeData: FlexRefundNativeData;
  refundNativeHash: Hex;

  confirmNativeProofData: FlexConfirmNativeProofData;
  confirmNativeProofHash: Hex;

  refundNativeProofData: FlexRefundNativeProofData;
  refundNativeProofHash: Hex;
}

/**
 * Receive native with lock (sends manually)
 *
 * Key hash based lock/unlock
 *
 * Proof based lock/unlock as fallback
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
