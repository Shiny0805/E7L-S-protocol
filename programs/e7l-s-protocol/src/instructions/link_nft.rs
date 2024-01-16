use crate::*;
use anchor_spl::token::{self, Approve, Token, TokenAccount};
use mpl_token_metadata::instruction::freeze_delegated_account;
use solana_program::program::invoke_signed;

#[derive(Accounts)]
pub struct LinkNft<'info> {
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
    #[account(
        mut,
        constraint = mint_metadata.owner == &mpl_token_metadata::ID
    )]
    /// CHECK: this account is safe
    pub mint_metadata: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,

    #[account(constraint = token_metadata_program.key == &mpl_token_metadata::ID)]
    /// CHECK: this account is safe
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn link_nft_handler(ctx: Context<LinkNft>) -> Result<()> {
    let nft_pool = &mut ctx.accounts.nft_authority;

    if nft_pool.max_limited {
        require!(
            nft_pool.item_count < NFT_LINK_MAX_COUNT as u64,
            E7LError::MaxLinkCount
        );
    }

    let mint_metadata = &mut &ctx.accounts.mint_metadata;

    msg!("Metadata Account: {:?}", ctx.accounts.mint_metadata.key());
    let (metadata, _) = Pubkey::find_program_address(
        &[
            mpl_token_metadata::state::PREFIX.as_bytes(),
            mpl_token_metadata::id().as_ref(),
            ctx.accounts.token_mint.key().as_ref(),
        ],
        &mpl_token_metadata::id(),
    );
    require!(metadata == mint_metadata.key(), E7LError::InvalidMetadata);

    // Add data on Nftpool
    let _add_nft = nft_pool.add_nft(ctx.accounts.token_mint.key());

    require!(_add_nft == Ok(()), E7LError::InvalidLinkNFT);

    // Delegate the NFT account to the PDA
    let cpi_accounts = Approve {
        to: ctx.accounts.token_account.to_account_info(),
        delegate: nft_pool.to_account_info(),
        authority: ctx.accounts.owner.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
    token::approve(cpi_context, 1)?;

    // Freeze delegated account
    let nft_account = ctx.accounts.token_mint.key();

    let seeds = &[
        nft_account.as_ref(),
        NFT_AUTHORITY_SEED.as_bytes(),
        &[*ctx.bumps.get("nft_pool").unwrap()],
    ];

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

    //  ----------------------------    resize nftpool   -----------------------------------------

    let data_len = nft_pool.to_account_info().data_len();

    resize_account(
        nft_pool.to_account_info().clone(),
        data_len + LinkedNFT::DATA_SIZE,
        ctx.accounts.owner.to_account_info().clone(),
        ctx.accounts.system_program.to_account_info().clone(),
    )?;

    nft_pool.item_count += 1;

    Ok(())
}
