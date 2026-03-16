"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./en.json";
import fr from "./fr.json";
import ar from "./ar.json";

export type Locale = "en" | "fr" | "ar";

const translations: Record<Locale, Record<string, string>> = { en, fr, ar };

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (k) => k,
});

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("ar")) return "ar";
  if (lang.startsWith("fr")) return "fr";
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem("scriptcraft_locale") as Locale | null;
    const initial = stored || detectBrowserLocale();
    setLocaleState(initial);
  }, []);

  useEffect(() => {
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", locale);
    // Font class for Arabic
    if (locale === "ar") {
      document.documentElement.classList.add("font-cairo");
    } else {
      document.documentElement.classList.remove("font-cairo");
    }
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("scriptcraft_locale", l);
  };

  const t = (key: string): string => {
    return translations[locale][key] ?? translations["en"][key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
