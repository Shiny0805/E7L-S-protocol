export type E7lSProtocol = {
  "version": "0.1.0",
  "name": "e7l_s_protocol",
  "instructions": [
    {
      "name": "initialize",
      "docs": [
        "* Initialize main Global pool"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initMain",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maxLimited",
          "type": "bool"
        },
        {
          "name": "unlinkable",
          "type": "bool"
        }
      ]
    },
    {
      "name": "linkNft",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unlinkNft",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "syncNft",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "nftPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "itemCount",
            "type": "u64"
          },
          {
            "name": "maxLimited",
            "type": "bool"
          },
          {
            "name": "unlinkable",
            "type": "bool"
          },
          {
            "name": "items",
            "type": {
              "vec": {
                "defined": "LinkedNFT"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "LinkedNFT",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "linkedTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidOwner",
      "msg": "Invalid owner key."
    },
    {
      "code": 6001,
      "name": "InvalidAdmin",
      "msg": "Invalid admin key."
    },
    {
      "code": 6002,
      "name": "UnlinkableNFT",
      "msg": "This is unlinkable NFT."
    },
    {
      "code": 6003,
      "name": "InvalidLinkNFT",
      "msg": "Faild to link NFT."
    },
    {
      "code": 6004,
      "name": "InvalidNftPool",
      "msg": "Invalid Main Nft Pool"
    },
    {
      "code": 6005,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata Address"
    },
    {
      "code": 6006,
      "name": "MaxLinkCount",
      "msg": "Linked maximum number of NFTs"
    },
    {
      "code": 6007,
      "name": "NftNotExist",
      "msg": "Can not find NFT"
    }
  ]
};

export const IDL: E7lSProtocol = {
  "version": "0.1.0",
  "name": "e7l_s_protocol",
  "instructions": [
    {
      "name": "initialize",
      "docs": [
        "* Initialize main Global pool"
      ],
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initMain",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftPool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "maxLimited",
          "type": "bool"
        },
        {
          "name": "unlinkable",
          "type": "bool"
        }
      ]
    },
    {
      "name": "linkNft",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "mintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unlinkNft",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "syncNft",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "destTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMintEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK instruction will fail if wrong edition is supplied"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "globalPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "nftPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "itemCount",
            "type": "u64"
          },
          {
            "name": "maxLimited",
            "type": "bool"
          },
          {
            "name": "unlinkable",
            "type": "bool"
          },
          {
            "name": "items",
            "type": {
              "vec": {
                "defined": "LinkedNFT"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "LinkedNFT",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "linkedTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidOwner",
      "msg": "Invalid owner key."
    },
    {
      "code": 6001,
      "name": "InvalidAdmin",
      "msg": "Invalid admin key."
    },
    {
      "code": 6002,
      "name": "UnlinkableNFT",
      "msg": "This is unlinkable NFT."
    },
    {
      "code": 6003,
      "name": "InvalidLinkNFT",
      "msg": "Faild to link NFT."
    },
    {
      "code": 6004,
      "name": "InvalidNftPool",
      "msg": "Invalid Main Nft Pool"
    },
    {
      "code": 6005,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata Address"
    },
    {
      "code": 6006,
      "name": "MaxLinkCount",
      "msg": "Linked maximum number of NFTs"
    },
    {
      "code": 6007,
      "name": "NftNotExist",
      "msg": "Can not find NFT"
    }
  ]
};
