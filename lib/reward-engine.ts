export interface RewardCalculation {
  dailyReward: number
  totalAccruedRewards: number
  claimableRewards: number
  projectedTotalRewards: number
  daysElapsed: number
  daysRemaining: number
  completionPercentage: number
}

export interface StakeRewardParams {
  principal: number
  dailyRate: number
  startDate: Date
  lockPeriodDays: number
  claimedRewards: number
  currentDate?: Date
}

export class RewardEngine {
  private static readonly DAILY_RATE = 0.01 // 1% daily
  private static readonly LOCK_PERIOD_DAYS = 365
  private static readonly SECONDS_PER_DAY = 24 * 60 * 60 * 1000

  /**
   * Calculate comprehensive reward information for a stake position
   */
  static calculateRewards(params: StakeRewardParams): RewardCalculation {
    const {
      principal,
      dailyRate = this.DAILY_RATE,
      startDate,
      lockPeriodDays = this.LOCK_PERIOD_DAYS,
      claimedRewards,
      currentDate = new Date(),
    } = params

    // Calculate time elapsed
    const timeElapsed = currentDate.getTime() - startDate.getTime()
    const daysElapsed = Math.max(0, Math.floor(timeElapsed / this.SECONDS_PER_DAY))
    const daysRemaining = Math.max(0, lockPeriodDays - daysElapsed)
    const completionPercentage = Math.min((daysElapsed / lockPeriodDays) * 100, 100)

    // Calculate daily reward amount
    const dailyReward = principal * dailyRate

    // Calculate total accrued rewards (capped at lock period)
    const effectiveDays = Math.min(daysElapsed, lockPeriodDays)
    const totalAccruedRewards = effectiveDays * dailyReward

    // Calculate claimable rewards (accrued minus already claimed)
    const claimableRewards = Math.max(0, totalAccruedRewards - claimedRewards)

    // Calculate projected total rewards for full lock period
    const projectedTotalRewards = lockPeriodDays * dailyReward

    return {
      dailyReward,
      totalAccruedRewards,
      claimableRewards,
      projectedTotalRewards,
      daysElapsed,
      daysRemaining,
      completionPercentage,
    }
  }

  /**
   * Calculate compound rewards (if enabled in future)
   */
  static calculateCompoundRewards(
    principal: number,
    dailyRate: number,
    days: number,
    compoundFrequency: "daily" | "weekly" | "monthly" = "daily",
  ): number {
    let periodsPerDay: number
    switch (compoundFrequency) {
      case "daily":
        periodsPerDay = 1
        break
      case "weekly":
        periodsPerDay = 1 / 7
        break
      case "monthly":
        periodsPerDay = 1 / 30
        break
    }

    const periodsElapsed = days * periodsPerDay
    const ratePerPeriod = dailyRate / periodsPerDay

    return principal * Math.pow(1 + ratePerPeriod, periodsElapsed) - principal
  }

  /**
   * Calculate early withdrawal penalty (if applicable)
   */
  static calculateEarlyWithdrawalPenalty(
    principal: number,
    daysElapsed: number,
    lockPeriodDays: number,
    penaltyRate = 0.1, // 10% penalty
  ): number {
    if (daysElapsed >= lockPeriodDays) {
      return 0 // No penalty after lock period
    }

    const remainingDays = lockPeriodDays - daysElapsed
    const penaltyFactor = remainingDays / lockPeriodDays
    return principal * penaltyRate * penaltyFactor
  }

  /**
   * Calculate APY based on daily rate
   */
  static calculateAPY(dailyRate: number): number {
    return (Math.pow(1 + dailyRate, 365) - 1) * 100
  }

  /**
   * Calculate total portfolio rewards across multiple stakes
   */
  static calculatePortfolioRewards(stakes: Array<StakeRewardParams>): {
    totalStaked: number
    totalDailyRewards: number
    totalAccruedRewards: number
    totalClaimableRewards: number
    totalProjectedRewards: number
    averageAPY: number
  } {
    const calculations = stakes.map((stake) => ({
      stake,
      rewards: this.calculateRewards(stake),
    }))

    const totalStaked = stakes.reduce((sum, stake) => sum + stake.principal, 0)
    const totalDailyRewards = calculations.reduce((sum, calc) => sum + calc.rewards.dailyReward, 0)
    const totalAccruedRewards = calculations.reduce((sum, calc) => sum + calc.rewards.totalAccruedRewards, 0)
    const totalClaimableRewards = calculations.reduce((sum, calc) => sum + calc.rewards.claimableRewards, 0)
    const totalProjectedRewards = calculations.reduce((sum, calc) => sum + calc.rewards.projectedTotalRewards, 0)

    // Calculate weighted average APY
    const weightedAPYSum = stakes.reduce((sum, stake) => {
      const apy = this.calculateAPY(stake.dailyRate || this.DAILY_RATE)
      return sum + apy * stake.principal
    }, 0)
    const averageAPY = totalStaked > 0 ? weightedAPYSum / totalStaked : 0

    return {
      totalStaked,
      totalDailyRewards,
      totalAccruedRewards,
      totalClaimableRewards,
      totalProjectedRewards,
      averageAPY,
    }
  }

  /**
   * Get next reward claim time
   */
  static getNextRewardTime(startDate: Date, currentDate: Date = new Date()): Date {
    const daysSinceStart = Math.floor((currentDate.getTime() - startDate.getTime()) / this.SECONDS_PER_DAY)
    const nextRewardDay = daysSinceStart + 1
    return new Date(startDate.getTime() + nextRewardDay * this.SECONDS_PER_DAY)
  }

  /**
   * Validate staking parameters
   */
  static validateStakeParams(params: StakeRewardParams): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (params.principal <= 0) {
      errors.push("Principal amount must be greater than 0")
    }

    if (params.dailyRate < 0 || params.dailyRate > 1) {
      errors.push("Daily rate must be between 0 and 1")
    }

    if (params.lockPeriodDays <= 0) {
      errors.push("Lock period must be greater than 0 days")
    }

    if (params.claimedRewards < 0) {
      errors.push("Claimed rewards cannot be negative")
    }

    if (params.startDate > new Date()) {
      errors.push("Start date cannot be in the future")
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}
