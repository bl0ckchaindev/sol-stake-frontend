"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "./wallet-provider"

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

interface ReferralContextType {
  referralData: ReferralData | null
  generateReferralCode: () => string
  setReferredBy: (code: string) => void
  addReferralReward: (stakeAmount: number) => void
  getReferralLink: () => string
}

const ReferralContext = createContext<ReferralContextType | null>(null)

export function ReferralProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected } = useWallet()
  const [referralData, setReferralData] = useState<ReferralData | null>(null)

  const generateReferralCode = (): string => {
    if (!publicKey) return ""
    return publicKey.toString().slice(0, 8).toUpperCase()
  }

  const setReferredBy = (code: string) => {
    if (!connected || !publicKey) return

    const stored = localStorage.getItem(`referral_${publicKey.toString()}`)
    if (!stored) {
      const newData: ReferralData = {
        referralCode: generateReferralCode(),
        referredBy: code,
        totalReferrals: 0,
        totalReferralRewards: 0,
        referralHistory: [],
      }
      setReferralData(newData)
      localStorage.setItem(`referral_${publicKey.toString()}`, JSON.stringify(newData))
    }
  }

  const addReferralReward = (stakeAmount: number) => {
    if (!referralData || !publicKey) return

    const rewardAmount = stakeAmount * 0.01 // 1% referral reward
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
    localStorage.setItem(`referral_${publicKey.toString()}`, JSON.stringify(updatedData))
  }

  const getReferralLink = (): string => {
    if (!referralData) return ""
    return `${window.location.origin}?ref=${referralData.referralCode}`
  }

  useEffect(() => {
    if (connected && publicKey) {
      const stored = localStorage.getItem(`referral_${publicKey.toString()}`)
      if (stored) {
        const data = JSON.parse(stored)
        // Convert timestamp strings back to Date objects
        data.referralHistory = data.referralHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setReferralData(data)
      } else {
        // Check for referral code in URL
        const urlParams = new URLSearchParams(window.location.search)
        const refCode = urlParams.get("ref")

        const newData: ReferralData = {
          referralCode: generateReferralCode(),
          referredBy: refCode,
          totalReferrals: 0,
          totalReferralRewards: 0,
          referralHistory: [],
        }
        setReferralData(newData)
        localStorage.setItem(`referral_${publicKey.toString()}`, JSON.stringify(newData))
      }
    } else {
      setReferralData(null)
    }
  }, [connected, publicKey])

  return (
    <ReferralContext.Provider
      value={{
        referralData,
        generateReferralCode,
        setReferredBy,
        addReferralReward,
        getReferralLink,
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
