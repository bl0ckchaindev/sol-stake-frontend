"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/context/wallet-provider"
import { useAnchorStaking } from "@/context/anchor-staking-provider"
import { useReferral } from "@/context/referral-provider"
import { useTranslation } from "@/context/translation-context"
import { getLockPeriodConfig, LockPeriod, type SupportedToken, type PoolInfo } from "@/lib/anchor/types"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { PublicKey } from "@solana/web3.js"
import { BN } from "@coral-xyz/anchor"
import { ArrowUpRight, ArrowDownLeft, Coins, Loader2, RefreshCw } from "lucide-react"
import { WalletSelector } from "@/components/shared/wallet-selector"
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
  const { referralData, getReferralAddressFromCode } = useReferral()
  const { t } = useTranslation()
  
  const [amount, setAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isCompounding, setIsCompounding] = useState(false)
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate APY (using 1 year lock period)
  const getAPY = () => {
    if (!userStake) {
      const config = getLockPeriodConfig(LockPeriod.OneYear, globalData || undefined)
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


  // Calculate withdrawable balance (only FreeLock tier)
  const getWithdrawableBalance = () => {
    if (!userStake) return 0
    return formatAmount(userStake.userStake.tier0Amount, tokenInfo.decimals)
  }



  // Format number with commas and appropriate suffixes
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B'
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    } else {
      return num.toFixed(2)
    }
  }

  // Get enhanced pool total with hardcoded defaults
  const getEnhancedPoolTotal = () => {
    if (!poolInfo) return 0
    
    const actualTotal = formatAmount(poolInfo.totalStaked, tokenInfo.decimals)
    
    // Define hardcoded default values for different tokens
    const defaultValues: Record<string, number> = {
      'SOL': 1031.9,
      'USDC': 115000,
      'USDT': 72000,
    }
    
    const defaultValue = defaultValues[tokenSymbol] || 100000 // 1M default
    
    // Sum the actual total and default value
    return actualTotal + defaultValue
  }

  const handleStake = async () => {
    if (!connected || !publicKey) {
      toast.error(t('dashboard.staking.pleaseConnectWallet'))
      return
    }

    const stakeAmount = parseFloat(amount)
    if (isNaN(stakeAmount) || stakeAmount <= 0) {
      toast.error(t('dashboard.staking.pleaseEnterValidAmount'))
      return
    }

    if (stakeAmount > userBalance) {
      toast.error(t('dashboard.staking.insufficientBalance'))
      return
    }

    setIsStaking(true)
    try {
      // Check if there is a referral code and get the referral address
      let referralAddress: PublicKey | undefined = undefined
      if (referralData?.referredBy) {
        const address = await getReferralAddressFromCode(referralData.referredBy)
        if (address) {
          referralAddress = new PublicKey(address)
          console.log('Staking with referral address:', address)
        } else {
          console.warn('Could not resolve referral code to address:', referralData.referredBy)
        }
      }
      
      await stakeTokens(tokenSymbol, stakeAmount, LockPeriod.OneYear, referralAddress)
      
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
      toast.error(t('dashboard.staking.pleaseEnterValidWithdrawalAmount'))
      return
    }

    const maxWithdraw = formatAmount(userStake.userStake.totalStaked, tokenInfo.decimals)
    if (withdrawValue > maxWithdraw) {
      toast.error(t('dashboard.staking.withdrawalAmountExceeds'))
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
    if (!userStake || !userStake?.pendingRewards) return

    setIsCompounding(true)
    try {
      // Compound by staking the pending rewards
      const compoundAmount = userStake?.pendingRewards
      
      const signature = await stakeTokens(
        tokenSymbol,
        compoundAmount,
        LockPeriod.OneYear
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
            {tokenInfo.icon && (
              <img src={tokenInfo.icon} className="w-12 h-12" alt={tokenInfo.name} />
            )}
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{tokenInfo.name}</CardTitle>
                {getRefreshIndicator()}
              </div>
              {poolInfo && (
                <p className="text-base text-foreground">
                  {t('dashboard.staking.poolTotal')}: <span className={blurIfLoading("font-extrabold text-lg")}>{formatNumber(getEnhancedPoolTotal())} {tokenSymbol}</span>
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            {connected && (
              <div className="mb-2">
                <div className="text-xs text-muted-foreground">{t('dashboard.staking.myTotalStaked')}</div>
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
              <Label htmlFor={`amount-${tokenSymbol}`}>{t('dashboard.staking.amountToStake')}</Label>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{t('dashboard.staking.available')}</p>
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
                className="transition-all duration-200 hover:scale-105"
              >
                {t('dashboard.staking.max')}
              </Button>
            </div>
          </div>


          <Button
            onClick={!connected ? () => setShowWalletSelector(true) : () => setShowTermsModal(true)}
            disabled={connected && (isStaking || !amount || parseFloat(amount) <= 0)}
            className="w-full btn-gradient-primary hover:gradient-hover transition-all duration-300 hover:scale-elevate"
          >
            {isStaking ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ArrowUpRight className="h-4 w-4 mr-2" />
            )}
            {!connected ? t('dashboard.staking.connectWallet') : t('dashboard.staking.stake')}
          </Button>
        </div>

        {/* Withdrawal Form - Only show if user has stakes */}
        {userStake && (
          <div className="space-y-4 pt-4 border-t">

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`withdraw-${tokenSymbol}`}>{t('dashboard.staking.amountToWithdraw')}</Label>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t('dashboard.staking.withdrawable')}</p>
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
                  className="transition-all duration-200 hover:scale-105"
                >
                  {t('dashboard.staking.max')}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={handleClaim}
                disabled={isClaiming || userStake?.pendingRewards <= 0}
                size="sm"
                className="btn-gradient-primary hover:gradient-hover transition-all duration-300 hover:scale-elevate"
              >
                {isClaiming ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                ) : (
                  <Coins className="h-4 w-4 mr-1 sm:mr-2" />
                )}
                <span className={blurIfLoading("")}>
                  <span className="hidden sm:inline">{t('dashboard.staking.claim')} </span>({userStake?.pendingRewards.toFixed(2)})
                </span>
              </Button>
              
              <Button
                onClick={handleCompound}
                disabled={isCompounding || userStake?.pendingRewards <= 0}
                variant="secondary"
                size="sm"
                className="transition-all duration-200 hover:scale-105"
              >
                {isCompounding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-1 sm:mr-2" />
                )}
                <span className="hidden sm:inline">{t('dashboard.staking.compound')}</span>
              </Button>
              
              <Button
                onClick={handleWithdraw}
                disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                variant="destructive"
                size="sm"
                className="transition-all duration-200 hover:scale-105"
              >
                {isWithdrawing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1 sm:mr-2" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 mr-1 sm:mr-2" />
                )}
                <span className="hidden sm:inline">{t('dashboard.staking.withdraw')}</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Terms Confirmation Modal */}
      {showTermsModal && mounted && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          onClick={() => setShowTermsModal(false)}
        >
          <div 
            className="relative max-w-md w-full max-h-[90vh] overflow-y-auto m-4 bg-background rounded-lg border shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Terms of Service</h3>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 bg-muted border rounded-full flex items-center justify-center hover:bg-muted/80 text-lg font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  By proceeding, you agree to our <a href="/terms" target="_blank" className="text-primary hover:underline">Terms of Service</a>.
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTermsModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowTermsModal(false)
                    handleStake()
                  }}
                  className="flex-1 btn-gradient-primary hover:gradient-hover"
                >
                  Proceed & Stake
                </Button>
              </div>
            </div>
          </div>
        </div>, 
        document.body
      )}

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
              {t('dashboard.staking.close')}
            </button>
            <WalletSelector onClose={() => setShowWalletSelector(false)} />
          </div>
        </div>, 
        document.body
      )}
    </Card>
  )
}
