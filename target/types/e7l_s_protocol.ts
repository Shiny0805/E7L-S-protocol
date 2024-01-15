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
          "name": "tokenAccount",
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
      "args": []
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
          "name": "userNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
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
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
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
            "name": "nftAddr",
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
      "name": "InvalidLinkNFT",
      "msg": "Faild to link NFT."
    },
    {
      "code": 6003,
      "name": "InvalidNftPool",
      "msg": "Invalid Main Nft Pool"
    },
    {
      "code": 6004,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata Address"
    },
    {
      "code": 6005,
      "name": "MaxLinkCount",
      "msg": "Linked maximum number of NFTs"
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
          "name": "tokenAccount",
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
      "args": []
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
          "name": "userNftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
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
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
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
            "name": "nftAddr",
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
      "name": "InvalidLinkNFT",
      "msg": "Faild to link NFT."
    },
    {
      "code": 6003,
      "name": "InvalidNftPool",
      "msg": "Invalid Main Nft Pool"
    },
    {
      "code": 6004,
      "name": "InvalidMetadata",
      "msg": "Invalid Metadata Address"
    },
    {
      "code": 6005,
      "name": "MaxLinkCount",
      "msg": "Linked maximum number of NFTs"
    }
  ]
};