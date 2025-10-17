import { Header } from "@/components/shared/header"
import { LandingHero } from "@/components/home/landing-hero"
import { HowItWorks } from "@/components/home/how-it-works"
import { StatsSection } from "@/components/home/stats-section"
import { FAQSection } from "@/components/home/faq-section"
import { Footer } from "@/components/shared/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="relative">
        <LandingHero />
        <StatsSection />
        <HowItWorks />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
