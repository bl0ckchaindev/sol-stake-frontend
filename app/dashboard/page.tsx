import { Header } from "@/components/header"
import { AnchorStakingDashboard } from "@/components/anchor-staking-dashboard"
import { Footer } from "@/components/footer"
import { MotionWrapper } from "@/components/motion-wrapper"
import { ComingSoonWrapper } from "@/components/coming-soon-wrapper"

export default function DashboardPage() {
  return (
    <ComingSoonWrapper pageType="dashboard">
      <MotionWrapper type="fadeIn" className="min-h-screen bg-background">
        <Header />
        <AnchorStakingDashboard />
        <Footer />
      </MotionWrapper>
     </ComingSoonWrapper>
  )
}
