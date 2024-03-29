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
export type LinkNftInstructionAccounts = {
  owner: Signer;
  globalAuthority: PublicKey | Pda;
  nftAuthority: PublicKey | Pda;
  tokenAccount: PublicKey | Pda;
  mainMint: PublicKey | Pda;
  tokenMint: PublicKey | Pda;
  /** CHECK instruction will fail if wrong edition is supplied */
  tokenMintEdition: PublicKey | Pda;
  mintMetadata: PublicKey | Pda;
  tokenProgram?: PublicKey | Pda;
  tokenMetadataProgram?: PublicKey | Pda;
  systemProgram?: PublicKey | Pda;
};

// Data.
export type LinkNftInstructionData = { discriminator: Array<number> };

export type LinkNftInstructionDataArgs = {};

export function getLinkNftInstructionDataSerializer(): Serializer<
  LinkNftInstructionDataArgs,
  LinkNftInstructionData
> {
  return mapSerializer<LinkNftInstructionDataArgs, any, LinkNftInstructionData>(
    struct<LinkNftInstructionData>(
      [['discriminator', array(u8(), { size: 8 })]],
      { description: 'LinkNftInstructionData' }
    ),
    (value) => ({
      ...value,
      discriminator: [199, 188, 128, 49, 165, 61, 6, 228],
    })
  ) as Serializer<LinkNftInstructionDataArgs, LinkNftInstructionData>;
}

// Instruction.
export function linkNft(
  context: Pick<Context, 'programs'>,
  input: LinkNftInstructionAccounts
): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey(
    'e7lSProtocol',
    'MyProgram1111111111111111111111111111111111'
  );

  // Accounts.
  const resolvedAccounts: ResolvedAccountsWithIndices = {
    owner: { index: 0, isWritable: true, value: input.owner ?? null },
    globalAuthority: {
      index: 1,
      isWritable: true,
      value: input.globalAuthority ?? null,
    },
    nftAuthority: {
      index: 2,
      isWritable: true,
      value: input.nftAuthority ?? null,
    },
    tokenAccount: {
      index: 3,
      isWritable: true,
      value: input.tokenAccount ?? null,
    },
    mainMint: { index: 4, isWritable: false, value: input.mainMint ?? null },
    tokenMint: { index: 5, isWritable: false, value: input.tokenMint ?? null },
    tokenMintEdition: {
      index: 6,
      isWritable: false,
      value: input.tokenMintEdition ?? null,
    },
    mintMetadata: {
      index: 7,
      isWritable: true,
      value: input.mintMetadata ?? null,
    },
    tokenProgram: {
      index: 8,
      isWritable: false,
      value: input.tokenProgram ?? null,
    },
    tokenMetadataProgram: {
      index: 9,
      isWritable: false,
      value: input.tokenMetadataProgram ?? null,
    },
    systemProgram: {
      index: 10,
      isWritable: false,
      value: input.systemProgram ?? null,
    },
  };

  // Default values.
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
  const data = getLinkNftInstructionDataSerializer().serialize({});

  // Bytes Created On Chain.
  const bytesCreatedOnChain = 0;

  return transactionBuilder([
    { instruction: { keys, programId, data }, signers, bytesCreatedOnChain },
  ]);
}
