"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useReferral } from "./referral-provider"
import { TrendingUp, Calendar, DollarSign, Target, Award } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export function ReferralAnalytics() {
  const { referralData } = useReferral()

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
    if (referrals >= 100) return { name: "Diamond", color: "bg-blue-500", bonus: "2.5%" }
    if (referrals >= 50) return { name: "Platinum", color: "bg-purple-500", bonus: "2%" }
    if (referrals >= 25) return { name: "Gold", color: "bg-yellow-500", bonus: "1.5%" }
    if (referrals >= 10) return { name: "Silver", color: "bg-gray-400", bonus: "1.25%" }
    return { name: "Bronze", color: "bg-orange-500", bonus: "1%" }
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
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Avg</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{avgMonthlyProfit.toFixed(2)} SOL</div>
            <p className="text-xs text-muted-foreground">Average monthly profit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitGrowth >= 0 ? "text-success" : "text-destructive"}`}>
              {profitGrowth >= 0 ? "+" : ""}
              {profitGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Month over month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6 Months</div>
            <p className="text-xs text-muted-foreground">Since first referral</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Visitors to stakers</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Referral Tier Status
          </CardTitle>
          <CardDescription>Unlock higher reward rates by referring more users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${currentTier.color}`} />
              <div>
                <div className="font-semibold">{currentTier.name} Tier</div>
                <div className="text-sm text-muted-foreground">Current reward rate: {currentTier.bonus}</div>
              </div>
            </div>
            <Badge variant="secondary">{referralData.totalReferrals} referrals</Badge>
          </div>

          {referralData.totalReferrals < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to next tier</span>
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
          <CardTitle>Profit History</CardTitle>
          <CardDescription>Your referral earnings over the last 6 months</CardDescription>
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
                  formatter={(value: number) => [`${value.toFixed(2)} SOL`, "Profit"]}
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
          <CardTitle>Referral Activity</CardTitle>
          <CardDescription>Number of new referrals per month</CardDescription>
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
                  formatter={(value: number) => [`${value}`, "Referrals"]}
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
