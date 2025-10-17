"use client"

import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { useTranslation } from "@/context/translation-context"

export default function PrivacyPage() {
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
              {t('privacy.title')}
            </h1>
            <p className="text-lg text-muted-foreground">{t('privacy.lastUpdated')}: {new Date().toLocaleDateString()}</p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.introduction.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.introduction.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.collection.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.collection.content')}
            </p>

            <h3 className="text-lg font-semibold mb-2">{t('privacy.sections.collection.walletInfo')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.collection.walletItems')) && (t('privacy.sections.collection.walletItems') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-2">{t('privacy.sections.collection.technicalInfo')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.collection.technicalItems')) && (t('privacy.sections.collection.technicalItems') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-2">{t('privacy.sections.collection.communicationInfo')}</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.collection.communicationItems')) && (t('privacy.sections.collection.communicationItems') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.usage.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{t('privacy.sections.usage.content')}</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.usage.items')) && (t('privacy.sections.usage.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.sharing.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.sharing.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.sharing.items')) && (t('privacy.sections.sharing.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.sharing.thirdPartyServices')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.blockchain.title')}</h2>
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">{t('privacy.sections.blockchain.notice')}</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                {t('privacy.sections.blockchain.noticeText')}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.security.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.security.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.security.items')) && (t('privacy.sections.security.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                {t('privacy.sections.security.breachNotification')}
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.cookies.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.cookies.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.cookies.items')) && (t('privacy.sections.cookies.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.cookies.cookieControl')}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.cookies.thirdPartyAnalytics')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.retention.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.retention.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.retention.items')) && (t('privacy.sections.retention.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.retention.deletionRights')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.rights.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.rights.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.rights.items')) && (t('privacy.sections.rights.items') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.rights.exercisingRights')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.children.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.children.content')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.transfers.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.transfers.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.transfers.safeguards')) && (t('privacy.sections.transfers.safeguards') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.changes.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.changes.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.changes.notificationMethods')) && (t('privacy.sections.changes.notificationMethods') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.changes.acceptance')}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.sections.contact.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.contact.content')}
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              {Array.isArray(t('privacy.sections.contact.contactMethods')) && (t('privacy.sections.contact.contactMethods') as unknown as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('privacy.sections.contact.responseTime')}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t('privacy.sections.contact.dpo')}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
