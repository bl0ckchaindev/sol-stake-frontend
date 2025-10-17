import { Header } from "@/components/shared/header"
import { AnchorStakingDashboard } from "@/components/dashboard/anchor-staking-dashboard"
import { Footer } from "@/components/shared/footer"
import { MotionWrapper } from "@/components/shared/motion-wrapper"
import { ComingSoonWrapper } from "@/components/shared/coming-soon-wrapper"

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
