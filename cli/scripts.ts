import { Program, web3 } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import fs from 'fs';
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet';
import { GLOBAL_AUTHORITY_SEED, PROGRAM_ID, NFT_AUTHORITY_SEED } from '../lib/constant';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { IDL } from "../target/types/e7l_s_protocol";
import {
    createInitializeTx,
    createInitMainTx,
    createLinkNftTx,
    createUnlinkNftTx,
    createSyncNftTx
} from '../lib/scripts';

let solConnection: Connection = null;
let program: Program = null;
let provider: anchor.Provider = null;
let payer: NodeWallet = null;

// Address of the deployed program.
let programId = new anchor.web3.PublicKey(PROGRAM_ID);

/**
 * Set cluster, provider, program
 * If rpc != null use rpc, otherwise use cluster param
 * @param cluster - cluster ex. mainnet-beta, devnet ...
 * @param keypair - wallet keypair
 * @param rpc - rpc
 */
export const setClusterConfig = async (
    cluster: web3.Cluster,
    keypair: string, rpc?: string
) => {

    if (!rpc) {
        solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
    } else {
        solConnection = new web3.Connection(rpc);
    }

    const walletKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
        { skipValidation: true });
    const wallet = new NodeWallet(walletKeypair);

    // Configure the client to use the local cluster.
    anchor.setProvider(new anchor.AnchorProvider(
        solConnection,
        wallet,
        { skipPreflight: true, commitment: 'confirmed' }));
    payer = wallet;

    provider = anchor.getProvider();
    console.log('Wallet Address: ', wallet.publicKey.toBase58());

    // Generate the program client from IDL.
    program = new anchor.Program(IDL as anchor.Idl, programId);
    console.log('ProgramId: ', program.programId.toBase58());
}

/**
 * Initialize global pool, vault
 */
export const initProject = async () => {
    try {
        const tx = await createInitializeTx(payer.publicKey, program);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Initialize main NFT pool
 */
export const initializeMainPool = async (nftMint: PublicKey) => {
    try {
        const tx = await createInitMainTx(payer.publicKey, nftMint, program);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Link NFT
 */
export const linkNft = async (
    mainNft: PublicKey,
    nftMint: PublicKey
) => {
    try {
        const tx = await createLinkNftTx(payer.publicKey, mainNft, nftMint, program);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Unlink NFT
 */
export const unlinkNft = async (
    mainNft: PublicKey,
    nftMint: PublicKey
) => {
    try {
        const tx = await createUnlinkNftTx(payer.publicKey, mainNft, nftMint, program);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Sync NFT
 */
export const syncNft = async (
    mainNft: PublicKey,
    nftMint: PublicKey,
    newAddress: PublicKey
) => {
    try {
        const tx = await createSyncNftTx(payer.publicKey, mainNft, nftMint, newAddress, program, solConnection);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}