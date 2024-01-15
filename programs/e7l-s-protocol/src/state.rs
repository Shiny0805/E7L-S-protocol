use crate::*;

#[account]
pub struct GlobalPool {
    pub admin: Pubkey, //  32
}

impl GlobalPool {
    pub const DATA_SIZE: usize = 32;
}

#[account]
pub struct NftPool {
    pub owner: Pubkey,                           // 32
    pub token_account: Pubkey,                   // 32
    pub item_count: u64,                         // 8
    pub max_limited: bool,                       // 4
    pub unlinkable: bool,                        // 4
    pub items: Vec<LinkedNFT>,  
}

impl NftPool {
    pub const DATA_SIZE: usize = 80 + 4;

    //  Add new NFT to vector
    pub fn add_nft(&mut self, nft_addr: Pubkey) -> Result<()> {
        //  Add link info
        self.items.push(LinkedNFT {
            nft_addr,
            linked_time: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct LinkedNFT {
    pub nft_addr: Pubkey,
    pub linked_time: i64,
}

impl LinkedNFT {
    pub const DATA_SIZE: usize = 32 + 8;
}
