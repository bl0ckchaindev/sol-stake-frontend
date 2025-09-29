"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStaking } from "./staking-provider"
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react"

interface WithdrawalRecord {
  id: string
  type: "reward_claim" | "stake_withdrawal" | "emergency_withdrawal"
  amount: number
  tokenSymbol: string
  timestamp: Date
  stakeId: string
  status: "completed" | "pending" | "failed"
}

export function WithdrawalHistory() {
  const { stakes } = useStaking()

  // Generate mock withdrawal history based on stakes
  const withdrawalHistory: WithdrawalRecord[] = stakes
    .filter((stake) => stake.claimedRewards > 0 || stake.status === "withdrawn")
    .flatMap((stake) => {
      const records: WithdrawalRecord[] = []

      // Add reward claims
      if (stake.claimedRewards > 0) {
        records.push({
          id: `claim_${stake.id}`,
          type: "reward_claim",
          amount: stake.claimedRewards,
          tokenSymbol: stake.tokenSymbol,
          timestamp: new Date(stake.startDate.getTime() + 24 * 60 * 60 * 1000), // Mock: 1 day after start
          stakeId: stake.id,
          status: "completed",
        })
      }

      // Add stake withdrawal
      if (stake.status === "withdrawn") {
        records.push({
          id: `withdraw_${stake.id}`,
          type: "stake_withdrawal",
          amount: stake.amount,
          tokenSymbol: stake.tokenSymbol,
          timestamp: stake.endDate,
          stakeId: stake.id,
          status: "completed",
        })
      }

      return records
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  if (withdrawalHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>Your withdrawal and claim history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ArrowDownLeft className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No withdrawals yet</p>
            <p className="text-sm">Start staking to see your withdrawal history</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>Track all your withdrawals and reward claims</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {withdrawalHistory.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    record.type === "reward_claim"
                      ? "bg-success/10"
                      : record.type === "stake_withdrawal"
                        ? "bg-primary/10"
                        : "bg-warning/10"
                  }`}
                >
                  {record.type === "reward_claim" ? (
                    <ArrowDownLeft className="h-5 w-5 text-success" />
                  ) : record.type === "stake_withdrawal" ? (
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                  ) : (
                    <Clock className="h-5 w-5 text-warning" />
                  )}
                </div>
                <div>
                  <div className="font-semibold">
                    {record.type === "reward_claim"
                      ? "Reward Claim"
                      : record.type === "stake_withdrawal"
                        ? "Stake Withdrawal"
                        : "Emergency Withdrawal"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {record.timestamp.toLocaleDateString()} at {record.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-success">
                  +{record.amount.toFixed(4)} {record.tokenSymbol}
                </div>
                <Badge
                  variant={
                    record.status === "completed"
                      ? "default"
                      : record.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {record.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
