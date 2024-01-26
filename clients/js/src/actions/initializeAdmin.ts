import { TransactionBuilder, Umi } from '@metaplex-foundation/umi';
import { findGlobalPoolPda, initialize } from 'src/generated';

export const initializeAdmin = (
  umi: Umi,
  identifier: number
): TransactionBuilder => {
  const adminPda = findGlobalPoolPda(umi, {
    authorityWallet: umi.identity.publicKey,
    identifier,
  });

  const txBuilder = initialize(umi, {
    admin: umi.identity,
    globalPool: adminPda,
  });

  return txBuilder;
};
