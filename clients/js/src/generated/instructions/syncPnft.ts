/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import {
  Context,
  Pda,
  PublicKey,
  Signer,
  TransactionBuilder,
  publicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import {
  Serializer,
  array,
  mapSerializer,
  struct,
  u8,
} from '@metaplex-foundation/umi/serializers';
import {
  ResolvedAccount,
  ResolvedAccountsWithIndices,
  getAccountMetasAndSigners,
} from '../shared';

// Accounts.
export type SyncPnftInstructionAccounts = {
  owner: Signer;
  /** CHECK instruction will fail if wrong metadata is supplied */
  oldOwner: PublicKey | Pda;
  globalAuthority: PublicKey | Pda;
  nftAuthority: PublicKey | Pda;
  tokenAccount: PublicKey | Pda;
  destTokenAccount: PublicKey | Pda;
  mainMint: PublicKey | Pda;
  tokenMint: PublicKey | Pda;
  /** CHECK instruction will fail if wrong edition is supplied */
  tokenMintEdition: PublicKey | Pda;
  /** CHECK instruction will fail if wrong record is supplied */
  tokenMintRecord: PublicKey | Pda;
  /** CHECK instruction will fail if wrong record is supplied */
  destTokenMintRecord: PublicKey | Pda;
  /** CHECK instruction will fail if wrong metadata is supplied */
  mintMetadata: PublicKey | Pda;
  /** CHECK instruction will fail if wrong rules are supplied */
  authRules: PublicKey | Pda;
  /** CHECK instruction will fail if wrong sysvar ixns are supplied */
  sysvarInstructions?: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  associatedTokenProgram: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  /** CHECK intstruction will fail if wrong program is supplied */
  authRulesProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type SyncPnftInstructionData = { discriminator: Array<number> };

export type SyncPnftInstructionDataArgs = {};

export function getSyncPnftInstructionDataSerializer(): Serializer<
  SyncPnftInstructionDataArgs,
  SyncPnftInstructionData
> {
  return mapSerializer<
    SyncPnftInstructionDataArgs,
    any,
    SyncPnftInstructionData
  >(
    struct<SyncPnftInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'SyncPnftInstructionData' }
    ),
    (value) => ({ ...value, discriminator: [123, 63, 57, 2, 4, 146, 49, 37] })
  ) as Serializer<SyncPnftInstructionDataArgs, SyncPnftInstructionData>;
}

// Instruction.
export function syncPnft(
  context: Pick<Context, 'programs'>,
  input: SyncPnftInstructionAccounts
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'e7lSProtocol',
    'MyProgram1111111111111111111111111111111111'
  );

  // Accounts.
  const resolvedAccounts: ResolvedAccountsWithIndices = {
    owner: { index: 0, isWritable: true, value: input.owner ?? null },
    oldOwner: { index: 1, isWritable: false, value: input.oldOwner ?? null },
    globalAuthority: {
      index: 2,
      isWritable: true,
      value: input.globalAuthority ?? null,
    },
    nftAuthority: {
      index: 3,
      isWritable: true,
      value: input.nftAuthority ?? null,
    },
    tokenAccount: {
      index: 4,
      isWritable: true,
      value: input.tokenAccount ?? null,
    },
    destTokenAccount: {
      index: 5,
      isWritable: true,
      value: input.destTokenAccount ?? null,
    },
    mainMint: { index: 6, isWritable: false, value: input.mainMint ?? null },
    tokenMint: { index: 7, isWritable: false, value: input.tokenMint ?? null },
    tokenMintEdition: {
      index: 8,
      isWritable: false,
      value: input.tokenMintEdition ?? null,
    },
    tokenMintRecord: {
      index: 9,
      isWritable: true,
      value: input.tokenMintRecord ?? null,
    },
    destTokenMintRecord: {
      index: 10,
      isWritable: true,
      value: input.destTokenMintRecord ?? null,
    },
    mintMetadata: {
      index: 11,
      isWritable: true,
      value: input.mintMetadata ?? null,
    },
    authRules: { index: 12, isWritable: false, value: input.authRules ?? null },
    sysvarInstructions: {
      index: 13,
      isWritable: false,
      value: input.sysvarInstructions ?? null,
    },
    tokenProgram: {
      index: 14,
      isWritable: false,
      value: input.tokenProgram ?? null,
    },
    associatedTokenProgram: {
      index: 15,
      isWritable: false,
      value: input.associatedTokenProgram ?? null,
    },
    tokenMetadataProgram: {
      index: 16,
      isWritable: false,
      value: input.tokenMetadataProgram ?? null,
    },
    authRulesProgram: {
      index: 17,
      isWritable: false,
      value: input.authRulesProgram ?? null,
    },
    systemProgram: {
      index: 18,
      isWritable: false,
      value: input.systemProgram ?? null,
    },
  };

  // Default values.
  if (!resolvedAccounts.sysvarInstructions.value) {
    resolvedAccounts.sysvarInstructions.value = publicKey(
      'Sysvar1nstructions1111111111111111111111111'
    );
  }
  if (!resolvedAccounts.tokenProgram.value) {
    resolvedAccounts.tokenProgram.value = context.programs.getPublicKey(
      'splToken',
      'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
    );
    resolvedAccounts.tokenProgram.isWritable = false;
  }
  if (!resolvedAccounts.tokenMetadataProgram.value) {
    resolvedAccounts.tokenMetadataProgram.value = context.programs.getPublicKey(
      'mplTokenMetadata',
      'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
    );
    resolvedAccounts.tokenMetadataProgram.isWritable = false;
  }
  if (!resolvedAccounts.authRulesProgram.value) {
    resolvedAccounts.authRulesProgram.value = context.programs.getPublicKey(
      'mplTokenAuthRules',
      'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg'
    );
    resolvedAccounts.authRulesProgram.isWritable = false;
  }
  if (!resolvedAccounts.systemProgram.value) {
    resolvedAccounts.systemProgram.value = context.programs.getPublicKey(
      'splSystem',
      '11111111111111111111111111111111'
    );
    resolvedAccounts.systemProgram.isWritable = false;
  }

  // Accounts in order.
  const orderedAccounts: ResolvedAccount[] = Object.values(
    resolvedAccounts
  ).sort((a, b) => a.index - b.index);

  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(
    orderedAccounts,
    'programId',
    programId
  );

  // Data.
  const data = getSyncPnftInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
