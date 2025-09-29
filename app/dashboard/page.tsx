import { Header } from "@/components/header"
import { StakingDashboard } from "@/components/staking-dashboard"
import { Footer } from "@/components/footer"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <StakingDashboard />
      </main>
      <Footer />
    </div>
  )
}
