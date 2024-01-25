use crate::constant::*;
use crate::state::{GlobalPool, LinkedNFT, NftPool};
use crate::util::resize_account;
use crate::E7LError;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::{invoke, invoke_signed};
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::instruction::{DelegateArgs, LockArgs, MetadataInstruction};
use solana_program::instruction::Instruction;

#[derive(Accounts)]
pub struct LinkPNft<'info> {
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
        constraint = token_account.mint == token_mint.key(),
        constraint = token_account.owner == *owner.key,
        constraint = token_account.amount == 1,
    )]
    pub token_account: Box<Account<'info, TokenAccount>>,

    /// CHECK: this account is safe
    pub main_mint: Box<Account<'info, Mint>>,

    /// CHECK: this account is safe
    pub token_mint: Box<Account<'info, Mint>>,

    /// CHECK instruction will fail if wrong edition is supplied
    pub token_mint_edition: AccountInfo<'info>,

    /// CHECK instruction will fail if wrong record is supplied
    #[account(mut)]
    pub token_mint_record: AccountInfo<'info>,
    /// CHECK instruction will fail if wrong metadata is supplied
    #[account(mut)]
    pub mint_metadata: UncheckedAccount<'info>,
    /// CHECK instruction will fail if wrong rules are supplied
    pub auth_rules: UncheckedAccount<'info>,
    /// CHECK instruction will fail if wrong sysvar ixns are supplied
    pub sysvar_instructions: AccountInfo<'info>,

    /// CHECK: this account is safe
    pub token_program: Program<'info, Token>,

    /// CHECK: this account is safe
    #[account(constraint = token_metadata_program.key == &mpl_token_metadata::ID)]
    pub token_metadata_program: AccountInfo<'info>,

    /// CHECK intstruction will fail if wrong program is supplied
    pub auth_rules_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>
}

