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
   * Start of send token operation _(6 bytes)_.
   *
   * Send operation cannot be performed earlier than this time. Also serves for controlling send operations
   * _chronological_ order.
   */
  start: FlexToHexValue;

  /**
   * Duration of send token operation _(6 bytes)_.
   *
   * Forms _deadline_ when added to {@link start}. Attempt to perform send operation after the deadline will fail.
   */
  duration: FlexToHexValue;

  /**
   * Send token group index selected by the {@link sender} _(6 bytes)_.
   */
  group: FlexToHexValue;

  /**
   * Send token domain to calculate component hash for _(8 bytes)_.
   */
  sendTokenDomain: FlexToHexValue;
}

/**
 * Send token component flow representation.
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
 * Encodes a flow where _sender_ transfers exact amount of ERC-20 token asset to _receiver_.
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
    start: params.start,
    duration: params.duration,
    group: params.group,
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
