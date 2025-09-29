"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/components/translation-context"

export function StatsSection() {
  const { t } = useTranslation()

  const stats = [
    {
      value: t('home.stats.items.tvl.value'),
      label: t('home.stats.items.tvl.label'),
      description: t('home.stats.items.tvl.description'),
    },
    {
      value: t('home.stats.items.apy.value'),
      label: t('home.stats.items.apy.label'),
      description: t('home.stats.items.apy.description'),
    },
    {
      value: t('home.stats.items.uptime.value'),
      label: t('home.stats.items.uptime.label'),
      description: t('home.stats.items.uptime.description'),
    },
    {
      value: t('home.stats.items.monitoring.value'),
      label: t('home.stats.items.monitoring.label'),
      description: t('home.stats.items.monitoring.description'),
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t('home.stats.title')}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {t('home.stats.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                <p className="text-muted-foreground text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
