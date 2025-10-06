"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useTranslation } from "@/components/translation-context"

export default function TermsPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">{t('terms.title')}</h1>
          <p className="text-muted-foreground mb-6 sm:mb-8">{t('terms.lastUpdated')}: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.acceptance.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.acceptance.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.description.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.description.content')}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.description.rewards')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.risk.title')}</h2>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-warning mb-2">{t('terms.sections.risk.warning')}</h3>
              <p className="text-sm leading-relaxed">
                {t('terms.sections.risk.warningText')}
              </p>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('terms.sections.risk.risks')) && t('terms.sections.risk.risks').map((risk: string, index: number) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.staking.title')}</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('terms.sections.staking.terms')) && t('terms.sections.staking.terms').map((term: string, index: number) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.responsibilities.title')}</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('terms.sections.responsibilities.items')) && t('terms.sections.responsibilities.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.limitations.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.limitations.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('terms.sections.limitations.items')) && t('terms.sections.limitations.items').map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.liability.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.liability.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.modifications.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.modifications.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.contact.title')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('terms.sections.contact.content')}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
