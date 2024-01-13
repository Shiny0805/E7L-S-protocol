use anchor_lang::prelude::*;

declare_id!("632M5HzWKtu4CgihaQmUNjEBxo1x6THsHfuuGXGNDWEw");

#[program]
pub mod e7l_s_protocol {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
