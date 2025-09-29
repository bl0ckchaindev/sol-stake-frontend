"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useReferral } from "./referral-provider"
import { useWallet } from "./wallet-provider"
import { ReferralAnalytics } from "./referral-analytics"
import { useTranslation } from "./translation-context"
import { Copy, Users, Gift, TrendingUp, Share2, Check, ExternalLink, Calendar, Wallet } from "lucide-react"
import { useState } from "react"

export function ReferralPage() {
  const { connected } = useWallet()
  const { referralData, getReferralLink } = useReferral()
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copyReferralLink = async () => {
    const link = getReferralLink()
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('referrals.main.title')}</h1>
        <p className="text-muted-foreground">{t('referrals.main.subtitle')}</p>
      </div>

      {!connected ? (
        <div className="space-y-6">
          {/* Program Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('referrals.main.referralRate')}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">1%</div>
                <p className="text-xs text-muted-foreground">{t('referrals.main.ofStakeAmount')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('referrals.main.instantRewards')}</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{t('referrals.main.instantRewards')}</div>
                <p className="text-xs text-muted-foreground">{t('referrals.main.noWaitingPeriod')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('referrals.main.unlimited')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">∞</div>
                <p className="text-xs text-muted-foreground">{t('referrals.main.noReferralLimit')}</p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>{t('referrals.main.howItWorks')}</CardTitle>
              <CardDescription>{t('referrals.main.howItWorksDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">{t('referrals.main.step1Title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('referrals.main.step1Description')}</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">{t('referrals.main.step2Title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('referrals.main.step2Description')}</p>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">{t('referrals.main.step3Title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('referrals.main.step3Description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Connect Wallet CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Wallet className="h-5 w-5" />
                {t('referrals.main.readyToStart')}
              </CardTitle>
              <CardDescription>
                {t('referrals.main.connectWalletDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="w-full md:w-auto">
                {t('referrals.main.connectWallet')}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : !referralData ? (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">{t('referrals.main.loading')}</h1>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">{t('referrals.main.overview')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('referrals.main.analytics')}</TabsTrigger>
            <TabsTrigger value="history">{t('referrals.main.history')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Referral Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('referrals.main.totalReferrals')}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{referralData.totalReferrals}</div>
                  <p className="text-xs text-muted-foreground">{t('referrals.main.usersReferred')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('referrals.main.totalRewards')}</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {referralData.totalReferralRewards.toFixed(4)} SOL
                  </div>
                  <p className="text-xs text-muted-foreground">{t('referrals.main.lifetimeEarnings')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t('referrals.main.referralRate')}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">1%</div>
                  <p className="text-xs text-muted-foreground">{t('referrals.main.ofStakeAmount')}</p>
                </CardContent>
              </Card>
            </div>

            {/* Referral Link */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  {t('referrals.main.yourReferralLink')}
                </CardTitle>
                <CardDescription>
                  {t('referrals.main.yourReferralLinkDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={getReferralLink()} readOnly className="font-mono text-sm" />
                  <Button onClick={copyReferralLink} variant="outline" size="icon">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{t('referrals.main.yourCode')}: {referralData.referralCode}</Badge>
                  {referralData.referredBy && <Badge variant="outline">{t('referrals.main.referredBy')}: {referralData.referredBy}</Badge>}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?text=Join me on MEVStake and earn 1% daily rewards from MEV bot operations! ${getReferralLink()}`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('referrals.main.shareOnTwitter')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://t.me/share/url?url=${getReferralLink()}&text=Join me on MEVStake and earn 1% daily rewards!`,
                        "_blank",
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t('referrals.main.shareOnTelegram')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>{t('referrals.main.howItWorks')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">1</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t('referrals.main.step1Title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('referrals.main.step1Description')}</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">2</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t('referrals.main.step2Title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('referrals.main.step2Description')}</p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold">3</span>
                    </div>
                    <h3 className="font-semibold mb-2">{t('referrals.main.step3Title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('referrals.main.step3Description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <ReferralAnalytics />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {/* Detailed Referral History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('referrals.main.referralHistory')}
                </CardTitle>
                <CardDescription>{t('referrals.main.referralHistoryDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {referralData.referralHistory.length > 0 ? (
                  <div className="space-y-4">
                    {referralData.referralHistory
                      .slice()
                      .reverse()
                      .map((reward) => (
                        <div
                          key={reward.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">{t('referrals.main.referralReward')}</div>
                            <div className="text-sm text-muted-foreground">{t('referrals.main.stakeAmount')}: {reward.stakeAmount} SOL</div>
                            <div className="text-xs text-muted-foreground">
                              {reward.timestamp.toLocaleDateString()} at {reward.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="font-bold text-success text-lg">+{reward.rewardAmount.toFixed(4)} SOL</div>
                            <Badge variant="secondary" className="text-xs">
                              1% reward
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{t('referrals.main.noReferralsYet')}</h3>
                    <p className="text-muted-foreground mb-4">{t('referrals.main.noReferralsDescription')}</p>
                    <Button onClick={copyReferralLink}>{t('referrals.main.copyReferralLink')}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
