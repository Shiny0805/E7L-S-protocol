const path = require("path");
const k = require("@metaplex-foundation/kinobi");

// Paths.
const clientDir = path.join(__dirname, "..", "clients");
const idlDir = path.join(__dirname, "..", "idls");

// Instanciate Kinobi.
const kinobi = k.createFromIdls([path.join(idlDir, "e7l_s_protocol.json")]);

// Update programs.
kinobi.update(
  new k.UpdateProgramsVisitor({
    e7lSProtocolProgram: { name: "e7lSProtocol" },
  })
);

// Update accounts.
// TODO: Add size
kinobi.update(
  new k.UpdateAccountsVisitor({
    admin: {
      seeds: [
        k.stringConstantSeed("global-authority"),
        k.publicKeySeed("authority_wallet", "The wallet address of the authority"),
        k.variableSeed(
            "identifier",
            k.numberTypeNode("u64", "le"),
            "The identifier number of the pool"
          ),
      ],
    },
    nftPool: {
        seeds: [
            k.stringConstantSeed("nft-pool"),
            k.publicKeySeed("mint", "The Mint address of the NFT"),
            k.publicKeySeed("config", "The Config address of the admin PDA"),
        ],
    }
  })
);

// // Update instructions.
// kinobi.update(
//   new k.UpdateInstructionsVisitor({
//     create: {
//       bytesCreatedOnChain: k.bytesFromAccount("myAccount"),
//     },
//   })
// );

// // Set ShankAccount discriminator.
// const key = (name) => ({ field: "key", value: k.vEnum("Key", name) });
// kinobi.update(
//   new k.SetAccountDiscriminatorFromFieldVisitor({
//     myAccount: key("MyAccount"),
//     myPdaAccount: key("MyPdaAccount"),
//   })
// );

// Render JavaScript.
const jsDir = path.join(clientDir, "js", "src", "generated");
const prettier = require(path.join(clientDir, "js", ".prettierrc.json"));
kinobi.accept(new k.RenderJavaScriptVisitor(jsDir, { prettier }));

// Render Rust.
// const crateDir = path.join(clientDir, "rust");
// const rustDir = path.join(clientDir, "rust", "src", "generated");
// kinobi.accept(
//   new k.RenderRustVisitor(rustDir, {
//     formatCode: true,
//     crateFolder: crateDir,
//   })
// );
