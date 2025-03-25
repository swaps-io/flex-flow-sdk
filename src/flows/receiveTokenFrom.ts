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
 * Parameters for {@link flexEncodeReceiveTokenFromFlow} function.
 *
 * @category Receive • Token From
 */
export interface FlexEncodeReceiveTokenFromFlowParams {
  /**
   * Address of token sender _(20 bytes)_.
   */
  sender: FlexToHexValue;

  /**
   * Should verify receiver signature as _contract_ one rather than EOA.
   */
  senderContract: boolean;

  /**
   * Should not wrap receiver signed message into EIP-191, i.e. signature is of _raw_ data hash.
   *
   * @default false
   */
  senderNoMessageWrap?: boolean;

  /**
   * Should not fallback to receiver signature verification as _contract_ after failed EOA check. In other words,
   * asserts the signature is known to be EOA and should not be attempted as contract one.
   *
   * @default false
   */
  senderNoRetryAsContract?: boolean;

  /**
   * Address of token receiver _(20 bytes)_.
   */
  receiver: FlexToHexValue;

  /**
   * Address of ERC-20 token to perform send of _(20 bytes)_.
   */
  token: FlexToHexValue;

  /**
   * Amount of token asset to send _(32 bytes)_.
   */
  amount: FlexToHexValue;

  /**
   * Deadline of receive token operation, i.e. time after which attempt to call receive operation will fail
   * _(6 bytes)_.
   */
  deadline: FlexToHexValue;

  /**
   * Nonce of receive token operation selected by {@link receiver} _(6 bytes)_.
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
   * Receive token domain to calculate component hash for _(8 bytes)_.
   */
  receiveTokenDomain: FlexToHexValue;

  /**
   * Settle token domain to calculate component hash for _(8 bytes)_.
   */
  settleTokenDomain: FlexToHexValue;

  /**
   * Settle token proof domain to calculate component hash for _(8 bytes)_.
   */
  settleTokenProofDomain: FlexToHexValue;
}

/**
 * Receive token from flow representation.
 *
 * @category Receive • Token From
 */
export interface FlexReceiveTokenFromFlow extends FlexFlowBase {
  /**
   * Receive token from component data.
   */
  receiveTokenData: FlexReceiveTokenData;

  /**
   * Receive token from component hash.
   */
  receiveTokenHash: FlexHex;

  /**
   * Confirm token from component data.
   */
  confirmTokenData: FlexConfirmTokenData;

  /**
   * Confirm token from component hash.
   */
  confirmTokenHash: FlexHex;

  /**
   * Refund token from component data.
   */
  refundTokenData: FlexRefundTokenData;

  /**
   * Refund token from component hash.
   */
  refundTokenHash: FlexHex;

  /**
   * Confirm token from proof component data.
   */
  confirmTokenProofData: FlexConfirmTokenProofData;

  /**
   * Confirm token from proof component hash.
   */
  confirmTokenProofHash: FlexHex;

  /**
   * Refund token from proof component data.
   */
  refundTokenProofData: FlexRefundTokenProofData;

  /**
   * Refund token from proof component hash.
   */
  refundTokenProofHash: FlexHex;
}

/**
 * Encodes a flow where ERC-20 token asset is transferred from _sender_ to contract, and _receiver_ gets this asset
 * after confirmation of other operation (for example, asset sent in other network). Otherwise, _sender_ is refunded
 * their asset. The call is expected to be preformed by _receiver_.
 *
 * This flow allows to confirm or refund by reveal of the corresponding key matching the agreed key hash. As a fallback,
 * this flow also allows confirmation by providing proof.
 *
 * @param params Function {@link FlexEncodeReceiveTokenFromFlowParams | parameters}.
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
