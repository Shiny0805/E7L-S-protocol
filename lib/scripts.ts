import * as anchor from '@project-serum/anchor';
import {
    PublicKey,
    Keypair,
    Connection,
    SystemProgram,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    Transaction,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PROGRAM_ID as TOKEN_AUTH_RULES_ID } from "@metaplex-foundation/mpl-token-auth-rules";

import { METAPLEX, getATokenAccountsNeedCreate, getAssociatedTokenAccount, getMasterEdition, getMetadata } from './util';
import { GLOBAL_AUTHORITY_SEED, NFT_AUTHORITY_SEED } from './constant';

export const createInitializeTx = async (
    userAddress: PublicKey,
    program: anchor.Program,
) => {
    const [globalPool, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalPool.toBase58());

    const txId = await program.methods
        .initialize()
        .accounts({
            admin: userAddress,
            globalPool,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY
        })
        .transaction();

    return txId;
}

export const createInitMainTx = async (
    userAddress: PublicKey,
    mainNFT: PublicKey,
    program: anchor.Program,
) => {
    const [nftPool, bump] = PublicKey.findProgramAddressSync(
        [mainNFT.toBuffer(), Buffer.from(NFT_AUTHORITY_SEED)],
        program.programId);

    console.log("nftPool: ", nftPool.toBase58());

    console.log("userAddress", userAddress);
    console.log("mainNFT", mainNFT);

    const txId = await program.methods
        .initMain(false, false)
        .accounts({
            user: userAddress,
            tokenMint: mainNFT,
            nftPool,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY
        })
        .transaction();

    return txId;
}

export const createLinkNftTx = async (
    userAddress: PublicKey,
    mainNft: PublicKey,
    nftMint: PublicKey,
    program: anchor.Program
) => {
    console.log("useraddress:", userAddress);
    const [globalAuthority, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalAuthority.toBase58());

    const [nftAuthority, _user_bump] = PublicKey.findProgramAddressSync(
        [mainNft.toBuffer(), Buffer.from(NFT_AUTHORITY_SEED)],
        program.programId);
    console.log("nftPool: ", nftAuthority.toBase58());

    const nftEdition = await getMasterEdition(nftMint);
    console.log("nftEdition: ", nftEdition.toBase58());

    let tokenAccount = await getAssociatedTokenAccount(userAddress, nftMint);
    console.log("tokenAccount: ", tokenAccount.toBase58());

    const mintMetadata = await getMetadata(nftMint);
    console.log("mintMetadata: ", mintMetadata.toBase58());

    const tx = new Transaction();

    const txId = await program.methods
        .linkNft()
        .accounts({
            owner: userAddress,
            globalAuthority,
            nftAuthority,
            tokenAccount,
            mainMint: mainNft,
            tokenMint: nftMint,
            tokenMintEdition: nftEdition,
            mintMetadata,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: METAPLEX,
            systemProgram: SystemProgram.programId
        })
        .transaction();

    tx.add(txId);

    return tx;
}

export const createUnlinkNftTx = async (
    userAddress: PublicKey,
    mainNft: PublicKey,
    nftMint: PublicKey,
    program: anchor.Program
) => {
    console.log("useraddress:", userAddress);
    const [globalAuthority, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalAuthority.toBase58());

    const [nftAuthority, _user_bump] = PublicKey.findProgramAddressSync(
        [mainNft.toBuffer(), Buffer.from(NFT_AUTHORITY_SEED)],
        program.programId);
    console.log("nftPool: ", nftAuthority.toBase58());

    const nftEdition = await getMasterEdition(nftMint);
    console.log("nftEdition: ", nftEdition.toBase58());

    let tokenAccount = await getAssociatedTokenAccount(userAddress, nftMint);
    console.log("tokenAccount: ", tokenAccount.toBase58());

    const mintMetadata = await getMetadata(nftMint);
    console.log("mintMetadata: ", mintMetadata.toBase58());

    const tx = new Transaction();

    const txId = await program.methods
        .unlinkNft()
        .accounts({
            owner: userAddress,
            globalAuthority,
            nftAuthority,
            tokenAccount,
            mainMint: mainNft,
            tokenMint: nftMint,
            tokenMintEdition: nftEdition,
            mintMetadata,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: METAPLEX,
            systemProgram: SystemProgram.programId
        })
        .transaction();

    tx.add(txId);

    return tx;
}


export const createSyncNftTx = async (
    userAddress: PublicKey,
    mainNft: PublicKey,
    nftMint: PublicKey,
    newAddress: PublicKey,
    program: anchor.Program,
    solConnection: Connection
) => {
    console.log("useraddress:", userAddress);
    const [globalAuthority, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId);
    console.log("globalPool: ", globalAuthority.toBase58());

    const [nftAuthority, _user_bump] = PublicKey.findProgramAddressSync(
        [mainNft.toBuffer(), Buffer.from(NFT_AUTHORITY_SEED)],
        program.programId);
    console.log("nftPool: ", nftAuthority.toBase58());

    const nftEdition = await getMasterEdition(nftMint);
    console.log("nftEdition: ", nftEdition.toBase58());

    const { instructions, destinationAccounts } = await getATokenAccountsNeedCreate(
        solConnection, 
        newAddress, 
        userAddress, 
        [nftMint]
    );
    console.log("destinationAccounts", destinationAccounts[0]); 

    let tokenAccount = await getAssociatedTokenAccount(newAddress, nftMint);
    console.log("tokenAccount: ", tokenAccount.toBase58());

    const mintMetadata = await getMetadata(nftMint);
    console.log("mintMetadata: ", mintMetadata.toBase58());

    const tx = new Transaction();

    const txId = await program.methods
        .syncNft()
        .accounts({
            owner: userAddress,
            globalAuthority,
            nftAuthority,
            tokenAccount,
            destTokenAccount: destinationAccounts[0],
            mainMint: mainNft,
            tokenMint: nftMint,
            tokenMintEdition: nftEdition,
            mintMetadata,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: METAPLEX,
            systemProgram: SystemProgram.programId
        })
        .preInstructions(instructions)
        .transaction();

    tx.add(txId);

    return tx;
}

