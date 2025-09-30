import { Header } from "@/components/header"
import { StakingDashboard } from "@/components/staking-dashboard"
import { Footer } from "@/components/footer"
import { MotionWrapper } from "@/components/motion-wrapper"

export default function DashboardPage() {
  return (
    <MotionWrapper type="fadeIn" className="min-h-screen bg-background">
      <Header />
      <main>
        <StakingDashboard />
      </main>
      <Footer />
    </MotionWrapper>
  )
}
