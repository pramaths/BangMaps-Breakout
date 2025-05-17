/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bangmaps_contracts.json`.
 */
export type BangmapsContracts = {
    "address": "DbQ1WFDhHd8gxd69STHnkQEcS82MvAXDSrNSwkTHrGKD",
    "metadata": {
      "name": "bangmapsContracts",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "distributeRewards",
        "discriminator": [
          97,
          6,
          227,
          255,
          124,
          165,
          3,
          148
        ],
        "accounts": [
          {
            "name": "state",
            "writable": true
          },
          {
            "name": "vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "state"
                }
              ]
            }
          },
          {
            "name": "adminSigner",
            "signer": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "recipients",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "amounts",
            "type": {
              "vec": "u64"
            }
          }
        ]
      },
      {
        "name": "initialize",
        "discriminator": [
          175,
          175,
          109,
          31,
          13,
          152,
          155,
          237
        ],
        "accounts": [
          {
            "name": "state",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    116,
                    97,
                    116,
                    101
                  ]
                }
              ]
            }
          },
          {
            "name": "vault",
            "docs": [
              "Vault PDA starts empty; gets funded on first search"
            ],
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "state"
                }
              ]
            }
          },
          {
            "name": "adminSigner",
            "writable": true,
            "signer": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "admin",
            "type": "pubkey"
          }
        ]
      },
      {
        "name": "payForSearch",
        "discriminator": [
          96,
          172,
          231,
          224,
          134,
          150,
          244,
          124
        ],
        "accounts": [
          {
            "name": "user",
            "writable": true,
            "signer": true
          },
          {
            "name": "state",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    115,
                    116,
                    97,
                    116,
                    101
                  ]
                }
              ]
            }
          },
          {
            "name": "vault",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    118,
                    97,
                    117,
                    108,
                    116
                  ]
                },
                {
                  "kind": "account",
                  "path": "state"
                }
              ]
            }
          },
          {
            "name": "contributor",
            "writable": true,
            "pda": {
              "seeds": [
                {
                  "kind": "const",
                  "value": [
                    99,
                    111,
                    110,
                    116,
                    114,
                    105,
                    98,
                    117,
                    116,
                    111,
                    114
                  ]
                },
                {
                  "kind": "account",
                  "path": "state"
                },
                {
                  "kind": "account",
                  "path": "user"
                }
              ]
            }
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "contributor",
        "discriminator": [
          222,
          222,
          255,
          212,
          133,
          49,
          27,
          93
        ]
      },
      {
        "name": "state",
        "discriminator": [
          216,
          146,
          107,
          94,
          104,
          75,
          182,
          177
        ]
      }
    ],
    "events": [
      {
        "name": "initializeEvent",
        "discriminator": [
          206,
          175,
          169,
          208,
          241,
          210,
          35,
          221
        ]
      },
      {
        "name": "rewardsDistributedEvent",
        "discriminator": [
          172,
          133,
          113,
          45,
          218,
          113,
          160,
          226
        ]
      },
      {
        "name": "searchPaidEvent",
        "discriminator": [
          162,
          46,
          84,
          218,
          164,
          48,
          125,
          167
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "vectorMismatch",
        "msg": "Recipients and amounts length mismatch"
      },
      {
        "code": 6001,
        "name": "insufficientVaultBalance",
        "msg": "Vault has insufficient funds"
      },
      {
        "code": 6002,
        "name": "unauthorized",
        "msg": "Only admin can call this"
      }
    ],
    "types": [
      {
        "name": "contributor",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "user",
              "type": "pubkey"
            }
          ]
        }
      },
      {
        "name": "initializeEvent",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "admin",
              "type": "pubkey"
            }
          ]
        }
      },
      {
        "name": "rewardsDistributedEvent",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "total",
              "type": "u64"
            }
          ]
        }
      },
      {
        "name": "searchPaidEvent",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "user",
              "type": "pubkey"
            }
          ]
        }
      },
      {
        "name": "state",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "admin",
              "type": "pubkey"
            },
            {
              "name": "vaultBump",
              "type": "u8"
            }
          ]
        }
      }
    ]
  };
  