"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAnchorStaking } from "./anchor-staking-provider"
import { useWallet } from "./wallet-provider"
import { SUPPORTED_TOKENS } from "@/lib/anchor/types"
import { ArrowDownLeft, ArrowUpRight, Clock, TrendingUp, Coins } from "lucide-react"

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
  const { stakes, transactions, formatAmount } = useAnchorStaking()
  const { connected } = useWallet()

  // Calculate total staked amounts by token
  const getTotalStakedByToken = () => {
    const totals: Record<string, { amount: number; symbol: string; name: string; icon: string }> = {}
    
    // Initialize all supported tokens with 0
    Object.entries(SUPPORTED_TOKENS).forEach(([symbol, tokenInfo]) => {
      totals[symbol] = {
        amount: 0,
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        icon: tokenInfo.icon || "💰"
      }
    })
    
    // Calculate actual staked amounts
    stakes.forEach(stake => {
      const token = Object.values(SUPPORTED_TOKENS).find(t => t.poolId === stake.userStake.poolId)
      if (token) {
        totals[token.symbol].amount += formatAmount(stake.userStake.totalStaked, token.decimals)
      }
    })
    
    return totals
  }

  const totalStakedByToken = getTotalStakedByToken()

  if (!connected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staking Overview</CardTitle>
          <CardDescription>Connect your wallet to see your staking summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Connect your wallet to view your staking summary</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Total Staked Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            My Total Staked
          </CardTitle>
          <CardDescription>Your total staked amounts across all tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(totalStakedByToken).map(([symbol, data]) => (
              <div key={symbol} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg">{data.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{data.name}</div>
                    <div className="text-sm text-muted-foreground">{data.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {data.amount.toFixed(2)} {data.symbol}
                  </div>
                  {data.amount === 0 && (
                    <div className="text-xs text-muted-foreground">Not staked</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent staking transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Your staking transactions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.signature || transaction.timestamp.getTime()} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "claim"
                          ? "bg-success/10"
                          : transaction.type === "withdraw"
                            ? "bg-primary/10"
                            : "bg-secondary/10"
                      }`}
                    >
                      {transaction.type === "claim" ? (
                        <ArrowDownLeft className="h-5 w-5 text-success" />
                      ) : transaction.type === "withdraw" ? (
                        <ArrowUpRight className="h-5 w-5 text-primary" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-secondary" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold capitalize">
                        {transaction.type === "claim" ? "Reward Claim" : 
                         transaction.type === "withdraw" ? "Stake Withdrawal" : 
                         "Stake"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.timestamp.toLocaleDateString()} at {transaction.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.type === 'claim' ? 'text-success' : transaction.type === 'withdraw' ? 'text-primary' : 'text-secondary'}`}>
                      {transaction.type === 'claim' ? '+' : transaction.type === 'withdraw' ? '-' : '+'}
                      {transaction.amount.toFixed(2)} {Object.keys(SUPPORTED_TOKENS)[transaction.lockPeriod] || 'TOKEN'}
                    </div>
                    <Badge
                      variant={
                        transaction.status === "confirmed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
