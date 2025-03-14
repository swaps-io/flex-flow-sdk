import { Hex } from '@swaps-io/flex-sdk';

import { FlexFlowBase } from './base';

export function flexJoinFlows(flows: []): FlexFlowBase;
export function flexJoinFlows<F0 extends FlexFlowBase>(flows: [F0]): F0;
export function flexJoinFlows<F0 extends FlexFlowBase, F1 extends FlexFlowBase>(flows: [F0, F1]): F0 & F1;
export function flexJoinFlows<F0 extends FlexFlowBase, F1 extends FlexFlowBase, F2 extends FlexFlowBase>(
  flows: [F0, F1, F2],
): F0 & F1 & F2;
export function flexJoinFlows<
  F0 extends FlexFlowBase,
  F1 extends FlexFlowBase,
  F2 extends FlexFlowBase,
  F3 extends FlexFlowBase,
>(flows: [F0, F1, F2, F3]): F0 & F1 & F2 & F3;
export function flexJoinFlows<
  F0 extends FlexFlowBase,
  F1 extends FlexFlowBase,
  F2 extends FlexFlowBase,
  F3 extends FlexFlowBase,
  F4 extends FlexFlowBase,
>(flows: [F0, F1, F2, F3, F4]): F0 & F1 & F2 & F3 & F4;
export function flexJoinFlows<
  F0 extends FlexFlowBase,
  F1 extends FlexFlowBase,
  F2 extends FlexFlowBase,
  F3 extends FlexFlowBase,
  F4 extends FlexFlowBase,
  F5 extends FlexFlowBase,
>(flows: [F0, F1, F2, F3, F4, F5]): F0 & F1 & F2 & F3 & F4 & F5;
export function flexJoinFlows<
  F0 extends FlexFlowBase,
  F1 extends FlexFlowBase,
  F2 extends FlexFlowBase,
  F3 extends FlexFlowBase,
  F4 extends FlexFlowBase,
  F5 extends FlexFlowBase,
  F6 extends FlexFlowBase,
>(flows: [F0, F1, F2, F3, F4, F5, F6]): F0 & F1 & F2 & F3 & F4 & F5 & F6;
export function flexJoinFlows<
  F0 extends FlexFlowBase,
  F1 extends FlexFlowBase,
  F2 extends FlexFlowBase,
  F3 extends FlexFlowBase,
  F4 extends FlexFlowBase,
  F5 extends FlexFlowBase,
  F6 extends FlexFlowBase,
  F7 extends FlexFlowBase,
>(flows: [F0, F1, F2, F3, F4, F5, F6, F7]): F0 & F1 & F2 & F3 & F4 & F5 & F6 & F7;

export function flexJoinFlows(flows: FlexFlowBase[]): FlexFlowBase {
  const joinHashes = new Set<Hex>();
  const joinData: Record<string, unknown> = {};

  for (const flow of flows) {
    const { componentHashes, ...componentData } = flow;

    for (const componentHash of componentHashes) {
      if (joinHashes.has(componentHash)) {
        throw new Error(`Component hash "${componentHash}" duplicate during flow join`);
      }
      joinHashes.add(componentHash);
    }

    for (const [dataKey, dataValue] of Object.entries(componentData)) {
      if (dataKey in joinData) {
        throw new Error(`Component data "${dataKey}" duplicate during flow join`);
      }
      joinData[dataKey] = dataValue;
    }
  }

  const join: FlexFlowBase = {
    componentHashes: [...joinHashes],
    ...joinData,
  };
  return join;
}
