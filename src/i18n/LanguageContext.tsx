import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationStrings } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED: Language[] = ['en', 'pt', 'es'];
const STORAGE_KEY = 'language';
const MANUAL_FLAG_KEY = 'language_manual';

function detectInitialLanguage(): Language {
  try {
    if (typeof window === 'undefined') return 'en';

    // Only honor a saved language if the user explicitly chose it.
    const manual = localStorage.getItem(MANUAL_FLAG_KEY) === '1';
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (manual && saved && SUPPORTED.includes(saved)) return saved;

    const candidates: string[] = [];
    if (navigator.languages && navigator.languages.length) {
      candidates.push(...navigator.languages);
    } else if (navigator.language) {
      candidates.push(navigator.language);
    }

    for (const raw of candidates) {
      const prefix = raw.toLowerCase().split('-')[0];
      if (prefix === 'pt') return 'pt';
      if (prefix === 'es') return 'es';
      if (prefix === 'en') return 'en';
    }
  } catch {
    // ignore (SSR / privacy mode)
  }
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(MANUAL_FLAG_KEY, '1');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
