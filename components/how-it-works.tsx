"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Coins, TrendingUp, Wallet } from "lucide-react"
import { useTranslation } from "@/components/translation-context"
import { MotionWrapper } from "@/components/motion-wrapper"

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
    <section id="how-it-works" className="py-24 lg:py-32 bg-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-64 h-64 opacity-10">
          <img src="/gradient-orb-1.svg" alt="" className="w-full h-full" />
        </div>
        <div className="absolute bottom-1/4 left-0 w-48 h-48 opacity-10">
          <img src="/gradient-orb-2.svg" alt="" className="w-full h-full" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <MotionWrapper type="slideUp" trigger="inView" className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 text-sm">
            {t('home.howitworks.badge')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-balance mb-6">
            {t('home.howitworks.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            {t('home.howitworks.subtitle')}
          </p>
        </MotionWrapper>

        {/* Timeline layout with connecting lines */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-accent transform -translate-y-1/2 z-0" />
          
          <MotionWrapper
            type="fadeIn"
            trigger="inView"
            className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative grid-equal-height"
            staggerChildren={0.3}
          >
            {steps.map((step, index) => (
              <MotionWrapper key={index} type="scale" delay={index * 0.2} trigger="inView" className="card-equal-height">
                <div className="relative group card-equal-height">
                  {/* Connection line between steps (desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 transform -translate-y-1/2 z-10">
                      <img src="/connection-line.svg" alt="" className="w-full h-full" />
                    </div>
                  )}
                  
                  <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-card border-border/50 backdrop-blur-sm card-equal-height">
                    <CardContent className="p-8 text-center card-content-equal-height items-center">
                      {/* Step number with gradient */}
                      <img src={`/step${index + 1}.png`} className="w-16 h-16 -mt-4 mb-4" alt={`Step ${index + 1}`} />
                      
                      <Badge variant="secondary" className="mb-4 bg-gradient-accent border-none">
                        {step.badge}
                      </Badge>
                      
                      <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                        {step.description}
                      </p>
                      
                      {/* Gradient accent bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </CardContent>
                  </Card>
                </div>
              </MotionWrapper>
            ))}
          </MotionWrapper>

          {/* Mobile timeline */}
          <div className="lg:hidden mt-12 space-y-8">
            {steps.map((step, index) => (
              <MotionWrapper key={index} type="slideUp" delay={index * 0.1} trigger="inView">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-accent" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-16 bg-gradient-accent mt-4" />
                    )}
                  </div>
                  <Card className="flex-1 bg-gradient-card border-border/50 backdrop-blur-sm h-full flex flex-col">
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <Badge variant="secondary" className="mb-3 bg-gradient-accent border-none">
                        {step.badge}
                      </Badge>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <MotionWrapper type="fadeIn" trigger="inView" className="text-center mt-20">
          <div className="bg-gradient-card rounded-2xl p-8 max-w-2xl mx-auto border border-border/50 backdrop-blur-sm">
            <img src="/mev.png" className="w-32 h-auto text-accent mx-auto mb-3" />
            <h3 className="text-2xl font-bold mb-4">{t('home.howitworks.cta.title')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('home.howitworks.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">1%</div>
                <div className="text-sm text-muted-foreground">{t('home.howitworks.cta.dailyReturns')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">365%</div>
                <div className="text-sm text-muted-foreground">{t('home.howitworks.cta.apy')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">90</div>
                <div className="text-sm text-muted-foreground">{t('home.howitworks.cta.dayLock')}</div>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  )
}
