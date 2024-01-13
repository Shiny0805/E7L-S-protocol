import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { E7lSProtocol } from "../target/types/e7l_s_protocol";

describe("e7l-s-protocol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.E7lSProtocol as Program<E7lSProtocol>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
