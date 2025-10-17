/**
 * Utility functions for generating Solana explorer URLs
 */

export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet'

/**
 * Get the current network from environment or default to devnet
 */
export function getCurrentNetwork(): SolanaNetwork {
  const rpcEndpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com"
  
  if (rpcEndpoint.includes('mainnet') || rpcEndpoint.includes('api.mainnet')) {
    return 'mainnet-beta'
  } else if (rpcEndpoint.includes('devnet') || rpcEndpoint.includes('api.devnet')) {
    return 'devnet'
  } else if (rpcEndpoint.includes('testnet')) {
    return 'testnet'
  } else {
    // Default to devnet for local development
    return 'devnet'
  }
}

/**
 * Generate Solana explorer URL for a transaction signature
 */
export function getTransactionExplorerUrl(signature: string, network?: SolanaNetwork): string {
  const currentNetwork = network || getCurrentNetwork()
  
  switch (currentNetwork) {
    case 'mainnet-beta':
      return `https://solscan.io/tx/${signature}`
    case 'devnet':
      return `https://solscan.io/tx/${signature}?cluster=devnet`
    case 'testnet':
      return `https://solscan.io/tx/${signature}?cluster=testnet`
    default:
      return `https://solscan.io/tx/${signature}?cluster=devnet`
  }
}

/**
 * Generate Solana explorer URL for an account/address
 */
export function getAccountExplorerUrl(address: string, network?: SolanaNetwork): string {
  const currentNetwork = network || getCurrentNetwork()
  
  switch (currentNetwork) {
    case 'mainnet-beta':
      return `https://explorer.solana.com/address/${address}`
    case 'devnet':
      return `https://explorer.solana.com/address/${address}?cluster=devnet`
    case 'testnet':
      return `https://explorer.solana.com/address/${address}?cluster=testnet`
    default:
      return `https://explorer.solana.com/address/${address}?cluster=devnet`
  }
}

/**
 * Generate Solana explorer URL for a token mint
 */
export function getTokenExplorerUrl(mint: string, network?: SolanaNetwork): string {
  const currentNetwork = network || getCurrentNetwork()
  
  switch (currentNetwork) {
    case 'mainnet-beta':
      return `https://explorer.solana.com/token/${mint}`
    case 'devnet':
      return `https://explorer.solana.com/token/${mint}?cluster=devnet`
    case 'testnet':
      return `https://explorer.solana.com/token/${mint}?cluster=testnet`
    default:
      return `https://explorer.solana.com/token/${mint}?cluster=devnet`
  }
}
