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

/**
 * Parameters for {@link flexEncodeReceiveTokenFlow} function.
 *
 * @category Receive • Token
 */
export interface FlexEncodeReceiveTokenFlowParams {
  /**
   * Address of token sender _(20 bytes)_.
   */
  sender: FlexToHexValue;

  /**
   * Address of token receiver _(20 bytes)_.
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
   * Address of ERC-20 token to perform receive of _(20 bytes)_.
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
 * Receive token flow representation.
 *
 * @category Receive • Token
 */
export interface FlexReceiveTokenFlow extends FlexFlowBase {
  /**
   * Receive token component data.
   */
  receiveTokenData: FlexReceiveTokenData;

  /**
   * Receive token component hash.
   */
  receiveTokenHash: FlexHex;

  /**
   * Confirm token component data.
   */
  confirmTokenData: FlexConfirmTokenData;

  /**
   * Confirm token component hash.
   */
  confirmTokenHash: FlexHex;

  /**
   * Refund token component data.
   */
  refundTokenData: FlexRefundTokenData;

  /**
   * Refund token component hash.
   */
  refundTokenHash: FlexHex;

  /**
   * Confirm token proof component data.
   */
  confirmTokenProofData: FlexConfirmTokenProofData;

  /**
   * Confirm token proof component hash.
   */
  confirmTokenProofHash: FlexHex;

  /**
   * Refund token proof component data.
   */
  refundTokenProofData: FlexRefundTokenProofData;

  /**
   * Refund token proof component hash.
   */
  refundTokenProofHash: FlexHex;
}

/**
 * Encodes a flow where ERC-20 token asset is transferred from _sender_ to contract, and _receiver_ gets this asset
 * after confirmation of other operation (for example, asset sent in other network). Otherwise, _sender_ is refunded
 * their asset. The call is expected to be preformed by _sender_.
 *
 * This flow allows to confirm or refund by reveal of the corresponding key matching the agreed key hash. As a fallback,
 * this flow also allows confirmation by providing proof.
 *
 * @param params Function {@link FlexEncodeReceiveTokenFlowParams | parameters}.
 *
 * @returns Encoded {@link FlexReceiveTokenFlow | flow}
 *
 * @category Receive • Token
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
