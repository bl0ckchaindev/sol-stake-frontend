"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/components/wallet-provider"
import { useStaking } from "@/components/staking-provider"
import { useTranslation } from "@/components/translation-context"
import { StakingModal } from "@/components/staking-modal"
import { StakePositionCard } from "@/components/stake-position-card"
import { RewardCalculator } from "./reward-calculator"
import { WithdrawalHistory } from "@/components/withdrawal-history"
import { Coins, TrendingUp, Lock, Wallet, ArrowUpRight, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useReferral } from "@/components/referral-provider"
import { MotionWrapper } from "@/components/motion-wrapper"

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
  const { t } = useTranslation()
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
      <MotionWrapper type="slideUp" delay={0.1} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.main.title')}</h1>
        <p className="text-muted-foreground">
          {connected ? t('dashboard.main.subtitle') : t('dashboard.main.subtitleDisconnected')}
        </p>
      </MotionWrapper>

      {!connected && (
        <MotionWrapper type="slideDown" delay={0.2} className="mb-8">
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="flex items-center gap-3 pt-6">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <p className="text-sm">
                <strong>{t('dashboard.main.walletNotConnected')}</strong> {t('dashboard.main.connectPrompt')}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>
      )}

      {/* Enhanced Portfolio Overview */}
      <MotionWrapper
        type="fadeIn"
        delay={0.3}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        staggerChildren={0.1}
      >
        <MotionWrapper type="scale" delay={0.1}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.stats.totalStaked')}</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {connected ? `${totalStaked.toFixed(2)} SOL` : `-- SOL`}
              </div>
              <p className="text-xs text-muted-foreground">
                {connected
                  ? `${stakes.length} ${stakes.length === 1 ? t('dashboard.stats.activePosition') : t('dashboard.stats.activePositions')}`
                  : t('dashboard.stats.connectWallet')}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper type="scale" delay={0.2}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.stats.dailyRewards')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {connected ? `${dailyRewards.toFixed(4)} SOL` : `-- SOL`}
              </div>
              <p className="text-xs text-muted-foreground">
                {dailyRate} {t('dashboard.stats.dailyRate')}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper type="scale" delay={0.3}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {connected && referralData && referralData.totalReferralRewards > 0
                  ? t('dashboard.stats.referralRewards')
                  : t('dashboard.stats.claimable')}
              </CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {connected
                  ? referralData && referralData.totalReferralRewards > 0
                    ? `${referralData.totalReferralRewards.toFixed(4)} SOL`
                    : `${totalClaimableRewards.toFixed(4)} SOL`
                  : `-- SOL`}
              </div>
              <p className="text-xs text-muted-foreground">
                {connected
                  ? referralData && referralData.totalReferralRewards > 0
                    ? t('dashboard.stats.fromReferrals')
                    : t('dashboard.stats.readyToClaim')
                  : t('dashboard.stats.connectWallet')}
              </p>
            </CardContent>
          </Card>
        </MotionWrapper>

        <MotionWrapper type="scale" delay={0.4}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.stats.totalEarned')}</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {connected ? `${totalRewards.toFixed(4)} SOL` : `-- SOL`}
              </div>
              <p className="text-xs text-muted-foreground">{t('dashboard.stats.lifetimeRewards')}</p>
            </CardContent>
          </Card>
        </MotionWrapper>
      </MotionWrapper>

      <MotionWrapper type="fadeIn" delay={0.4}>
        <Tabs defaultValue="stake" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stake">{t('dashboard.tabs.staking')}</TabsTrigger>
            <TabsTrigger value="positions">{t('dashboard.tabs.myStakes')}</TabsTrigger>
            <TabsTrigger value="history">{t('dashboard.tabs.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="stake" className="space-y-8">
            {/* Staking Options and Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MotionWrapper type="slideRight" delay={0.5}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t('dashboard.staking.availableTokens')}</CardTitle>
                    <CardDescription>
                      {t('dashboard.staking.selectToken')} {currentAPY}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tokens.map((token, index) => (
                      <MotionWrapper key={token.symbol} type="slideUp" delay={index * 0.1}>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-primary">{token.symbol.slice(0, 2)}</span>
                            </div>
                            <div>
                              <div className="font-semibold">{token.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {t('dashboard.staking.balance')}{" "}
                                {connected
                                  ? balanceLoading
                                    ? "Loading..."
                                    : `${token.balance} ${token.symbol}`
                                  : t('dashboard.stats.connectWallet')}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-2">
                              {token.apy} APY
                            </Badge>
                            <div>
                              <Button size="sm" disabled={!connected} onClick={() => handleStakeClick(token)}>
                                {!connected ? t('dashboard.staking.connectWallet') : t('dashboard.staking.stake')}
                                <ArrowUpRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </MotionWrapper>
                    ))}
                  </CardContent>
                </Card>
              </MotionWrapper>

              <MotionWrapper type="slideLeft" delay={0.6}>
                <RewardCalculator />
              </MotionWrapper>
            </div>
          </TabsContent>

          <TabsContent value="positions">
            {/* Active Stakes */}
            {connected ? (
              stakes.length > 0 ? (
                <MotionWrapper type="fadeIn" delay={0.5}>
                  <div>
                    <h2 className="text-2xl font-bold mb-6">{t('dashboard.positions.yourStakes')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stakes.map((stake, index) => (
                        <MotionWrapper key={stake.id} type="scale" delay={index * 0.1}>
                          <StakePositionCard stake={stake} />
                        </MotionWrapper>
                      ))}
                    </div>
                  </div>
                </MotionWrapper>
              ) : (
                <MotionWrapper type="scale" delay={0.5}>
                  <Card>
                    <CardContent className="text-center py-16">
                      <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-xl font-semibold mb-2">{t('dashboard.positions.noActiveStakes')}</h3>
                      <p className="text-muted-foreground mb-6">{t('dashboard.positions.startStaking')}</p>
                      <Button onClick={() => setStakingModalOpen(true)}>
                        {t('dashboard.positions.startStakingButton')}
                      </Button>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              )
            ) : (
              <MotionWrapper type="scale" delay={0.5}>
                <Card>
                  <CardContent className="text-center py-16">
                    <Wallet className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">{t('dashboard.positions.walletNotConnected')}</h3>
                    <p className="text-muted-foreground mb-6">{t('dashboard.positions.connectPrompt')}</p>
                    <Button>{t('common.header.connectWallet')}</Button>
                  </CardContent>
                </Card>
              </MotionWrapper>
            )}
          </TabsContent>

          <TabsContent value="history">
            <MotionWrapper type="fadeIn" delay={0.5}>
              <WithdrawalHistory />
            </MotionWrapper>
          </TabsContent>
        </Tabs>
      </MotionWrapper>

      <StakingModal token={selectedToken} open={stakingModalOpen} onOpenChange={setStakingModalOpen} />
    </div>
  )
}