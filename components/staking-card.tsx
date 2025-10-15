"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/components/wallet-provider"
import { useAnchorStaking } from "@/components/anchor-staking-provider"
import { useTranslation } from "@/components/translation-context"
import { SUPPORTED_TOKENS, LOCK_PERIOD_CONFIG, getLockPeriodConfig, LockPeriod, type SupportedToken, type PoolInfo } from "@/lib/anchor/types"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { PublicKey } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor"
import { ArrowUpRight, ArrowDownLeft, Coins, Clock, TrendingUp, Loader2, RefreshCw } from "lucide-react"
import { WalletSelector } from "@/components/wallet-selector"
import { toast } from "sonner"

interface StakingCardProps {
  tokenSymbol: string
  tokenInfo: SupportedToken
  poolInfo?: PoolInfo
  userStake?: any // StakePosition if user has stakes
  userBalance: number
  isLoading?: boolean
  initialLoading?: boolean
  refreshing?: boolean
}

export function StakingCard({ tokenSymbol, tokenInfo, poolInfo, userStake, userBalance, isLoading = false, initialLoading = false, refreshing = false }: StakingCardProps) {
  const { connected, publicKey } = useWallet()
  const { stakeTokens, withdrawTokens, claimRewards, formatAmount, parseAmount, globalData } = useAnchorStaking()
  const { t } = useTranslation()
  
  const [amount, setAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [lockPeriod, setLockPeriod] = useState<LockPeriod>(LockPeriod.FreeLock)
  const [isStaking, setIsStaking] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isCompounding, setIsCompounding] = useState(false)
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate APY based on lock period
  const getAPY = () => {
    if (!userStake) {
      const config = getLockPeriodConfig(lockPeriod, globalData)
      return config.multiplier * 10 // Base 10% APY
    }
    return userStake.apy
  }

  // Helper function to blur numbers when loading (only on initial load)
  const blurIfLoading = (className: string = "") => {
    return `${className} ${initialLoading ? 'blur-sm' : ''}`.trim()
  }

  // Helper function to show refresh indicator
  const getRefreshIndicator = () => {
    if (refreshing) {
      return <RefreshCw className="h-3 w-3 animate-spin text-primary/60" />
    }
    return null
  }

  // Calculate daily reward percentage for each lock period
  const getDailyRewardPercentage = (period: LockPeriod) => {
    const config = getLockPeriodConfig(period, globalData)
    const baseDailyRate = 1 // 0.027 // Base 10% APY / 365 days ≈ 0.027% daily
    return (baseDailyRate * config.multiplier).toFixed(1)
  }

  // Calculate withdrawable balance (only FreeLock tier)
  const getWithdrawableBalance = () => {
    if (!userStake) return 0
    return formatAmount(userStake.userStake.tier0Amount, tokenInfo.decimals)
  }

  // Calculate lock period progress
  const getLockProgress = () => {
    if (!userStake) return 0
    
    // For simplicity, assume all locked amounts have the same lock period
    // You might need to track individual lock periods per tier
    const currentTime = Math.floor(Date.now() / 1000)
    const stakeTime = userStake.userStake.lastClaimTime.toNumber()
    const lockDuration = LOCK_PERIOD_CONFIG[LockPeriod.SixMonths].duration // Max lock duration
    
    const elapsed = currentTime - stakeTime
    const progress = Math.min(elapsed / lockDuration, 1)
    return progress * 100
  }

  // Get current lock period from user stake
  const getCurrentLockPeriod = () => {
    if (!userStake) return LockPeriod.FreeLock
    
    // Determine primary lock period based on largest stake
    const amounts = [
      userStake.userStake.tier0Amount.toNumber(),
      userStake.userStake.tier1Amount.toNumber(),
      userStake.userStake.tier2Amount.toNumber(),
      userStake.userStake.tier3Amount.toNumber(),
      userStake.userStake.tier4Amount.toNumber(),
    ]
    
    const maxIndex = amounts.indexOf(Math.max(...amounts))
    return maxIndex as LockPeriod
  }

  const handleStake = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet")
      return
    }

    const stakeAmount = parseFloat(amount)
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (stakeAmount > userBalance) {
      toast.error("Insufficient balance")
      return
    }

    setIsStaking(true)
    try {
      const amountBN = parseAmount(stakeAmount, tokenInfo.decimals)
      
      await stakeTokens(tokenSymbol, stakeAmount, lockPeriod)
      
      setAmount("")
      // Success notification is handled by the staking provider
    } catch (error) {
      console.error("Staking error:", error)
      // Error notification is handled by the staking provider
    } finally {
      setIsStaking(false)
    }
  }

  const handleWithdraw = async () => {
    if (!userStake) return

    const withdrawValue = parseFloat(withdrawAmount)
    if (isNaN(withdrawValue) || withdrawValue <= 0) {
      toast.error("Please enter a valid withdrawal amount")
      return
    }

    const maxWithdraw = formatAmount(userStake.userStake.totalStaked, tokenInfo.decimals)
    if (withdrawValue > maxWithdraw) {
      toast.error("Withdrawal amount exceeds staked amount")
      return
    }

    setIsWithdrawing(true)
    try {
      await withdrawTokens(userStake, withdrawValue)
      setWithdrawAmount("")
      // Success notification is handled by the staking provider
    } catch (error) {
      console.error("Withdrawal error:", error)
      // Error notification is handled by the staking provider
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleClaim = async () => {
    if (!userStake) return

    setIsClaiming(true)
    try {
      await claimRewards(userStake)
      // Success notification is handled by the staking provider
    } catch (error) {
      console.error("Claim error:", error)
      // Error notification is handled by the staking provider
    } finally {
      setIsClaiming(false)
    }
  }

  const handleCompound = async () => {
    if (!userStake || !userStake.pendingRewards) return

    setIsCompounding(true)
    try {
      // Compound by staking the pending rewards
      const compoundAmount = userStake.pendingRewards
      const currentLockPeriod = getCurrentLockPeriod()
      
      const signature = await stakeTokens(
        tokenSymbol,
        compoundAmount,
        currentLockPeriod
      )
      
      if (signature) {
        // Success notification is handled by the staking provider
        setAmount("")
      }
    } catch (error) {
      console.error("Compound error:", error)
      // Error notification is handled by the staking provider
    } finally {
      setIsCompounding(false)
    }
  }

  const maxAmount = userBalance
  const apy = getAPY()

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="font-semibold text-primary text-lg">{tokenInfo.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{tokenInfo.name}</CardTitle>
                {getRefreshIndicator()}
              </div>
              {poolInfo && (
                <p className="text-base text-foreground">
                  Pool Total: <span className={blurIfLoading("font-extrabold text-lg")}>{formatAmount(poolInfo.totalStaked, tokenInfo.decimals).toFixed(2)} {tokenSymbol}</span>
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            {connected && (
              <div className="mb-2">
                <div className="text-xs text-muted-foreground">My Total Staked</div>
                <div className={blurIfLoading("font-bold text-lg")}>
                  {userStake 
                    ? `${formatAmount(userStake.userStake.totalStaked, tokenInfo.decimals).toFixed(2)} ${tokenSymbol}`
                    : `0.00 ${tokenSymbol}`
                  }
                </div>
              </div>
            )}
            <Badge variant="secondary" className={blurIfLoading("text-success")}>
              {apy.toFixed(1)}% APY
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">

        {/* Staking Form - Always visible */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`amount-${tokenSymbol}`}>Amount to Stake</Label>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Available</p>
                <p className={blurIfLoading("text-xs font-medium")}>
                  {userBalance.toFixed(2)} {tokenSymbol}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                id={`amount-${tokenSymbol}`}
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.0001"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(maxAmount.toString())}
              >
                Max
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`lock-${tokenSymbol}`}>Lock Period</Label>
            <Select value={lockPeriod.toString()} onValueChange={(value) => setLockPeriod(parseInt(value) as LockPeriod)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LOCK_PERIOD_CONFIG).map(([period, config]) => (
                  <SelectItem key={period} value={period}>
                    <div className="flex items-center gap-2">
                      <span>{config.emoji}</span>
                      <span>{config.name}</span>
                      <Badge variant="outline" className="ml-auto">
                        {getDailyRewardPercentage(parseInt(period) as LockPeriod)}% daily
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <Button 
            onClick={!connected ? () => setShowWalletSelector(true) : handleStake} 
            disabled={connected && (isStaking || !amount || parseFloat(amount) <= 0)}
            className="w-full"
          >
            {isStaking ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ArrowUpRight className="h-4 w-4 mr-2" />
            )}
            {!connected ? "Connect Wallet" : "Stake"}
          </Button>
        </div>

        {/* Withdrawal Form - Only show if user has stakes */}
        {userStake && (
          <div className="space-y-4 pt-4 border-t">
            {/* Progress Bar for Lock Period */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Lock Progress</Label>
                <span className="text-xs text-muted-foreground">
                  {getLockProgress().toFixed(1)}% Complete
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getLockProgress()}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {LOCK_PERIOD_CONFIG[getCurrentLockPeriod()].name} - {getDailyRewardPercentage(getCurrentLockPeriod())}% daily
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`withdraw-${tokenSymbol}`}>Amount to Withdraw</Label>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Withdrawable</p>
                  <p className={blurIfLoading("text-xs font-medium")}>
                    {getWithdrawableBalance().toFixed(2)} {tokenSymbol}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  id={`withdraw-${tokenSymbol}`}
                  type="number"
                  placeholder="0.0"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="0"
                  step="0.0001"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setWithdrawAmount(getWithdrawableBalance().toString())}
                >
                  Max
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button 
                onClick={handleClaim} 
                disabled={isClaiming || userStake.pendingRewards <= 0}
                variant="outline"
                size="sm"
              >
                {isClaiming ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                ) : (
                  <Coins className="h-4 w-4 mr-1 sm:mr-2" />
                )}
                <span className={blurIfLoading("")}>
                  <span className="hidden sm:inline">Claim </span>({userStake.pendingRewards.toFixed(2)})
                </span>
              </Button>
              
              <Button 
                onClick={handleCompound} 
                disabled={isCompounding || userStake.pendingRewards <= 0}
                variant="secondary"
                size="sm"
              >
                {isCompounding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Compound</span>
              </Button>
              
              <Button 
                onClick={handleWithdraw} 
                disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                variant="destructive"
                size="sm"
              >
                {isWithdrawing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 mr-1 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Withdraw</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {showWalletSelector && mounted && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          onClick={() => setShowWalletSelector(false)}
        >
          <div 
            className="relative max-w-md w-full max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowWalletSelector(false)}
              className="absolute top-2 right-2 w-8 h-8 bg-background border rounded-full flex items-center justify-center hover:bg-muted z-10 text-lg font-bold shadow-lg"
            >
              ×
            </button>
            <WalletSelector onClose={() => setShowWalletSelector(false)} />
          </div>
        </div>, 
        document.body
      )}
    </Card>
  )
}
