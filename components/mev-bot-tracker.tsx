"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Activity, DollarSign, Zap, Target, CheckCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from './translation-context'

interface BotPerformance {
  totalProfit: number
  dailyProfit: number
  successRate: number
  activeStrategies: number
  totalTransactions: number
  avgExecutionTime: number
  status: "active" | "maintenance" | "offline"
}

interface Transaction {
  id: string
  timestamp: Date
  type: "arbitrage" | "liquidation" | "sandwich"
  profit: number
  gasUsed: number
  success: boolean
}

export function MevBotTracker() {
  const { t } = useTranslation();
  
  const [performance, setPerformance] = useState<BotPerformance>({
    totalProfit: 1247.89,
    dailyProfit: 23.45,
    successRate: 94.2,
    activeStrategies: 7,
    totalTransactions: 15847,
    avgExecutionTime: 0.23,
    status: "active",
  })

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: "arbitrage",
      profit: 2.34,
      gasUsed: 0.001,
      success: true,
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      type: "liquidation",
      profit: 5.67,
      gasUsed: 0.002,
      success: true,
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 18),
      type: "sandwich",
      profit: -0.45,
      gasUsed: 0.001,
      success: false,
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "arbitrage",
      profit: 1.23,
      gasUsed: 0.001,
      success: true,
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 1000 * 60 * 31),
      type: "liquidation",
      profit: 8.91,
      gasUsed: 0.003,
      success: true,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformance((prev) => ({
        ...prev,
        dailyProfit: prev.dailyProfit + (Math.random() - 0.5) * 0.1,
        totalProfit: prev.totalProfit + (Math.random() - 0.5) * 0.1,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 3),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground"
      case "maintenance":
        return "bg-warning text-warning-foreground"
      case "offline":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "arbitrage":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "liquidation":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "sandwich":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "arbitrage":
        return t('mevtracker.analytics.arbitrage');
      case "liquidation":
        return t('mevtracker.analytics.liquidation');
      case "sandwich":
        return t('mevtracker.analytics.sandwich');
      default:
        return type;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('mevtracker.main.title')}</h1>
            <p className="text-muted-foreground">{t('mevtracker.main.subtitle')}</p>
          </div>
          <Badge className={getStatusColor(performance.status)}>
            <Activity className="w-3 h-3 mr-1" />
            {t(`mevtracker.main.status.${performance.status}`)}
          </Badge>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('mevtracker.stats.totalProfit')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{performance.totalProfit.toFixed(2)} SOL</div>
            <p className="text-xs text-muted-foreground">{t('mevtracker.stats.allTimeEarnings')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('mevtracker.stats.dailyProfit')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+{performance.dailyProfit.toFixed(2)} SOL</div>
            <p className="text-xs text-muted-foreground">{t('mevtracker.stats.last24Hours')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('mevtracker.stats.successRate')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.successRate}%</div>
            <Progress value={performance.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('mevtracker.stats.activeStrategies')}</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.activeStrategies}</div>
            <p className="text-xs text-muted-foreground">{t('mevtracker.stats.runningAlgorithms')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="live" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">{t('mevtracker.tabs.liveActivity')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('mevtracker.tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="strategies">{t('mevtracker.tabs.strategies')}</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('mevtracker.live.recentTransactions')}</CardTitle>
              <CardDescription>{t('mevtracker.live.liveFeedDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {tx.success ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <Badge variant="outline" className={getTransactionTypeColor(tx.type)}>
                          {getTransactionTypeLabel(tx.type)}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium">
                          {tx.profit > 0 ? "+" : ""}
                          {tx.profit.toFixed(3)} SOL
                        </div>
                        <div className="text-sm text-muted-foreground">{t('mevtracker.live.gas')}: {tx.gasUsed.toFixed(4)} SOL</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{tx.timestamp.toLocaleTimeString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.floor((Date.now() - tx.timestamp.getTime()) / 60000)}{t('mevtracker.live.ago')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('mevtracker.analytics.performanceMetrics')}</CardTitle>
                <CardDescription>{t('mevtracker.analytics.performanceDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('mevtracker.analytics.totalTransactions')}</span>
                  <span className="text-sm">{performance.totalTransactions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('mevtracker.analytics.avgExecutionTime')}</span>
                  <span className="text-sm">{performance.avgExecutionTime}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('mevtracker.analytics.successRate')}</span>
                  <span className="text-sm">{performance.successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('mevtracker.analytics.dailyVolume')}</span>
                  <span className="text-sm">2,847 SOL</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('mevtracker.analytics.strategyDistribution')}</CardTitle>
                <CardDescription>{t('mevtracker.analytics.profitByStrategy')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t('mevtracker.analytics.arbitrage')}</span>
                      <span>67.2%</span>
                    </div>
                    <Progress value={67.2} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t('mevtracker.analytics.liquidation')}</span>
                      <span>24.8%</span>
                    </div>
                    <Progress value={24.8} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t('mevtracker.analytics.sandwich')}</span>
                      <span>8.0%</span>
                    </div>
                    <Progress value={8.0} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  {t('mevtracker.strategies.arbitrageBot')}
                </CardTitle>
                <CardDescription>{t('mevtracker.strategies.crossDexDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.dailyProfit')}</span>
                    <span className="text-success">+15.7 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.successRate')}</span>
                    <span>96.4%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.transactions')}</span>
                    <span>247</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  {t('mevtracker.strategies.liquidationBot')}
                </CardTitle>
                <CardDescription>{t('mevtracker.strategies.lendingDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.dailyProfit')}</span>
                    <span className="text-success">+5.8 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.successRate')}</span>
                    <span>89.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.transactions')}</span>
                    <span>43</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  {t('mevtracker.strategies.sandwichBot')}
                </CardTitle>
                <CardDescription>{t('mevtracker.strategies.mevDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.dailyProfit')}</span>
                    <span className="text-success">+1.9 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.successRate')}</span>
                    <span>78.5%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('mevtracker.strategies.transactions')}</span>
                    <span>89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}