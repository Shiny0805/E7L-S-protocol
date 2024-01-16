use crate::*;
use anchor_spl::token::{ Mint };

#[derive(Accounts)]
pub struct InitMain<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub token_mint: Box<Account<'info, Mint>>,

    //  Nft pool stores main NFT's link info
    #[account(
        init,
        space = 8 + NftPool::DATA_SIZE,
        seeds = [user.key().as_ref(), NFT_AUTHORITY_SEED.as_ref()],
        bump,
        payer = user
    )]
    pub nft_pool: Account<'info, NftPool>,

    //  Needed to init new account
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl InitMain<'_> {
    pub fn process_instruction(ctx: &mut Context<Self>, max_limited: bool, unlinkable: bool) -> Result<()> {
        let nft_pool: &mut Account<'_, NftPool> = &mut ctx.accounts.nft_pool;

        nft_pool.token_mint = ctx.accounts.token_mint.key();
        nft_pool.max_limited = max_limited;
        nft_pool.unlinkable = unlinkable;

        Ok(())
    }
}
