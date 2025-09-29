"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Coins, TrendingUp, Wallet } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Wallet,
      title: "Connect & Stake",
      description: "Connect your Solana wallet and stake SOL, USDC, USDT, or meme tokens with our platform.",
      badge: "Step 1",
    },
    {
      icon: Bot,
      title: "MEV Bot Deployment",
      description:
        "Your staked funds are deployed across our MEV bot infrastructure to capture arbitrage opportunities.",
      badge: "Step 2",
    },
    {
      icon: TrendingUp,
      title: "Value Extraction",
      description: "Our bots identify and execute profitable trades, liquidations, and arbitrage across Solana DEXs.",
      badge: "Step 3",
    },
    {
      icon: Coins,
      title: "Reward Distribution",
      description: "Earn 1% daily rewards from MEV profits while your principal remains locked for 90 days.",
      badge: "Step 4",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">How MEV Staking Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Our sophisticated MEV bot infrastructure generates consistent returns by capturing Maximum Extractable Value
            opportunities across the Solana ecosystem.
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
