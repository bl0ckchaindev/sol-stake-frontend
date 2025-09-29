"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { StakePosition } from "./staking-provider"
import { useStaking } from "./staking-provider"
import { RewardEngine } from "@/lib/reward-engine"
import { EmergencyWithdrawalModal } from "./emergency-withdrawal-modal"
import { Coins, Calendar, TrendingUp, Lock, Clock, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface StakePositionCardProps {
  stake: StakePosition
}

export function StakePositionCard({ stake }: StakePositionCardProps) {
  const { claimRewards, withdrawStake } = useStaking()
  const [claiming, setClaiming] = useState(false)
  const [withdrawing, setWithdrawing] = useState(false)
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false)

  const rewardCalc = RewardEngine.calculateRewards({
    principal: stake.amount,
    dailyRate: 0.01,
    startDate: stake.startDate,
    lockPeriodDays: 90,
    claimedRewards: stake.claimedRewards,
  })

  const isCompleted = rewardCalc.daysElapsed >= 90
  const nextRewardTime = RewardEngine.getNextRewardTime(stake.startDate)

  const handleClaimRewards = async () => {
    setClaiming(true)
    try {
      await claimRewards(stake.id)
    } finally {
      setClaiming(false)
    }
  }

  const handleWithdraw = async () => {
    setWithdrawing(true)
    try {
      await withdrawStake(stake.id)
    } finally {
      setWithdrawing(false)
    }
  }

  const handleEmergencyWithdraw = async (stakeId: string) => {
    setWithdrawing(true)
    try {
      // Simulate emergency withdrawal with penalty
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await withdrawStake(stakeId)
    } finally {
      setWithdrawing(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="font-semibold text-primary text-sm">{stake.tokenSymbol.slice(0, 2)}</span>
              </div>
              {stake.amount} {stake.tokenSymbol}
            </CardTitle>
            <Badge
              variant={stake.status === "active" ? "default" : stake.status === "completed" ? "secondary" : "outline"}
            >
              {stake.status === "active" ? "Active" : stake.status === "completed" ? "Completed" : "Withdrawn"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Lock Progress</span>
              <span className="font-medium">
                {rewardCalc.daysElapsed}/90 days ({rewardCalc.completionPercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={rewardCalc.completionPercentage} className="h-2" />
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                Daily Reward
              </div>
              <div className="font-medium">
                {rewardCalc.dailyReward.toFixed(4)} {stake.tokenSymbol}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Coins className="h-3 w-3" />
                Total Earned
              </div>
              <div className="font-medium text-success">
                {rewardCalc.totalAccruedRewards.toFixed(4)} {stake.tokenSymbol}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Days Remaining
              </div>
              <div className="font-medium">{rewardCalc.daysRemaining} days</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Lock className="h-3 w-3" />
                Claimable
              </div>
              <div className="font-medium text-success">
                {rewardCalc.claimableRewards.toFixed(4)} {stake.tokenSymbol}
              </div>
            </div>
          </div>

          {/* Next Reward Timer */}
          {stake.status === "active" && !isCompleted && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Next reward available:</span>
                <span className="font-medium text-primary">{nextRewardTime.toLocaleTimeString()}</span>
              </div>
            </div>
          )}

          {/* Projected Rewards */}
          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Projected Total:</span>
              <span className="font-medium text-success">
                {rewardCalc.projectedTotalRewards.toFixed(4)} {stake.tokenSymbol}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            {/* Primary Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClaimRewards}
                disabled={rewardCalc.claimableRewards <= 0.0001 || claiming || stake.status !== "active"}
                className="flex-1 bg-transparent"
              >
                {claiming ? "Claiming..." : `Claim ${rewardCalc.claimableRewards.toFixed(4)}`}
              </Button>

              {isCompleted && stake.status === "active" && (
                <Button size="sm" onClick={handleWithdraw} disabled={withdrawing} className="flex-1">
                  {withdrawing ? "Withdrawing..." : "Withdraw"}
                </Button>
              )}
            </div>

            {/* Emergency Withdrawal */}
            {stake.status === "active" && !isCompleted && rewardCalc.daysElapsed >= 7 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEmergencyModalOpen(true)}
                disabled={withdrawing}
                className="w-full text-warning border-warning/20 hover:bg-warning/10"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Withdrawal (15% penalty)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <EmergencyWithdrawalModal
        stake={stake}
        open={emergencyModalOpen}
        onOpenChange={setEmergencyModalOpen}
        onConfirm={handleEmergencyWithdraw}
      />
    </>
  )
}
