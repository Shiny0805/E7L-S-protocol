import { PublicKey, Umi } from '@metaplex-foundation/umi';
import {
  findMetadataPda,
  fetchMetadata,
} from '@metaplex-foundation/mpl-token-metadata';

export const getTokenStandard = async (mint: PublicKey, umi: Umi) => {
  const metadataPda = findMetadataPda(umi, { mint });

  const metadataAcc = await fetchMetadata(umi, metadataPda);

  return metadataAcc.tokenStandard;
};
