import { PublicKey } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor"

// ============================================================================
// 🎯 PROGRAM CONFIGURATION
// ============================================================================

export const PROGRAM_ID = new PublicKey("8afvHrvgATxL21paW9H25bzqkq87mhyvssfvUDDSeV7E")

// PDA Seeds
export const GLOBAL_DATA_SEED = "global-authority"
export const SOL_VAULT_SEED = "vault-authority"
export const POOL_AUTHORITY_SEED = "pool-authority"
export const USER_AUTHORITY_SEED = "user-authority"

// ============================================================================
// 🔒 LOCK PERIOD ENUM & CONFIG
// ============================================================================

export enum LockPeriod {
  FreeLock = 0,
  OneWeek = 1,
  OneMonth = 2,
  ThreeMonths = 3,
  SixMonths = 4,
}

export const LOCK_PERIOD_CONFIG = {
  [LockPeriod.FreeLock]: {
    name: "No Lock",
    duration: 0,
    multiplier: 1.0,
    description: "Withdraw anytime",
    emoji: "🔓"
  },
  [LockPeriod.OneWeek]: {
    name: "1 Week",
    duration: 7 * 24 * 60 * 60,
    multiplier: 1.2,
    description: "7 days lock period",
    emoji: "📅"
  },
  [LockPeriod.OneMonth]: {
    name: "1 Month", 
    duration: 30 * 24 * 60 * 60,
    multiplier: 1.5,
    description: "30 days lock period",
    emoji: "🗓️"
  },
  [LockPeriod.ThreeMonths]: {
    name: "3 Months",
    duration: 90 * 24 * 60 * 60,
    multiplier: 2.0,
    description: "90 days lock period",
    emoji: "🔒"
  },
  [LockPeriod.SixMonths]: {
    name: "6 Months",
    duration: 180 * 24 * 60 * 60,
    multiplier: 3.0,
    description: "180 days lock period",
    emoji: "🔐"
  }
} as const

// ============================================================================
// 🏦 PROGRAM ACCOUNT INTERFACES
// ============================================================================

export interface GlobalData {
  superAdmin: PublicKey
  referralFee: number
  nextPoolId: number
  poolCount: number
  pools: PublicKey[]
  tier0Reward: number  // No Lock rewards
  tier1Reward: number  // 1 Week rewards
  tier2Reward: number  // 1 Month rewards
  tier3Reward: number  // 3 Months rewards
  tier4Reward: number  // 6 Months rewards
}

export interface PoolInfo {
  poolId: number
  tokenMint: PublicKey
  totalContributed: BN
  totalStaked: BN
  totalRewardsDistributed: BN
  totalReferralFee: BN
  isActive: boolean
  bump: number
  createdAt: BN
}

export interface UserStake {
  user: PublicKey
  poolId: number
  tier0Amount: BN  // No Lock amount
  tier1Amount: BN  // 1 Week amount
  tier2Amount: BN  // 1 Month amount
  tier3Amount: BN  // 3 Months amount
  tier4Amount: BN  // 6 Months amount
  lastClaimTime: BN
  totalClaimed: BN
  totalStaked: BN
  referrer: PublicKey
  referralCount: number
  referralAmount: BN
}

// ============================================================================
// 🎨 FRONTEND TYPES
// ============================================================================

export interface StakePosition {
  userStake: UserStake
  poolInfo: PoolInfo
  userStakeAddress: PublicKey
  poolInfoAddress: PublicKey
  pendingRewards: number
  canWithdraw: boolean
  lockEndTime: Date
  apy: number
}

export interface SupportedToken {
  mint: PublicKey
  symbol: string
  name: string
  decimals: number
  poolId?: number
  icon?: string
  color?: string
}

export interface StakeTransaction {
  signature: string
  type: 'stake' | 'withdraw' | 'claim'
  amount: number
  lockPeriod: LockPeriod
  timestamp: Date
  status: 'pending' | 'confirmed' | 'failed'
}

// ============================================================================
// 🪙 SUPPORTED TOKENS
// ============================================================================

export const SUPPORTED_TOKENS: Record<string, SupportedToken> = {
  SOL: {
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    poolId: 0,
    icon: "🔥",
    color: "#9945FF"
  },
  USDC: {
    mint: new PublicKey("7jjzvW2n1fSTjvzRyJu9jfboNZDZCSmiM9vfurZ9Bn9o"),
    symbol: "USDC",
    name: "USD Coin", 
    decimals: 6,
    poolId: 1,
    icon: "💵",
    color: "#2775CA"
  },
  USDT: {
    mint: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"),
    symbol: "USDT",
    name: "Tether",
    decimals: 6,
    poolId: 2,
    icon: "💰",
    color: "#26A17B"
  }
} as const

