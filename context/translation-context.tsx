"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, type Language } from '@/lib/i18n'

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
  translations: any;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const validLanguages: Language[] = ['en', 'de', 'it', 'es'];
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLanguage = navigator.language.split('-')[0] as Language;
      if (validLanguages.includes(browserLanguage)) {
        setLanguage(browserLanguage);
      }
    }
  }, []);

  const t = (key: string, fallback?: string): string => {
    const currentTranslations = translations[language];
    if (!currentTranslations) {
      return fallback || key;
    }

    const keys = key.split('.');
    let value: any = currentTranslations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === 'string' ? value : (fallback || key);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    if (validLanguages.includes(newLanguage)) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  const contextValue: TranslationContextType = {
    language,
    setLanguage: handleLanguageChange,
    t,
    isLoading,
    translations: translations[language],
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}