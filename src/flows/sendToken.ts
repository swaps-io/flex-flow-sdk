import { AsHexValue, FlexSendTokenData, Hex, flexCalcSendTokenHash, flexEncodeSendTokenData } from '@swaps-io/flex-sdk';

import { FlexFlowBase } from '../base';

export interface FlexEncodeSendTokenFlowParams {
  sender: AsHexValue;
  receiver: AsHexValue;
  token: AsHexValue;
  amount: AsHexValue;
  start: AsHexValue;
  duration: AsHexValue;
  group: AsHexValue;

  sendTokenDomain: AsHexValue;
}

export interface FlexSendTokenFlow extends FlexFlowBase {
  sendTokenData: FlexSendTokenData;
  sendTokenHash: Hex;
}

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