// ============================================================================
// 📊 CONSTANTS
// ============================================================================

export const CONSTANTS = {
  PRECISION: 1_000_000_000, // 1e9 for precision calculations
  SECONDS_PER_DAY: 86400,
  SECONDS_PER_YEAR: 31536000,
  BASIS_POINTS: 10000,
  MAX_POOLS: 255,
  MIN_STAKE_AMOUNT: 0.001, // Minimum stake amount in tokens
} as const

// ============================================================================
// 🛠️ UTILITY TYPES
// ============================================================================

export type TokenSymbol = keyof typeof SUPPORTED_TOKENS
export type LockPeriodKey = keyof typeof LOCK_PERIOD_CONFIG

// ============================================================================
// 🔧 HELPER FUNCTIONS
// ============================================================================

export const getLockPeriodName = (lockPeriod: LockPeriod): string => {
  return LOCK_PERIOD_CONFIG[lockPeriod]?.name || "Unknown"
}

export const getLockPeriodDuration = (lockPeriod: LockPeriod): number => {
  return LOCK_PERIOD_CONFIG[lockPeriod]?.duration || 0
}

export const getLockPeriodEmoji = (lockPeriod: LockPeriod): string => {
  return LOCK_PERIOD_CONFIG[lockPeriod]?.emoji || "❓"
}

export const getTokenBySymbol = (symbol: string): SupportedToken | undefined => {
  return SUPPORTED_TOKENS[symbol]
}

export const getTokenByMint = (mint: PublicKey): SupportedToken | undefined => {
  return Object.values(SUPPORTED_TOKENS).find(token => token.mint.equals(mint))
}

export const formatLamports = (lamports: BN, decimals: number = 9): number => {
  return lamports.toNumber() / Math.pow(10, decimals)
}

export const toLamports = (amount: number, decimals: number = 9): BN => {
  return new BN(amount * Math.pow(10, decimals))
}

export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return "Unlocked"
  
  const days = Math.floor(seconds / (24 * 60 * 60))
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((seconds % (60 * 60)) / 60)
  
  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export const calculateAPY = (dailyRate: number): number => {
  return dailyRate * 365 * 100 // Convert to annual percentage
}



// ============================================================================
// 🎯 VALIDATION HELPERS
// ============================================================================

export const isValidStakeAmount = (amount: number, token: SupportedToken): boolean => {
  return amount >= CONSTANTS.MIN_STAKE_AMOUNT && amount > 0
}

export const isValidLockPeriod = (lockPeriod: number): lockPeriod is LockPeriod => {
  return Object.values(LockPeriod).includes(lockPeriod)
}

export const isValidTokenSymbol = (symbol: string): symbol is TokenSymbol => {
  return symbol in SUPPORTED_TOKENS
}

// ============================================================================
// 🏷️ DISPLAY HELPERS
// ============================================================================

export const getStakeStatusBadge = (position: StakePosition) => {
  const now = Date.now()
  const lockEnd = position.lockEndTime.getTime()
  
  if (now >= lockEnd) {
    return { text: "Unlocked", variant: "success" as const, emoji: "🔓" }
  }
  
  const timeLeft = lockEnd - now
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))
  
  if (daysLeft <= 7) {
    return { text: `${daysLeft}d left`, variant: "warning" as const, emoji: "⏰" }
  }
  
  return { text: "Locked", variant: "secondary" as const, emoji: "🔒" }
}

export const getTierName = (tierIndex: number): string => {
  const tierNames = ["No Lock", "1 Week", "1 Month", "3 Months", "6 Months"]
  return tierNames[tierIndex] || "Unknown"
}

export const getTierEmoji = (tierIndex: number): string => {
  const tierEmojis = ["🔓", "📅", "🗓️", "🔒", "🔐"]
  return tierEmojis[tierIndex] || "❓"
}

// ============================================================================
// 📋 PROGRAM IDL TYPE (Simplified)
// ============================================================================

