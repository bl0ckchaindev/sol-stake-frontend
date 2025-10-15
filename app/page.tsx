import { Header } from "@/components/header"
import { LandingHero } from "@/components/landing-hero"
import { HowItWorks } from "@/components/how-it-works"
import { StatsSection } from "@/components/stats-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="relative">
        <LandingHero />
        <HowItWorks />
        <StatsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
