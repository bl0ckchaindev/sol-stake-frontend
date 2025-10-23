"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useWallet } from "./wallet-provider"
import { useMevStakingReadOnly } from "./mev-staking-provider"
import { PublicKey } from "@solana/web3.js"
import { 
  generateReferralCode, 
  validateReferralCodeFormat, 
  verifyReferralCode,
  decodeReferralCode,
  getPublicKeyFromCode,
  belongsToAddress,
  testEncodeDecode
} from "@/lib/referral-utils"

interface ReferralData {
  referralCode: string
  referredBy: string | null
  totalReferrals: number
  totalReferralRewards: number
  referralHistory: Array<{
    id: string
    referredUser: string
    stakeAmount: number
    rewardAmount: number
    timestamp: Date
  }>
}

type ReferralSharingMode = 'stakers-only' | 'all-users'

interface ReferralContextType {
  referralData: ReferralData | null
  hasActiveStakes: boolean
  isStakeChecker: boolean
  sharingMode: ReferralSharingMode
  generateReferralCode: (publicKey?: PublicKey) => string
  setReferredBy: (code: string) => void
  addReferralReward: (stakeAmount: number) => void
  getReferralLink: () => string
  getReferralAddressFromCode: (referralCode: string) => Promise<string | null>
  ensureExistingStakersHaveCodes: () => Promise<void>
  validateReferralCode: (code: string) => boolean
  checkUserStakes: () => Promise<boolean>
  canShareReferralCode: () => boolean
}

const ReferralContext = createContext<ReferralContextType | null>(null)