pub fn link_pnft_handler(ctx: Context<LinkPNft>) -> Result<()> {
    let nft_pool = &mut ctx.accounts.nft_authority;

    require!(
        ctx.accounts.main_mint.key() != ctx.accounts.token_mint.key(),
        E7LError::InvalidMainNFT
    );

    if nft_pool.max_limited {
        require!(
            nft_pool.item_count < NFT_LINK_MAX_COUNT as u64,
            E7LError::MaxLinkCount
        );
    }

    //  --------------------------- delegate, lock    ---------------------------------------
    let nft_account = ctx.accounts.main_mint.key();

    let seeds = &[
        nft_account.as_ref(),
        NFT_AUTHORITY_SEED.as_bytes(),
        &[*ctx.bumps.get("nft_authority").unwrap()],
    ];

    let delegate_seeds: &[&[&[u8]]; 1] = &[&seeds[..]];

    invoke(
        &(Instruction {
            program_id: mpl_token_metadata::id(),
            accounts: vec![
                // 0. `[writable]` Delegate record account
                AccountMeta::new_readonly(mpl_token_metadata::id(), false),
                // 1. `[]` Delegated owner
                AccountMeta::new_readonly(nft_pool.key(), false),
                // 2. `[writable]` Metadata account
                AccountMeta::new(ctx.accounts.mint_metadata.key(), false),
                // 3. `[optional]` Master Edition account
                AccountMeta::new_readonly(ctx.accounts.token_mint_edition.key(), false),
                // 4. `[]` Token record
                AccountMeta::new(ctx.accounts.token_mint_record.key(), false),
                // 5. `[]` Mint account
                AccountMeta::new_readonly(ctx.accounts.token_mint.key(), false),
                // 6. `[optional, writable]` Token account
                AccountMeta::new(ctx.accounts.token_account.key(), false),
                // 7. `[signer]` Approver (update authority or token owner) to approve the delegation
                AccountMeta::new_readonly(ctx.accounts.owner.key(), true),
                // 8. `[signer, writable]` Payer
                AccountMeta::new(ctx.accounts.owner.key(), true),
                // 9. `[]` System Program
                AccountMeta::new_readonly(ctx.accounts.system_program.key(), false),
                // 10. `[]` Instructions sysvar account
                AccountMeta::new_readonly(ctx.accounts.sysvar_instructions.key(), false),
                // 11. `[optional]` SPL Token Program
                AccountMeta::new_readonly(ctx.accounts.token_program.key(), false),
                // 12. `[optional]` Token Authorization Rules program
                AccountMeta::new_readonly(ctx.accounts.auth_rules_program.key(), false),
                // 13. `[optional]` Token Authorization Rules account
                AccountMeta::new_readonly(ctx.accounts.auth_rules.key(), false),
            ],
            data: MetadataInstruction::Delegate(DelegateArgs::LockedTransferV1 {
                amount: 1,
                locked_address: nft_pool.key(),
                authorization_data: None,
            })
            .try_to_vec()
            .unwrap(),
        }),
        &[
            nft_pool.to_account_info(),
            ctx.accounts.mint_metadata.to_account_info(),
            ctx.accounts.token_mint_edition.to_account_info(),
            ctx.accounts.token_mint_record.to_account_info(),
            ctx.accounts.token_mint.to_account_info(),
            ctx.accounts.token_account.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.sysvar_instructions.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.auth_rules_program.to_account_info(),
            ctx.accounts.auth_rules.to_account_info(),
        ],
    )?;

    invoke_signed(
        &(Instruction {
            program_id: mpl_token_metadata::id(),
            accounts: vec![
                // 0. `[signer]` Delegate
                AccountMeta::new_readonly(nft_pool.key(), true),
                // 1. `[optional]` Token owner
                AccountMeta::new_readonly(ctx.accounts.owner.key(), false),
                // 2. `[mut]` Token account
                AccountMeta::new(ctx.accounts.token_account.key(), false),
                // 3. `[]` Mint account
                AccountMeta::new_readonly(ctx.accounts.token_mint.key(), false),
                // 4. `[mut]` Metadata account
                AccountMeta::new(ctx.accounts.mint_metadata.key(), false),
                // 5. `[optional]` Edition account
                AccountMeta::new_readonly(ctx.accounts.token_mint_edition.key(), false),
                // 6. `[optional, mut]` Token record account
                AccountMeta::new(ctx.accounts.token_mint_record.key(), false),
                // 7. `[signer, mut]` Payer
                AccountMeta::new(ctx.accounts.owner.key(), true),
                // 8. `[]` System Program
                AccountMeta::new_readonly(ctx.accounts.system_program.key(), false),
                // 9. `[]` Instructions sysvar account
                AccountMeta::new_readonly(ctx.accounts.sysvar_instructions.key(), false),
                // 10. `[optional]` SPL Token Program
                AccountMeta::new_readonly(ctx.accounts.token_program.key(), false),
                // 11. `[optional]` Token Authorization Rules program
                AccountMeta::new_readonly(ctx.accounts.auth_rules_program.key(), false),
                // 12. `[optional]` Token Authorization Rules account
                AccountMeta::new_readonly(ctx.accounts.auth_rules.key(), false),
            ],
            data: MetadataInstruction::Lock(LockArgs::V1 {
                authorization_data: None,
            })
            .try_to_vec()
            .unwrap(),
        }),
        &[
            nft_pool.to_account_info(),
            ctx.accounts.owner.to_account_info(),
            ctx.accounts.token_account.to_account_info(),
            ctx.accounts.token_mint.to_account_info(),
            ctx.accounts.mint_metadata.to_account_info(),
            ctx.accounts.token_mint_edition.to_account_info(),
            ctx.accounts.token_mint_record.to_account_info(),
            ctx.accounts.system_program.to_account_info(),
            ctx.accounts.sysvar_instructions.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
            ctx.accounts.auth_rules_program.to_account_info(),
            ctx.accounts.auth_rules.to_account_info(),
        ],
        delegate_seeds,
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

    // Add data on Nftpool
    let _add_nft = nft_pool.add_nft(ctx.accounts.token_mint.key());

    require!(_add_nft == Ok(()), E7LError::InvalidLinkNFT);

    Ok(())
}
