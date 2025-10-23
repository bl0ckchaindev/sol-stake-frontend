"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { PublicKey } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor"
import { useWallet } from "./wallet-provider"
import { useMevStaking } from "./mev-staking-provider"
import { 
  StakePosition,
  GlobalData,
  PoolInfo,
  LockPeriod,
  StakeTransaction,
  SUPPORTED_TOKENS,
  LOCK_PERIOD_CONFIG
} from "@/lib/anchor/types"
import { toast } from "sonner"
import { getTransactionExplorerUrl } from "@/lib/explorer-utils"
import { CheckCircle, XCircle, ExternalLink, AlertTriangle } from "lucide-react"

interface AnchorStakingContextType {
  // Program instance (inherited from MevStakingProvider)
  program: any | null
  
  // State
  stakes: StakePosition[]
  globalData: GlobalData | null
  poolsInfo: Record<string, PoolInfo>
  transactions: StakeTransaction[]
  loading: boolean
  initialLoading: boolean
  refreshing: boolean
  
  // Computed values
  totalStaked: number
  stakedByToken: Record<string, number>
  totalRewards: number
  totalRewardsByToken: Record<string, number>
  dailyRewards: number
  dailyRewardsByToken: Record<string, number>
  totalClaimableRewards: number
  claimableByToken: Record<string, number>
  
  // Actions
  stakeTokens: (tokenSymbol: string, amount: number, lockPeriod: LockPeriod, referrer?: PublicKey) => Promise<string | null>
  withdrawTokens: (position: StakePosition, amount: number) => Promise<string | null>
  claimRewards: (position: StakePosition) => Promise<string | null>
  
  // Data fetching
  refreshData: () => Promise<void>
  manualRefresh: () => Promise<void>
  
  // Utilities
  getSupportedTokens: () => typeof SUPPORTED_TOKENS
  getLockPeriodConfig: () => typeof LOCK_PERIOD_CONFIG
  formatAmount: (amount: BN, decimals?: number) => number
  parseAmount: (amount: number, decimals?: number) => BN
}

const AnchorStakingContext = createContext<AnchorStakingContextType | null>(null)


