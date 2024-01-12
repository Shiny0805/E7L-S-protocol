import { UmiPlugin } from '@metaplex-foundation/umi';
import { createE7lSProtocolProgram } from './generated';

export const e7lSProtocol = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createE7lSProtocolProgram(), false);
  },
});
