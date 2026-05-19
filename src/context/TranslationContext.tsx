"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { en, Translations } from "../locales/en";

type Locale = "en"; // Add more as needed

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => any;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations: Record<Locale, Translations> = {
  en,
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");

  const t = (key: string, params?: Record<string, string | number>): any => {
    const keys = key.split(".");
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value === "string" && params) {
      let stringValue = value;
      Object.entries(params).forEach(([k, v]) => {
        stringValue = stringValue.replace(`{${k}}`, String(v));
      });
      return stringValue;
    }

    return value;
  };

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
