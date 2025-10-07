"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useReferral } from "./referral-provider"
import { useTranslation } from "./translation-context"
import { TrendingUp, Calendar, DollarSign, Target, Award } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export function ReferralAnalytics() {
  const { referralData } = useReferral()
  const { t } = useTranslation()

  if (!referralData) return null

  // Generate monthly profit data for the last 6 months
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    const monthName = date.toLocaleDateString("en-US", { month: "short" })

    // Simulate realistic monthly referral profits
    const baseProfit = Math.random() * 50 + 10
    const monthlyProfit = i === 5 ? referralData.totalReferralRewards * 0.3 : baseProfit

    return {
      month: monthName,
      profit: Number.parseFloat(monthlyProfit.toFixed(2)),
      referrals: Math.floor(Math.random() * 10) + 1,
    }
  })

  // Calculate performance metrics
  const avgMonthlyProfit = monthlyData.reduce((sum, month) => sum + month.profit, 0) / monthlyData.length
  const totalMonthlyReferrals = monthlyData.reduce((sum, month) => sum + month.referrals, 0)
  const profitGrowth =
    monthlyData.length > 1
      ? ((monthlyData[monthlyData.length - 1].profit - monthlyData[monthlyData.length - 2].profit) /
          monthlyData[monthlyData.length - 2].profit) *
        100
      : 0

  // Tier system based on total referrals
  const getTier = (referrals: number) => {
    if (referrals >= 100) return { name: t('referrals.analytics.diamond'), color: "bg-blue-500", bonus: "2.5%" }
    if (referrals >= 50) return { name: t('referrals.analytics.platinum'), color: "bg-purple-500", bonus: "2%" }
    if (referrals >= 25) return { name: t('referrals.analytics.gold'), color: "bg-yellow-500", bonus: "1.5%" }
    if (referrals >= 10) return { name: t('referrals.analytics.silver'), color: "bg-gray-400", bonus: "1.25%" }
    return { name: t('referrals.analytics.bronze'), color: "bg-orange-500", bonus: "1%" }
  }

  const currentTier = getTier(referralData.totalReferrals)
  const nextTierThreshold =
    referralData.totalReferrals >= 100
      ? 100
      : referralData.totalReferrals >= 50
        ? 100
        : referralData.totalReferrals >= 25
          ? 50
          : referralData.totalReferrals >= 10
            ? 25
            : 10

  return (
    <div className="space-y-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-0 w-48 h-48 opacity-5 animate-pulse">
          <div className="w-full h-full bg-gradient-secondary rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-1/3 left-0 w-64 h-64 opacity-5 animate-pulse" style={{animationDelay: '0.5s'}}>
          <div className="w-full h-full bg-gradient-accent rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-success rounded-full opacity-10 blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('referrals.analytics.monthlyAvg')}</CardTitle>
            <DollarSign className="h-5 w-5 text-success group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success mb-1">{avgMonthlyProfit.toFixed(2)} SOL</div>
            <p className="text-xs text-muted-foreground">{t('referrals.analytics.averageMonthlyProfit')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-accent rounded-full opacity-10 blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('referrals.analytics.growthRate')}</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${profitGrowth >= 0 ? "text-success" : "text-destructive"} mb-1`}>
              {profitGrowth >= 0 ? "+" : ""}
              {profitGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">{t('referrals.analytics.monthOverMonth')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-primary rounded-full opacity-10 blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('referrals.analytics.activePeriod')}</CardTitle>
            <Calendar className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground mb-1">6 {t('referrals.analytics.months')}</div>
            <p className="text-xs text-muted-foreground">{t('referrals.analytics.sinceFirstReferral')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('referrals.analytics.conversionRate')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">{t('referrals.analytics.visitorsToStakers')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t('referrals.analytics.referralTierStatus')}
          </CardTitle>
          <CardDescription>{t('referrals.analytics.unlockHigherRewards')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${currentTier.color}`} />
              <div>
                <div className="font-semibold">{currentTier.name} {t('referrals.analytics.tier')}</div>
                <div className="text-sm text-muted-foreground">{t('referrals.analytics.currentRewardRate')}: {currentTier.bonus}</div>
              </div>
            </div>
            <Badge variant="secondary">{referralData.totalReferrals} {t('referrals.analytics.referrals')}</Badge>
          </div>

          {referralData.totalReferrals < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('referrals.analytics.progressToNextTier')}</span>
                <span>
                  {referralData.totalReferrals}/{nextTierThreshold}
                </span>
              </div>
              <Progress value={(referralData.totalReferrals / nextTierThreshold) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profit History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('referrals.analytics.profitHistory')}</CardTitle>
          <CardDescription>{t('referrals.analytics.profitHistoryDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} SOL`, t('referrals.analytics.profit')]}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Referral Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{t('referrals.analytics.referralActivity')}</CardTitle>
          <CardDescription>{t('referrals.analytics.referralActivityDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}`, t('referrals.analytics.referrals')]}
                />
                <Bar dataKey="referrals" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
