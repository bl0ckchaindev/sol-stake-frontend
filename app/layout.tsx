import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { WalletProvider } from "@/context/wallet-provider"
import { MevStakingProvider } from "@/context/mev-staking-provider"
import { AnchorStakingProvider } from "@/context/anchor-staking-provider"
import { ReferralProvider } from "@/context/referral-provider"
import { TranslationProvider } from "@/context/translation-context"
import { ThemeProvider } from "@/context/theme-provider"
import { Toaster } from "sonner"
import { Suspense } from "react"
import { ToasterWrapper } from "@/components/shared/toaster-wrapper"
import { CookieConsent } from "@/components/shared/cookie-consent"
import "./globals.css"

export const metadata: Metadata = {
  title: "MEVStake - Advanced MEV Bot Staking on Solana",
  description:
    "Stake SOL, USDC, USDT and meme tokens with our MEV bot infrastructure. Earn 1% daily rewards from Maximum Extractable Value opportunities on Solana DeFi. Get 10% referral rewards!",
  keywords: "MEV, Solana, staking, DeFi, arbitrage, bot, cryptocurrency, rewards, yield farming",
  authors: [{ name: "MEVStake Team" }],
  creator: "MEVStake",
  publisher: "MEVStake",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mevstake.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MEVStake - Advanced MEV Bot Staking on Solana",
    description: "Earn 1% daily rewards from MEV bot operations. Get 10% referral rewards! Stake your tokens with institutional-grade security.",
    url: "https://mevstake.com",
    siteName: "MEVStake",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MEVStake - MEV Bot Staking Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MEVStake - Advanced MEV Bot Staking on Solana",
    description: "Earn 1% daily rewards from MEV bot operations. Get 10% referral rewards! Stake your tokens with institutional-grade security.",
    creator: "@mevstake",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TranslationProvider>
            <WalletProvider>
              <MevStakingProvider>
                <ReferralProvider>
                  <AnchorStakingProvider>
                    <Suspense>{children}</Suspense>
                  </AnchorStakingProvider>
                </ReferralProvider>
              </MevStakingProvider>
            </WalletProvider>
            <ToasterWrapper />
            <CookieConsent />
          </TranslationProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
