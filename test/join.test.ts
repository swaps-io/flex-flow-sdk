import { Hex, flexInit } from '@swaps-io/flex-sdk';

import { flexJoinFlows } from '../src';

const HASHES: Hex[] = [
  '0x0123456701234567012345670123456701234567012345670123456701234567',
  '0x4444333322221111444433332222111144443333222211114444333322221111',
  '0x8888888888888888888888888888888888888888888888888888888888888888',
  '0x0707070707070707070707070707070707070707070707070707070707070707',
];

beforeAll(async () => {
  await flexInit; // TODO: ESM repro?
});

test('Should join empty', () => {
  const join = flexJoinFlows([]);

  const expectedJoin = {
    componentHashes: [],
  };
  expect(join).toEqual(expectedJoin);
});

test('Should join 1 empty flow', () => {
  const flow = {
    componentHashes: [],
  };
  const join = flexJoinFlows([flow]);

  const expectedJoin = {
    componentHashes: [],
  };
  expect(join).toEqual(expectedJoin);
});

test('Should join 1 flow', () => {
  const flow = {
    componentHashes: [HASHES[0]],
    someData: { a: 1, b: 2 },
  };
  const join = flexJoinFlows([flow]);

  const expectedJoin = {
    componentHashes: [HASHES[0]],
    someData: { a: 1, b: 2 },
  };
  expect(join).toEqual(expectedJoin);
});

test('Should join 2 flows', () => {
  const flow0 = {
    componentHashes: [HASHES[0]],
    someData0: { a: 1, b: 2 },
    someData01: { a: 1, b: 3 },
  };
  const flow1 = {
    componentHashes: [HASHES[1], HASHES[2]],
    someData1: { a: 3 },
  };
  const join = flexJoinFlows([flow0, flow1]);

  const expectedJoin = {
    componentHashes: [HASHES[0], HASHES[1], HASHES[2]],
    someData0: { a: 1, b: 2 },
    someData01: { a: 1, b: 3 },
    someData1: { a: 3 },
  };
  expect(join).toEqual(expectedJoin);
});

test('Should join 3 flows', () => {
  const flow0 = {
    componentHashes: [HASHES[0]],
    someData0: { a: 1, b: 2 },
    someData01: { a: 1, b: 3 },
  };
  const flow1 = {
    componentHashes: [HASHES[1], HASHES[2]],
    someData1: { a: 3 },
  };
  const flow2 = {
    componentHashes: [HASHES[3]],
    someData2: { c: 4 },
  };
  const join = flexJoinFlows([flow0, flow1, flow2]);

  const expectedJoin = {
    componentHashes: [HASHES[0], HASHES[1], HASHES[2], HASHES[3]],
    someData0: { a: 1, b: 2 },
    someData01: { a: 1, b: 3 },
    someData1: { a: 3 },
    someData2: { c: 4 },
  };
  expect(join).toEqual(expectedJoin);
});

test('Should not join flows with hash duplicate', () => {
  const flow0 = {
    componentHashes: [HASHES[0]],
  };
  const flow1 = {
    componentHashes: [HASHES[0]],
  };

  expect(() => {
    flexJoinFlows([flow0, flow1]);
  }).toThrow(Error);
});

test('Should not join flows with data key duplicate', () => {
  const flow0 = {
    componentHashes: [],
    someData: {},
  };
  const flow1 = {
    componentHashes: [],
    someData: {},
  };

  expect(() => {
    flexJoinFlows([flow0, flow1]);
  }).toThrow(Error);
});
