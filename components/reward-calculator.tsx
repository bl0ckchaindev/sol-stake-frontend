"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RewardEngine } from "@/lib/reward-engine"
import { useState, useEffect } from "react"
import { Calculator, TrendingUp, Calendar, Coins } from "lucide-react"
import { useTranslation } from './translation-context'
import { motion } from "framer-motion"

export function RewardCalculator() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("100")
  const [days, setDays] = useState("90")
  const [calculation, setCalculation] = useState<any>(null)

  useEffect(() => {
    const principal = Number.parseFloat(amount) || 0
    const lockDays = Number.parseInt(days) || 90

    if (principal > 0) {
      const startDate = new Date()
      const endDate = new Date(startDate.getTime() + lockDays * 24 * 60 * 60 * 1000)

      const rewards = RewardEngine.calculateRewards({
        principal,
        dailyRate: 0.01,
        startDate,
        lockPeriodDays: lockDays,
        claimedRewards: 0,
        currentDate: endDate, // Calculate as if at end of period
      })

      setCalculation(rewards)
    }
  }, [amount, days])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {t('dashboard.calculator.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="calc-amount">{t('dashboard.calculator.stakeAmount')}</Label>
            <Input
              id="calc-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="transition-all duration-200 focus:scale-105"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="calc-days">{t('dashboard.calculator.lockPeriod')}</Label>
            <Input
              id="calc-days"
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="90"
              className="transition-all duration-200 focus:scale-105"
            />
          </div>
        </motion.div>

        {calculation && (
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="space-y-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                {t('dashboard.calculator.dailyReward')}
              </div>
              <motion.div
                className="text-2xl font-bold text-success"
                key={calculation.dailyReward}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {calculation.dailyReward.toFixed(4)} SOL
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Coins className="h-4 w-4" />
                {t('dashboard.calculator.totalRewards')}
              </div>
              <motion.div
                className="text-2xl font-bold text-success"
                key={calculation.projectedTotalRewards}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {calculation.projectedTotalRewards.toFixed(4)} SOL
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {t('dashboard.calculator.apy')}
              </div>
              <motion.div
                className="text-2xl font-bold text-primary"
                key={RewardEngine.calculateAPY(0.01)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {RewardEngine.calculateAPY(0.01).toFixed(0)}%
              </motion.div>
            </motion.div>

            <motion.div
              className="space-y-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                {t('dashboard.calculator.finalAmount')}
              </div>
              <motion.div
                className="text-2xl font-bold"
                key={Number.parseFloat(amount) + calculation.projectedTotalRewards}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {(Number.parseFloat(amount) + calculation.projectedTotalRewards).toFixed(4)} SOL
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <p>
            <strong>{t('dashboard.calculator.note')}:</strong> {t('dashboard.calculator.noteText')}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  )
}