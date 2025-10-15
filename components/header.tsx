"use client"

import { WalletButton } from "@/components/wallet-button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/components/translation-context"
import { MotionWrapper } from "@/components/motion-wrapper"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Bot } from "lucide-react"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  const navigation = [
    { name: t('common.header.navigation.home'), href: "/", current: pathname === "/" },
    { name: t('common.header.navigation.dashboard'), href: "/dashboard", current: pathname === "/dashboard" },
    { name: t('common.header.navigation.referrals'), href: "/referrals", current: pathname === "/referrals" },
    { name: t('common.header.navigation.mevTracker'), href: "/mev-tracker", current: pathname === "/mev-tracker" },
  ]

  return (
    <MotionWrapper type="slideDown" className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <MotionWrapper type="slideRight" delay={0.1} className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <img width={96} height={48} src="/mev.png" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MEVStake</h1>
              <p className="text-xs text-muted-foreground">MEV Bot Infrastructure</p>
            </div>
          </Link>
        </MotionWrapper>

        <MotionWrapper type="fadeIn" delay={0.2} className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-all duration-200 px-3 py-2 rounded-md text-sm font-medium ${
                  item.current
                    ? "text-foreground bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <MotionWrapper type="fadeIn" delay={0.3 + index * 0.1}>
                  {item.name}
                </MotionWrapper>
              </Link>
            ))}
          </nav>
        </MotionWrapper>

        <MotionWrapper type="slideLeft" delay={0.4} className="flex items-center gap-3">
          <div className="flex flex-row gap-3 max-sm:hidden">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
          <WalletButton />

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border border-background animate-pulse" />
                  </div>
                  <div>
                    <h2 className="font-bold">MEVStake</h2>
                    <p className="text-xs text-muted-foreground">MEV Bot Infrastructure</p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={`mobile-${item.name}`}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                        item.current
                          ? "text-foreground bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="flex items-center gap-3 pt-4 border-t">
                  <LanguageSwitcher />
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </MotionWrapper>
      </div>
    </MotionWrapper>
  )
}