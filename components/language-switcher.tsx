"use client"

import React from 'react';
import { useTranslation } from './translation-context';
import ReactCountryFlag from "react-country-flag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: 'en', label: 'EN', countryCode: 'US' },
  { code: 'de', label: 'DE', countryCode: 'DE' },
  { code: 'it', label: 'IT', countryCode: 'IT' },
  { code: 'es', label: 'ES', countryCode: 'ES' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[100px] ml-3">
        <SelectValue>
          <div className="flex items-center gap-2">
            <ReactCountryFlag
              countryCode={languages.find(lang => lang.code === language)?.countryCode || 'US'}
              svg
              style={{ width: '16px', height: '12px' }}
            />
            {languages.find(lang => lang.code === language)?.label}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={lang.countryCode}
                svg
                style={{ width: '16px', height: '12px' }}
              />
              {lang.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};