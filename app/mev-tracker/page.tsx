import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { MevBotTracker } from "@/components/mev-tracker/mev-bot-tracker"
import { MotionWrapper } from "@/components/shared/motion-wrapper"
import { ComingSoonWrapper } from "@/components/shared/coming-soon-wrapper"

export default function MevTrackerPage() {
  return (
    <ComingSoonWrapper pageType="mevTracker">
      <MotionWrapper type="fadeIn" className="min-h-screen bg-background">
        <Header />
        <MevBotTracker />
        <Footer />
      </MotionWrapper>
    </ComingSoonWrapper>
  )
}
