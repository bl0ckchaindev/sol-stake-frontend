"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor"
import { useWallet } from "./wallet-provider"
import { MevStakingProgram } from "@/lib/anchor/program"
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

interface AnchorStakingContextType {
  // Program instance
  program: MevStakingProgram | null
  
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
  totalRewards: number
  dailyRewards: number
  totalClaimableRewards: number
  
  // Actions
  stakeTokens: (tokenSymbol: string, amount: number, lockPeriod: LockPeriod, referrer?: PublicKey) => Promise<string | null>
  withdrawTokens: (position: StakePosition, amount: number) => Promise<string | null>
  claimRewards: (position: StakePosition) => Promise<string | null>
  
  // Data fetching
  refreshData: () => Promise<void>
  
  // Utilities
  getSupportedTokens: () => typeof SUPPORTED_TOKENS
  getLockPeriodConfig: () => typeof LOCK_PERIOD_CONFIG
  formatAmount: (amount: BN, decimals?: number) => number
  parseAmount: (amount: number, decimals?: number) => BN
}

const AnchorStakingContext = createContext<AnchorStakingContextType | null>(null)

// RPC endpoints for better reliability
const RPC_ENDPOINTS = [
  process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com",
  "https://api.devnet.solana.com",
  "https://devnet.genesysgo.net",
]

export function AnchorStakingProvider({ children }: { children: ReactNode }) {
  const { wallet, connected, publicKey } = useWallet()
  
  // State
  const [program, setProgram] = useState<MevStakingProgram | null>(null)
  const [stakes, setStakes] = useState<StakePosition[]>([])
  const [globalData, setGlobalData] = useState<GlobalData | null>(null)
  const [poolsInfo, setPoolsInfo] = useState<Record<string, PoolInfo>>({})
  const [transactions, setTransactions] = useState<StakeTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasInitialData, setHasInitialData] = useState(false)
  const [connection, setConnection] = useState<Connection | null>(null)

  // Initialize connection and program
  useEffect(() => {
    const initializeConnection = () => {
      try {
        const conn = new Connection(RPC_ENDPOINTS[0], "confirmed")
        setConnection(conn)
        
        if (wallet) {
          const stakingProgram = new MevStakingProgram(conn, wallet)
          setProgram(stakingProgram)
        }
      } catch (error) {
        console.error("Failed to initialize connection:", error)
        toast.error("Failed to connect to Solana network")
      }
    }

    initializeConnection()
  }, [wallet])

  // Refresh data when wallet connects
  useEffect(() => {
    if (connected && publicKey && program) {
      console.log('log->connected', connected)
      if (!hasInitialData) {
        refreshData(true) // Initial load
      } else {
        refreshData(false) // Background refresh
      }
    } else {
      setStakes([])
      setGlobalData(null)
      setPoolsInfo({})
      setTransactions([])
      setHasInitialData(false)
    }
  }, [connected, publicKey, program, hasInitialData])

  // Computed values
  const totalStaked = stakes.reduce((sum, stake) => {
    return sum + program!.formatAmount(stake.userStake.totalStaked)
  }, 0)

  const totalRewards = stakes.reduce((sum, stake) => {
    return sum + stake.pendingRewards
  }, 0)

  const dailyRewards = stakes.reduce((sum, stake) => {
    const stakeAmount = program!.formatAmount(stake.userStake.totalStaked)
    const dailyRate = stake.apy / 365 / 100
    return sum + (stakeAmount * dailyRate)
  }, 0)

  const totalClaimableRewards = stakes.reduce((sum, stake) => {
    return sum + stake.pendingRewards
  }, 0)

  // Data fetching functions
  const refreshData = useCallback(async (isInitialLoad: boolean = false) => {
    if (!program || !publicKey) return

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
      toast.error("Failed to refresh staking data")
    } finally {
      if (isInitialLoad) {
        setInitialLoading(false)
        setLoading(false)
      } else {
        setRefreshing(false)
      }
    }
  }, [program, publicKey])

  // Transaction functions
  const executeTransaction = async (
    transactionPromise: Promise<string>,
    type: StakeTransaction['type'],
    amount: number,
    lockPeriod: LockPeriod
  ): Promise<string | null> => {
    if (!program) {
      toast.error("Program not initialized")
      return null
    }

    try {
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

      toast.success(`Transaction confirmed: ${signature.slice(0, 8)}...`)
      
      // Refresh data after successful transaction
      setTimeout(() => {
        refreshData()
      }, 2000)

      return signature
    } catch (error) {
      console.error("Transaction error:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.error(`Transaction failed: ${errorMessage}`)
      
      // Update transaction status to failed
      setTransactions(prev => 
        prev.map(tx => 
          tx.timestamp.getTime() === Date.now() 
            ? { ...tx, status: 'failed' as const }
            : tx
        )
      )
      
      return null
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
    }, 30000)

    return () => clearInterval(interval)
  }, [connected, program, hasInitialData, refreshData])

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
    totalRewards,
    dailyRewards,
    totalClaimableRewards,
    stakeTokens,
    withdrawTokens,
    claimRewards,
    refreshData,
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
