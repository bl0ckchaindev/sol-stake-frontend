"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { RewardEngine, type RewardCalculation } from "@/lib/reward-engine"
import { useReferral } from "./referral-provider"

export interface StakePosition {
  id: string
  tokenSymbol: string
  amount: number
  startDate: Date
  endDate: Date
  dailyReward: number
  totalRewards: number
  claimedRewards: number
  status: "active" | "completed" | "withdrawn"
  rewardCalculation?: RewardCalculation
}

interface StakingContextType {
  stakes: StakePosition[]
  totalStaked: number
  totalRewards: number
  dailyRewards: number
  totalClaimableRewards: number
  createStake: (params: { tokenSymbol: string; amount: number; lockPeriod: number }) => Promise<void>
  claimRewards: (stakeId: string) => Promise<void>
  withdrawStake: (stakeId: string) => Promise<void>
  refreshRewards: () => void
}

const StakingContext = createContext<StakingContextType | null>(null)

export function StakingProvider({ children }: { children: ReactNode }) {
  const [stakes, setStakes] = useState<StakePosition[]>([])
  const { addReferralReward } = useReferral()

  const refreshRewards = () => {
    setStakes((prevStakes) =>
      prevStakes.map((stake) => {
        if (stake.status === "active") {
          const rewardCalculation = RewardEngine.calculateRewards({
            principal: stake.amount,
            dailyRate: 0.01,
            startDate: stake.startDate,
            lockPeriodDays: 90,
            claimedRewards: stake.claimedRewards,
          })

          return {
            ...stake,
            totalRewards: rewardCalculation.totalAccruedRewards,
            dailyReward: rewardCalculation.dailyReward,
            rewardCalculation,
          }
        }
        return stake
      }),
    )
  }

  // Calculate derived values using RewardEngine
  const portfolioRewards = RewardEngine.calculatePortfolioRewards(
    stakes
      .filter((stake) => stake.status === "active")
      .map((stake) => ({
        principal: stake.amount,
        dailyRate: 0.01,
        startDate: stake.startDate,
        lockPeriodDays: 90,
        claimedRewards: stake.claimedRewards,
      })),
  )

  const totalStaked = portfolioRewards.totalStaked
  const totalRewards = portfolioRewards.totalAccruedRewards
  const dailyRewards = portfolioRewards.totalDailyRewards
  const totalClaimableRewards = portfolioRewards.totalClaimableRewards

  const createStake = async (params: { tokenSymbol: string; amount: number; lockPeriod: number }) => {
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + params.lockPeriod * 24 * 60 * 60 * 1000)

    const rewardCalculation = RewardEngine.calculateRewards({
      principal: params.amount,
      dailyRate: 0.01,
      startDate,
      lockPeriodDays: params.lockPeriod,
      claimedRewards: 0,
    })

    const newStake: StakePosition = {
      id: `stake_${Date.now()}`,
      tokenSymbol: params.tokenSymbol,
      amount: params.amount,
      startDate,
      endDate,
      dailyReward: rewardCalculation.dailyReward,
      totalRewards: 0,
      claimedRewards: 0,
      status: "active",
      rewardCalculation,
    }

    setStakes((prev) => [...prev, newStake])

    try {
      addReferralReward(params.amount)
    } catch (error) {
      console.error("Failed to add referral reward:", error)
    }
  }

  const claimRewards = async (stakeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStakes((prev) =>
      prev.map((stake) => {
        if (stake.id === stakeId && stake.status === "active") {
          const rewardCalculation = RewardEngine.calculateRewards({
            principal: stake.amount,
            dailyRate: 0.01,
            startDate: stake.startDate,
            lockPeriodDays: 90,
            claimedRewards: stake.claimedRewards,
          })

          const claimableAmount = rewardCalculation.claimableRewards

          return {
            ...stake,
            claimedRewards: stake.claimedRewards + claimableAmount,
            totalRewards: rewardCalculation.totalAccruedRewards,
            rewardCalculation: {
              ...rewardCalculation,
              claimableRewards: 0, // Reset claimable after claiming
            },
          }
        }
        return stake
      }),
    )
  }

  const withdrawStake = async (stakeId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStakes((prev) =>
      prev.map((stake) => {
        if (stake.id === stakeId && new Date() >= stake.endDate) {
          return { ...stake, status: "withdrawn" as const }
        }
        return stake
      }),
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      refreshRewards()
    }, 10000) // Update every 10 seconds for demo purposes

    return () => clearInterval(interval)
  }, [])

  // Initial reward calculation
  useEffect(() => {
    refreshRewards()
  }, [])

  return (
    <StakingContext.Provider
      value={{
        stakes,
        totalStaked,
        totalRewards,
        dailyRewards,
        totalClaimableRewards,
        createStake,
        claimRewards,
        withdrawStake,
        refreshRewards,
      }}
    >
      {children}
    </StakingContext.Provider>
  )
}

export function useStaking() {
  const context = useContext(StakingContext)
  if (!context) {
    throw new Error("useStaking must be used within a StakingProvider")
  }
  return context
}
