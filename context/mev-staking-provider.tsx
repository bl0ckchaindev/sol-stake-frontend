"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { MevStakingProgram } from "@/lib/anchor/program"
import { useWallet } from "./wallet-provider"

interface MevStakingContextType {
  // Program instance and connection
  program: MevStakingProgram | null
  connection: Connection | null
  
  // Loading states
  isLoading: boolean
  isInitialized: boolean
  
  // Error handling
  error: string | null
  
  // Wallet change tracking
  walletChangeTrigger: number
}

const MevStakingContext = createContext<MevStakingContextType | null>(null)

export function MevStakingProvider({ children }: { children: ReactNode }) {
  const { wallet, connected, publicKey } = useWallet()
  const [program, setProgram] = useState<MevStakingProgram | null>(null)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletChangeTrigger, setWalletChangeTrigger] = useState(0)

  // Initialize connection and program instance
  useEffect(() => {
    const initializeMevStaking = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Create connection (shared across all providers)
        const endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com"
        const conn = new Connection(endpoint, "confirmed")
        setConnection(conn)

        // Create program instance
        // Use wallet if connected, otherwise null (for read-only operations)
        const stakingProgram = new MevStakingProgram(conn, wallet || null)
        setProgram(stakingProgram)

        setIsInitialized(true)
        console.log("MevStakingProgram initialized successfully")
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize MevStakingProgram"
        console.error("Failed to initialize MevStakingProgram:", err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    initializeMevStaking()
  }, [wallet]) // Re-initialize when wallet changes

  // Update program when wallet connection status changes
  useEffect(() => {
    if (connection && isInitialized) {
      try {
        const updatedProgram = new MevStakingProgram(connection, wallet || null)
        setProgram(updatedProgram)
        console.log("MevStakingProgram updated for wallet connection change")
      } catch (err) {
        console.error("Failed to update MevStakingProgram:", err)
        setError(err instanceof Error ? err.message : "Failed to update program")
      }
    }
  }, [connected, connection, isInitialized, wallet])

  // Track wallet changes to trigger data refresh in child providers
  useEffect(() => {
    if (publicKey) {
      console.log("Wallet changed, triggering data refresh:", publicKey.toString())
      setWalletChangeTrigger(prev => prev + 1)
    }
  }, [publicKey])

  const contextValue: MevStakingContextType = {
    program,
    connection,
    isLoading,
    isInitialized,
    error,
    walletChangeTrigger
  }

  return (
    <MevStakingContext.Provider value={contextValue}>
      {children}
    </MevStakingContext.Provider>
  )
}

export function useMevStaking() {
  const context = useContext(MevStakingContext)
  if (!context) {
    throw new Error("useMevStaking must be used within a MevStakingProvider")
  }
  return context
}

// Utility hook for read-only operations (doesn't require wallet)
export function useMevStakingReadOnly() {
  const { program, connection, isLoading, isInitialized, error, walletChangeTrigger } = useMevStaking()
  
  return {
    program,
    connection,
    isLoading,
    isInitialized,
    error,
    walletChangeTrigger,
    canPerformReadOperations: !isLoading && !error && !!program && !!connection
  }
}
