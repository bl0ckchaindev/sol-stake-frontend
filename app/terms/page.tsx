"use client"

import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { useTranslation } from "@/context/translation-context"

export default function TermsPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 right-0 w-32 h-32 opacity-5 animate-float">
          <img src="/gradient-orb-1.svg" alt="" className="w-full h-full" />
        </div>
        <div className="absolute bottom-1/3 left-0 w-48 h-48 opacity-5 animate-float" style={{animationDelay: '2s'}}>
          <img src="/gradient-orb-2.svg" alt="" className="w-full h-full" />
        </div>
      </div>

      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl relative">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {t('terms.title')}
            </h1>
            <p className="text-lg text-muted-foreground">{t('terms.lastUpdated')}: {new Date().toLocaleDateString()}</p>
          </div>

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

          <section className="mb-8" id="risk">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.risk.title')}</h2>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-warning mb-2">{t('terms.sections.risk.warning')}</h3>
              <p className="text-sm leading-relaxed">
                {t('terms.sections.risk.warningText')}
              </p>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('terms.sections.risk.risks')) && (t('terms.sections.risk.risks') as unknown as string[]).map((risk: string, index: number) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.staking.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.staking.overview')}
            </p>
            
            <h3 className="text-lg font-semibold mb-3">Core Staking Terms</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.staking.terms')) && (t('terms.sections.staking.terms') as unknown as string[]).map((term: string, index: number) => (
                <li key={index}>{term}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3">{t('terms.sections.staking.technicalDetails.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.staking.technicalDetails.items')) && (t('terms.sections.staking.technicalDetails.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3">{t('terms.sections.staking.rewardStructure.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.staking.rewardStructure.items')) && (t('terms.sections.staking.rewardStructure.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100 mb-2">Referral Program</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                {t('terms.sections.staking.referral')}
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-3">{t('terms.sections.staking.emergencyProcedures.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('terms.sections.staking.emergencyProcedures.items')) && (t('terms.sections.staking.emergencyProcedures.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.responsibilities.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('terms.sections.responsibilities.overview')}
            </p>

            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('terms.sections.responsibilities.securityResponsibilities.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.responsibilities.securityResponsibilities.items')) && (t('terms.sections.responsibilities.securityResponsibilities.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('terms.sections.responsibilities.transactionResponsibilities.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.responsibilities.transactionResponsibilities.items')) && (t('terms.sections.responsibilities.transactionResponsibilities.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('terms.sections.responsibilities.legalCompliance.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.responsibilities.legalCompliance.items')) && (t('terms.sections.responsibilities.legalCompliance.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('terms.sections.responsibilities.technicalResponsibilities.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.responsibilities.technicalResponsibilities.items')) && (t('terms.sections.responsibilities.technicalResponsibilities.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('terms.sections.responsibilities.conductResponsibilities.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.responsibilities.conductResponsibilities.items')) && (t('terms.sections.responsibilities.conductResponsibilities.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3 text-foreground">{t('terms.sections.responsibilities.informationResponsibilities.title')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              {Array.isArray(t('terms.sections.responsibilities.informationResponsibilities.items')) && (t('terms.sections.responsibilities.informationResponsibilities.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="text-md font-semibold text-red-900 dark:text-red-100 mb-2">⚠️ Important Notice</h4>
              <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed">
                {t('terms.sections.responsibilities.consequences')}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.limitations.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.limitations.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('terms.sections.limitations.items')) && (t('terms.sections.limitations.items') as unknown as string[]).map((item: string, index: number) => (
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
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.intellectual.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.intellectual.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.termination.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.termination.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.modifications.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.modifications.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.governing.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.governing.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('terms.sections.severability.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('terms.sections.severability.content')}
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
