use crate::*;
use anchor_spl::token::{ TokenAccount };

#[derive(Accounts)]
pub struct InitMain<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub token_account: Box<Account<'info, TokenAccount>>,

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
    pub fn process_instruction(ctx: &mut Context<Self>) -> Result<()> {
        let nft_pool = &mut ctx.accounts.nft_pool;

        nft_pool.owner = ctx.accounts.user.key();
        nft_pool.token_account = ctx.accounts.token_account.key();

        Ok(())
    }
}
