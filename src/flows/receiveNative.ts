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
 * Parameters for {@link flexEncodeReceiveNativeFlow} function.
 *
 * @category Receive • Native
 */
export interface FlexEncodeReceiveNativeFlowParams {
  /**
   * Address of native sender _(20 bytes)_.
   */
  sender: FlexToHexValue;

  /**
   * Address of native receiver _(20 bytes)_.
   */
  receiver: FlexToHexValue;

  /**
   * Should verify receiver signature as _contract_ one rather than EOA.
   */
  receiverContract: boolean;

  /**
   * Should not wrap receiver signed message into EIP-191, i.e. signature is of _raw_ data hash.
   *
   * @default false
   */
  receiverNoMessageWrap?: boolean;

  /**
   * Should not fallback to receiver signature verification as _contract_ after failed EOA check. In other words,
   * asserts the signature is known to be EOA and should not be attempted as contract one.
   *
   * @default false
   */
  receiverNoRetryAsContract?: boolean;

  /**
   * Amount of native asset to send _(32 bytes)_.
   */
  amount: FlexToHexValue;

  /**
   * Deadline of receive native operation, i.e. time after which attempt to call receive operation will fail
   * _(6 bytes)_.
   */
  deadline: FlexToHexValue;

  /**
   * Nonce of receive native operation selected by {@link receiver} _(6 bytes)_.
   */
  nonce: FlexToHexValue;

  /**
   * Address of asset receiver as result of confirm _(20 bytes)_.
   *
   * @default receiver
   */
  confirmReceiver?: FlexToHexValue;

  /**
   * Address of asset receiver as result of refund _(20 bytes)_.
   *
   * @default sender
   */
  refundReceiver?: FlexToHexValue;

  /**
   * Hash of key that _authorizes_ confirm operation _(32 bytes)_.
   */
  confirmKeyHash: FlexToHexValue;

  /**
   * Hash of key that _authorizes_ refund operation _(32 bytes)_.
   */
  refundKeyHash: FlexToHexValue;

  /**
   * Chain ID of proof event that authorizes confirm & refund operations _(4 bytes)_.
   */
  proofEventChain: FlexToHexValue;

  /**
   * Signature (i.e. topic #0) of event that authorizes confirm operation _(32 bytes)_.
   *
   * @default FlexSend signature
   */
  confirmProofEventSignature?: FlexToHexValue;

  /**
   * Signature (i.e. topic #0) of event that authorizes refund operation _(32 bytes)_.
   *
   * @default FlexSendFail signature
   */
  refundProofEventSignature?: FlexToHexValue;

  /**
   * Receive native domain to calculate component hash for _(8 bytes)_.
   */
  receiveNativeDomain: FlexToHexValue;

  /**
   * Settle native domain to calculate component hash for _(8 bytes)_.
   */
  settleNativeDomain: FlexToHexValue;

  /**
   * Settle native proof domain to calculate component hash for _(8 bytes)_.
   */
  settleNativeProofDomain: FlexToHexValue;
}

/**
 * Receive native flow representation.
 *
 * @category Receive • Native
 */
export interface FlexReceiveNativeFlow extends FlexFlowBase {
  /**
   * Receive native component data.
   */
  receiveNativeData: FlexReceiveNativeData;

  /**
   * Receive native component hash.
   */
  receiveNativeHash: FlexHex;

  /**
   * Confirm native component data.
   */
  confirmNativeData: FlexConfirmNativeData;

  /**
   * Confirm native component hash.
   */
  confirmNativeHash: FlexHex;

  /**
   * Refund native component data.
   */
  refundNativeData: FlexRefundNativeData;

  /**
   * Refund native component hash.
   */
  refundNativeHash: FlexHex;

  /**
   * Confirm native proof component data.
   */
  confirmNativeProofData: FlexConfirmNativeProofData;

  /**
   * Confirm native proof component hash.
   */
  confirmNativeProofHash: FlexHex;

  /**
   * Refund native proof component data.
   */
  refundNativeProofData: FlexRefundNativeProofData;

  /**
   * Refund native proof component hash.
   */
  refundNativeProofHash: FlexHex;
}

/**
 * Encodes a flow where native asset is transferred from _sender_ to contract, and _receiver_ gets this asset after
 * confirmation of other operation (for example, asset sent in other network). Otherwise, _sender_ is refunded their
 * asset. The call is expected to be preformed by _sender_.
 *
 * This flow allows to confirm or refund by reveal of the corresponding key matching the agreed key hash. As a fallback,
 * this flow also allows confirmation by providing proof.
 *
 * @param params Function {@link FlexEncodeReceiveNativeFlowParams | parameters}.
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
