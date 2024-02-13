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
    createSyncNftTx,
    createLinkPNftTx,
    createUnlinkPNftTx,
    createSyncPNftTx
} from '../lib/scripts';
import { getTokenStandard } from '../lib/util';
import { initializeAdmin } from '../clients/js/src';
import { Umi, keypairIdentity } from '@metaplex-foundation/umi';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

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

export const createUmiWithConfigs = (endpoint: string, keypair) => {
    const umi = createUmi(endpoint);

    const kp = umi.eddsa.createKeypairFromSecretKey(Uint8Array.from(require(keypair)));

    umi.use(keypairIdentity(kp));

    return umi;
}

/**
 * Initialize global pool, vault
 */
export const initProject = async (umi: Umi, identifier: number) => {
    try {
        const txBuilder = initializeAdmin(umi, identifier)

        const res = await txBuilder.sendAndConfirm(umi)
        // const tx = await createInitializeTx(payer.publicKey, program);

        // const txId = await provider.sendAndConfirm(tx, [], {
        //     commitment: "confirmed",
        // });

        console.log("txHash: ", bs58.encode(res.signature));
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
        const tokenStandard = await getTokenStandard(nftMint, solConnection);

        let tx: any;
        if (tokenStandard === 4) {
            tx = await createLinkPNftTx(payer.publicKey, mainNft, nftMint, program);
        } else {
            tx = await createLinkNftTx(payer.publicKey, mainNft, nftMint, program);
        }

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
        const tokenStandard = await getTokenStandard(nftMint, solConnection);
        
        let tx: any;
        if (tokenStandard === 4) {
            tx =await createUnlinkPNftTx(payer.publicKey, mainNft, nftMint, program);
        } else {
            tx = await createUnlinkNftTx(payer.publicKey, mainNft, nftMint, program);
        }

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
    oldAddress: PublicKey
) => {
    try {
        const tokenStandard = await getTokenStandard(nftMint, solConnection);
        let tx: any;
        if (tokenStandard === 4) {
            tx = await createSyncPNftTx(payer.publicKey, mainNft, nftMint, oldAddress, program, solConnection);
        } else {
            tx = await createSyncNftTx(payer.publicKey, mainNft, nftMint, oldAddress, program, solConnection);
        }
        
        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: "confirmed",
        });

        console.log("txHash: ", txId);
    } catch (e) {
        console.log(e);
    }
}

export const initAdmin = async (umi: Umi, identifier: number) => {
    try {
        const txBuilder = initializeAdmin(umi, identifier);

        const res = await txBuilder.sendAndConfirm(umi);

        console.log("Admin account initialized. Transaction hash : ", bs58.encode(res.signature));
    } catch (e) {
        console.log("Error initializing admin account:", e);
    }
}