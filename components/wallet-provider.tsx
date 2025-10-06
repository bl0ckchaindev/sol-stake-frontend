"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token"
import { SUPPORTED_TOKENS } from "@/lib/anchor/types"
import { toast } from "sonner"

interface WalletAdapter {
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  isConnected?: boolean
  connect: () => Promise<any>
  disconnect: () => Promise<void>
  signTransaction?: (transaction: any) => Promise<any>
  signAllTransactions?: (transactions: any[]) => Promise<any[]>
  on?: (event: string, callback: (...args: any[]) => void) => void
  removeAllListeners?: () => void
}

interface TokenBalance {
  symbol: string
  balance: number
  decimals: number
}

interface DetectedWallet {
  name: string
  adapter: WalletAdapter
  icon: string
  downloadUrl: string
}

interface WalletContextType {
  wallet: WalletAdapter | null
  connecting: boolean
  connected: boolean
  publicKey: PublicKey | null
  connect: (walletName?: string) => Promise<void>
  disconnect: () => Promise<void>
  balance: number
  tokenBalances: Record<string, number>
  walletName: string | null
  balanceLoading: boolean
  tokenBalanceLoading: boolean
  detectedWallets: DetectedWallet[]
  availableWallets: DetectedWallet[]
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
  const [tokenBalances, setTokenBalances] = useState<Record<string, number>>({})
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(false)
  const [walletName, setWalletName] = useState<string | null>(null)
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([])
  const [availableWallets, setAvailableWallets] = useState<DetectedWallet[]>([])

  const detectAllWallets = (): { detected: DetectedWallet[], available: DetectedWallet[] } => {
    if (typeof window === "undefined") return { detected: [], available: [] }

    const detected: DetectedWallet[] = []
    const available: DetectedWallet[] = []

    // Phantom Wallet
    if (window.phantom?.solana?.isPhantom) {
      detected.push({
        name: "Phantom",
        adapter: window.phantom.solana,
        icon: "👻",
        downloadUrl: "https://phantom.app/"
      })
    } else {
      available.push({
        name: "Phantom",
        adapter: null as any,
        icon: "👻",
        downloadUrl: "https://phantom.app/"
      })
    }

    // Solflare Wallet
    if (window.solflare?.isSolflare) {
      detected.push({
        name: "Solflare",
        adapter: window.solflare,
        icon: "☀️",
        downloadUrl: "https://solflare.com/"
      })
    } else {
      available.push({
        name: "Solflare",
        adapter: null as any,
        icon: "☀️",
        downloadUrl: "https://solflare.com/"
      })
    }

    // Backpack Wallet
    if (window.backpack?.isBackpack) {
      detected.push({
        name: "Backpack",
        adapter: window.backpack,
        icon: "🎒",
        downloadUrl: "https://backpack.app/"
      })
    } else {
      available.push({
        name: "Backpack",
        adapter: null as any,
        icon: "🎒",
        downloadUrl: "https://backpack.app/"
      })
    }

    // MetaMask Wallet
    if (window.ethereum?.isMetaMask) {
      detected.push({
        name: "MetaMask",
        adapter: {
          publicKey: null,
          connected: false,
          connecting: false,
          connect: async () => window.ethereum?.request?.({ method: 'eth_requestAccounts' }),
          disconnect: async () => {},
          ...window.ethereum
        } as any,
        icon: "🦊",
        downloadUrl: "https://metamask.io/"
      })
    } else {
      available.push({
        name: "MetaMask",
        adapter: null as any,
        icon: "🦊",
        downloadUrl: "https://metamask.io/"
      })
    }

    // Coinbase Wallet
    if (window.ethereum?.isCoinbaseWallet) {
      detected.push({
        name: "Coinbase Wallet",
        adapter: {
          publicKey: null,
          connected: false,
          connecting: false,
          connect: async () => window.ethereum?.request?.({ method: 'eth_requestAccounts' }),
          disconnect: async () => {},
          ...window.ethereum
        } as any,
        icon: "🔵",
        downloadUrl: "https://wallet.coinbase.com/"
      })
    } else {
      available.push({
        name: "Coinbase Wallet",
        adapter: null as any,
        icon: "🔵",
        downloadUrl: "https://wallet.coinbase.com/"
      })
    }

    // Trust Wallet
    if (window.ethereum?.isTrust) {
      detected.push({
        name: "Trust Wallet",
        adapter: {
          publicKey: null,
          connected: false,
          connecting: false,
          connect: async () => window.ethereum?.request?.({ method: 'eth_requestAccounts' }),
          disconnect: async () => {},
          ...window.ethereum
        } as any,
        icon: "🔐",
        downloadUrl: "https://trustwallet.com/"
      })
    } else {
      available.push({
        name: "Trust Wallet",
        adapter: null as any,
        icon: "🔐",
        downloadUrl: "https://trustwallet.com/"
      })
    }

    // WalletConnect
    available.push({
      name: "WalletConnect",
      adapter: null as any,
      icon: "🔗",
      downloadUrl: "https://walletconnect.com/"
    })

    // Sollet Wallet
    if (window.sollet) {
      detected.push({
        name: "Sollet",
        adapter: window.sollet,
        icon: "🔗",
        downloadUrl: "https://www.sollet.io/"
      })
    }

    // Generic Solana wallet
    if (window.solana && !detected.find(w => w.adapter === window.solana)) {
      detected.push({
        name: "Unknown Wallet",
        adapter: window.solana,
        icon: "🔷",
        downloadUrl: ""
      })
    }

    return { detected, available }
  }

