import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReferralPage } from "@/components/referral-page"
import { MotionWrapper } from "@/components/motion-wrapper"
import { ComingSoonWrapper } from "@/components/coming-soon-wrapper"

export default function ReferralsPage() {
  return (
    <ComingSoonWrapper pageType="referrals">
      <MotionWrapper type="fadeIn" className="min-h-screen bg-background">
        <Header />
        <ReferralPage />
        <Footer />
      </MotionWrapper>
    </ComingSoonWrapper>
  )
}
