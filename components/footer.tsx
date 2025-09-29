"use client"

import Link from "next/link"
import { SocialLinks } from "@/components/social-links"
import { useTranslation } from "@/components/translation-context"

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <h3 className="text-lg font-bold">{t('common.footer.company.name')}</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('common.footer.company.description')}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('common.footer.sections.platform')}</h4>
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('common.footer.links.dashboard')}
              </Link>
              <Link
                href="/mev-tracker"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('common.footer.links.mevBotTracker')}
              </Link>
              <Link
                href="/referrals"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('common.footer.links.referrals')}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('common.footer.sections.legal')}</h4>
            <div className="space-y-2">
              <Link
                href="/terms"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('common.footer.links.termsOfService')}
              </Link>
              <Link
                href="/privacy"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('common.footer.links.privacyPolicy')}
              </Link>
              <Link
                href="/terms#risk"
                className="block text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {t('common.footer.links.riskDisclosure')}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">{t('common.footer.sections.followUs')}</h4>
            <SocialLinks variant="footer" />
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t('common.footer.copyright').replace('{{year}}', currentYear.toString())}
          </p>
        </div>
      </div>
    </footer>
  )
}