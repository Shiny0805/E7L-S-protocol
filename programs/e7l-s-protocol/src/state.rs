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
    pub token_mint: Pubkey,                      // 32
    pub item_count: u64,                         // 8
    pub max_limited: bool,                       // 4
    pub unlinkable: bool,                        // 4
    pub items: Vec<LinkedNFT>,  
}

impl NftPool {
    pub const DATA_SIZE: usize = 48 + 4;

    //  Add new NFT to vector
    pub fn add_nft(&mut self, mint: Pubkey) -> Result<()> {
        //  Add link info
        self.items.push(LinkedNFT {
            mint,
            linked_time: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn remove_nft(&mut self, mint: Pubkey) -> Result<bool> {
        let mut removed = false;
        for (index, item) in self.items.iter().enumerate() {
            if item.mint == mint {
                removed = true;
                self.items.swap_remove(index);
                break;
            }
        }
        Ok(removed)
    }

}

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct LinkedNFT {
    pub mint: Pubkey,       // 32
    pub linked_time: i64,   // 8
}

impl LinkedNFT {
    pub const DATA_SIZE: usize = 32 + 8;
}
