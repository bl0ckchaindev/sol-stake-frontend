"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "./wallet-provider"
import { useStaking } from "./staking-provider"
import { Lock, AlertCircle } from "lucide-react"

interface Token {
  symbol: string
  name: string
  balance: number
  apy: string
}

interface StakingModalProps {
  token: Token | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StakingModal({ token, open, onOpenChange }: StakingModalProps) {
  const [amount, setAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const { connected } = useWallet()
  const { createStake } = useStaking()

  if (!token) return null

  const handleStake = async () => {
    if (!connected || !amount || Number.parseFloat(amount) <= 0) return

    setIsStaking(true)
    try {
      await createStake({
        tokenSymbol: token.symbol,
        amount: Number.parseFloat(amount),
        lockPeriod: 90,
      })
      setAmount("")
      onOpenChange(false)
    } catch (error) {
      console.error("Staking failed:", error)
    } finally {
      setIsStaking(false)
    }
  }

  const maxAmount = token.balance
  const dailyReward = Number.parseFloat(amount || "0") * 0.01
  const totalReward = dailyReward * 90

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="font-semibold text-primary text-sm">{token.symbol.slice(0, 2)}</span>
            </div>
            Stake {token.name}
          </DialogTitle>
          <DialogDescription>Lock your {token.symbol} for 90 days and earn 1% daily rewards</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Stake</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-20"
                max={maxAmount}
                step="0.01"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {token.symbol}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Available: {maxAmount} {token.symbol}
              </span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-primary"
                onClick={() => setAmount(maxAmount.toString())}
              >
                Max
              </Button>
            </div>
          </div>

          {/* Staking Details */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lock className="h-4 w-4 text-primary" />
              Staking Details
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Lock Period</div>
                <div className="font-medium">90 days</div>
              </div>
              <div>
                <div className="text-muted-foreground">Daily Rate</div>
                <div className="font-medium text-success">1.00%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Daily Reward</div>
                <div className="font-medium">
                  {dailyReward.toFixed(4)} {token.symbol}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Total Reward</div>
                <div className="font-medium text-success">
                  {totalReward.toFixed(4)} {token.symbol}
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-warning-foreground">Important Notice</div>
              <div className="text-muted-foreground mt-1">
                Your tokens will be locked for 90 days. You can withdraw rewards daily, but principal amount remains
                locked until the end of the period.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleStake}
              disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > maxAmount || isStaking}
              className="flex-1"
            >
              {isStaking ? "Staking..." : `Stake ${token.symbol}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