export type MevStaking = {
  "address": "8afvHrvgATxL21paW9H25bzqkq87mhyvssfvUDDSeV7E",
  "metadata": {
    "name": "mev_staking",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claim_sol",
      "discriminator": [
        139,
        113,
        179,
        189,
        190,
        30,
        132,
        195
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "const",
                "value": [
                  6,
                  155,
                  136,
                  87,
                  254,
                  171,
                  129,
                  132,
                  251,
                  104,
                  127,
                  99,
                  70,
                  24,
                  192,
                  53,
                  218,
                  196,
                  57,
                  220,
                  26,
                  235,
                  59,
                  85,
                  152,
                  160,
                  240,
                  0,
                  0,
                  0,
                  0,
                  1
                ]
              }
            ]
          }
        },
        {
          "name": "user_stake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "pool_id"
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pool_id",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claim_token",
      "discriminator": [
        116,
        206,
        27,
        191,
        166,
        19,
        0,
        73
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ]
          }
        },
        {
          "name": "token_mint"
        },
        {
          "name": "user_stake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "pool_id"
              }
            ]
          }
        },
        {
          "name": "user_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "pool_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "pool_info"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pool_id",
          "type": "u8"
        }
      ]
    },
    {
      "name": "contribute_sol",
      "discriminator": [
        186,
        36,
        137,
        50,
        25,
        152,
        8,
        5
      ],
      "accounts": [
        {
          "name": "contributor",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "const",
                "value": [
                  6,
                  155,
                  136,
                  87,
                  254,
                  171,
                  129,
                  132,
                  251,
                  104,
                  127,
                  99,
                  70,
                  24,
                  192,
                  53,
                  218,
                  196,
                  57,
                  220,
                  26,
                  235,
                  59,
                  85,
                  152,
                  160,
                  240,
                  0,
                  0,
                  0,
                  0,
                  1
                ]
              }
            ]
          }
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "contribute_token",
      "discriminator": [
        63,
        47,
        179,
        97,
        237,
        210,
        209,
        49
      ],
      "accounts": [
        {
          "name": "contributor",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ]
          }
        },
        {
          "name": "token_mint"
        },
        {
          "name": "contributor_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "contributor"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "pool_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "pool_info"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pool_id",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "create_pool",
      "discriminator": [
        233,
        146,
        209,
        142,
        207,
        104,
        64,
        188
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "stake_pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "token_mint"
              }
            ]
          }
        },
        {
          "name": "token_mint",
          "writable": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token_mint",
          "type": "pubkey"
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
          "name": "global_data",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "sol_pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "const",
                "value": [
                  6,
                  155,
                  136,
                  87,
                  254,
                  171,
                  129,
                  132,
                  251,
                  104,
                  127,
                  99,
                  70,
                  24,
                  192,
                  53,
                  218,
                  196,
                  57,
                  220,
                  26,
                  235,
                  59,
                  85,
                  152,
                  160,
                  240,
                  0,
                  0,
                  0,
                  0,
                  1
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "set_global_data",
      "discriminator": [
        210,
        202,
        176,
        221,
        143,
        119,
        203,
        194
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "updates",
          "type": {
            "defined": {
              "name": "GlobalDataUpdate"
            }
          }
        }
      ]
    },
    {
      "name": "stake_sol",
      "discriminator": [
        200,
        38,
        157,
        155,
        245,
        57,
        236,
        168
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "const",
                "value": [
                  6,
                  155,
                  136,
                  87,
                  254,
                  171,
                  129,
                  132,
                  251,
                  104,
                  127,
                  99,
                  70,
                  24,
                  192,
                  53,
                  218,
                  196,
                  57,
                  220,
                  26,
                  235,
                  59,
                  85,
                  152,
                  160,
                  240,
                  0,
                  0,
                  0,
                  0,
                  1
                ]
              }
            ]
          }
        },
        {
          "name": "user_stake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "pool_id"
              }
            ]
          }
        },
        {
          "name": "referrer_stake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "referrer"
              },
              {
                "kind": "arg",
                "path": "pool_id"
              }
            ]
          }
        },
        {
          "name": "referrer"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pool_id",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "lock_period",
          "type": "u8"
        },
        {
          "name": "referrer",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "stake_token",
      "discriminator": [
        191,
        127,
        193,
        101,
        37,
        96,
        87,
        211
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ]
          }
        },
        {
          "name": "token_mint"
        },
        {
          "name": "user_stake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "pool_id"
              }
            ]
          }
        },
        {
          "name": "referrer_stake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "referrer"
              },
              {
                "kind": "arg",
                "path": "pool_id"
              }
            ]
          }
        },
        {
          "name": "referrer"
        },
        {
          "name": "user_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "pool_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "pool_info"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pool_id",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "lock_period",
          "type": "u8"
        },
        {
          "name": "referrer",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "withdraw_for_mev_sol",
      "discriminator": [
        16,
        135,
        242,
        188,
        232,
        175,
        75,
        111
      ],
      "accounts": [
        {
          "name": "mev_bot",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "const",
                "value": [
                  6,
                  155,
                  136,
                  87,
                  254,
                  171,
                  129,
                  132,
                  251,
                  104,
                  127,
                  99,
                  70,
                  24,
                  192,
                  53,
                  218,
                  196,
                  57,
                  220,
                  26,
                  235,
                  59,
                  85,
                  152,
                  160,
                  240,
                  0,
                  0,
                  0,
                  0,
                  1
                ]
              }
            ]
          }
        },
        {
          "name": "wsol_mint",
          "address": "So11111111111111111111111111111111111111112"
        },
        {
          "name": "pool_wsol_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "pool_info"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "wsol_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mev_bot_wsol_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mev_bot"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "wsol_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw_for_mev_token",
      "discriminator": [
        6,
        240,
        181,
        232,
        252,
        39,
        128,
        228
      ],
      "accounts": [
        {
          "name": "mev_bot",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ]
          }
        },
        {
          "name": "token_mint"
        },
        {
          "name": "mev_bot_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mev_bot"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "pool_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "pool_info"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pool_id",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw_sol",
      "discriminator": [
        145,
        131,
        74,
        136,
        65,
        137,
        42,
        38
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "const",
                "value": [
                  6,
                  155,
                  136,
                  87,
                  254,
                  171,
                  129,
                  132,
                  251,
                  104,
                  127,
                  99,
                  70,
                  24,
                  192,
                  53,
                  218,
                  196,
                  57,
                  220,
                  26,
                  235,
                  59,
                  85,
                  152,
                  160,
                  240,
                  0,
                  0,
                  0,
                  0,
                  1
                ]
              }
            ]
          }
        },
        {
          "name": "user_stake",
          "writable": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "lock_period",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdraw_token",
      "discriminator": [
        136,
        235,
        181,
        5,
        101,
        109,
        57,
        81
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "global_data",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "pool_info",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ]
          }
        },
        {
          "name": "token_mint"
        },
        {
          "name": "user_stake",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "pool_id"
              }
            ]
          }
        },
        {
          "name": "user_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "pool_ata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "pool_info"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "token_mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "pool_id",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "lock_period",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "GlobalData",
      "discriminator": [
        48,
        194,
        194,
        186,
        46,
        71,
        131,
        61
      ]
    },
    {
      "name": "PoolInfo",
      "discriminator": [
        18,
        19,
        191,
        60,
        244,
        139,
        177,
        235
      ]
    },
    {
      "name": "UserStake",
      "discriminator": [
        102,
        53,
        163,
        107,
        9,
        138,
        87,
        153
      ]
    }
  ],
  "events": [
    {
      "name": "GlobalDataUpdated",
      "discriminator": [
        141,
        248,
        65,
        195,
        11,
        84,
        249,
        61
      ]
    },
    {
      "name": "MevWithdrawal",
      "discriminator": [
        224,
        195,
        89,
        245,
        94,
        44,
        68,
        250
      ]
    },
    {
      "name": "PoolContributed",
      "discriminator": [
        48,
        232,
        29,
        93,
        46,
        39,
        52,
        44
      ]
    },
    {
      "name": "PoolCreated",
      "discriminator": [
        202,
        44,
        41,
        88,
        104,
        220,
        157,
        82
      ]
    },
    {
      "name": "PoolStaked",
      "discriminator": [
        237,
        8,
        97,
        83,
        88,
        119,
        69,
        203
      ]
    },
    {
      "name": "PoolWithdrawn",
      "discriminator": [
        23,
        62,
        221,
        23,
        53,
        222,
        69,
        207
      ]
    },
    {
      "name": "ProgramInitialized",
      "discriminator": [
        43,
        70,
        110,
        241,
        199,
        218,
        221,
        245
      ]
    },
    {
      "name": "RewardClaimed",
      "discriminator": [
        49,
        28,
        87,
        84,
        158,
        48,
        229,
        175
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "StakeStillLocked",
      "msg": "Stake is still locked"
    },
    {
      "code": 6001,
      "name": "NoRewardsToClaim",
      "msg": "No rewards to claim"
    },
    {
      "code": 6002,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6003,
      "name": "InvalidLockPeriod",
      "msg": "Invalid lock period"
    },
    {
      "code": 6004,
      "name": "StakeNotFound",
      "msg": "Stake not found"
    },
    {
      "code": 6005,
      "name": "InsufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6006,
      "name": "ReferralAccountNotFound",
      "msg": "Referral account not found"
    },
    {
      "code": 6007,
      "name": "CannotReferYourself",
      "msg": "Cannot refer yourself"
    },
    {
      "code": 6008,
      "name": "RewardCalculationOverflow",
      "msg": "Reward calculation overflow"
    },
    {
      "code": 6009,
      "name": "InvalidRewardRate",
      "msg": "Invalid reward rate"
    },
    {
      "code": 6010,
      "name": "Unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6011,
      "name": "PoolAlreadyExists",
      "msg": "Pool already exists"
    },
    {
      "code": 6012,
      "name": "PoolInactive",
      "msg": "Pool is inactive"
    },
    {
      "code": 6013,
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6014,
      "name": "InvalidTokenMint",
      "msg": "Invalid token mint"
    },
    {
      "code": 6015,
      "name": "InvalidPoolId",
      "msg": "Invalid pool ID"
    },
    {
      "code": 6016,
      "name": "InvalidReferrer",
      "msg": "Invalid referrer"
    },
    {
      "code": 6017,
      "name": "PoolLimitReached",
      "msg": "Pool limit reached (maximum 10 pools)"
    }
  ],
  "types": [
    {
      "name": "GlobalData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "super_admin",
            "type": "pubkey"
          },
          {
            "name": "referral_fee",
            "type": "u16"
          },
          {
            "name": "next_pool_id",
            "type": "u8"
          },
          {
            "name": "pool_count",
            "type": "u8"
          },
          {
            "name": "pools",
            "type": {
              "array": [
                "pubkey",
                10
              ]
            }
          },
          {
            "name": "tier_0_reward",
            "type": "u16"
          },
          {
            "name": "tier_1_reward",
            "type": "u16"
          },
          {
            "name": "tier_2_reward",
            "type": "u16"
          },
          {
            "name": "tier_3_reward",
            "type": "u16"
          },
          {
            "name": "tier_4_reward",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "GlobalDataUpdate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "referral_fee",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_0_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_1_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_2_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_3_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_4_reward",
            "type": {
              "option": "u16"
            }
          }
        ]
      }
    },
    {
      "name": "GlobalDataUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "referral_fee",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_0_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_1_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_2_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_3_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "tier_4_reward",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "LockPeriod",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FreeLock"
          },
          {
            "name": "OneWeek"
          },
          {
            "name": "OneMonth"
          },
          {
            "name": "ThreeMonths"
          },
          {
            "name": "SixMonths"
          }
        ]
      }
    },
    {
      "name": "MevWithdrawal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mev_bot",
            "type": "pubkey"
          },
          {
            "name": "pool_id",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "PoolContributed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contributor",
            "type": "pubkey"
          },
          {
            "name": "pool_id",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "PoolCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool_id",
            "type": "u8"
          },
          {
            "name": "token_mint",
            "type": "pubkey"
          },
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "PoolInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pool_id",
            "type": "u8"
          },
          {
            "name": "token_mint",
            "type": "pubkey"
          },
          {
            "name": "total_contributed",
            "type": "u64"
          },
          {
            "name": "total_staked",
            "type": "u64"
          },
          {
            "name": "total_rewards_distributed",
            "type": "u64"
          },
          {
            "name": "total_referral_fee",
            "type": "u64"
          },
          {
            "name": "is_active",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "created_at",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "PoolStaked",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "pool_id",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lock_period",
            "type": {
              "defined": {
                "name": "LockPeriod"
              }
            }
          },
          {
            "name": "referrer",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "PoolWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "pool_id",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lock_period",
            "type": {
              "defined": {
                "name": "LockPeriod"
              }
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "ProgramInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "RewardClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "pool_id",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "UserStake",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "pool_id",
            "type": "u8"
          },
          {
            "name": "tier_0_amount",
            "type": "u64"
          },
          {
            "name": "tier_1_amount",
            "type": "u64"
          },
          {
            "name": "tier_2_amount",
            "type": "u64"
          },
          {
            "name": "tier_3_amount",
            "type": "u64"
          },
          {
            "name": "tier_4_amount",
            "type": "u64"
          },
          {
            "name": "last_claim_time",
            "type": "i64"
          },
          {
            "name": "total_claimed",
            "type": "u64"
          },
          {
            "name": "total_staked",
            "type": "u64"
          },
          {
            "name": "referrer",
            "type": "pubkey"
          },
          {
            "name": "referral_count",
            "type": "u8"
          },
          {
            "name": "referral_amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
}