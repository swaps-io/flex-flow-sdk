import { FlexHex } from '@swaps-io/flex-sdk';

/**
 * Component flow representation base.
 *
 * @category Base
 */
export interface FlexFlowBase {
  /**
   * Hashes of flow components _(32 bytes each)_.
   */
  componentHashes: FlexHex[];
}
