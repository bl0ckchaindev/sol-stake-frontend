"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, HelpCircle, Shield, DollarSign, Clock, Users, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "@/context/translation-context"
import { MotionWrapper } from "@/components/shared/motion-wrapper"
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
      icon: HelpCircle,
    },
    {
      id: "supported-tokens",
      question: t('home.faq.items.supportedTokens.question'),
      answer: t('home.faq.items.supportedTokens.answer'),
      category: "staking",
      icon: HelpCircle,
    },
    {
      id: "daily-rewards",
      question: t('home.faq.items.dailyRewards.question'),
      answer: t('home.faq.items.dailyRewards.answer'),
      category: "rewards",
      icon: HelpCircle,
    },
    {
      id: "lock-period",
      question: t('home.faq.items.lockPeriod.question'),
      answer: t('home.faq.items.lockPeriod.answer'),
      category: "staking",
      icon: HelpCircle,
    },
    {
      id: "security-measures",
      question: t('home.faq.items.securityMeasures.question'),
      answer: t('home.faq.items.securityMeasures.answer'),
      category: "security",
      icon: HelpCircle,
    },
    {
      id: "referral-program",
      question: t('home.faq.items.referralProgram.question'),
      answer: t('home.faq.items.referralProgram.answer'),
      category: "referrals",
      icon: HelpCircle,
    },
    {
      id: "referral-tiers",
      question: t('home.faq.items.referralTiers.question'),
      answer: t('home.faq.items.referralTiers.answer'),
      category: "referrals",
      icon: HelpCircle,
    },
    {
      id: "risks-involved",
      question: t('home.faq.items.risksInvolved.question'),
      answer: t('home.faq.items.risksInvolved.answer'),
      category: "security",
      icon: HelpCircle,
    },
    {
      id: "minimum-stake",
      question: t('home.faq.items.minimumStake.question'),
      answer: t('home.faq.items.minimumStake.answer'),
      category: "staking",
      icon: HelpCircle,
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
    <section id="faq" className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <MotionWrapper type="slideUp" trigger="inView" className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 text-sm">
            {t('home.faq.badge')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-balance mb-6">
            {t('home.faq.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            {t('home.faq.subtitle')}
          </p>
        </MotionWrapper>

        <div className="max-w-4xl mx-auto">
          {/* Enhanced Category Filter with gradient indicators */}
          <MotionWrapper type="fadeIn" trigger="inView" className="flex flex-wrap gap-3 mb-12 justify-center" staggerChildren={0.1}>
            {categories.map((category, index) => (
              <MotionWrapper key={category.id} type="scale" delay={index * 0.1} trigger="inView">
                <Button
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-sm px-3 py-3 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "btn-gradient-primary hover:gradient-hover shadow-lg"
                      : "hover:bg-gradient-card hover:border-accent/50"
                  }`}
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2 bg-[#9993]">
                    {category.count}
                  </Badge>
                </Button>
              </MotionWrapper>
            ))}
          </MotionWrapper>

          {/* FAQ Items with enhanced design */}
          <MotionWrapper type="fadeIn" trigger="inView" className="space-y-4" staggerChildren={0.1}>
            {filteredFAQs.map((faq, index) => (
              <MotionWrapper key={faq.id} type="slideUp" delay={index * 0.05} trigger="inView">
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-card border-border/50 backdrop-blur-sm">
                  <Collapsible open={openItems.includes(faq.id)} onOpenChange={() => toggleItem(faq.id)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-gradient-hover transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                              <faq.icon className="h-5 w-5 text-accent" />
                            </div>
                            <CardTitle className="text-left text-lg font-semibold">
                              {faq.question}
                            </CardTitle>
                          </div>
                          <motion.div
                            animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center"
                          >
                            <ChevronDown className="h-4 w-4 text-accent" />
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
                            <CardContent className="pt-0 pb-6">
                              <motion.p
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                                className="text-muted-foreground leading-relaxed pl-14"
                              >
                                {faq.answer}
                              </motion.p>
                            </CardContent>
                          </motion.div>
                        </CollapsibleContent>
                      )}
                    </AnimatePresence>
                  </Collapsible>
                  
                  {/* Gradient accent bar that animates */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: openItems.includes(faq.id) ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                  />
                </Card>
              </MotionWrapper>
            ))}
          </MotionWrapper>

          {/* Additional support section */}
          <MotionWrapper type="fadeIn" trigger="inView" className="text-center mt-16">
            <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
              <img src="/community.png" className="w-24 h-24 text-accent mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-4">{t('home.faq.support.title')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('home.faq.support.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="btn-gradient-primary hover:gradient-hover"
                  asChild
                >
                  <a 
                    href="mailto:support@mevstake.fi"
                    className="flex items-center gap-2"
                  >
                    {t('home.faq.support.contactSupport')}
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="hover:bg-gradient-card"
                  asChild
                >
                  <a 
                    href="https://t.me/MevSmartDefi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {t('home.faq.support.joinCommunity')}
                  </a>
                </Button>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>
    </section>
  )
}
