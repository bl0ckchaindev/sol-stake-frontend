"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/components/translation-context"

export function LandingHero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="bg-accent/10 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-muted-foreground">{t('home.hero.announcement')}</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
            {t('home.hero.title')}
            <br />
            <span className="text-muted-foreground">{t('home.hero.subtitle')}</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('home.hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/dashboard">
                {t('home.hero.buttons.startStaking')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="#how-it-works">{t('home.hero.buttons.learnMore')}</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-card border rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.hero.features.mevExtraction.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('home.hero.features.mevExtraction.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-card border rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.hero.features.secureStaking.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('home.hero.features.secureStaking.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-card border rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('home.hero.features.dailyRewards.title')}</h3>
              <p className="text-muted-foreground text-sm">
                {t('home.hero.features.dailyRewards.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}