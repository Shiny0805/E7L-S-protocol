use anchor_lang::{prelude::*, AnchorDeserialize};
pub mod constant;
pub mod error;
pub mod instructions;
pub mod state;
pub mod util;
use constant::*;
use error::*;
use instructions::*;
use state::*;
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
    pub fn init_main(mut ctx: Context<InitMain>, max_limited: bool, unlinkable: bool) -> Result<()> {
        InitMain::process_instruction(&mut ctx, max_limited, unlinkable)
    }

    pub fn link_nft(ctx: Context<LinkNft>) -> Result<()> {
        link_nft::link_nft_handler(ctx)
    }

    pub fn unlink_nft(ctx: Context<UnlinkNft>) -> Result<()> {
        unlink_nft::unlink_nft_handler(ctx)
    }

    pub fn sync_nft(ctx: Context<SyncNft>) -> Result<()> {
        sync_nft::sync_nft_handler(ctx)
    }

    pub fn link_pnft(ctx: Context<LinkPNft>) -> Result<()> {
        link_pnft::link_pnft_handler(ctx)
    }

    pub fn unlink_pnft(ctx: Context<UnlinkPNft>) -> Result<()> {
        unlink_pnft::unlink_pnft_handler(ctx)
    }

    pub fn sync_pnft(ctx: Context<SyncPNft>) -> Result<()> {
        sync_pnft::sync_pnft_handler(ctx)
    }

}
