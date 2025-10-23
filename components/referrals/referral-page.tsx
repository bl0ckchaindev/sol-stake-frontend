"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReferral } from "@/context/referral-provider";
import { useWallet } from "@/context/wallet-provider";
import { ReferralAnalytics } from "@/components/referrals/referral-analytics";
import { useTranslation } from "@/context/translation-context";
import { useAnchorStaking } from "@/context/anchor-staking-provider";
import { useSolPrice, formatUsd } from "@/lib/price-utils";
import { SUPPORTED_TOKENS } from "@/lib/anchor/types";
import {
  Copy,
  Users,
  Gift,
  TrendingUp,
  Share2,
  Check,
  ExternalLink,
  Calendar,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { MotionWrapper } from "@/components/shared/motion-wrapper";

export function ReferralPage() {
  const { connected } = useWallet();
  const { 
    referralData, 
    getReferralLink, 
    hasActiveStakes, 
    isStakeChecker,
    sharingMode
  } = useReferral();

  const { t } = useTranslation();
  const { globalData, poolsInfo, stakes } = useAnchorStaking();
  const { price: solPrice, loading: priceLoading } = useSolPrice();
  const [copied, setCopied] = useState(false);

  // Safety check for loading states
  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to view your referral information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while checking stakes, but allow fallback after timeout
  if (isStakeChecker && !referralData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Referral Data</h2>
            <p className="text-muted-foreground">
              Please wait while we fetch your referral information...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              If this takes too long, please refresh the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const copyReferralLink = async () => {
    const link = getReferralLink();
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate total referrals from user stakes across all pools
  const calculateUserTotalReferrals = () => {
    if (!stakes || stakes.length === 0) {
      return 0;
    }

    let totalReferrals = 0;
    stakes.forEach(stake => {
      if (stake && stake.userStake) {
        totalReferrals += stake.userStake.referralCount || 0;
      }
    });

    return totalReferrals;
  };

  const userTotalReferrals = calculateUserTotalReferrals();

  // Calculate total referral rewards from user stakes across all pools
  const calculateUserTotalReferralRewards = () => {
    if (!stakes || stakes.length === 0) {
      return {
        totalUsd: 0,
        totalSol: 0
      };
    }

    let totalReferralRewardsUsd = 0;
    let totalReferralRewardsSol = 0;

    stakes.forEach(stake => {
      if (!stake || !stake.userStake) return;
      
      // Find the token info for this pool to get correct decimals
      const tokenInfo = Object.values(SUPPORTED_TOKENS).find(token => 
        token.poolId === stake.userStake.poolId
      );
      const decimals = tokenInfo?.decimals || 9; // Default to SOL decimals if not found
      
      // Convert referral amount from lamports to actual token amount
      const referralAmountInTokens = (stake.userStake.referralAmount?.toNumber() || 0) / Math.pow(10, decimals);
      
      // console.log(`Pool ${stake.userStake.poolId}: referralAmount raw=${stake.userStake.referralAmount?.toNumber() || 0}, decimals=${decimals}, converted=${referralAmountInTokens}`);
      
      if (stake.userStake.poolId === 0) {
        // SOL pool - convert to USD using current SOL price
        totalReferralRewardsSol += referralAmountInTokens;
        totalReferralRewardsUsd += referralAmountInTokens * (solPrice || 0);
      } else if (stake.userStake.poolId === 1) {
        // USDC pool - already in USD equivalent
        totalReferralRewardsUsd += referralAmountInTokens;
      } else if (stake.userStake.poolId === 2) {
        // USDT pool - already in USD equivalent (if enabled)
        totalReferralRewardsUsd += referralAmountInTokens;
      }
    });

    // console.log(`Total referral rewards: USD=${totalReferralRewardsUsd}, SOL=${totalReferralRewardsSol}`);

    return {
      totalUsd: totalReferralRewardsUsd,
      totalSol: totalReferralRewardsSol
    };
  };

  const userTotalReferralRewards = calculateUserTotalReferralRewards();

  // Calculate global referral statistics
  const calculateGlobalReferralStats = () => {
    if (!globalData || !poolsInfo) {
      return {
        totalReferralPaidSol: 0,
        totalReferralPaidUsd: 0,
        totalReferralsAcrossAllUsers: 0,
        totalRewardsAcrossAllUsers: 0
      }
    }

    // Calculate total referral fees paid across all pools using correct formula:
    // total_referral_fee of sol pool * solPrice + total_referral_fee of usdc + total_referral_fee of usdt
    let totalReferralPaidUsd = 0
    let totalReferralPaidSol = 0
    let totalStakedAcrossAllPools = 0
    let totalRewardsAcrossAllPools = 0

    Object.values(poolsInfo).forEach(pool => {
      if (pool.isActive) {
        // Find the token info for this pool to get correct decimals
        const tokenInfo = Object.values(SUPPORTED_TOKENS).find(token => 
          token.poolId === pool.poolId
        )
        const decimals = tokenInfo?.decimals || 9 // Default to SOL decimals if not found
        
        const referralFeeInTokens = pool.totalReferralFee.toNumber() / Math.pow(10, decimals)
        
        if (pool.poolId === 0) {
          // SOL pool - convert to USD using current SOL price
          totalReferralPaidSol = referralFeeInTokens
          totalReferralPaidUsd += referralFeeInTokens * (solPrice || 0)
        } else if (pool.poolId === 1) {
          // USDC pool - already in USD equivalent
          totalReferralPaidUsd += referralFeeInTokens
        } else if (pool.poolId === 2) {
          // USDT pool - already in USD equivalent (if enabled)
          totalReferralPaidUsd += referralFeeInTokens
        }
        
        totalStakedAcrossAllPools += pool.totalStaked.toNumber() / Math.pow(10, decimals)
        totalRewardsAcrossAllPools += pool.totalRewardsDistributed.toNumber() / Math.pow(10, decimals)
      }
    })

    // Estimate total referrals across all users (this would need actual user data)
    // For now, we'll estimate based on total staked amount and average stake size
    const averageStakeSize = 10 // SOL - estimated average stake
    const estimatedTotalReferrals = Math.floor(totalStakedAcrossAllPools / averageStakeSize)

    return {
      totalReferralPaidSol,
      totalReferralPaidUsd,
      totalReferralsAcrossAllUsers: estimatedTotalReferrals,
      totalRewardsAcrossAllUsers: totalRewardsAcrossAllPools
    }
  }

  const globalReferralStats = calculateGlobalReferralStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <MotionWrapper type="slideUp" delay={0.1} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("referrals.main.title")}</h1>
        <p className="text-muted-foreground">{t("referrals.main.subtitle")}</p>
      </MotionWrapper>

      {!connected ? (
        <MotionWrapper type="fadeIn" delay={0.2} className="space-y-6">
          {/* Program Benefits */}
          <MotionWrapper
            type="fadeIn"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            staggerChildren={0.1}
          >
            <MotionWrapper type="scale" delay={0.1}>
              <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("referrals.main.referralRate")}
                  </CardTitle>
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src="/referral-rate.png" className="w-12 h-12 text-accent" alt="Referral Rate" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">10%</div>
                  <p className="text-xs text-muted-foreground">
                    {t("referrals.main.ofStakeAmount")}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper type="scale" delay={0.2}>
              <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("referrals.main.instantRewards")}
                  </CardTitle>
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src="/instant-referral-rewards.png" className="w-12 h-12 text-accent" alt="Instant Rewards" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {t("referrals.main.instantRewards")}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("referrals.main.noWaitingPeriod")}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>

            <MotionWrapper type="scale" delay={0.3}>
              <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("referrals.main.unlimited")}
                  </CardTitle>
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src="/infinite.png" className="w-12 h-12 text-accent" alt="Unlimited" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">∞</div>
                  <p className="text-xs text-muted-foreground">
                    {t("referrals.main.noReferralLimit")}
                  </p>
                </CardContent>
              </Card>
            </MotionWrapper>
          </MotionWrapper>

          {/* How It Works */}
          <MotionWrapper type="slideUp" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>{t("referrals.main.howItWorks")}</CardTitle>
                <CardDescription>
                  {t("referrals.main.howItWorksDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <MotionWrapper
                  type="fadeIn"
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  staggerChildren={0.2}
                >
                  <MotionWrapper type="scale" delay={0.1}>
                    <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">1</span>
                      </div>
                      <h3 className="font-semibold mb-2">
                        {t("referrals.main.step1Title")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("referrals.main.step1Description")}
                      </p>
                    </div>
                  </MotionWrapper>

                  <MotionWrapper type="scale" delay={0.2}>
                    <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">2</span>
                      </div>
                      <h3 className="font-semibold mb-2">
                        {t("referrals.main.step2Title")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("referrals.main.step2Description")}
                      </p>
                    </div>
                  </MotionWrapper>

                  <MotionWrapper type="scale" delay={0.3}>
                    <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-primary font-bold">3</span>
                      </div>
                      <h3 className="font-semibold mb-2">
                        {t("referrals.main.step3Title")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("referrals.main.step3Description")}
                      </p>
                    </div>
                  </MotionWrapper>
                </MotionWrapper>
              </CardContent>
            </Card>
          </MotionWrapper>

          {/* Connect Wallet CTA */}
          <MotionWrapper type="scale" delay={0.4}>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Wallet className="h-5 w-5" />
                  {t("referrals.main.readyToStart")}
                </CardTitle>
                <CardDescription>
                  {t("referrals.main.connectWalletDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" className="w-full md:w-auto">
                  {t("referrals.main.connectWallet")}
                </Button>
              </CardContent>
            </Card>
          </MotionWrapper>
        </MotionWrapper>
      ) : isStakeChecker ? (
        <MotionWrapper type="fadeIn" delay={0.2}>
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">
                Checking your stakes...
              </h1>
              <p className="text-muted-foreground">
                Verifying if you have active staking positions...
              </p>
            </div>
          </div>
        </MotionWrapper>
      ) : sharingMode === 'stakers-only' && !hasActiveStakes ? (
        <MotionWrapper type="fadeIn" delay={0.2}>
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto">
                <Wallet className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                Stake Required for Referral Program
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                You need to have active stakes in any pool to access the referral program and earn rewards.
              </p>
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  How to get your referral code:
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      1
                    </div>
                    <p className="text-sm">
                      Stake tokens in any available pool
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      2
                    </div>
                    <p className="text-sm">
                      Your referral code will be automatically generated
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      3
                    </div>
                    <p className="text-sm">
                      Start sharing and earning referral rewards
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className="mt-6"
              >
                Go to Staking Dashboard
              </Button>
            </div>
          </div>
        </MotionWrapper>
      ) : !referralData ? (
        <MotionWrapper type="fadeIn" delay={0.2}>
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">
                Generating your referral code...
              </h1>
              <p className="text-muted-foreground">
                Creating your unique referral code...
              </p>
            </div>
          </div>
        </MotionWrapper>
      ) : (
        <MotionWrapper type="fadeIn" delay={0.2}>
          <Tabs defaultValue="overview" className="space-y-6">
            {/* <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                {t("referrals.main.overview")}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {t("referrals.main.analytics")}
              </TabsTrigger>
              <TabsTrigger value="history">
                {t("referrals.main.history")}
              </TabsTrigger>
            </TabsList> */}

            <TabsContent value="overview" className="space-y-6">
              {/* Referral Information Cards */}
              <MotionWrapper
                type="fadeIn"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                staggerChildren={0.1}
              >
                {/* Card 1: Total Referral Paid Across All Pools and Users */}
                <MotionWrapper type="scale" delay={0.1}>
                  <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-success rounded-full opacity-10 blur-2xl"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Referral Paid
                      </CardTitle>
                      <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <img src="/total-rewards.png" className="w-12 h-12 text-accent" alt="Total Referral Paid" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-success mb-1">
                        {priceLoading ? "Loading..." : formatUsd(globalReferralStats.totalReferralPaidUsd, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Across all pools & users
                      </p>
                    </CardContent>
                  </Card>
                </MotionWrapper>

                {/* Card 2: Total Referral Count of Connected Wallet User */}
                <MotionWrapper type="scale" delay={0.2}>
                  <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-primary rounded-full opacity-10 blur-2xl"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Your Total Referrals
                      </CardTitle>
                      <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <img src="/total-referrals.png" className="w-12 h-12 text-accent" alt="Your Referrals" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {userTotalReferrals}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("referrals.main.usersReferred")}
                      </p>
                    </CardContent>
                  </Card>
                </MotionWrapper>

                {/* Card 3: Total Reward Paid of Connected Wallet User */}
                <MotionWrapper type="scale" delay={0.3}>
                  <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-accent rounded-full opacity-10 blur-2xl"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Your Total Rewards
                      </CardTitle>
                      <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <img src="/total-earned.png" className="w-12 h-12 text-accent" alt="Your Rewards" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-success mb-1">
                        {priceLoading ? "Loading..." : formatUsd(userTotalReferralRewards.totalUsd)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("referrals.main.lifetimeEarnings")}
                      </p>
                    </CardContent>
                  </Card>
                </MotionWrapper>

                {/* Card 4: Referral Rate */}
                <MotionWrapper type="scale" delay={0.4}>
                  <Card className="bg-gradient-card border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-secondary rounded-full opacity-10 blur-2xl"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {t("referrals.main.referralRate")}
                      </CardTitle>
                      <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <img src="/referral-rate.png" className="w-12 h-12 text-accent" alt="Referral Rate" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-success mb-1">
                        10%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("referrals.main.ofStakeAmount")}
                      </p>
                    </CardContent>
                  </Card>
                </MotionWrapper>
              </MotionWrapper>


              {/* Referral Link */}
              <MotionWrapper type="slideUp" delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5" />
                      {t("referrals.main.yourReferralLink")}
                    </CardTitle>
                    <CardDescription>
                      {t("referrals.main.yourReferralLinkDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={getReferralLink()}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        onClick={copyReferralLink}
                        variant="outline"
                        size="icon"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {t("referrals.main.yourCode")}:{" "}
                        {referralData.referralCode}
                      </Badge>
                      {referralData.referredBy && (
                        <Badge variant="outline">
                          {t("referrals.main.referredBy")}:{" "}
                          {referralData.referredBy}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://twitter.com/intent/tweet?text=Join me on MEVStake and earn 1% daily rewards from MEV bot operations! Get 10% referral rewards! ${getReferralLink()}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("referrals.main.shareOnTwitter")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://t.me/share/url?url=${getReferralLink()}&text=Join me on MEVStake and earn 1% daily rewards! Get 10% referral rewards!`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("referrals.main.shareOnTelegram")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>

              {/* How It Works */}
              <MotionWrapper type="slideUp" delay={0.4}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("referrals.main.howItWorks")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <MotionWrapper
                      type="fadeIn"
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      staggerChildren={0.2}
                    >
                      <MotionWrapper type="scale" delay={0.1}>
                        <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-primary font-bold">1</span>
                          </div>
                          <h3 className="font-semibold mb-2">
                            {t("referrals.main.step1Title")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("referrals.main.step1Description")}
                          </p>
                        </div>
                      </MotionWrapper>

                      <MotionWrapper type="scale" delay={0.2}>
                        <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-primary font-bold">2</span>
                          </div>
                          <h3 className="font-semibold mb-2">
                            {t("referrals.main.step2Title")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("referrals.main.step2Description")}
                          </p>
                        </div>
                      </MotionWrapper>

                      <MotionWrapper type="scale" delay={0.3}>
                        <div className="text-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-primary font-bold">3</span>
                          </div>
                          <h3 className="font-semibold mb-2">
                            {t("referrals.main.step3Title")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("referrals.main.step3Description")}
                          </p>
                        </div>
                      </MotionWrapper>
                    </MotionWrapper>
                  </CardContent>
                </Card>
              </MotionWrapper>
            </TabsContent>

            <TabsContent value="analytics">
              <MotionWrapper type="fadeIn" delay={0.3}>
                <ReferralAnalytics />
              </MotionWrapper>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              {/* Detailed Referral History */}
              <MotionWrapper type="slideUp" delay={0.3}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {t("referrals.main.referralHistory")}
                    </CardTitle>
                    <CardDescription>
                      {t("referrals.main.referralHistoryDescription")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {referralData.referralHistory.length > 0 ? (
                      <div className="space-y-4">
                        {referralData.referralHistory
                          .slice()
                          .reverse()
                          .map((reward, index) => (
                            <MotionWrapper
                              key={reward.id}
                              type="slideUp"
                              delay={index * 0.1}
                            >
                              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="space-y-1">
                                  <div className="font-medium">
                                    {t("referrals.main.referralReward")}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {t("referrals.main.stakeAmount")}:{" "}
                                    {reward.stakeAmount} SOL
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {reward.timestamp.toLocaleDateString()} at{" "}
                                    {reward.timestamp.toLocaleTimeString()}
                                  </div>
                                </div>
                                <div className="text-right space-y-1">
                                  <div className="font-bold text-success text-lg">
                                    +{reward.rewardAmount.toFixed(4)} SOL
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    10% reward
                                  </Badge>
                                </div>
                              </div>
                            </MotionWrapper>
                          ))}
                      </div>
                    ) : (
                      <MotionWrapper type="scale" delay={0.2}>
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            {t("referrals.main.noReferralsYet")}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {t("referrals.main.noReferralsDescription")}
                          </p>
                          <Button onClick={copyReferralLink}>
                            {t("referrals.main.copyReferralLink")}
                          </Button>
                        </div>
                      </MotionWrapper>
                    )}
                  </CardContent>
                </Card>
              </MotionWrapper>
            </TabsContent>
          </Tabs>
        </MotionWrapper>
      )}
    </div>
  );
}
