"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/context/translation-context"
import { MotionWrapper } from "@/components/shared/motion-wrapper"
import { CountdownTimer } from "@/components/home/countdown-timer"

export function LandingHero() {
  const { t } = useTranslation()

  return (
    <MotionWrapper type="fadeIn" className="relative overflow-hidden bg-background">
      {/* Hero background image - lowest z-index */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0" style={{ backgroundImage: "url('/hero-background.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
      </div>
      
      {/* Floating gradient orbs background - middle z-index */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-20 left-10 w-48 h-48 animate-float opacity-30 dark:opacity-5">
          <img src="/gradient-orb-1.svg" alt="" className="w-full h-full" />
        </div>
        <div className="absolute top-40 right-20 w-32 h-32 animate-float opacity-25 dark:opacity-5" style={{ animationDelay: '1s' }}>
          <img src="/gradient-orb-2.svg" alt="" className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 animate-float opacity-20 dark:opacity-5" style={{ animationDelay: '2s' }}>
          <img src="/gradient-orb-1.svg" alt="" className="w-full h-full" />
        </div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 animate-float opacity-15 dark:opacity-5" style={{ animationDelay: '0.5s' }}>
          <img src="/gradient-orb-2.svg" alt="" className="w-full h-full" />
        </div>
      </div>

      {/* Enhanced announcement bar with gradient - highest z-index */}
      <MotionWrapper type="slideDown" delay={0.1} className="bg-gradient-accent border-b relative z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="w-2 h-2 bg-gradient-primary rounded-full animate-pulse" />
            <span className="text-muted-foreground font-medium">{t('home.hero.announcement')}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </MotionWrapper>

      <div className="container mx-auto px-4 py-24 lg:py-32 relative z-20">
        <div className="max-w-6xl mx-auto">
          {/* Main hero content with split layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Main content */}
            <MotionWrapper type="slideUp" delay={0.2} className="text-center lg:text-left">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                    <span className="text-foreground">
                      {t('home.hero.title')}
                    </span>
                    <br />
                    <span className="text-muted-foreground">
                      {t('home.hero.subtitle')}
                    </span>
                  </h1>
                  
                  <p className="text-xl text-foreground text-balance max-w-2xl leading-relaxed">
                    {t('home.hero.description')}
                  </p>
                </div>

                {/* Enhanced countdown timer */}
                {/* <MotionWrapper type="fadeIn" delay={0.9} className="mt-12">
                  <div className="max-w-2xl mx-auto lg:mx-0">
                    <CountdownTimer targetDate="2025-10-10T10:00:00Z" />
                  </div>
                </MotionWrapper> */}

                {/* Trust indicators */}
                <MotionWrapper type="fadeIn" delay={1.0} className="mt-5 sm:col-span-2">
                  <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-center">
                    <div className="flex items-center gap-2">
                      <img src="/audited-contract.png" className="w-12 h-12 text-accent" />
                      <span className="text-sm text-muted-foreground">{t('home.hero.trustIndicators.auditedContracts')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/24_7-monitoring.png" className="w-12 h-12 text-accent" />
                      <span className="text-sm text-muted-foreground">{t('home.hero.trustIndicators.monitoring')}</span>
                    </div>
                  </div>
                </MotionWrapper>

                <MotionWrapper type="slideUp" delay={0.4} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-center mt-15">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 btn-gradient-primary hover:gradient-hover transition-all duration-300 hover:scale-elevate"
                    asChild
                  >
                    <Link href="/dashboard">
                      {t('home.hero.buttons.startStaking')}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-6 border-2 hover:bg-card/50 hover:border-accent/50 transition-all duration-300"
                    asChild
                  >
                    <Link href="#how-it-works">{t('home.hero.buttons.learnMore')}</Link>
                  </Button>
                </MotionWrapper>
              </div>
            </MotionWrapper>

            {/* Right column - Feature cards grid */}
            <MotionWrapper
              type="fadeIn"
              delay={0.6}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              staggerChildren={0.2}
            >
              <MotionWrapper type="scale" delay={0.7}>
                <div className="bg-card/50 rounded-2xl p-6 border border-border backdrop-blur-xl hover:gradient-hover transition-all duration-300 hover:scale-elevate group h-full flex flex-col">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src="/mev-extraction.png" className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('home.hero.features.mevExtraction.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {t('home.hero.features.mevExtraction.description')}
                  </p>
                </div>
              </MotionWrapper>

              <MotionWrapper type="scale" delay={0.8}>
                <div className="bg-card/50 rounded-2xl p-6 border border-border backdrop-blur-xl hover:gradient-hover transition-all duration-300 hover:scale-elevate group h-full flex flex-col">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src="/secure-staking.png" className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('home.hero.features.secureStaking.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {t('home.hero.features.secureStaking.description')}
                  </p>
                </div>
              </MotionWrapper>

              <MotionWrapper type="scale" delay={0.9} className="sm:col-span-2">
                <div className="bg-card/50 rounded-2xl p-6 border border-border backdrop-blur-xl hover:gradient-hover transition-all duration-300 hover:scale-elevate group">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src="/daily-rewards.png" className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('home.hero.features.dailyRewards.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t('home.hero.features.dailyRewards.description')}
                  </p>
                </div>
              </MotionWrapper>

            </MotionWrapper>
          </div>

        </div>
      </div>
    </MotionWrapper>
  )
}