'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => any;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => ''
});

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};

export function TranslationProvider({ children }: { children: ReactNode }) {
  const validLanguages = ['en', 'de', 'it', 'es'];
  const [language, setLanguageState] = useState('en');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Only run on client side
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mevstake-language');
      if (saved && validLanguages.includes(saved)) {
        setLanguageState(saved);
      } else {
        localStorage.setItem('mevstake-language', 'en');
      }
    }
  }, []);

  useEffect(() => {
    async function loadTranslations() {
      try {
        setIsLoading(true);

        // Load translations with fallback to English
        const loadTranslation = async (path: string) => {
          try {
            return (await import(`../src/i18n/${path}/${language}.json`)).default;
          } catch (error) {
            console.warn(`Failed to load ../src/i18n/${path}/${language}.json, falling back to English`);
            try {
              return (await import(`../src/i18n/${path}/en.json`)).default;
            } catch (fallbackError) {
              console.error(`Failed to load English fallback for ../src/i18n/${path}/en.json`, fallbackError);
              return {};
            }
          }
        };

        // Load all translation files
        const [
          commonHeader,
          commonFooter,
          homeHero,
          homeHowitworks,
          homeFaq,
          homeStats,
          dashboardMain,
          dashboardStaking,
          dashboardPositions,
          dashboardStats,
          dashboardTabs,
          dashboardCalculator,
          dashboardHistory,
          mevtrackerMain,
          mevtrackerStats,
          mevtrackerTabs,
          mevtrackerLive,
          mevtrackerAnalytics,
          mevtrackerStrategies,
          referralsMain,
          referralsAnalytics,
          terms,
          privacy,
          countdown,
          comingSoon
        ] = await Promise.all([
          loadTranslation('common/header'),
          loadTranslation('common/footer'),
          loadTranslation('home/hero'),
          loadTranslation('home/howitworks'),
          loadTranslation('home/faq'),
          loadTranslation('home/stats'),
          loadTranslation('dashboard/main'),
          loadTranslation('dashboard/staking'),
          loadTranslation('dashboard/positions'),
          loadTranslation('dashboard/stats'),
          loadTranslation('dashboard/tabs'),
          loadTranslation('dashboard/calculator'),
          loadTranslation('dashboard/history'),
          loadTranslation('mevtracker/main'),
          loadTranslation('mevtracker/stats'),
          loadTranslation('mevtracker/tabs'),
          loadTranslation('mevtracker/live'),
          loadTranslation('mevtracker/analytics'),
          loadTranslation('mevtracker/strategies'),
          loadTranslation('referrals/main'),
          loadTranslation('referrals/analytics'),
          loadTranslation('terms'),
          loadTranslation('privacy'),
          loadTranslation('countdown'),
          loadTranslation('coming-soon')
        ]);

        const loadedTranslations = {
          common: {
            header: commonHeader,
            footer: commonFooter
          },
          home: {
            hero: homeHero,
            howitworks: homeHowitworks,
            faq: homeFaq,
            stats: homeStats
          },
          dashboard: {
            main: dashboardMain,
            staking: dashboardStaking,
            positions: dashboardPositions,
            stats: dashboardStats,
            tabs: dashboardTabs,
            calculator: dashboardCalculator,
            history: dashboardHistory
          },
          mevtracker: {
            main: mevtrackerMain,
            stats: mevtrackerStats,
            tabs: mevtrackerTabs,
            live: mevtrackerLive,
            analytics: mevtrackerAnalytics,
            strategies: mevtrackerStrategies
          },
          referrals: {
            main: referralsMain,
            analytics: referralsAnalytics
          },
          terms: terms,
          privacy: privacy,
          countdown: countdown,
          comingSoon: comingSoon
        };

        setTranslations(loadedTranslations);
      } catch (error) {
        console.error('Critical error loading translations:', error);
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [language]);

  const setLanguage = (lang: string) => {
    if (validLanguages.includes(lang)) {
      setLanguageState(lang);
      // Only update localStorage on client side
      if (typeof window !== 'undefined') {
        localStorage.setItem('mevstake-language', lang);
      }
    } else {
      console.warn(`Invalid language code: ${lang}, defaulting to 'en'`);
      setLanguageState('en');
      // Only update localStorage on client side
      if (typeof window !== 'undefined') {
        localStorage.setItem('mevstake-language', 'en');
      }
    }
  };

  const t = (key: string): any => {
    if (isLoading || !translations || Object.keys(translations).length === 0) {
      return "ㅤ"; // Return empty character as fallback during loading
    }

    const keys = key.split('.');
    let result: any = translations;

    for (const k of keys) {
      result = result?.[k];
      if (result === undefined || result === null) {
        return key; // Return key as fallback when translation not found
      }
    }

    return result; // Return the result, whether string or object
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {isClient ? children : null}
    </TranslationContext.Provider>
  );
}