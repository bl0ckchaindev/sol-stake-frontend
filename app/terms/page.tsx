import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By accessing and using MEVStake ("the Platform"), you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              MEVStake is a decentralized finance (DeFi) platform that allows users to stake Solana-based tokens (SOL,
              USDC, USDT, and select meme tokens) to participate in Maximum Extractable Value (MEV) bot operations. Our
              MEV bots capture arbitrage opportunities, liquidations, and other profitable transactions across Solana
              decentralized exchanges.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Users receive daily rewards of approximately 1% based on MEV bot performance, with a mandatory 90-day lock
              period for staked assets. Rewards can be claimed daily while the principal remains locked.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Risk Disclosure</h2>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-warning mb-2">Important Risk Warning</h3>
              <p className="text-sm leading-relaxed">
                Cryptocurrency staking and MEV bot operations involve significant financial risks. Past performance does
                not guarantee future results. You may lose some or all of your staked assets.
              </p>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>MEV bot performance is subject to market conditions and competition</li>
              <li>Smart contract risks and potential vulnerabilities</li>
              <li>Solana network risks including downtime and congestion</li>
              <li>Regulatory risks in your jurisdiction</li>
              <li>Liquidity risks during the 90-day lock period</li>
              <li>Impermanent loss and slippage risks</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Staking Terms</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Minimum staking period: 90 days from deposit</li>
              <li>Target daily rewards: 1% (subject to MEV bot performance)</li>
              <li>Supported tokens: SOL, USDC, USDT, and approved meme tokens</li>
              <li>Rewards are distributed based on actual MEV bot profits</li>
              <li>Early withdrawal is not permitted during the lock period</li>
              <li>Platform reserves the right to adjust reward rates based on performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Maintain security of your wallet and private keys</li>
              <li>Verify all transaction details before confirming</li>
              <li>Comply with applicable laws and regulations in your jurisdiction</li>
              <li>Not use the platform for illegal activities or money laundering</li>
              <li>Understand the risks associated with cryptocurrency staking</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Platform Limitations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              MEVStake operates on a best-effort basis. We do not guarantee:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Specific reward rates or returns</li>
              <li>Continuous platform availability</li>
              <li>Protection against smart contract vulnerabilities</li>
              <li>Recovery of funds in case of user error</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To the maximum extent permitted by law, MEVStake and its operators shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from your use of the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes
              through the platform interface. Continued use of the platform after modifications constitutes acceptance
              of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us through our official channels or community
              forums.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
