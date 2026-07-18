import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MaintenanceGate } from './MaintenanceGate';
import { WhatsAppFloat } from './WhatsAppFloat';
import { useStandaloneMode } from '@/hooks/useStandaloneMode';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Language } from '@/i18n/translations';
import logoIntersofti from '@/assets/logo-footer.avif';

const FlagGB = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-8 h-6 rounded-sm flex-shrink-0" {...props}>
    <clipPath id="pl-s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="pl-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clipPath="url(#pl-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#pl-t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const FlagPT = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14" className="w-8 h-6 rounded-sm flex-shrink-0" {...props}>
    <rect width="20" height="14" fill="#009C3B" />
    <path d="M10 1.5 L18.5 7 L10 12.5 L1.5 7 Z" fill="#FFDF00" />
    <circle cx="10" cy="7" r="3.5" fill="#002776" />
    <path d="M6.5 7 Q10 5 13.5 7 Q10 9 6.5 7" fill="#FFFFFF" />
  </svg>
);

const FlagES = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-8 h-6 rounded-sm flex-shrink-0" {...props}>
    <rect width="750" height="500" fill="#AA151B" />
    <rect y="125" width="750" height="250" fill="#F1BF00" />
  </svg>
);

const flagComponents: Record<Language, React.FC<React.SVGProps<SVGSVGElement>>> = {
  en: FlagGB,
  pt: FlagPT,
  es: FlagES,
};

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
];

export function PublicLayout() {
  const isStandalone = useStandaloneMode();
  const { pathname } = useLocation();
  const { language, setLanguage } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // When the app is launched as an installed PWA from the eSIM mini-app,
  // strip the marketing chrome so users get a focused experience.
  const isEsimMiniApp = isStandalone && pathname.toLowerCase().startsWith('/esim');
  const lowerPath = pathname.toLowerCase();
  const hidePublicChrome = lowerPath === '/esim-status' || lowerPath === '/esim' || lowerPath === '/esim/plan';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const CurrentFlag = flagComponents[language];

  return (
    <MaintenanceGate>
      <div className="min-h-screen flex flex-col">
        {!isEsimMiniApp && !hidePublicChrome && <Header />}
        {isEsimMiniApp && (
          <div className="flex items-center justify-between gap-3 px-4 pt-[max(env(safe-area-inset-top),0.75rem)] pb-2">
            <Link to="/eSIM" aria-label="INTERSOFTI" className="inline-block">
              <img
                src={logoIntersofti}
                alt="INTERSOFTI"
                className="h-[116px] w-auto"
                loading="eager"
                decoding="async"
              />
            </Link>

            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Language"
                className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-border bg-card hover:bg-accent transition-colors"
              >
                <CurrentFlag />
                <ChevronDown className={`w-3 h-3 text-foreground transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-xl p-1 z-50">
                  {languages.map((l) => {
                    const Flag = flagComponents[l.code];
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                        className={`flex items-center justify-center w-full px-3 py-1.5 rounded-md transition-colors ${l.code === language ? 'bg-accent' : 'hover:bg-accent'}`}
                      >
                        <Flag />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        <main className={`flex-1 ${isEsimMiniApp || hidePublicChrome ? 'bg-white' : 'pt-24 lg:pt-32'}`}>
          <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <Outlet />
          </Suspense>
        </main>
        {!isEsimMiniApp && !hidePublicChrome && <Footer />}
      </div>
    </MaintenanceGate>
  );
}
