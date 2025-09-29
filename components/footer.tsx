import Link from "next/link"
import { SocialLinks } from "./social-links"

export function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <h3 className="text-lg font-bold">MEVStake</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Advanced MEV bot infrastructure for Solana DeFi staking with institutional-grade security and transparent
              rewards.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Platform</h4>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/mev-tracker"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                MEV Bot Tracker
              </Link>
              <Link
                href="/referrals"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Referrals
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <div className="space-y-2">
              <Link
                href="/terms"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms#risk"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Risk Disclosure
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Follow Us</h4>
            <SocialLinks variant="footer" />
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} MEVStake. All rights reserved. Built on Solana.
          </p>
        </div>
      </div>
    </footer>
  )
}
