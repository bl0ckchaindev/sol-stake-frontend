import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MevBotTracker } from "@/components/mev-bot-tracker"
import { MotionWrapper } from "@/components/motion-wrapper"

export default function MevTrackerPage() {
  return (
    <MotionWrapper type="fadeIn" className="min-h-screen bg-background">
      <Header />
      <MevBotTracker />
      <Footer />
    </MotionWrapper>
  )
}