export function AnchorStakingProvider({ children }: { children: ReactNode }) {
  const { wallet, connected, publicKey } = useWallet()
  const { program, connection, isLoading: mevStakingLoading, error: mevStakingError, walletChangeTrigger } = useMevStaking()
  
  // State (program and connection now come from MevStakingProvider)
  const [stakes, setStakes] = useState<StakePosition[]>([])
  const [globalData, setGlobalData] = useState<GlobalData | null>(null)
  const [poolsInfo, setPoolsInfo] = useState<Record<string, PoolInfo>>({})
  const [transactions, setTransactions] = useState<StakeTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasInitialData, setHasInitialData] = useState(false)
  const [pendingTransactions, setPendingTransactions] = useState<Set<string>>(new Set())

  // Handle MevStakingProvider errors
  useEffect(() => {
    if (mevStakingError) {
      toast.error(
        <div className="flex items-start gap-3 p-1">
          <div className="flex-shrink-0 mt-0.5">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-red-900 dark:text-red-100">
              Connection Failed
            </div>
            <div className="text-sm text-red-700 dark:text-red-300 mt-1">
              Failed to connect to Solana network
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              Please check your internet connection and try again
            </div>
          </div>
        </div>
      )
    }
  }, [mevStakingError])

  // This useEffect will be moved after refreshData is declared

  // Enhanced computed values that properly handle all pools and lock periods
  // Calculate staked amounts by token type for proper USD conversion
  const stakedByToken = stakes.reduce((acc, stake) => {
    // Find the token info for this pool
    const tokenInfo = Object.values(SUPPORTED_TOKENS).find(token => token.poolId === stake.userStake.poolId)
    
    if (!tokenInfo) return acc
    
    // Convert from lamports to actual token amount using correct decimals
    const stakedAmount = stake.userStake.totalStaked.toNumber() / Math.pow(10, tokenInfo.decimals)
    
    // Group by token symbol
    if (!acc[tokenInfo.symbol]) {
      acc[tokenInfo.symbol] = 0
    }
    acc[tokenInfo.symbol] += stakedAmount
    
    return acc
  }, {} as Record<string, number>)

  // For backward compatibility, keep totalStaked as SOL amount
  // The UI will handle USD conversion using the price
  const totalStaked = stakedByToken.SOL || 0

  // Calculate total claimable rewards across all pools and lock periods
  // Group claimable rewards by token type for proper USD conversion
  const claimableByToken = stakes.reduce((acc, stake) => {
    // Find the token info for this pool
    const tokenInfo = Object.values(SUPPORTED_TOKENS).find(token => token.poolId === stake.userStake.poolId)
    
    if (!tokenInfo) return acc
    
    // stake.pendingRewards is already converted to actual token amount in calculatePendingRewards
    // No need to convert again - just use the value directly
    const claimableAmount = stake.pendingRewards
    
    // Group by token symbol
    if (!acc[tokenInfo.symbol]) {
      acc[tokenInfo.symbol] = 0
    }
    acc[tokenInfo.symbol] += claimableAmount
    
    return acc
  }, {} as Record<string, number>)

  // For backward compatibility, keep totalClaimableRewards as SOL amount
  const totalClaimableRewards = claimableByToken.SOL || 0

  // Calculate daily rewards properly for each pool and lock period
  // Group daily rewards by token type for proper USD conversion
  const dailyRewardsByToken = stakes.reduce((acc, stake) => {
    if (!globalData) return acc
    
    // Find the token info for this pool
    const tokenInfo = Object.values(SUPPORTED_TOKENS).find(token => token.poolId === stake.userStake.poolId)
    
    if (!tokenInfo) return acc
    
    // Calculate daily rewards for each tier (lock period)
    const tiers = [
      { amount: stake.userStake.tier0Amount, rate: globalData.tier0Reward },
      { amount: stake.userStake.tier1Amount, rate: globalData.tier1Reward },
      { amount: stake.userStake.tier2Amount, rate: globalData.tier2Reward },
      { amount: stake.userStake.tier3Amount, rate: globalData.tier3Reward },
    ]

    let poolDailyRewards = 0
    for (const tier of tiers) {
      if (tier.amount.gt(new BN(0))) {
        // Convert from lamports to actual token amount using correct decimals
        const stakeAmount = tier.amount.toNumber() / Math.pow(10, tokenInfo.decimals)
        const dailyRate = tier.rate / 10000 // Convert from basis points
        poolDailyRewards += stakeAmount * dailyRate
      }
    }

    // Group by token symbol
    if (!acc[tokenInfo.symbol]) {
      acc[tokenInfo.symbol] = 0
    }
    acc[tokenInfo.symbol] += poolDailyRewards

    return acc
  }, {} as Record<string, number>)

  // For backward compatibility, keep dailyRewards as SOL amount
  const dailyRewards = dailyRewardsByToken.SOL || 0

  // Calculate total lifetime rewards earned by the user across all pools
  // Group total rewards by token type for proper USD conversion
  const totalRewardsByToken = stakes.reduce((acc, stake) => {
    // Find the token info for this pool
    const tokenInfo = Object.values(SUPPORTED_TOKENS).find(token => token.poolId === stake.userStake.poolId)
    
    if (!tokenInfo) return acc
    
    // Convert from lamports to actual token amount using correct decimals
    const userTotalClaimed = stake.userStake.totalClaimed.toNumber() / Math.pow(10, tokenInfo.decimals)
    
    // Group by token symbol
    if (!acc[tokenInfo.symbol]) {
      acc[tokenInfo.symbol] = 0
    }
    acc[tokenInfo.symbol] += userTotalClaimed
    
    return acc
  }, {} as Record<string, number>)

  // For backward compatibility, keep totalRewards as SOL amount
  const totalRewards = totalRewardsByToken.SOL || 0

  // Data fetching functions
  const refreshData = useCallback(async (isInitialLoad: boolean = false) => {
    if (!program || !publicKey || mevStakingLoading) return

    if (isInitialLoad) {
      setInitialLoading(true)
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    try {
      // Fetch global data
      const globalDataResult = await program.getGlobalData()
      setGlobalData(globalDataResult)

      // Fetch all user stakes
      const userStakes = await program.getAllUserStakes(publicKey)
      setStakes(userStakes)

      // Fetch pool info for each supported token
      const pools: Record<string, PoolInfo> = {}
      for (const [symbol, token] of Object.entries(SUPPORTED_TOKENS)) {
        const poolInfo = await program.getPoolInfo(token.mint)
        if (poolInfo) {
          pools[symbol] = poolInfo
        }
      }
      setPoolsInfo(pools)

      if (isInitialLoad) {
        setHasInitialData(true)
      }

    } catch (error) {
      console.error("Error refreshing data:", error)
      toast.error(
        <div className="flex items-start gap-3 p-1">
          <div className="flex-shrink-0 mt-0.5">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-red-900 dark:text-red-100">
              Data Refresh Failed
            </div>
            <div className="text-sm text-red-700 dark:text-red-300 mt-1">
              Failed to refresh staking data
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              Data may be outdated. Please refresh manually.
            </div>
          </div>
        </div>
      )
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false)
        setLoading(false)
      } else {
        setRefreshing(false)
      }
    }
  }, [program, publicKey])

  // Refresh data when wallet connects (moved after refreshData declaration)
  useEffect(() => {
    if (connected && publicKey && program) {
      if (!hasInitialData) {
        refreshData(true) // Initial load
      }
      // Remove automatic background refresh on every dependency change
    } else {
      setStakes([])
      setGlobalData(null)
      setPoolsInfo({})
      setTransactions([])
      setHasInitialData(false)
    }
  }, [connected, publicKey, program, hasInitialData, refreshData])

  // Refresh data when wallet changes
  useEffect(() => {
    if (connected && publicKey && program && hasInitialData) {
      
      // Clear existing data first
      setStakes([])
      setGlobalData(null)
      setPoolsInfo({})
      setTransactions([])
      setHasInitialData(false)
      
      // Refresh data for the new wallet
      refreshData(true).catch(error => {
        console.error('Error refreshing data on wallet change:', error)
      })
    }
  }, [walletChangeTrigger, connected, publicKey, program, refreshData])

  // Manual refresh function for user-triggered refreshes
  const manualRefresh = useCallback(async () => {
    if (!program || !publicKey) return
    await refreshData(false)
  }, [refreshData, program, publicKey])

  // Generate unique transaction ID
  const generateTransactionId = (type: StakeTransaction['type'], amount: number, lockPeriod: LockPeriod): string => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    return `${type}-${amount}-${lockPeriod}-${timestamp}-${random}`
  }

  // Transaction functions
  const executeTransaction = async (
    transactionPromise: Promise<string>,
    type: StakeTransaction['type'],
    amount: number,
    lockPeriod: LockPeriod
  ): Promise<string | null> => {
    if (!program) {
      toast.error(
        <div className="flex items-start gap-3 p-1">
          <div className="flex-shrink-0 mt-0.5">
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-red-900 dark:text-red-100">
              Program Not Initialized
            </div>
            <div className="text-sm text-red-700 dark:text-red-300 mt-1">
              Please refresh the page and try again
            </div>
          </div>
        </div>
      )
      return null
    }

    // Generate unique transaction ID to prevent duplicates
    const transactionId = generateTransactionId(type, amount, lockPeriod)
    
    // Check if this transaction is already pending
    if (pendingTransactions.has(transactionId)) {
      toast.warning(
        <div className="flex items-start gap-3 p-1">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-yellow-900 dark:text-yellow-100">
              Transaction in Progress
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Please wait for the current transaction to complete
            </div>
          </div>
        </div>
      )
      return null
    }

    // Add to transactions list as pending
    const newTransaction: StakeTransaction = {
      signature: '',
      type,
      amount,
      lockPeriod,
      timestamp: new Date(),
      status: 'pending',
    }
    setTransactions(prev => [newTransaction, ...prev])

    try {
      // Add to pending transactions
      setPendingTransactions(prev => new Set(prev).add(transactionId))

      // Execute transaction
      const signature = await transactionPromise
      
      // Update transaction with signature and confirmed status
      setTransactions(prev => 
        prev.map(tx => 
          tx.timestamp.getTime() === newTransaction.timestamp.getTime()
            ? { ...tx, signature, status: 'confirmed' as const }
            : tx
        )
      )

      const explorerUrl = getTransactionExplorerUrl(signature)
      toast.success(
        <div className="flex items-start gap-3 p-1">
          <div className="flex-shrink-0 mt-0.5">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-green-900 dark:text-green-100">
              Transaction Confirmed
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 mt-1">
              {signature.slice(0, 8)}...{signature.slice(-8)}
            </div>
            <a 
              href={explorerUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
            >
              <ExternalLink className="h-3 w-3" />
              View on Explorer
            </a>
          </div>
        </div>
      )
      
      // Refresh data after successful transaction
      setTimeout(() => {
        refreshData()
      }, 2000)

      return signature
    } catch (error) {
      console.error("Transaction error:", error)
      
      // Handle specific error types
      let errorMessage = 'Unknown error'
      let isDuplicateTransaction = false
      let transactionSignature: string | null = null
      
      if (error instanceof Error) {
        errorMessage = error.message
        
        // Extract transaction signature if available
        const signatureMatch = errorMessage.match(/\(Signature: ([a-zA-Z0-9]+)\)/)
        if (signatureMatch) {
          transactionSignature = signatureMatch[1]
          errorMessage = errorMessage.replace(/ \(Signature: [a-zA-Z0-9]+\)/, '')
        }
        
        // Check for duplicate transaction error
        if (errorMessage.includes('already been processed') || 
            errorMessage.includes('duplicate') ||
            errorMessage.includes('processed')) {
          isDuplicateTransaction = true
          errorMessage = 'Transaction already processed. Please wait and try again.'
        }
      }
      
      if (isDuplicateTransaction) {
        toast.warning(
          <div className="flex items-start gap-3 p-1">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-yellow-900 dark:text-yellow-100">
                Transaction Already Processed
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Please wait and try again
              </div>
            </div>
          </div>
        )
      } else {
        const errorContent = (
          <div className="flex items-start gap-3 p-1">
            <div className="flex-shrink-0 mt-0.5">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-red-900 dark:text-red-100">
                Transaction Failed
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                {errorMessage}
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                Check your wallet or try again in a moment
              </div>
              {transactionSignature && (
                <a 
                  href={getTransactionExplorerUrl(transactionSignature)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  <ExternalLink className="h-3 w-3" />
                  View on Explorer
                </a>
              )}
            </div>
          </div>
        )
        toast.error(errorContent)
      }
      
      // Update transaction status to failed
      setTransactions(prev => 
        prev.map(tx => 
          tx.timestamp.getTime() === newTransaction.timestamp.getTime()
            ? { ...tx, status: 'failed' as const }
            : tx
        )
      )
      
      return null
    } finally {
      // Remove from pending transactions
      setPendingTransactions(prev => {
        const newSet = new Set(prev)
        newSet.delete(transactionId)
        return newSet
      })
    }
  }

  const stakeTokens = async (
    tokenSymbol: string,
    amount: number,
    lockPeriod: LockPeriod,
    referrer?: PublicKey
  ): Promise<string | null> => {
    if (!program) return null

    const token = SUPPORTED_TOKENS[tokenSymbol]
    if (!token || token.poolId === undefined) {
      toast.error(`Token ${tokenSymbol} not supported`)
      return null
    }

    try {
      const amountBN = program.parseAmount(amount, token.decimals)
      
      const transactionPromise = program.stakeTokens(
        token.mint,
        token.poolId,
        amountBN,
        lockPeriod,
        referrer
      )

      return await executeTransaction(transactionPromise, 'stake', amount, lockPeriod)
    } catch (error) {
      console.error("Stake error:", error)
      toast.error(`Failed to stake: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }

  const withdrawTokens = async (
    position: StakePosition,
    amount: number
  ): Promise<string | null> => {
    if (!program) return null

    // Find the token info
    const token = Object.values(SUPPORTED_TOKENS).find(t => 
      t.poolId === position.userStake.poolId
    )
    
    if (!token) {
      toast.error("Token not found")
      return null
    }

    try {
      const amountBN = program.parseAmount(amount, token.decimals)
      const lockPeriod = program.getLockPeriodFromTier(position.userStake)
      
      const transactionPromise = program.withdrawTokens(
        token.mint,
        position.userStake.poolId,
        amountBN,
        lockPeriod
      )

      return await executeTransaction(transactionPromise, 'withdraw', amount, lockPeriod)
    } catch (error) {
      console.error("Withdraw error:", error)
      toast.error(`Failed to withdraw: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }

  const claimRewards = async (position: StakePosition): Promise<string | null> => {
    if (!program) return null

    // Find the token info
    const token = Object.values(SUPPORTED_TOKENS).find(t => 
      t.poolId === position.userStake.poolId
    )
    
    if (!token) {
      toast.error("Token not found")
      return null
    }

    try {
      const lockPeriod = program.getLockPeriodFromTier(position.userStake)
      
      const transactionPromise = program.claimRewards(
        token.mint,
        position.userStake.poolId
      )

      return await executeTransaction(transactionPromise, 'claim', position.pendingRewards, lockPeriod)
    } catch (error) {
      console.error("Claim rewards error:", error)
      toast.error(`Failed to claim rewards: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return null
    }
  }

  // Utility functions
  const getSupportedTokens = () => SUPPORTED_TOKENS
  const getLockPeriodConfig = () => LOCK_PERIOD_CONFIG

  const formatAmount = (amount: BN, decimals: number = 9): number => {
    return program?.formatAmount(amount, decimals) || 0
  }

  const parseAmount = (amount: number, decimals: number = 9): BN => {
    return program?.parseAmount(amount, decimals) || new BN(0)
  }

  // Auto-refresh data every 30 seconds (background refresh only)
  useEffect(() => {
    if (!connected || !program || !hasInitialData) return

    const interval = setInterval(() => {
      refreshData(false) // Background refresh, no blur
    }, 300000)

    return () => clearInterval(interval)
  }, [connected, program, hasInitialData]) // Remove refreshData from dependencies

  const contextValue: AnchorStakingContextType = {
    program,
    stakes,
    globalData,
    poolsInfo,
    transactions,
    loading,
    initialLoading,
    refreshing,
    totalStaked,
    stakedByToken,
    totalRewards,
    totalRewardsByToken,
    dailyRewards,
    dailyRewardsByToken,
    totalClaimableRewards,
    claimableByToken,
    stakeTokens,
    withdrawTokens,
    claimRewards,
    refreshData,
    manualRefresh,
    getSupportedTokens,
    getLockPeriodConfig,
    formatAmount,
    parseAmount,
  }

  return (
    <AnchorStakingContext.Provider value={contextValue}>
      {children}
    </AnchorStakingContext.Provider>
  )
}

export function useAnchorStaking() {
  const context = useContext(AnchorStakingContext)
  if (!context) {
    throw new Error("useAnchorStaking must be used within an AnchorStakingProvider")
  }
  return context
}
