import {
  FlexHex,
  FlexSendNativeData,
  FlexToHexValue,
  flexCalcSendNativeHash,
  flexEncodeSendNativeData,
} from '@swaps-io/flex-sdk';

import { FlexFlowBase } from '../base';

/**
 * Parameters for {@link flexEncodeSendNativeFlow} function.
 *
 * @category Send • Native
 */
export interface FlexEncodeSendNativeFlowParams {
  /**
   * Address of native sender _(20 bytes)_.
   */
  sender: FlexToHexValue;

  /**
   * Address of native receiver _(20 bytes)_.
   */
  receiver: FlexToHexValue;

  /**
   * Amount of native asset to send _(32 bytes)_.
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
   * Send native domain to calculate component hash for _(8 bytes)_.
   */
  sendNativeDomain: FlexToHexValue;
}

/**
 * Send native flow representation.
 *
 * @category Send • Native
 */
export interface FlexSendNativeFlow extends FlexFlowBase {
  /**
   * Send native component data.
   */
  sendNativeData: FlexSendNativeData;

  /**
   * Send native component hash _(32 bytes)_.
   */
  sendNativeHash: FlexHex;
}

/**
 * Encodes a flow where _sender_ transfers exact amount of native asset to _receiver_. The call is expected to be
 * preformed by _sender_.
 *
 * This flow assumes the intention to send asset according to params comes from additional factors (i.e. modifying
 * params would lead to _sender_ penalty).
 *
 * @param params Function {@link FlexEncodeSendNativeFlowParams | parameters}.
 *
 * @returns Encoded {@link FlexSendNativeFlow | flow}.
 *
 * @category Send • Native
 */
export function flexEncodeSendNativeFlow(params: FlexEncodeSendNativeFlowParams): FlexSendNativeFlow {
  const sendNativeData = flexEncodeSendNativeData({
    sender: params.sender,
    receiver: params.receiver,
    amount: params.amount,
    deadline: params.deadline,
    nonce: params.nonce,
  });
  const sendNativeHash = flexCalcSendNativeHash({
    data: sendNativeData,
    domain: params.sendNativeDomain,
  });

  const flow: FlexSendNativeFlow = {
    sendNativeData,
    sendNativeHash,
    componentHashes: [sendNativeHash],
  };
  return flow;
}
