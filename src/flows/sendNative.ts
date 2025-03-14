import {
  AsHexValue,
  FlexSendNativeData,
  Hex,
  flexCalcSendNativeHash,
  flexEncodeSendNativeData,
} from '@swaps-io/flex-sdk';

import { FlexFlowBase } from '../base';

export interface FlexEncodeSendNativeFlowParams {
  sender: AsHexValue;
  receiver: AsHexValue;
  native: AsHexValue;
  amount: AsHexValue;
  start: AsHexValue;
  duration: AsHexValue;
  group: AsHexValue;

  sendNativeDomain: AsHexValue;
}

export interface FlexSendNativeFlow extends FlexFlowBase {
  sendNativeData: FlexSendNativeData;
  sendNativeHash: Hex;
}

export function flexEncodeSendNativeFlow(params: FlexEncodeSendNativeFlowParams): FlexSendNativeFlow {
  const sendNativeData = flexEncodeSendNativeData({
    sender: params.sender,
    receiver: params.receiver,
    amount: params.amount,
    start: params.start,
    duration: params.duration,
    group: params.group,
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
