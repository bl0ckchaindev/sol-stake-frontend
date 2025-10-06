import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MevBotTracker } from "@/components/mev-bot-tracker"
import { MotionWrapper } from "@/components/motion-wrapper"
import { ComingSoonWrapper } from "@/components/coming-soon-wrapper"

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
