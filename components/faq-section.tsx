"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown, HelpCircle, Shield, DollarSign, Clock, Users, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "@/components/translation-context"
import { MotionWrapper } from "@/components/motion-wrapper"
import { motion, AnimatePresence } from "framer-motion"

interface FAQItem {
  id: string
  question: string
  answer: string
  category: "general" | "staking" | "rewards" | "security" | "referrals"
  icon: React.ComponentType<{ className?: string }>
}

export function FAQSection() {
  const { t } = useTranslation()
  const [openItems, setOpenItems] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const faqData: FAQItem[] = [
    {
      id: "what-is-mev",
      question: t('home.faq.items.whatIsMev.question'),
      answer: t('home.faq.items.whatIsMev.answer'),
      category: "general",
      icon: HelpCircle,
    },
    {
      id: "how-staking-works",
      question: t('home.faq.items.howStakingWorks.question'),
      answer: t('home.faq.items.howStakingWorks.answer'),
      category: "staking",
      icon: DollarSign,
    },
    {
      id: "supported-tokens",
      question: t('home.faq.items.supportedTokens.question'),
      answer: t('home.faq.items.supportedTokens.answer'),
      category: "staking",
      icon: DollarSign,
    },
    {
      id: "daily-rewards",
      question: t('home.faq.items.dailyRewards.question'),
      answer: t('home.faq.items.dailyRewards.answer'),
      category: "rewards",
      icon: DollarSign,
    },
    {
      id: "lock-period",
      question: t('home.faq.items.lockPeriod.question'),
      answer: t('home.faq.items.lockPeriod.answer'),
      category: "staking",
      icon: Clock,
    },
    {
      id: "security-measures",
      question: t('home.faq.items.securityMeasures.question'),
      answer: t('home.faq.items.securityMeasures.answer'),
      category: "security",
      icon: Shield,
    },
    {
      id: "referral-program",
      question: t('home.faq.items.referralProgram.question'),
      answer: t('home.faq.items.referralProgram.answer'),
      category: "referrals",
      icon: Users,
    },
    {
      id: "referral-tiers",
      question: t('home.faq.items.referralTiers.question'),
      answer: t('home.faq.items.referralTiers.answer'),
      category: "referrals",
      icon: Users,
    },
    {
      id: "risks-involved",
      question: t('home.faq.items.risksInvolved.question'),
      answer: t('home.faq.items.risksInvolved.answer'),
      category: "security",
      icon: AlertTriangle,
    },
    {
      id: "minimum-stake",
      question: t('home.faq.items.minimumStake.question'),
      answer: t('home.faq.items.minimumStake.answer'),
      category: "staking",
      icon: DollarSign,
    },
    {
      id: "bot-performance",
      question: t('home.faq.items.botPerformance.question'),
      answer: t('home.faq.items.botPerformance.answer'),
      category: "general",
      icon: HelpCircle,
    },
  ]

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const categories = [
    { id: "all", label: t('home.faq.categories.all'), count: faqData.length },
    { id: "general", label: t('home.faq.categories.general'), count: faqData.filter((item) => item.category === "general").length },
    { id: "staking", label: t('home.faq.categories.staking'), count: faqData.filter((item) => item.category === "staking").length },
    { id: "rewards", label: t('home.faq.categories.rewards'), count: faqData.filter((item) => item.category === "rewards").length },
    { id: "security", label: t('home.faq.categories.security'), count: faqData.filter((item) => item.category === "security").length },
    { id: "referrals", label: t('home.faq.categories.referrals'), count: faqData.filter((item) => item.category === "referrals").length },
  ]

  const filteredFAQs =
    selectedCategory === "all" ? faqData : faqData.filter((item) => item.category === selectedCategory)

  return (
    <section id="faq" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <MotionWrapper type="slideUp" trigger="inView" className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('home.faq.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {t('home.faq.subtitle')}
          </p>
        </MotionWrapper>

        <div className="max-w-4xl mx-auto">
          {/* Category Filter */}
          <MotionWrapper type="fadeIn" trigger="inView" className="flex flex-wrap gap-2 mb-8 justify-center" staggerChildren={0.1}>
            {categories.map((category, index) => (
              <MotionWrapper key={category.id} type="scale" delay={index * 0.1} trigger="inView">
                <Button
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-sm"
                >
                  {category.label} ({category.count})
                </Button>
              </MotionWrapper>
            ))}
          </MotionWrapper>

          {/* FAQ Items */}
          <MotionWrapper type="fadeIn" trigger="inView" className="space-y-4" staggerChildren={0.1}>
            {filteredFAQs.map((faq, index) => (
              <MotionWrapper key={faq.id} type="slideUp" delay={index * 0.05} trigger="inView">
                <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <faq.icon className="h-5 w-5 text-primary" />
                            <CardTitle className="text-left text-lg">{faq.question}</CardTitle>
                          </div>
                          <motion.div
                            animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                          >
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <AnimatePresence>
                      {openItems.includes(faq.id) && (
                        <CollapsibleContent asChild>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <CardContent className="pt-0">
                              <motion.p
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                                className="text-muted-foreground leading-relaxed"
                              >
                                {faq.answer}
                              </motion.p>
                            </CardContent>
                          </motion.div>
                        </CollapsibleContent>
                      )}
                    </AnimatePresence>
                  </Collapsible>
                </Card>
              </MotionWrapper>
            ))}
          </MotionWrapper>
        </div>
      </div>
    </section>
  )
}
