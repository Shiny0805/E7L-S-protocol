use crate::*;

#[error_code]
pub enum E7LError {
    #[msg("Invalid owner key.")]
    InvalidOwner,
    #[msg("Invalid admin key.")]
    InvalidAdmin,
    #[msg("Can't Link main NFT.")]
    InvalidMainNFT,
    #[msg("This is unlinkable NFT.")]
    UnlinkableNFT,
    #[msg("Faild to link NFT.")]
    InvalidLinkNFT,
    #[msg("Invalid Main Nft Pool")]
    InvalidNftPool,
    #[msg("Invalid Metadata Address")]
    InvalidMetadata,
    #[msg("Linked maximum number of NFTs")]
    MaxLinkCount,
    #[msg("Can not find NFT")]
    NftNotExist,
}
