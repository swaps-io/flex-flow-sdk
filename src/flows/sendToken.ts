import {
  FlexHex,
  FlexSendTokenData,
  FlexToHexValue,
  flexCalcSendTokenHash,
  flexEncodeSendTokenData,
} from '@swaps-io/flex-sdk';

import { FlexFlowBase } from '../base';

export interface FlexEncodeSendTokenFlowParams {
  sender: FlexToHexValue;
  receiver: FlexToHexValue;
  token: FlexToHexValue;
  amount: FlexToHexValue;
  start: FlexToHexValue;
  duration: FlexToHexValue;
  group: FlexToHexValue;

  sendTokenDomain: FlexToHexValue;
}

export interface FlexSendTokenFlow extends FlexFlowBase {
  sendTokenData: FlexSendTokenData;
  sendTokenHash: FlexHex;
}

/**
 * Encodes send token flow:
 * - send token
 *
 * @param params Flow encode {@link FlexEncodeSendTokenFlowParams | params}
 *
 * @returns Encoded {@link FlexSendTokenFlow | flow}
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
