use anchor_lang::{prelude::*, AnchorDeserialize};

pub mod constant;
pub mod instructions;
pub mod state;
pub mod error;
pub mod util;
use constant::*;
use instructions::*;
use state::*;
use error::*;
use util::*;

declare_id!("FisiUgsgCrjcwzDDrdoqTpjVizLNiEij73hrTgfUSwvi");

#[program]
pub mod e7l_s_protocol {
    use super::*;

    /**
     * Initialize main Global pool
     */
    pub fn initialize(mut ctx: Context<Initialize>) -> Result<()> {
        Initialize::process_instruction(&mut ctx)
    }

    //  Initialize main NFT pool
    pub fn init_main(mut ctx: Context<InitMain>) -> Result<()> {
        InitMain::process_instruction(&mut ctx)
    }

    pub fn link_nft(ctx: Context<LinkNft>) -> Result<()> {
        link_nft::link_nft_handler(ctx)
    }

}

// fn user(pool_loader: &AccountLoader<NftPool>, user: &AccountInfo) -> Result<()> {
//     let nft_pool = pool_loader.load()?;
//     require!(nft_pool.owner == *user.key, E7LError::InvalidNftPool);
//     Ok(())
// }
