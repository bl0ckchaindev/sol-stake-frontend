"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"

interface WalletAdapter {
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signTransaction?: (transaction: any) => Promise<any>
  signAllTransactions?: (transactions: any[]) => Promise<any[]>
}

interface WalletContextType {
  wallet: WalletAdapter | null
  connecting: boolean
  connected: boolean
  publicKey: PublicKey | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  balance: number
  walletName: string | null
  balanceLoading: boolean
}

const WalletContext = createContext<WalletContextType | null>(null)

const RPC_ENDPOINTS = [
  "https://api.devnet.solana.com", // Using devnet for development
  "https://api.mainnet-beta.solana.com",
  "https://solana-api.projectserum.com",
]

let connectionIndex = 0
const getConnection = () => {
  const endpoint = RPC_ENDPOINTS[connectionIndex % RPC_ENDPOINTS.length]
  return new Connection(endpoint, "confirmed")
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [balance, setBalance] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [walletName, setWalletName] = useState<string | null>(null)

  const detectWallet = () => {
    if (typeof window === "undefined") return null

    // Check for Phantom
    if (window.phantom?.solana?.isPhantom) {
      return {
        name: "Phantom",
        adapter: window.phantom.solana,
      }
    }

    // Check for Solflare
    if (window.solflare?.isSolflare) {
      return {
        name: "Solflare",
        adapter: window.solflare,
      }
    }

    // Check for other wallets
    if (window.solana) {
      return {
        name: "Unknown Wallet",
        adapter: window.solana,
      }
    }

    return null
  }

  const fetchBalance = async (pubKey: PublicKey, retryCount = 0) => {
    if (retryCount >= RPC_ENDPOINTS.length) {
      console.error("Failed to fetch balance from all RPC endpoints")
      setBalance(0)
      setBalanceLoading(false)
      return
    }

    setBalanceLoading(true)
    try {
      const connection = getConnection()
      console.log(
        `[v0] Attempting to fetch balance from endpoint: ${RPC_ENDPOINTS[connectionIndex % RPC_ENDPOINTS.length]}`,
      )

      const balance = await connection.getBalance(pubKey)
      const solBalance = balance / LAMPORTS_PER_SOL

      console.log(`[v0] Successfully fetched balance: ${solBalance} SOL`)
      setBalance(solBalance)
      setBalanceLoading(false)
    } catch (error) {
      console.error(`[v0] Failed to fetch balance from endpoint ${connectionIndex % RPC_ENDPOINTS.length}:`, error)

      // Try next endpoint
      connectionIndex++

      // If it's a 403 or rate limit error, try the next endpoint immediately
      if (error instanceof Error && (error.message.includes("403") || error.message.includes("429"))) {
        console.log(`[v0] Rate limited or forbidden, trying next endpoint...`)
        await fetchBalance(pubKey, retryCount + 1)
      } else {
        // For other errors, set balance to 0 but don't retry
        console.log(`[v0] Setting balance to 0 due to error`)
        setBalance(0)
        setBalanceLoading(false)
      }
    }
  }

  const connect = async () => {
    const detectedWallet = detectWallet()

    if (!detectedWallet) {
      // Redirect to wallet installation
      window.open("https://phantom.app/", "_blank")
      return
    }

    setConnecting(true)
    try {
      const response = await detectedWallet.adapter.connect()
      const pubKey = new PublicKey(response.publicKey.toString())

      setWallet(detectedWallet.adapter)
      setPublicKey(pubKey)
      setConnected(true)
      setWalletName(detectedWallet.name)

      console.log(`[v0] Wallet connected: ${pubKey.toString()}`)
      await fetchBalance(pubKey)
    } catch (error) {
      console.error("Wallet connection failed:", error)
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    if (wallet) {
      try {
        await wallet.disconnect()
      } catch (error) {
        console.error("Disconnect error:", error)
      }
    }

    setWallet(null)
    setPublicKey(null)
    setConnected(false)
    setBalance(0)
    setBalanceLoading(false)
    setWalletName(null)
  }

  useEffect(() => {
    const detectedWallet = detectWallet()
    if (detectedWallet) {
      setWallet(detectedWallet.adapter)
      setWalletName(detectedWallet.name)

      // Listen for account changes
      detectedWallet.adapter.on?.("connect", (publicKey: PublicKey) => {
        console.log(`[v0] Wallet connected via event: ${publicKey.toString()}`)
        setPublicKey(publicKey)
        setConnected(true)
        fetchBalance(publicKey)
      })

      detectedWallet.adapter.on?.("disconnect", () => {
        console.log(`[v0] Wallet disconnected via event`)
        setPublicKey(null)
        setConnected(false)
        setBalance(0)
        setBalanceLoading(false)
      })

      detectedWallet.adapter.on?.("accountChanged", (publicKey: PublicKey | null) => {
        if (publicKey) {
          console.log(`[v0] Account changed: ${publicKey.toString()}`)
          setPublicKey(publicKey)
          fetchBalance(publicKey)
        } else {
          disconnect()
        }
      })
    }

    return () => {
      // Cleanup listeners
      if (detectedWallet?.adapter.removeAllListeners) {
        detectedWallet.adapter.removeAllListeners()
      }
    }
  }, [])

  useEffect(() => {
    const autoConnect = async () => {
      const detectedWallet = detectWallet()
      if (detectedWallet?.adapter.isConnected) {
        try {
          const pubKey = detectedWallet.adapter.publicKey
          if (pubKey) {
            console.log(`[v0] Auto-connecting wallet: ${pubKey.toString()}`)
            setPublicKey(pubKey)
            setConnected(true)
            setWalletName(detectedWallet.name)
            await fetchBalance(pubKey)
          }
        } catch (error) {
          console.error("Auto-connect failed:", error)
        }
      }
    }

    autoConnect()
  }, [])

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connecting,
        connected,
        publicKey,
        connect,
        disconnect,
        balance,
        balanceLoading,
        walletName,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

declare global {
  interface Window {
    phantom?: {
      solana?: any
    }
    solflare?: any
    solana?: any
  }
}
