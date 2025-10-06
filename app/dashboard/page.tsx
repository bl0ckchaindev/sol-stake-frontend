import { Header } from "@/components/header"
import { AnchorStakingDashboard } from "@/components/anchor-staking-dashboard"
import { Footer } from "@/components/footer"
import { MotionWrapper } from "@/components/motion-wrapper"

export default function DashboardPage() {
  return (
    <MotionWrapper type="fadeIn" className="min-h-screen bg-background">
      <Header />
      <main>
        <AnchorStakingDashboard />
      </main>
      <Footer />
    </MotionWrapper>
  )
}