export function ReferralProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected } = useWallet()
  const { program, canPerformReadOperations, walletChangeTrigger } = useMevStakingReadOnly()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [hasActiveStakes, setHasActiveStakes] = useState(false)
  const [isStakeChecker, setIsStakeChecker] = useState(false)
  
  // Track processed wallets to prevent duplicate processing
  const processedWalletRef = useRef<string | null>(null)
  const isProcessingRef = useRef(false)
  
  // 🔧 CONFIGURATION: Read sharing mode from environment variable
  // Set NEXT_PUBLIC_REFERRAL_SHARING_MODE to 'stakers-only' or 'all-users'
  // Defaults to 'stakers-only' if not set or invalid value
  const getSharingModeFromEnv = (): ReferralSharingMode => {
    const envMode = process.env.NEXT_PUBLIC_REFERRAL_SHARING_MODE
    if (envMode === 'all-users' || envMode === 'stakers-only') {
      // console.log(`Referral sharing mode loaded from env: ${envMode}`)
      return envMode
    }
    // console.log(`Invalid or missing NEXT_PUBLIC_REFERRAL_SHARING_MODE, defaulting to 'all-users'`)
    return 'all-users'
  }
  
  const [sharingMode] = useState<ReferralSharingMode>(getSharingModeFromEnv())

  // Enhanced referral code generation using utility function
  const generateReferralCodeWrapper = (targetPublicKey?: PublicKey): string => {
    const key = targetPublicKey || publicKey
    if (!key) return ""
    
    return generateReferralCode(key)
  }

  // Function to find address from referral code using pure encoding/decoding
  const getReferralAddressFromCode = async (referralCode: string): Promise<string | null> => {
    if (!referralCode) return null
    
    try {
      // Use the new decoding function to get the public key
      const decodedPublicKey = decodeReferralCode(referralCode)
      
      if (decodedPublicKey) {
        return decodedPublicKey.toString()
      }
      
      return null
    } catch (error) {
      console.error('Error finding referral address:', error)
      return null
    }
  }

  // Function to check if user has active stakes and get referral data
  const checkUserStakes = async (): Promise<boolean> => {
    if (!connected || !publicKey) {
      setHasActiveStakes(false)
      setIsStakeChecker(false)
      return false
    }

    if (!program) {
      console.log("MevStakingProgram not ready for stake checking, waiting...")
      // Wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (!program) {
        console.log("MevStakingProgram still not ready, giving up")
        setHasActiveStakes(false)
        setIsStakeChecker(false)
        return false
      }
    }

    setIsStakeChecker(true)
    
    try {
      // Import SUPPORTED_TOKENS for calculations
      const { SUPPORTED_TOKENS } = await import("@/lib/anchor/types")
      
      // Get all user stakes
      const userStakes = await program.getAllUserStakes(publicKey)
      
      // Check if user has any active stakes
      const hasStakes = userStakes.length > 0
      setHasActiveStakes(hasStakes)
      
      // Calculate total referral rewards from blockchain data
      let totalReferralRewards = 0
      let totalReferrals = 0
      const referralHistory: Array<{
        id: string
        referredUser: string
        stakeAmount: number
        rewardAmount: number
        timestamp: Date
      }> = []

      userStakes.forEach((stake, index) => {
        // Find the token info for this pool to get correct decimals
        const tokenInfo = Object.values(SUPPORTED_TOKENS).find(token => 
          token.poolId === stake.userStake.poolId
        )
        const decimals = tokenInfo?.decimals || 9
        
        // Convert referral amount from lamports to actual token amount
        const referralAmount = stake.userStake.referralAmount.toNumber() / Math.pow(10, decimals)
        const referralCount = stake.userStake.referralCount
        
        totalReferralRewards += referralAmount
        totalReferrals += referralCount
        
        // Create mock referral history entries (in a real app, this would come from blockchain events)
        if (referralAmount > 0) {
          referralHistory.push({
            id: `referral_${index}_${Date.now()}`,
            referredUser: "Anonymous",
            stakeAmount: stake.userStake.totalStaked.toNumber() / Math.pow(10, decimals),
            rewardAmount: referralAmount,
            timestamp: new Date()
          })
        }
      })
      
      // Update referral data with real blockchain data
      if (referralData) {
        const updatedData = {
          ...referralData,
          totalReferrals,
          totalReferralRewards,
          referralHistory: [...referralData.referralHistory, ...referralHistory]
        }
        setReferralData(updatedData)
      }
      
      console.log(`User ${publicKey.toString()} has ${userStakes.length} active stakes, ${totalReferrals} referrals, ${totalReferralRewards.toFixed(4)} SOL in referral rewards`)
      return hasStakes
    } catch (error) {
      console.error('Error checking user stakes:', error)
      setHasActiveStakes(false)
      return false
    } finally {
      setIsStakeChecker(false)
    }
  }

  // Function to check if user can share referral code based on current mode
  const canShareReferralCode = (): boolean => {
    if (!connected || !publicKey) return false
    
    if (sharingMode === 'all-users') {
      return true // All connected users can share
    } else {
      return hasActiveStakes // Only stakers can share
    }
  }


  // Function to generate referral code for current user
  const ensureExistingStakersHaveCodes = async (): Promise<void> => {
    if (!connected || !publicKey) return
    
    console.log(`Checking referral access for ${publicKey.toString()} in mode: ${sharingMode}`)
    
    try {
      // If in stakers-only mode, try to check stakes, but don't block if it fails
      if (sharingMode === 'stakers-only') {
        try {
          const userHasStakes = await checkUserStakes()
          console.log(`User has stakes: ${userHasStakes}`)
          
          if (!userHasStakes) {
            console.log('User has no stakes, but keeping existing referral data')
            // Don't clear referral data, just return without updating
            return
          }
        } catch (stakeError) {
          console.warn('Could not check stakes, proceeding with referral code generation:', stakeError)
          // Continue with referral code generation even if stake checking fails
        }
      }
      
      // Generate referral code (either for stakers-only mode with stakes, or all-users mode)
      const newCode = generateReferralCodeWrapper()
      console.log(`Generated referral code: ${newCode}`)
      
      // Check if we already have referral data
      if (referralData && referralData.referralCode !== newCode) {
        // Update to new code if it's different
        const updatedData = {
          ...referralData,
          referralCode: newCode
        }
        setReferralData(updatedData)
        console.log(`Updated referral code for ${publicKey.toString()}: ${newCode}`)
      } else if (!referralData) {
        // Create new referral data
        const newData: ReferralData = {
          referralCode: newCode,
          referredBy: null,
          totalReferrals: 0,
          totalReferralRewards: 0,
          referralHistory: [],
        }
        setReferralData(newData)
        console.log(`Created new referral code for ${publicKey.toString()}: ${newCode}`)
      }
      
      // Always reset the stake checker state when done
      setIsStakeChecker(false)
    } catch (error) {
      console.error('Error in ensureExistingStakersHaveCodes:', error)
      // Make sure to reset the stake checker state on error
      setIsStakeChecker(false)
    }
  }

  // Validation function for referral codes
  const validateReferralCode = (code: string): boolean => {
    return validateReferralCodeFormat(code)
  }

  const setReferredBy = (code: string) => {
    if (!connected || !publicKey) return

    // Validate the referral code format
    if (!validateReferralCode(code)) {
      console.error('Invalid referral code format:', code)
      return
    }

    if (!referralData) {
      const newData: ReferralData = {
        referralCode: generateReferralCodeWrapper(),
        referredBy: code,
        totalReferrals: 0,
        totalReferralRewards: 0,
        referralHistory: [],
      }
      setReferralData(newData)
    } else {
      // Update existing data
      const updatedData = {
        ...referralData,
        referredBy: code
      }
      setReferralData(updatedData)
    }
  }

  const addReferralReward = (stakeAmount: number) => {
    if (!referralData || !publicKey) return

    const rewardAmount = stakeAmount * 0.10 // 10% referral reward
    const newReward = {
      id: `reward_${Date.now()}`,
      referredUser: "Anonymous",
      stakeAmount,
      rewardAmount,
      timestamp: new Date(),
    }

    const updatedData: ReferralData = {
      ...referralData,
      totalReferrals: referralData.totalReferrals + 1,
      totalReferralRewards: referralData.totalReferralRewards + rewardAmount,
      referralHistory: [...referralData.referralHistory, newReward],
    }

    setReferralData(updatedData)
  }

  const getReferralLink = (): string => {
    if (!referralData) return ""
    return `${window.location.origin}/dashboard?ref=${referralData.referralCode}`
  }

  // Handle wallet connection and referral code setup
  useEffect(() => {
    const walletKey = publicKey?.toString()
    
    if (connected && publicKey && walletKey && walletKey !== processedWalletRef.current && !isProcessingRef.current) {
      isProcessingRef.current = true
      processedWalletRef.current = walletKey
      
      // console.log(`Processing new wallet: ${walletKey}, sharing mode: ${sharingMode}`)

      // Check for referral code in URL
      const urlParams = new URLSearchParams(window.location.search)
      const refCode = urlParams.get("ref")

      // Generate immediate referral code
      const immediateCode = generateReferralCodeWrapper()
      const immediateData: ReferralData = {
        referralCode: immediateCode,
        referredBy: refCode || null,
        totalReferrals: 0,
        totalReferralRewards: 0,
        referralHistory: [],
      }
      setReferralData(immediateData)
      // console.log(`Generated referral code for ${walletKey}: ${immediateCode}`)

      // Try to enhance the data in the background (non-blocking)
      if (sharingMode === 'stakers-only') {
        ensureExistingStakersHaveCodes().then(() => {
          setIsStakeChecker(false)
          // console.log(`Enhanced referral data for ${walletKey}`)
        }).catch(error => {
          console.error(`Error enhancing referral data for ${walletKey}:`, error)
          setIsStakeChecker(false)
        })
      } else {
        setIsStakeChecker(false)
        // console.log(`Referral code ready for ${walletKey}`)
      }

      isProcessingRef.current = false
    } else if (!connected) {
      // console.log('Wallet disconnected, clearing referral data')
      setReferralData(null)
      setHasActiveStakes(false)
      setIsStakeChecker(false)
      processedWalletRef.current = null
      isProcessingRef.current = false
    }
  }, [connected, publicKey, sharingMode])

  // Refresh referral data when wallet changes (but not on initial load)
  useEffect(() => {
    const walletKey = publicKey?.toString()
    
    if (connected && publicKey && walletChangeTrigger > 0 && walletKey && walletKey !== processedWalletRef.current && !isProcessingRef.current) {
      isProcessingRef.current = true
      processedWalletRef.current = walletKey
      
      console.log(`Wallet changed, refreshing referral data for: ${walletKey}`)
      
      // Generate new referral code for the changed wallet
      const newCode = generateReferralCodeWrapper()
      const newData: ReferralData = {
        referralCode: newCode,
        referredBy: null,
        totalReferrals: 0,
        totalReferralRewards: 0,
        referralHistory: [],
      }
      setReferralData(newData)
      setHasActiveStakes(false)
      setIsStakeChecker(false)
      
      console.log(`Generated new referral code for changed wallet: ${newCode}`)
      isProcessingRef.current = false
    }
  }, [walletChangeTrigger]) // Only depend on walletChangeTrigger

  return (
    <ReferralContext.Provider
      value={{
        referralData,
        hasActiveStakes,
        isStakeChecker,
        sharingMode,
        generateReferralCode: generateReferralCodeWrapper,
        setReferredBy,
        addReferralReward,
        getReferralLink,
        getReferralAddressFromCode,
        ensureExistingStakersHaveCodes,
        validateReferralCode,
        checkUserStakes,
        canShareReferralCode,
      }}
    >
      {children}
    </ReferralContext.Provider>
  )
}

export function useReferral() {
  const context = useContext(ReferralContext)
  if (!context) {
    throw new Error("useReferral must be used within a ReferralProvider")
  }
  return context
}
