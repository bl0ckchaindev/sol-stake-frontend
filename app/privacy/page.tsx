import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              MEVStake is designed with privacy in mind. As a decentralized platform, we collect minimal personal
              information necessary for platform operation.
            </p>

            <h3 className="text-lg font-semibold mb-2">Wallet Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Public wallet addresses for transaction processing</li>
              <li>Transaction history related to staking activities</li>
              <li>Staking positions and reward calculations</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Technical Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>IP addresses for security and fraud prevention</li>
              <li>Browser type and version for compatibility</li>
              <li>Device information for optimal user experience</li>
              <li>Usage analytics to improve platform performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use collected information solely for:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Processing staking transactions and reward distributions</li>
              <li>Maintaining platform security and preventing fraud</li>
              <li>Improving user experience and platform functionality</li>
              <li>Complying with applicable legal requirements</li>
              <li>Communicating important platform updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>When required by law or legal process</li>
              <li>To protect our rights, property, or safety</li>
              <li>With service providers who assist in platform operations (under strict confidentiality)</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Blockchain Transparency</h2>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Public Blockchain Data</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                All staking transactions are recorded on the Solana blockchain and are publicly visible. This includes
                wallet addresses, transaction amounts, and timestamps.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure infrastructure and hosting environments</li>
              <li>Incident response procedures for security breaches</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use minimal cookies and tracking technologies:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Essential cookies for platform functionality</li>
              <li>Analytics cookies to understand usage patterns (anonymized)</li>
              <li>Preference cookies to remember your settings</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We retain information only as long as necessary for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Providing platform services</li>
              <li>Complying with legal obligations</li>
              <li>Resolving disputes and enforcing agreements</li>
              <li>Maintaining security and fraud prevention</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Depending on your jurisdiction, you may have rights to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. International Transfers</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a decentralized platform, your information may be processed in various jurisdictions. We ensure
              appropriate safeguards are in place for international data transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may update this Privacy Policy periodically. Significant changes will be communicated through the
              platform interface. Your continued use constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy-related questions or to exercise your rights, please contact us through our official channels
              or community forums.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
