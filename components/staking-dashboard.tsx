"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "./wallet-provider"
import { useStaking } from "./staking-provider"
import { useLanguage } from "./language-provider"
import { StakingModal } from "./staking-modal"
import { StakePositionCard } from "./stake-position-card"
import { RewardCalculator } from "./reward-calculator"
import { WithdrawalHistory } from "./withdrawal-history"
import { Coins, TrendingUp, Lock, Wallet, ArrowUpRight, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useReferral } from "./referral-provider"

interface Token {
  symbol: string
  name: string
  balance: number
  apy: string
}

export function StakingDashboard() {
  const { connected, balance, balanceLoading } = useWallet()
  const { stakes, totalStaked, totalRewards, dailyRewards, totalClaimableRewards } = useStaking()
  const { referralData } = useReferral()
  const { t } = useLanguage()
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [stakingModalOpen, setStakingModalOpen] = useState(false)

  const currentAPY = "287%" // This would be fetched from MEV bot performance API
  const dailyRate = "0.79%" // Dynamic daily rate based on bot performance

  const tokens: Token[] = [
    { symbol: "SOL", name: "Solana", balance: balance, apy: currentAPY },
    { symbol: "USDC", name: "USD Coin", balance: 0, apy: currentAPY },
    { symbol: "USDT", name: "Tether", balance: 0, apy: currentAPY },
    { symbol: "BONK", name: "Bonk", balance: 0, apy: currentAPY },
  ]

  const handleStakeClick = (token: Token) => {
    if (!connected) {
      // Show wallet connection prompt
      return
    }
    setSelectedToken(token)
    setStakingModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">
          {connected ? t("dashboard.subtitle") : t("dashboard.subtitleDisconnected")}
        </p>
      </div>

      {!connected && (
        <Card className="mb-8 border-warning/50 bg-warning/5">
          <CardContent className="flex items-center gap-3 pt-6">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <p className="text-sm">
              <strong>{t("dashboard.walletNotConnected")}</strong> {t("dashboard.connectPrompt")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.totalStaked")}</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connected ? `${totalStaked.toFixed(2)} ${t("common.sol")}` : `-- ${t("common.sol")}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {connected
                ? `${stakes.length} ${stakes.length === 1 ? t("stats.activePosition") : t("stats.activePositions")}`
                : t("stats.connectWallet")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.dailyRewards")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {connected ? `${dailyRewards.toFixed(4)} ${t("common.sol")}` : `-- ${t("common.sol")}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {dailyRate} {t("stats.dailyRate")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("stats.totalEarned")}</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {connected ? `${totalRewards.toFixed(4)} ${t("common.sol")}` : `-- ${t("common.sol")}`}
            </div>
            <p className="text-xs text-muted-foreground">{t("stats.lifetimeRewards")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {connected && referralData && referralData.totalReferralRewards > 0
                ? t("stats.referralRewards")
                : t("stats.claimable")}
            </CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {connected
                ? referralData && referralData.totalReferralRewards > 0
                  ? `${referralData.totalReferralRewards.toFixed(4)} ${t("common.sol")}`
                  : `${totalClaimableRewards.toFixed(4)} ${t("common.sol")}`
                : `-- ${t("common.sol")}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {connected
                ? referralData && referralData.totalReferralRewards > 0
                  ? t("stats.fromReferrals")
                  : t("stats.readyToClaim")
                : t("stats.connectWallet")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stake" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stake">{t("tabs.staking")}</TabsTrigger>
          <TabsTrigger value="positions">{t("tabs.myStakes")}</TabsTrigger>
          <TabsTrigger value="history">{t("tabs.history")}</TabsTrigger>
        </TabsList>

        <TabsContent value="stake" className="space-y-8">
          {/* Staking Options and Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t("staking.availableTokens")}</CardTitle>
                <CardDescription>
                  {t("staking.selectToken")} {currentAPY}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tokens.map((token) => (
                  <div key={token.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary">{token.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{token.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {t("staking.balance")}{" "}
                          {connected
                            ? balanceLoading
                              ? "Loading..."
                              : `${token.balance} ${token.symbol}`
                            : t("stats.connectWallet")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2">
                        {token.apy} {t("common.apy")}
                      </Badge>
                      <div>
                        <Button size="sm" disabled={!connected} onClick={() => handleStakeClick(token)}>
                          {!connected ? t("staking.connectWallet") : t("staking.stake")}
                          <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <RewardCalculator />
          </div>
        </TabsContent>

        <TabsContent value="positions">
          {/* Active Stakes */}
          {connected ? (
            stakes.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">{t("positions.yourStakes")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stakes.map((stake) => (
                    <StakePositionCard key={stake.id} stake={stake} />
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">{t("positions.noActiveStakes")}</h3>
                  <p className="text-muted-foreground mb-6">{t("positions.startStaking")}</p>
                  <Button onClick={() => document.querySelector('[data-state="active"][value="stake"]')?.click()}>
                    {t("positions.startStakingButton")}
                  </Button>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">{t("positions.walletNotConnected")}</h3>
                <p className="text-muted-foreground mb-6">{t("positions.connectPrompt")}</p>
                <Button>{t("common.connectWallet")}</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <WithdrawalHistory />
        </TabsContent>
      </Tabs>

      <StakingModal token={selectedToken} open={stakingModalOpen} onOpenChange={setStakingModalOpen} />
    </div>
  )
}
