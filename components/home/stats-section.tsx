"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/context/translation-context"
import { MotionWrapper } from "@/components/shared/motion-wrapper"
import { TrendingUp, Activity, Clock } from "lucide-react"
import { useAnchorStaking } from "@/context/anchor-staking-provider"
import { useSolPrice, formatUsd } from "@/lib/price-utils"
import { SUPPORTED_TOKENS } from "@/lib/anchor/types"
import { useMemo } from "react"

export function StatsSection() {
  const { t } = useTranslation()
  const { globalData, poolsInfo } = useAnchorStaking()
  const { price: solPrice, loading: priceLoading } = useSolPrice()

  // Calculate global statistics with memoization
  const globalStats = useMemo(() => {
    if (!globalData || !poolsInfo) {
      return {
        totalStakedUsd: 0,
        totalClaimedUsd: 0,
        dailyMevProfit: 0,
        currentAPY: 0
      }
    }

    // Calculate total staked across all pools in USD
    let totalStakedUsd = 0
    let totalClaimedUsd = 0
    let totalStakedSol = 0
    let totalClaimedSol = 0

    Object.values(poolsInfo).forEach(pool => {
      if (pool.isActive) {
        // Find the token info for this pool to get correct decimals
        const tokenInfo = Object.values(SUPPORTED_TOKENS).find(token => 
          token.poolId === pool.poolId
        )
        const decimals = tokenInfo?.decimals || 9 // Default to SOL decimals if not found
        
        const stakedAmount = pool.totalStaked.toNumber() / Math.pow(10, decimals)
        const claimedAmount = pool.totalRewardsDistributed.toNumber() / Math.pow(10, decimals)
        
        if (pool.poolId === 0) {
          // SOL pool - convert to USD using current SOL price
          totalStakedSol = stakedAmount
          totalClaimedSol = claimedAmount
          totalStakedUsd += stakedAmount * (solPrice || 0)
          totalClaimedUsd += claimedAmount * (solPrice || 0)
        } else if (pool.poolId === 1) {
          // USDC pool - already in USD equivalent (1 USDC = 1 USD)
          totalStakedUsd += stakedAmount
          totalClaimedUsd += claimedAmount
        } else if (pool.poolId === 2) {
          // USDT pool - already in USD equivalent (1 USDT = 1 USD)
          totalStakedUsd += stakedAmount
          totalClaimedUsd += claimedAmount
        }
      }
    })

    // Calculate current APY (using highest tier reward rate)
    const maxRate = Math.max(
      globalData.tier0Reward,
      globalData.tier1Reward,
      globalData.tier2Reward,
      globalData.tier3Reward,
      globalData.tier4Reward
    )
    const dailyRate = maxRate / 10000 // Convert from basis points
    const annualRate = dailyRate * 365 * 100

    // Estimate daily MEV profit (this would come from actual MEV bot data)
    // For now, we'll use a percentage of total staked as an estimate
    const dailyMevProfitUsd = totalStakedUsd * 0.01 // 1% daily estimate (this is for MEV profits, not referral rewards)
    const dailyMevProfitSol = totalStakedSol * 0.01 // 1% daily estimate (this is for MEV profits, not referral rewards)

    return {
      totalStakedSol,
      totalClaimedSol,
      totalStakedUsd,
      totalClaimedUsd,
      dailyMevProfitSol,
      dailyMevProfitUsd,
      currentAPY: annualRate
    }
  }, [globalData, poolsInfo])

  const stats = [
    {
      icon: "/tvl.png",
      value: priceLoading ? "Loading..." : formatUsd(globalStats.totalStakedUsd, 0),
      label: t('home.stats.items.tvl.label'),
      description: `Total value locked across all pools (SOL, USDC, USDT)`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: "/total-profit.png",
      value: priceLoading ? "Loading..." : formatUsd(globalStats.totalClaimedUsd, 0),
      label: "Total Claimed",
      description: `Total rewards distributed across all pools`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: "/daily-profit.png",
      value: priceLoading ? "Loading..." : formatUsd(globalStats.dailyMevProfitUsd || 0, 0),
      label: "Daily MEV Profit",
      description: `${(globalStats.dailyMevProfitSol || 0).toFixed(4)} SOL daily MEV extraction`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: "/apy.png",
      value: `${globalStats.currentAPY.toFixed(1)}%`,
      label: t('home.stats.items.apy.label'),
      description: t('home.stats.items.apy.description'),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <MotionWrapper type="slideUp" trigger="inView" className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 text-sm">
            {t('home.stats.badge')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-balance mb-6">
            {t('home.stats.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            {t('home.stats.subtitle')}
          </p>
        </MotionWrapper>

        <MotionWrapper
          type="fadeIn"
          trigger="inView"
          className="flex flex-wrap gap-8 items-stretch"
          staggerChildren={0.15}
        >
          {stats.map((stat, index) => (
            <MotionWrapper key={index} type="scale" delay={index * 0.1} trigger="inView" className="flex-1 min-w-[250px]">
              <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-card border-border/50 backdrop-blur-sm h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src={stat.icon} className="w-12 h-12 text-accent" />
                  </div>
                  <MotionWrapper type="slideUp" delay={0.1}>
                    <div className="text-4xl lg:text-5xl font-bold mb-3 text-foreground">
                      {stat.value}
                    </div>
                  </MotionWrapper>
                  <MotionWrapper type="slideUp" delay={0.2}>
                    <div className="text-xl font-semibold mb-3">{stat.label}</div>
                  </MotionWrapper>
                  <MotionWrapper type="slideUp" delay={0.3} className="flex-1">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {stat.description}
                    </p>
                  </MotionWrapper>
                  <div className="absolute inset-0 bg-gradient-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </MotionWrapper>

        {/* Additional performance indicators */}
        <MotionWrapper type="fadeIn" trigger="inView" className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 backdrop-blur-sm text-center">
              <img src="/consistent-rewards.png" className="w-12 h-12 text-accent mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2 text-foreground">{t('home.stats.additional.consistentReturns.title')}</h4>
              <p className="text-muted-foreground text-sm">{t('home.stats.additional.consistentReturns.description')}</p>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 backdrop-blur-sm text-center">
              <img src="/real-time-monitoring.png" className="w-12 h-12 text-accent mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2 text-foreground">{t('home.stats.additional.realtimeMonitoring.title')}</h4>
              <p className="text-muted-foreground text-sm">{t('home.stats.additional.realtimeMonitoring.description')}</p>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 backdrop-blur-sm text-center">
              <img src="/instant-rewards.png" className="w-12 h-12 text-accent mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2 text-foreground">{t('home.stats.additional.instantRewards.title')}</h4>
              <p className="text-muted-foreground text-sm">{t('home.stats.additional.instantRewards.description')}</p>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  )
}
