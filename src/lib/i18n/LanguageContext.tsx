"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { TRANSLATIONS, SupportedLanguage, TranslationKey, SUPPORTED_LANGUAGES, LanguageOption } from "./translations";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey, ...args: (string | number)[]) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "nihongo_lang";
const USER_KEY = "nihongo_user";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      // 1. Check explicit language storage
      const savedLang = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (savedLang && (savedLang === "en" || savedLang === "ta" || savedLang === "ja")) {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
        return;
      }

      // 2. Check student profile nativeLanguage
      const userRaw = localStorage.getItem(USER_KEY);
      if (userRaw) {
        const user = JSON.parse(userRaw);
        if (user?.nativeLanguage && (user.nativeLanguage === "en" || user.nativeLanguage === "ta" || user.nativeLanguage === "ja")) {
          setLanguageState(user.nativeLanguage);
          document.documentElement.lang = user.nativeLanguage;
          return;
        }
      }

      // 3. Default to English
      setLanguageState("en");
      document.documentElement.lang = "en";
    } catch {
      setLanguageState("en");
    }
  }, []);

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    if (newLang !== "en" && newLang !== "ta" && newLang !== "ja") return;
    setLanguageState(newLang);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, newLang);
        document.documentElement.lang = newLang;

        // Sync with student profile in localStorage
        const userRaw = localStorage.getItem(USER_KEY);
        if (userRaw) {
          const user = JSON.parse(userRaw);
          user.nativeLanguage = newLang;
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, ...args: (string | number)[]): string => {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      let text = (dict as Record<string, string>)[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;

      if (args.length > 0) {
        args.forEach((val, idx) => {
          text = text.replace(new RegExp(`\\{${idx}\\}`, "g"), String(val));
        });
      }

      return text;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a graceful default if used outside Provider
    return {
      language: "en" as SupportedLanguage,
      setLanguage: () => {},
      t: (key: TranslationKey, ...args: (string | number)[]) => {
        let text = (TRANSLATIONS.en as Record<string, string>)[key] || key;
        args.forEach((val, idx) => {
          text = text.replace(new RegExp(`\\{${idx}\\}`, "g"), String(val));
        });
        return text;
      },
      languages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}
