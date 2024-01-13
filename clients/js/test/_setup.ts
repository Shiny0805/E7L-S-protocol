/* eslint-disable import/no-extraneous-dependencies */
import { createUmi as basecreateUmi } from '@metaplex-foundation/umi-bundle-tests';
import { e7lSProtocol } from '../src';

export const createUmi = async () =>
  (await basecreateUmi()).use(e7lSProtocol());
