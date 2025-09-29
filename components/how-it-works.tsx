"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Coins, TrendingUp, Wallet } from "lucide-react"
import { useTranslation } from "@/components/translation-context"

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      icon: Wallet,
      title: t('home.howitworks.steps.step1.title'),
      description: t('home.howitworks.steps.step1.description'),
      badge: t('home.howitworks.steps.step1.badge'),
    },
    {
      icon: Bot,
      title: t('home.howitworks.steps.step2.title'),
      description: t('home.howitworks.steps.step2.description'),
      badge: t('home.howitworks.steps.step2.badge'),
    },
    {
      icon: TrendingUp,
      title: t('home.howitworks.steps.step3.title'),
      description: t('home.howitworks.steps.step3.description'),
      badge: t('home.howitworks.steps.step3.badge'),
    },
    {
      icon: Coins,
      title: t('home.howitworks.steps.step4.title'),
      description: t('home.howitworks.steps.step4.description'),
      badge: t('home.howitworks.steps.step4.badge'),
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('home.howitworks.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {t('home.howitworks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-4">
                  {step.badge}
                </Badge>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
