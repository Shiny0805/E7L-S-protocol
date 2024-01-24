use crate::*;
use anchor_spl::token;
use anchor_spl::token::{Approve, Mint, Token, TokenAccount, Transfer};
use mpl_token_metadata::{
    instruction::freeze_delegated_account, instruction::thaw_delegated_account,
};
use solana_program::program::invoke_signed;

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
        seeds = [main_mint.key().as_ref(), NFT_AUTHORITY_SEED.as_ref()],
        bump,
    )]
    pub nft_authority: Box<Account<'info, NftPool>>,

    #[account(
        mut,
        constraint = token_account.mint == *token_mint.to_account_info().key,
        constraint = token_account.amount == 1,
    )]
    pub token_account: Box<Account<'info, TokenAccount>>,

    // Used to receive NFT from
    #[account(
        mut,
        constraint = dest_token_account.mint == *token_mint.to_account_info().key,
    )]
    pub dest_token_account: Box<Account<'info, TokenAccount>>,

    /// CHECK: this account is safe
    pub main_mint: Box<Account<'info, Mint>>,

    /// CHECK: this account is safe
    pub token_mint: Box<Account<'info, Mint>>,

    /// CHECK instruction will fail if wrong edition is supplied
    pub token_mint_edition: AccountInfo<'info>,

    /// CHECK: this account is safe
    #[account(
        mut,
        constraint = mint_metadata.owner == &mpl_token_metadata::ID
    )]
    pub mint_metadata: AccountInfo<'info>,

    /// CHECK: this account is safe
    pub token_program: Program<'info, Token>,

    #[account(constraint = token_metadata_program.key == &mpl_token_metadata::ID)]
    /// CHECK: this account is safe
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn sync_nft_handler(ctx: Context<SyncNft>) -> Result<()> {
    let nft_pool = &mut ctx.accounts.nft_authority;

    require!(!nft_pool.unlinkable, E7LError::UnlinkableNFT);

    // Thaw delegated Account
    let nft_account = ctx.accounts.main_mint.key();

    let seeds = &[
        nft_account.as_ref(),
        NFT_AUTHORITY_SEED.as_bytes(),
        &[*ctx.bumps.get("nft_authority").unwrap()],
    ];

    invoke_signed(
        &thaw_delegated_account(
            ctx.accounts.token_metadata_program.key(),
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
        &[&seeds[..]],
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
    let cpi_accounts = Approve {
        to: ctx.accounts.dest_token_account.to_account_info(),
        delegate: nft_pool.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
    token::approve(cpi_context, 1)?;

    // Delegate the NFT account to the PDA
    invoke_signed(
        &freeze_delegated_account(
            ctx.accounts.token_metadata_program.key(),
            nft_pool.key(),
            ctx.accounts.dest_token_account.key(),
            ctx.accounts.token_mint_edition.key(),
            ctx.accounts.token_mint.key(),
        ),
        &[
            nft_pool.to_account_info().clone(),
            ctx.accounts.dest_token_account.to_account_info(),
            ctx.accounts.token_mint_edition.to_account_info(),
            ctx.accounts.token_mint.to_account_info(),
        ],
        &[&seeds[..]],
    )?;

    Ok(())
}
