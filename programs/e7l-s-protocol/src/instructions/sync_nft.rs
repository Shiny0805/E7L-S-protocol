use crate::*;
use anchor_spl::token::{Token, TokenAccount, Transfer};
use mpl_token_metadata::{
    instruction::freeze_delegated_account, instruction::thaw_delegated_account,
};
use solana_program::program::invoke_signed;
use anchor_spl::token;

#[derive(Accounts)]
pub struct SyncNft<'info> {
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

    // Used to receive NFT from
    #[account(
        mut,
        constraint = dest_token_account.mint == *token_mint.to_account_info().key,
        constraint = dest_token_account.owner == *nft_authority.to_account_info().key
    )]
    pub dest_token_account: Account<'info, TokenAccount>,

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

pub fn sync_nft_handler(ctx: Context<SyncNft>) -> Result<()> {
    let nft_pool = &mut ctx.accounts.nft_authority;

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

    //  --------------------------- transfer linked NFT to new owner   ---------------------------------------

    let token_program = &mut &ctx.accounts.token_program;
    let signer = &[&seeds[..]];
    let cpi_accounts = Transfer {
        from: ctx.accounts.token_account.to_account_info(),
        to: ctx.accounts.dest_token_account.to_account_info(),
        authority: nft_pool.to_account_info(),
    };
    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info().clone(),
            cpi_accounts,
            signer,
        ),
        1,
    )?;

    // Delegate the NFT account to the PDA
    invoke_signed(
        &freeze_delegated_account(
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

    Ok(())
}