  const detectWallet = (walletName?: string): DetectedWallet | null => {
    const { detected } = detectAllWallets()
    
    if (walletName) {
      return detected.find(w => w.name.toLowerCase() === walletName.toLowerCase()) || null
    }
    
    // Return first detected wallet for backward compatibility
    return detected.length > 0 ? detected[0] : null
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

  const fetchTokenBalances = async (pubKey: PublicKey) => {
    setTokenBalanceLoading(true)
    const balances: Record<string, number> = {}
    
    try {
      const connection = getConnection()
      
      for (const [symbol, tokenInfo] of Object.entries(SUPPORTED_TOKENS)) {
        if (symbol === "SOL") {
          // SOL balance is already fetched separately
          continue
        }
        
        try {
          // Get the associated token address
          const ata = await getAssociatedTokenAddress(tokenInfo.mint, pubKey)
          
          // Get the token account
          const tokenAccount = await getAccount(connection, ata)
          
          // Convert to human-readable format
          const balance = Number(tokenAccount.amount) / Math.pow(10, tokenInfo.decimals)
          balances[symbol] = balance
          
          console.log(`[v0] Token ${symbol} balance: ${balance}`)
        } catch (error) {
          // Token account doesn't exist or other error
          balances[symbol] = 0
          console.log(`[v0] Token ${symbol} balance: 0 (no account or error)`)
        }
      }
      
      setTokenBalances(balances)
      setTokenBalanceLoading(false)
    } catch (error) {
      console.error("[v0] Failed to fetch token balances:", error)
      setTokenBalances({})
      setTokenBalanceLoading(false)
    }
  }

  const connect = async (walletName?: string) => {
    const detectedWallet = detectWallet(walletName)

    if (!detectedWallet) {
      console.error(`[v0] Wallet ${walletName || 'default'} not detected`)
      toast.error(`Wallet ${walletName || 'default'} not detected`)
      return
    }

    setConnecting(true)
    try {
      const response = await detectedWallet.adapter.connect()
      const pubKey = new PublicKey(response?.publicKey?.toString() || detectedWallet.adapter.publicKey?.toString() || '')

      setWallet(detectedWallet.adapter)
      setPublicKey(pubKey)
      setConnected(true)
      setWalletName(detectedWallet.name)

      console.log(`[v0] Wallet connected: ${pubKey.toString()}`)
      // Don't show toast here - let the event listener handle it to avoid duplicates
      
      await Promise.all([
        fetchBalance(pubKey),
        fetchTokenBalances(pubKey)
      ])
    } catch (error) {
      console.error("Wallet connection failed:", error)
      toast.error(`Failed to connect ${detectedWallet.name} wallet`)
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    if (wallet) {
      try {
        await wallet.disconnect()
        // Don't show toast here - let the event listener handle it
      } catch (error) {
        console.error("Disconnect error:", error)
        toast.error("Failed to disconnect wallet")
      }
    }

    setWallet(null)
    setPublicKey(null)
    setConnected(false)
    setBalance(0)
    setTokenBalances({})
    setBalanceLoading(false)
    setTokenBalanceLoading(false)
    setWalletName(null)
  }

  useEffect(() => {
    // Detect all available wallets
    const { detected, available } = detectAllWallets()
    setDetectedWallets(detected)
    setAvailableWallets(available)

    // Set up event listeners for all detected wallets
    detected.forEach(detectedWallet => {
      if (detectedWallet.adapter.on) {
        // Listen for account changes
        detectedWallet.adapter.on("connect", (publicKey: PublicKey) => {
          console.log(`[v0] Wallet ${detectedWallet.name} connected via event: ${publicKey.toString()}`)
          setPublicKey(publicKey)
          setConnected(true)
          setWallet(detectedWallet.adapter)
          setWalletName(detectedWallet.name)
          toast.success(`${detectedWallet.name} wallet connected!`)
          Promise.all([
            fetchBalance(publicKey),
            fetchTokenBalances(publicKey)
          ])
        })

        detectedWallet.adapter.on("disconnect", () => {
          console.log(`[v0] Wallet ${detectedWallet.name} disconnected via event`)
          setPublicKey(null)
          setConnected(false)
          setWallet(null)
          setWalletName(null)
          setBalance(0)
          setTokenBalances({})
          setBalanceLoading(false)
          setTokenBalanceLoading(false)
          toast.success(`${detectedWallet.name} wallet disconnected!`)
        })

        detectedWallet.adapter.on("accountChanged", (publicKey: PublicKey | null) => {
          if (publicKey) {
            console.log(`[v0] Account changed in ${detectedWallet.name}: ${publicKey.toString()}`)
            setPublicKey(publicKey)
            Promise.all([
              fetchBalance(publicKey),
              fetchTokenBalances(publicKey)
            ])
          } else {
            disconnect()
          }
        })
      }
    })

    return () => {
      // Cleanup listeners for all wallets
      detected.forEach(detectedWallet => {
        if (detectedWallet.adapter.removeAllListeners) {
          detectedWallet.adapter.removeAllListeners()
        }
      })
    }
  }, [])

  // Check if any wallet is already connected on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      const { detected } = detectAllWallets()
      
      for (const detectedWallet of detected) {
        if (detectedWallet.adapter.isConnected && detectedWallet.adapter.publicKey) {
          console.log(`[v0] Found existing connection: ${detectedWallet.name}`)
          setPublicKey(detectedWallet.adapter.publicKey)
          setConnected(true)
          setWallet(detectedWallet.adapter)
          setWalletName(detectedWallet.name)
          await Promise.all([
            fetchBalance(detectedWallet.adapter.publicKey),
            fetchTokenBalances(detectedWallet.adapter.publicKey)
          ])
          break // Only connect to the first connected wallet
        }
      }
    }

    checkExistingConnection()
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
        tokenBalances,
        balanceLoading,
        tokenBalanceLoading,
        walletName,
        detectedWallets,
        availableWallets,
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
    backpack?: any
    sollet?: any
    ethereum?: {
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      isTrust?: boolean
      request?: (params: any) => Promise<any>
      on?: (event: string, callback: (...args: any[]) => void) => void
      removeAllListeners?: () => void
    }
  }
}
