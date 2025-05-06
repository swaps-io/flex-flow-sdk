import {
  FlexHex,
  FlexSendTokenData,
  FlexToHexValue,
  flexCalcSendTokenHash,
  flexEncodeSendTokenData,
} from '@swaps-io/flex-sdk';

import { FlexFlowBase } from '../base';

/**
 * Parameters for {@link flexEncodeSendTokenFlow} function.
 *
 * @category Send • Token
 */
export interface FlexEncodeSendTokenFlowParams {
  /**
   * Address of token sender _(20 bytes)_.
   */
  sender: FlexToHexValue;

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
   * Deadline of send token operation, i.e. time after which attempt to perform send operation will fail _(6 bytes)_.
   */
  deadline: FlexToHexValue;

  /**
   * Nonce of send token operation selected by {@link sender} _(6 bytes)_.
   */
  nonce: FlexToHexValue;

  /**
   * Send token domain to calculate component hash for _(8 bytes)_.
   */
  sendTokenDomain: FlexToHexValue;
}

/**
 * Send token flow representation.
 *
 * @category Send • Token
 */
export interface FlexSendTokenFlow extends FlexFlowBase {
  /**
   * Send token component data.
   */
  sendTokenData: FlexSendTokenData;

  /**
   * Send token component hash _(32 bytes)_.
   */
  sendTokenHash: FlexHex;
}

/**
 * Encodes a flow where _sender_ transfers exact amount of ERC-20 token asset to _receiver_. The call is expected to be
 * preformed by _sender_.
 *
 * This flow assumes the intention to send asset according to params comes from additional factors (i.e. modifying
 * params would lead to _sender_ penalty).
 *
 * @param params Function {@link FlexEncodeSendTokenFlowParams | parameters}.
 *
 * @returns Encoded {@link FlexSendTokenFlow | flow}.
 *
 * @category Send • Token
 */
export function flexEncodeSendTokenFlow(params: FlexEncodeSendTokenFlowParams): FlexSendTokenFlow {
  const sendTokenData = flexEncodeSendTokenData({
    sender: params.sender,
    receiver: params.receiver,
    token: params.token,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
  });
  const sendTokenHash = flexCalcSendTokenHash({
    data: sendTokenData,
    domain: params.sendTokenDomain,
  });

  const flow: FlexSendTokenFlow = {
    sendTokenData,
    sendTokenHash,
    componentHashes: [sendTokenHash],
  };
  return flow;
}
