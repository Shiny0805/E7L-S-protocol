use crate::*;
use anchor_spl::token::{Token, TokenAccount};
use mpl_token_metadata::instruction::thaw_delegated_account;
use solana_program::program::invoke_signed;

#[derive(Accounts)]
pub struct UnlinkNft<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_AUTHORITY_SEED.as_ref()],
        bump,
    )]
    pub global_authority: Box<Account<'info, GlobalPool>>,

    #[account(
        mut,
        seeds = [token_mint.key().as_ref(), NFT_AUTHORITY_SEED.as_ref()],
        bump,
    )]
    pub nft_authority: Box<Account<'info, NftPool>>,

    #[account(
        mut,
        constraint = token_account.mint == token_mint.key(),
        constraint = token_account.owner == *owner.key,
        constraint = token_account.amount == 1,
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// CHECK: this account is safe
    pub token_mint: AccountInfo<'info>,

    /// CHECK instruction will fail if wrong edition is supplied
    pub token_mint_edition: AccountInfo<'info>,

    /// CHECK: this account is safe
    pub token_program: Program<'info, Token>,

    #[account(constraint = token_metadata_program.key == &mpl_token_metadata::ID)]
    /// CHECK: this account is safe
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn unlink_nft_handler(ctx: Context<UnlinkNft>) -> Result<()> {
    let nft_pool = &mut ctx.accounts.nft_authority;
    require!(!nft_pool.unlinkable, E7LError::UnlinkableNFT);

    let removed = nft_pool.remove_nft(ctx.accounts.token_mint.key())?;
    require!(removed, E7LError::NftNotExist);

    // Thaw delegated Account
    let nft_account = ctx.accounts.token_mint.key();

    let seeds = &[
        nft_account.as_ref(),
        NFT_AUTHORITY_SEED.as_bytes(),
        &[*ctx.bumps.get("nft_pool").unwrap()],
    ];

    invoke_signed(
        &thaw_delegated_account(
            ctx.accounts.token_program.key(),
            nft_pool.key(),
            ctx.accounts.token_account.key(),
            ctx.accounts.token_mint_edition.key(),
            ctx.accounts.token_mint.key(),
        ),
        &[
            nft_pool.to_account_info().clone(),
            ctx.accounts.token_account.to_account_info(),
            ctx.accounts.token_mint_edition.to_account_info(),
            ctx.accounts.token_mint.to_account_info(),
        ],
        &[seeds],
    )?;

    //  ----------------------------    resize nftpool   -----------------------------------------

    let data_len = nft_pool.to_account_info().data_len();

    resize_account(
        nft_pool.to_account_info().clone(),
        data_len - LinkedNFT::DATA_SIZE,
        ctx.accounts.owner.to_account_info().clone(),
        ctx.accounts.system_program.to_account_info().clone(),
    )?;

    nft_pool.item_count -= 1;

    Ok(())
}
