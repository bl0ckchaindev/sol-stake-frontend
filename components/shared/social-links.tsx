"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Twitter, Users, ExternalLink } from "lucide-react"

interface SocialLink {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const socialLinks: SocialLink[] = [
  {
    name: "X (Twitter)",
    href: "https://twitter.com/mevstake",
    icon: Twitter,
    description: "Follow us for updates and MEV insights",
  },
  {
    name: "Telegram",
    href: "https://t.me/MevSmartDefi",
    icon: Users,
    description: "Get real-time support and announcements",
  },
]

interface SocialLinksProps {
  variant?: "default" | "compact" | "footer"
  className?: string
}

export function SocialLinks({ variant = "default", className = "" }: SocialLinksProps) {
  if (variant === "compact") {
    return (
      <div className={`flex gap-3 ${className}`}>
        {socialLinks.map((link) => (
          <Button key={link.name} variant="outline" size="icon" asChild>
            <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.description}>
              <link.icon className="h-4 w-4" />
            </a>
          </Button>
        ))}
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <div className={`flex gap-4 ${className}`}>
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            title={link.description}
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {socialLinks.map((link) => (
        <Button key={link.name} variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent" asChild>
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            <link.icon className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">{link.name}</div>
              <div className="text-xs text-muted-foreground">{link.description}</div>
            </div>
            <ExternalLink className="h-3 w-3 absolute top-2 right-2 opacity-50" />
          </a>
        </Button>
      ))}
    </div>
  )
}
