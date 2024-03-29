import { program } from 'commander';
import {
    PublicKey
} from '@solana/web3.js';
import { initProject, linkNft, unlinkNft, syncNft, initializeMainPool, setClusterConfig, createUmiWithConfigs } from './scripts';

program.version('0.0.1');

programCommand('init')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-i, --identifier <number>')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, identifier } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        const umi = createUmiWithConfigs(rpc, keypair)

        await initProject(umi, identifier);
    });

programCommand('init-main')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-m, --mint <number>')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, mint } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);

        if (mint === undefined) {
            console.log("Error token Input");
            return;
        }
        await initializeMainPool(new PublicKey(mint));
    });

programCommand('link')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-a, --amint <number>')
    .option('-m, --mint <number>')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, amint, mint } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);

        await linkNft(new PublicKey(amint), new PublicKey(mint));
    });

programCommand('unlink')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-a, --amint <number>')
    .option('-m, --mint <number>')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, amint, mint } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);

        await unlinkNft(new PublicKey(amint), new PublicKey(mint));
    });

programCommand('sync')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .option('-a, --amint <number>')
    .option('-m, --mint <number>')
    .option('-o, --oaddress <number>')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc, amint, mint, oaddress } = cmd.opts();

        console.log('Solana Cluster:', env);
        console.log('Keypair Path:', keypair);
        console.log('RPC URL:', rpc);

        await setClusterConfig(env, keypair, rpc);

        await syncNft(new PublicKey(amint), new PublicKey(mint), new PublicKey(oaddress));
    });


function programCommand(name: string) {
    return program
        .command(name)
        .option('-e, --env <string>', 'Solana cluster env name', 'devnet') //mainnet-beta, testnet, devnet
        .option('-r, --rpc <string>', 'Solana cluster RPC name', 'https://api.devnet.solana.com')
        .option('-k, --keypair <string>', 'Solana wallet Keypair Path', './keys/E2.json')
}

program.parse(process.argv);
