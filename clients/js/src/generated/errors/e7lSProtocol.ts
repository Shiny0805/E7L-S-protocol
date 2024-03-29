/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Program, ProgramError } from '@metaplex-foundation/umi';

type ProgramErrorConstructor = new (
  program: Program,
  cause?: Error
) => ProgramError;
const codeToErrorMap: Map<number, ProgramErrorConstructor> = new Map();
const nameToErrorMap: Map<string, ProgramErrorConstructor> = new Map();

/** InvalidOwner: Invalid owner key. */
export class InvalidOwnerError extends ProgramError {
  readonly name: string = 'InvalidOwner';

  readonly code: number = 0x1770; // 6000

  constructor(program: Program, cause?: Error) {
    super('Invalid owner key.', program, cause);
  }
}
codeToErrorMap.set(0x1770, InvalidOwnerError);
nameToErrorMap.set('InvalidOwner', InvalidOwnerError);

/** InvalidAdmin: Invalid admin key. */
export class InvalidAdminError extends ProgramError {
  readonly name: string = 'InvalidAdmin';

  readonly code: number = 0x1771; // 6001

  constructor(program: Program, cause?: Error) {
    super('Invalid admin key.', program, cause);
  }
}
codeToErrorMap.set(0x1771, InvalidAdminError);
nameToErrorMap.set('InvalidAdmin', InvalidAdminError);

/** InvalidMainNFT: Can't Link main NFT. */
export class InvalidMainNFTError extends ProgramError {
  readonly name: string = 'InvalidMainNFT';

  readonly code: number = 0x1772; // 6002

  constructor(program: Program, cause?: Error) {
    super("Can't Link main NFT.", program, cause);
  }
}
codeToErrorMap.set(0x1772, InvalidMainNFTError);
nameToErrorMap.set('InvalidMainNFT', InvalidMainNFTError);

/** UnlinkableNFT: This is unlinkable NFT. */
export class UnlinkableNFTError extends ProgramError {
  readonly name: string = 'UnlinkableNFT';

  readonly code: number = 0x1773; // 6003

  constructor(program: Program, cause?: Error) {
    super('This is unlinkable NFT.', program, cause);
  }
}
codeToErrorMap.set(0x1773, UnlinkableNFTError);
nameToErrorMap.set('UnlinkableNFT', UnlinkableNFTError);

/** InvalidLinkNFT: Faild to link NFT. */
export class InvalidLinkNFTError extends ProgramError {
  readonly name: string = 'InvalidLinkNFT';

  readonly code: number = 0x1774; // 6004

  constructor(program: Program, cause?: Error) {
    super('Faild to link NFT.', program, cause);
  }
}
codeToErrorMap.set(0x1774, InvalidLinkNFTError);
nameToErrorMap.set('InvalidLinkNFT', InvalidLinkNFTError);

/** InvalidNftPool: Invalid Main Nft Pool */
export class InvalidNftPoolError extends ProgramError {
  readonly name: string = 'InvalidNftPool';

  readonly code: number = 0x1775; // 6005

  constructor(program: Program, cause?: Error) {
    super('Invalid Main Nft Pool', program, cause);
  }
}
codeToErrorMap.set(0x1775, InvalidNftPoolError);
nameToErrorMap.set('InvalidNftPool', InvalidNftPoolError);

/** InvalidMetadata: Invalid Metadata Address */
export class InvalidMetadataError extends ProgramError {
  readonly name: string = 'InvalidMetadata';

  readonly code: number = 0x1776; // 6006

  constructor(program: Program, cause?: Error) {
    super('Invalid Metadata Address', program, cause);
  }
}
codeToErrorMap.set(0x1776, InvalidMetadataError);
nameToErrorMap.set('InvalidMetadata', InvalidMetadataError);

/** MaxLinkCount: Linked maximum number of NFTs */
export class MaxLinkCountError extends ProgramError {
  readonly name: string = 'MaxLinkCount';

  readonly code: number = 0x1777; // 6007

  constructor(program: Program, cause?: Error) {
    super('Linked maximum number of NFTs', program, cause);
  }
}
codeToErrorMap.set(0x1777, MaxLinkCountError);
nameToErrorMap.set('MaxLinkCount', MaxLinkCountError);

/** NftNotExist: Can not find NFT */
export class NftNotExistError extends ProgramError {
  readonly name: string = 'NftNotExist';

  readonly code: number = 0x1778; // 6008

  constructor(program: Program, cause?: Error) {
    super('Can not find NFT', program, cause);
  }
}
codeToErrorMap.set(0x1778, NftNotExistError);
nameToErrorMap.set('NftNotExist', NftNotExistError);

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 */
export function getE7lSProtocolErrorFromCode(
  code: number,
  program: Program,
  cause?: Error
): ProgramError | null {
  const constructor = codeToErrorMap.get(code);
  return constructor ? new constructor(program, cause) : null;
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 */
export function getE7lSProtocolErrorFromName(
  name: string,
  program: Program,
  cause?: Error
): ProgramError | null {
  const constructor = nameToErrorMap.get(name);
  return constructor ? new constructor(program, cause) : null;
}
