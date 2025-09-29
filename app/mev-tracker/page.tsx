import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MevBotTracker } from "@/components/mev-bot-tracker"

export default function MevTrackerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MevBotTracker />
      <Footer />
    </div>
  )
}
