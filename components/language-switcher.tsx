"use client"

import React from 'react';
import { useTranslation } from './translation-context';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'it', label: 'IT', flag: '🇮🇹' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="appearance-none rounded-md px-3 py-2 bg-background border border-input text-sm font-medium cursor-pointer focus:outline-none focus:ring-0"
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="bg-background"
          >
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
    </div>
  );
};