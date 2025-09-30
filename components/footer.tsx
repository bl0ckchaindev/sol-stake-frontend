"use client"

import Link from "next/link"
import { SocialLinks } from "@/components/social-links"
import { useTranslation } from "@/components/translation-context"
import { MotionWrapper } from "@/components/motion-wrapper"

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <MotionWrapper type="fadeIn" trigger="inView" className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <MotionWrapper
          type="fadeIn"
          trigger="inView"
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          staggerChildren={0.2}
        >
          <MotionWrapper type="slideUp" delay={0.1} trigger="inView" className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <h3 className="text-lg font-bold">{t('common.footer.company.name')}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('common.footer.company.description')}
            </p>
          </MotionWrapper>

          <MotionWrapper type="slideUp" delay={0.2} trigger="inView" className="space-y-4">
            <h4 className="font-semibold">{t('common.footer.sections.platform')}</h4>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors hover:translate-x-1 transform transition-transform"
              >
                {t('common.footer.links.dashboard')}
              </Link>
              <Link
                href="/mev-tracker"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors hover:translate-x-1 transform transition-transform"
              >
                {t('common.footer.links.mevBotTracker')}
              </Link>
              <Link
                href="/referrals"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors hover:translate-x-1 transform transition-transform"
              >
                {t('common.footer.links.referrals')}
              </Link>
            </div>
          </MotionWrapper>

          <MotionWrapper type="slideUp" delay={0.3} trigger="inView" className="space-y-4">
            <h4 className="font-semibold">{t('common.footer.sections.legal')}</h4>
            <div className="space-y-2">
              <Link
                href="/terms"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors hover:translate-x-1 transform transition-transform"
              >
                {t('common.footer.links.termsOfService')}
              </Link>
              <Link
                href="/privacy"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors hover:translate-x-1 transform transition-transform"
              >
                {t('common.footer.links.privacyPolicy')}
              </Link>
              <Link
                href="/terms#risk"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors hover:translate-x-1 transform transition-transform"
              >
                {t('common.footer.links.riskDisclosure')}
              </Link>
            </div>
          </MotionWrapper>

          <MotionWrapper type="slideUp" delay={0.4} trigger="inView" className="space-y-4">
            <h4 className="font-semibold">{t('common.footer.sections.followUs')}</h4>
            <SocialLinks variant="footer" />
          </MotionWrapper>
        </MotionWrapper>

        <MotionWrapper type="slideUp" delay={0.5} trigger="inView" className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t('common.footer.copyright').replace('{{year}}', currentYear.toString())}
          </p>
        </MotionWrapper>
      </div>
    </MotionWrapper>
  )
}