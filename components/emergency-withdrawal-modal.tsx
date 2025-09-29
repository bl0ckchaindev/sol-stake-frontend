"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { StakePosition } from "./staking-provider"
import { RewardEngine } from "@/lib/reward-engine"
import { AlertTriangle, Calculator } from "lucide-react"

interface EmergencyWithdrawalModalProps {
  stake: StakePosition | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (stakeId: string) => Promise<void>
}

export function EmergencyWithdrawalModal({ stake, open, onOpenChange, onConfirm }: EmergencyWithdrawalModalProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  if (!stake) return null

  const rewardCalc = RewardEngine.calculateRewards({
    principal: stake.amount,
    dailyRate: 0.01,
    startDate: stake.startDate,
    lockPeriodDays: 90,
    claimedRewards: stake.claimedRewards,
  })

  const penalty = RewardEngine.calculateEarlyWithdrawalPenalty(
    stake.amount,
    rewardCalc.daysElapsed,
    90,
    0.15, // 15% penalty
  )

  const netWithdrawal = stake.amount - penalty + rewardCalc.claimableRewards

  const handleEmergencyWithdraw = async () => {
    setIsWithdrawing(true)
    try {
      await onConfirm(stake.id)
      onOpenChange(false)
    } catch (error) {
      console.error("Emergency withdrawal failed:", error)
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Emergency Withdrawal
          </DialogTitle>
          <DialogDescription>Withdraw your stake before the lock period ends with penalty</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stake Details */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Stake Details</span>
              <Badge variant="outline">{stake.tokenSymbol}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Original Amount</div>
                <div className="font-medium">
                  {stake.amount} {stake.tokenSymbol}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Days Elapsed</div>
                <div className="font-medium">{rewardCalc.daysElapsed}/90 days</div>
              </div>
              <div>
                <div className="text-muted-foreground">Claimable Rewards</div>
                <div className="font-medium text-success">
                  {rewardCalc.claimableRewards.toFixed(4)} {stake.tokenSymbol}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Days Remaining</div>
                <div className="font-medium">{rewardCalc.daysRemaining} days</div>
              </div>
            </div>
          </div>

          {/* Penalty Calculation */}
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-4 w-4 text-warning" />
              <span className="font-semibold text-warning-foreground">Penalty Calculation</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Early Withdrawal Penalty (15%)</span>
                <span className="font-medium text-destructive">
                  -{penalty.toFixed(4)} {stake.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Claimable Rewards</span>
                <span className="font-medium text-success">
                  +{rewardCalc.claimableRewards.toFixed(4)} {stake.tokenSymbol}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Net Withdrawal Amount</span>
                <span className={netWithdrawal >= 0 ? "text-success" : "text-destructive"}>
                  {netWithdrawal.toFixed(4)} {stake.tokenSymbol}
                </span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Emergency withdrawal will incur a 15% penalty on your principal amount. This
              action cannot be undone. Consider waiting for the lock period to end to avoid penalties.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleEmergencyWithdraw} disabled={isWithdrawing} className="flex-1">
              {isWithdrawing ? "Processing..." : "Confirm Emergency Withdrawal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
