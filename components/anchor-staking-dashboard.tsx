"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/components/wallet-provider"
import { useAnchorStaking } from "@/components/anchor-staking-provider"
import { useTranslation } from "@/components/translation-context"
import { StakingCard } from "@/components/staking-card"
import { WithdrawalHistory } from "@/components/withdrawal-history"
import { Coins, TrendingUp, Lock, Wallet, AlertTriangle, Loader2 } from "lucide-react"
import { useReferral } from "@/components/referral-provider"
import { MotionWrapper } from "@/components/motion-wrapper"
import { SUPPORTED_TOKENS } from "@/lib/anchor/types"
import { BN } from "@coral-xyz/anchor"

export function AnchorStakingDashboard() {
  const { connected, balance, tokenBalances, balanceLoading, tokenBalanceLoading } = useWallet()
  const { 
    stakes, 
    totalStaked, 
    totalRewards, 
    dailyRewards, 
    totalClaimableRewards,
    loading,
    initialLoading,
    refreshing,
    globalData,
    poolsInfo
  } = useAnchorStaking()
  const { referralData } = useReferral()
  const { t } = useTranslation()

  // Calculate current APY based on global data
  const getCurrentAPY = () => {
    if (!globalData) return "0"
    
    // Use the highest tier reward rate for display
    const maxRate = Math.max(
      globalData.tier0Reward,
      globalData.tier1Reward,
      globalData.tier2Reward,
      globalData.tier3Reward,
      globalData.tier4Reward
    )
    
    const dailyRate = maxRate / 10000 // Convert from basis points
    const annualRate = dailyRate * 365 * 100
    return annualRate.toFixed(1)
  }

  const currentAPY = getCurrentAPY()
  const dailyRate = globalData ? (globalData.tier0Reward / 10000 * 100).toFixed(2) : "0"

  // Get user's stake for each token
  const getUserStakeForToken = (tokenSymbol: string) => {
    return stakes.find(stake => {
      const token = Object.values(SUPPORTED_TOKENS).find(t => t.poolId === stake.userStake.poolId)
      return token?.symbol === tokenSymbol
    })
  }

  // Get pool info for each token
  const getPoolInfoForToken = (tokenSymbol: string) => {
    const tokenInfo = SUPPORTED_TOKENS[tokenSymbol]
    if (!tokenInfo) return undefined
    // Return a default pool info with 0 values if pool doesn't exist
    if (!poolsInfo[tokenSymbol]) {
      return {
        poolId: tokenInfo.poolId || 0,
        tokenMint: tokenInfo.mint,
        totalContributed: new BN(0),
        totalStaked: new BN(0),
        totalRewardsDistributed: new BN(0),
        totalReferralFee: new BN(0),
        isActive: true,
        bump: 0,
        createdAt: new BN(0)
      }
    }
    return poolsInfo[tokenSymbol]
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <MotionWrapper type="slideUp" delay={0.1} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('dashboard.main.title')}</h1>
        <p className="text-muted-foreground">
          {connected ? t('dashboard.main.subtitle') : t('dashboard.main.subtitleDisconnected')}
        </p>
      </MotionWrapper>

      {/* {!connected && (
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
      )} */}

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
                {dailyRate}% {t('dashboard.stats.dailyRate')}
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
                  : t('dashboard.stats.readyToClaim')}
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
        <Tabs defaultValue="staking" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="history">{t('dashboard.tabs.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="staking" className="space-y-8">
            {/* Overall Statistics */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MotionWrapper type="scale" delay={0.1}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Staked</p>
                        <p className="text-2xl font-bold">
                          {connected ? `$${(totalStaked * 100).toFixed(2)}` : '$0.00'}
                        </p>
                      </div>
                      <Coins className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>

              <MotionWrapper type="scale" delay={0.2}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Daily Rewards</p>
                        <p className="text-2xl font-bold">
                          {connected ? `$${(dailyRewards * 100).toFixed(2)}` : '$0.00'}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>

              <MotionWrapper type="scale" delay={0.3}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Claimable</p>
                        <p className="text-2xl font-bold">
                          {connected ? `$${(totalClaimableRewards * 100).toFixed(2)}` : '$0.00'}
                        </p>
                      </div>
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>

              <MotionWrapper type="scale" delay={0.4}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                        <p className="text-2xl font-bold">
                          {connected ? `$${(totalRewards * 100).toFixed(2)}` : '$0.00'}
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>
            </div> */}

            {/* Always show all staking cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(SUPPORTED_TOKENS).map(([symbol, tokenInfo], index) => {
                const userStake = getUserStakeForToken(symbol)
                const poolInfo = getPoolInfoForToken(symbol)
                const userBalance = connected ? (symbol === "SOL" ? balance : (tokenBalances[symbol] || 0)) : 0
                
                return (
                  <MotionWrapper key={symbol} type="scale" delay={index * 0.1}>
                    <StakingCard
                      tokenSymbol={symbol}
                      tokenInfo={tokenInfo}
                      poolInfo={poolInfo}
                      userStake={userStake}
                      userBalance={userBalance}
                      isLoading={loading || balanceLoading || tokenBalanceLoading}
                      initialLoading={initialLoading}
                      refreshing={refreshing}
                    />
                  </MotionWrapper>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <MotionWrapper type="fadeIn" delay={0.5}>
              <WithdrawalHistory />
            </MotionWrapper>
          </TabsContent>
        </Tabs>
      </MotionWrapper>

    </div>
  )
}
