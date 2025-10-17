import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { ReferralPage } from "@/components/referrals/referral-page"
import { MotionWrapper } from "@/components/shared/motion-wrapper"
import { ComingSoonWrapper } from "@/components/shared/coming-soon-wrapper"

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
