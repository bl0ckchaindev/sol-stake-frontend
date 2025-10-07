"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/components/translation-context"
import { MotionWrapper } from "@/components/motion-wrapper"
import { TrendingUp, Activity, Clock } from "lucide-react"

export function StatsSection() {
  const { t } = useTranslation()

  const stats = [
    {
      icon: "/tvl.png",
      value: t('home.stats.items.tvl.value'),
      label: t('home.stats.items.tvl.label'),
      description: t('home.stats.items.tvl.description'),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: "/apy.png",
      value: t('home.stats.items.apy.value'),
      label: t('home.stats.items.apy.label'),
      description: t('home.stats.items.apy.description'),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: "/uptime.png",
      value: t('home.stats.items.uptime.value'),
      label: t('home.stats.items.uptime.label'),
      description: t('home.stats.items.uptime.description'),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: "/24_7.png",
      value: t('home.stats.items.monitoring.value'),
      label: t('home.stats.items.monitoring.label'),
      description: t('home.stats.items.monitoring.description'),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <MotionWrapper type="slideUp" trigger="inView" className="text-center mb-20">
          <Badge variant="secondary" className="mb-4 text-sm">
            {t('home.stats.badge')}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-balance mb-6">
            {t('home.stats.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            {t('home.stats.subtitle')}
          </p>
        </MotionWrapper>

        <MotionWrapper
          type="fadeIn"
          trigger="inView"
          className="flex flex-wrap gap-8 items-stretch"
          staggerChildren={0.15}
        >
          {stats.map((stat, index) => (
            <MotionWrapper key={index} type="scale" delay={index * 0.1} trigger="inView" className="flex-1 min-w-[250px]">
              <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-card border-border/50 backdrop-blur-sm h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img src={stat.icon} className="w-12 h-12 text-accent" />
                  </div>
                  <MotionWrapper type="slideUp" delay={0.1}>
                    <div className="text-4xl lg:text-5xl font-bold mb-3 text-foreground">
                      {stat.value}
                    </div>
                  </MotionWrapper>
                  <MotionWrapper type="slideUp" delay={0.2}>
                    <div className="text-xl font-semibold mb-3">{stat.label}</div>
                  </MotionWrapper>
                  <MotionWrapper type="slideUp" delay={0.3} className="flex-1">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {stat.description}
                    </p>
                  </MotionWrapper>
                  <div className="absolute inset-0 bg-gradient-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </CardContent>
              </Card>
            </MotionWrapper>
          ))}
        </MotionWrapper>

        {/* Additional performance indicators */}
        <MotionWrapper type="fadeIn" trigger="inView" className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 backdrop-blur-sm text-center">
              <img src="/consistent-rewards.png" className="w-12 h-12 text-accent mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2 text-foreground">{t('home.stats.additional.consistentReturns.title')}</h4>
              <p className="text-muted-foreground text-sm">{t('home.stats.additional.consistentReturns.description')}</p>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 backdrop-blur-sm text-center">
              <img src="/real-time-monitoring.png" className="w-12 h-12 text-accent mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2 text-foreground">{t('home.stats.additional.realtimeMonitoring.title')}</h4>
              <p className="text-muted-foreground text-sm">{t('home.stats.additional.realtimeMonitoring.description')}</p>
            </div>
            
            <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 backdrop-blur-sm text-center">
              <img src="/instant-rewards.png" className="w-12 h-12 text-accent mx-auto mb-3" />
              <h4 className="text-lg font-semibold mb-2 text-foreground">{t('home.stats.additional.instantRewards.title')}</h4>
              <p className="text-muted-foreground text-sm">{t('home.stats.additional.instantRewards.description')}</p>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  )
}
