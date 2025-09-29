"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RewardEngine } from "@/lib/reward-engine"
import { useState, useEffect } from "react"
import { Calculator, TrendingUp, Calendar, Coins } from "lucide-react"

export function RewardCalculator() {
  const [amount, setAmount] = useState("100")
  const [days, setDays] = useState("90")
  const [calculation, setCalculation] = useState<any>(null)

  useEffect(() => {
    const principal = Number.parseFloat(amount) || 0
    const lockDays = Number.parseInt(days) || 90

    if (principal > 0) {
      const startDate = new Date()
      const endDate = new Date(startDate.getTime() + lockDays * 24 * 60 * 60 * 1000)

      const rewards = RewardEngine.calculateRewards({
        principal,
        dailyRate: 0.01,
        startDate,
        lockPeriodDays: lockDays,
        claimedRewards: 0,
        currentDate: endDate, // Calculate as if at end of period
      })

      setCalculation(rewards)
    }
  }, [amount, days])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Reward Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="calc-amount">Stake Amount</Label>
            <Input
              id="calc-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc-days">Lock Period (Days)</Label>
            <Input
              id="calc-days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="90"
            />
          </div>
        </div>

        {calculation && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Daily Reward
              </div>
              <div className="text-2xl font-bold text-success">{calculation.dailyReward.toFixed(4)} SOL</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Coins className="h-4 w-4" />
                Total Rewards
              </div>
              <div className="text-2xl font-bold text-success">{calculation.projectedTotalRewards.toFixed(4)} SOL</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                APY
              </div>
              <div className="text-2xl font-bold text-primary">{RewardEngine.calculateAPY(0.01).toFixed(0)}%</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Final Amount
              </div>
              <div className="text-2xl font-bold">
                {(Number.parseFloat(amount) + calculation.projectedTotalRewards).toFixed(4)} SOL
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>Note:</strong> Calculations are based on 1% daily rewards. Actual rewards may vary based on network
            conditions and platform performance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
