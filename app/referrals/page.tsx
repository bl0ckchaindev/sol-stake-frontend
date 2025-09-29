import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReferralPage } from "@/components/referral-page"

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ReferralPage />
      <Footer />
    </div>
  )
}
