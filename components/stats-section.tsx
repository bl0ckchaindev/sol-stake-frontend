"use client"

import { Card, CardContent } from "@/components/ui/card"

export function StatsSection() {
  const stats = [
    {
      value: "$2M+",
      label: "Total Value Locked",
      description: "Assets secured in our MEV infrastructure",
    },
    {
      value: "365%",
      label: "Annual Percentage Yield",
      description: "Based on 1% daily compound returns",
    },
    {
      value: "99.9%",
      label: "Uptime Guarantee",
      description: "Institutional-grade MEV bot reliability",
    },
    {
      value: "24/7",
      label: "MEV Monitoring",
      description: "Continuous opportunity identification",
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Platform Performance</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Our MEV bot infrastructure delivers consistent, transparent results for institutional and retail stakers.
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
