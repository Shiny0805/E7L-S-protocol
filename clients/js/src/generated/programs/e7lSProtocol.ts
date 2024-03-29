/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  ClusterFilter,
  Context,
  Program,
  PublicKey,
} from '@metaplex-foundation/umi';
import {
  getE7lSProtocolErrorFromCode,
  getE7lSProtocolErrorFromName,
} from '../errors';

export const E7L_S_PROTOCOL_PROGRAM_ID =
  'MyProgram1111111111111111111111111111111111' as PublicKey<'MyProgram1111111111111111111111111111111111'>;

export function createE7lSProtocolProgram(): Program {
  return {
    name: 'e7lSProtocol',
    publicKey: E7L_S_PROTOCOL_PROGRAM_ID,
    getErrorFromCode(code: number, cause?: Error) {
      return getE7lSProtocolErrorFromCode(code, this, cause);
    },
    getErrorFromName(name: string, cause?: Error) {
      return getE7lSProtocolErrorFromName(name, this, cause);
    },
    isOnCluster() {
      return true;
    },
  };
}

export function getE7lSProtocolProgram<T extends Program = Program>(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): T {
  return context.programs.get<T>('e7lSProtocol', clusterFilter);
}

export function getE7lSProtocolProgramId(
  context: Pick<Context, 'programs'>,
  clusterFilter?: ClusterFilter
): PublicKey {
  return context.programs.getPublicKey(
    'e7lSProtocol',
    E7L_S_PROTOCOL_PROGRAM_ID,
    clusterFilter
  );
}
