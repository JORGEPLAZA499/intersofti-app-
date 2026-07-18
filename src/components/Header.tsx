import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoIntersofti from '@/assets/logo-header.avif';
import logoAgricredit from '@/assets/logo-agricredit.webp';
import logoVehistory from '@/assets/logo-vehistory.webp';
import logoGhostcode from '@/assets/logo-ghostcode-messenger.webp';
import logoUsdx from '@/assets/logo-usdx.webp';
import logoEsim from '@/assets/logo-esim.png';
import logoFirswe from '@/assets/icono-firswe.webp';
import spywareShieldAsset from '@/assets/spyware-shield.png.asset.json';
import ironwatchAiLogoAsset from '@/assets/ironwatch-ai-logo.png.asset.json';
import { Menu, X, ChevronDown, LogIn, Search } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Language } from '@/i18n/translations';
import { Button } from './ui/button';

const FlagGB = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function FlagGB(props, ref) {
    return (
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-8 h-6 rounded-sm flex-shrink-0" {...props}>
        <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
        <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
        <g clipPath="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </g>
      </svg>
    );
  }
);

const FlagPT = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function FlagPT(props, ref) {
    return (
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14" className="w-8 h-6 rounded-sm flex-shrink-0" {...props}>
        <rect width="20" height="14" fill="#009C3B"/>
        <path d="M10 1.5 L18.5 7 L10 12.5 L1.5 7 Z" fill="#FFDF00"/>
        <circle cx="10" cy="7" r="3.5" fill="#002776"/>
        <path d="M6.5 7 Q10 5 13.5 7 Q10 9 6.5 7" fill="#FFFFFF"/>
      </svg>
    );
  }
);

const FlagES = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  function FlagES(props, ref) {
    return (
      <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-8 h-6 rounded-sm flex-shrink-0" {...props}>
        <rect width="750" height="500" fill="#AA151B"/>
        <rect y="125" width="750" height="250" fill="#F1BF00"/>
      </svg>
    );
  }
);

const flagComponents: Record<Language, React.ForwardRefExoticComponent<React.RefAttributes<SVGSVGElement> & React.SVGProps<SVGSVGElement>>> = {
  en: FlagGB,
  pt: FlagPT,
  es: FlagES,
};

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Português' },
  { code: 'es', label: 'Español' },
];

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ghostcodeOpen, setGhostcodeOpen] = useState(false);
  const [digitalOpen, setDigitalOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement>(null);
  const langRefMobile = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inDesktop = langRef.current && langRef.current.contains(target);
      const inMobile = langRefMobile.current && langRefMobile.current.contains(target);
      if (!inDesktop && !inMobile) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      {/* Top row: Logo + mobile controls (collapses on scroll down, desktop only) */}
      <div className={`lg:overflow-hidden transition-all duration-300 max-h-[300px] ${headerVisible ? 'lg:max-h-[300px]' : 'lg:max-h-0'}`}>
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100">

        {/* Left spacer on desktop */}
        <div className="hidden lg:block flex-1" />

        {/* Center: Logo */}
        <Link to="/" className="flex flex-col items-center">
          <img
            src={logoIntersofti}
            alt="INTERSOFTI - Objective Communication"
            className="h-[60px] lg:h-[116px] w-auto object-contain"
            width={216}
            height={116}
            fetchPriority="high"
            decoding="async"
            style={{ imageRendering: 'auto' }}
          />
        </Link>

        {/* Right: mobile/tablet controls aligned to bottom of logo */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Language selector */}
          <div className="relative" ref={langRefMobile}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-0.5 text-sm font-medium px-1 py-0.5 rounded hover:bg-gray-100 transition-colors"
            >
              {(() => { const Flag = flagComponents[language]; return <Flag className="w-6 h-[18px] rounded-sm flex-shrink-0" />; })()}
              <ChevronDown className={`w-2.5 h-2.5 text-gray-900 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-50">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                    className={`flex items-center justify-center w-full px-3 py-1.5 rounded-md transition-colors ${l.code === language ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  >
                    {(() => { const Flag = flagComponents[l.code]; return <Flag />; })()}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login icon */}
          <Link to="/login" aria-label="Login" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <LogIn className="w-4 h-4 text-gray-700" />
          </Link>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
          </button>
        </div>

        {/* Right spacer on desktop */}
        <div className="hidden lg:block flex-1" />
      </div>
      </div>

      {/* Desktop bottom nav row */}

      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-12">
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-[1.037rem] font-medium text-gray-900 hover:text-primary transition-colors duration-300">{t.nav.home}</Link>

            {/* Ghostcode S10 Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[1.037rem] font-medium text-gray-900 hover:text-primary transition-colors duration-300">
                {t.nav.ghostcodeS10}
                <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 min-w-[200px]">
                  <Link to="/ghostcode-s10" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200">
                    <img src={logoGhostcode} alt="" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                    {t.nav.ghostcodeS10}
                  </Link>
                 <a href="https://www.ghostcodemessenger.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200 whitespace-nowrap">
                   <img src={logoGhostcode} alt="" className="h-5 w-5 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                   {t.nav.messenger}
                 </a>
                 <a href="https://www.ghostcodetoken.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200 whitespace-nowrap">
                   <img src={logoUsdx} alt="" className="h-5 w-5 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                   {t.nav.token}
                 </a>
                  <Link to="/activation" className="block px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200">{t.nav.activation}</Link>
                </div>
              </div>
            </div>

            {/* Digital Platforms Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[1.037rem] font-medium text-gray-900 hover:text-primary transition-colors duration-300">
                {t.nav.digitalPlatforms}
                <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 min-w-[240px]">
                  <a href="https://www.agricreditscore.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-primary/5 rounded-md transition-colors duration-200">
                    <img src={logoAgricredit} alt="" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                    <span><span className="text-green-600 font-semibold">AgriCreditScore</span> <span className="text-primary font-semibold">Global</span></span>
                  </a>
                  <a href="https://www.vehistorybrasil.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200">
                    <img src={logoVehistory} alt="" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                    <span><span className="text-gray-900 font-semibold">VE</span><span className="text-primary font-semibold">HISTORY</span> <span className="text-gray-900">Brasil</span></span>
                  </a>
                  <a href="https://www.vehistoryparaguay.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200">
                    <img src={logoVehistory} alt="" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                    <span><span className="text-gray-900 font-semibold">VE</span><span className="text-primary font-semibold">HISTORY</span> <span className="text-gray-900">Paraguay</span></span>
                  </a>
                </div>
              </div>
            </div>

            {/* Products Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-[1.037rem] font-medium text-gray-900 hover:text-primary transition-colors duration-300">
                {t.nav.store}
                <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-2 min-w-[200px]">
                  <Link to="/ghostcode-s10-product" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200">
                    <img src={logoGhostcode} alt="" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                    GhostCode S10
                  </Link>
                  <Link to="/esim_home" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200">
                    <img src={logoEsim} alt="" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                    Comprar eSIM
                  </Link>
                  <Link to="/crypto-card-firswe-visa" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200 whitespace-nowrap">
                    <img src={logoFirswe} alt="" className="h-5 w-5 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                    Crypto Card Firswe Visa
                  </Link>
                  <Link to="/box_ai" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200 whitespace-nowrap">
                    <img src={ironwatchAiLogoAsset.url} alt="" className="h-5 w-5 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                    IronWatch AI Box
                  </Link>
                  <Link to="/esim-status" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 hover:text-primary hover:bg-primary/5 rounded-md transition-colors duration-200">
                    <Search className="h-4 w-4" />
                    Consultar eSIM
                  </Link>
                  <a href="https://spyware.rpjsoftware.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-primary/5 transition-colors duration-200 whitespace-nowrap">
                    <img src={spywareShieldAsset.url} alt="" className="h-5 w-5 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                    <span className="flex items-baseline gap-1.5">
                      <span className="font-bold tracking-wide bg-gradient-to-b from-gray-400 via-gray-700 to-gray-400 bg-clip-text text-transparent">SPYWARE</span>
                      <span className="text-primary font-semibold text-[0.65rem] uppercase tracking-wider">Forensic Analyzer</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <Link to="/contact" className="text-[1.037rem] font-medium text-gray-900 hover:text-primary transition-colors duration-300">{t.nav.contact}</Link>
          </nav>

          {/* Desktop: Language + Login */}
          <div className="ml-6 flex items-center gap-3">
            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-sm font-medium px-2 py-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                {(() => { const Flag = flagComponents[language]; return <Flag />; })()}
                <ChevronDown className={`w-3 h-3 text-gray-900 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-1 z-50">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code); setLangOpen(false); }}
                      className={`flex items-center justify-center w-full px-3 py-1.5 rounded-md transition-colors ${l.code === language ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                    >
                      {(() => { const Flag = flagComponents[l.code]; return <Flag />; })()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login icon */}
            <Link to="/login" aria-label="Login" className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <LogIn className="w-4 h-4 text-gray-700" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="lg:hidden pb-4 space-y-1 bg-white px-4 sm:px-6">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-900 hover:text-primary">{t.nav.home}</Link>

          {/* Ghostcode S10 dropdown */}
          <button onClick={() => setGhostcodeOpen(!ghostcodeOpen)} className="flex items-center gap-1 w-full px-3 py-2 text-sm font-medium text-gray-900 hover:text-primary">
            {t.nav.ghostcodeS10} <ChevronDown className={`w-3 h-3 transition-transform ${ghostcodeOpen ? 'rotate-180' : ''}`} />
          </button>
          {ghostcodeOpen && (
            <div className="pl-6 space-y-1">
              <Link to="/ghostcode-s10" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <img src={logoGhostcode} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
                {t.nav.ghostcodeS10}
              </Link>
              <a href="https://www.ghostcodemessenger.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary whitespace-nowrap">
                <img src={logoGhostcode} alt="" className="h-4 w-4 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                {t.nav.messenger}
              </a>
              <a href="https://www.ghostcodetoken.com/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary whitespace-nowrap">
                <img src={logoUsdx} alt="" className="h-4 w-4 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                {t.nav.token}
              </a>
              <Link to="/activation" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:text-primary">{t.nav.activation}</Link>
            </div>
          )}

          {/* Digital Platforms dropdown */}
          <button onClick={() => setDigitalOpen(!digitalOpen)} className="flex items-center gap-1 w-full px-3 py-2 text-sm font-medium text-gray-900 hover:text-primary">
            {t.nav.digitalPlatforms} <ChevronDown className={`w-3 h-3 transition-transform ${digitalOpen ? 'rotate-180' : ''}`} />
          </button>
          {digitalOpen && (
            <div className="pl-6 space-y-1">
              <a href="https://www.agricreditscore.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <img src={logoAgricredit} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
                <span><span className="text-green-600 font-semibold">AgriCreditScore</span> <span className="text-primary font-semibold">Global</span></span>
              </a>
              <a href="https://www.vehistorybrasil.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <img src={logoVehistory} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
                <span><span className="font-semibold">VE</span><span className="text-primary font-semibold">HISTORY</span> Brasil</span>
              </a>
              <a href="https://www.vehistoryparaguay.com" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <img src={logoVehistory} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
                <span><span className="font-semibold">VE</span><span className="text-primary font-semibold">HISTORY</span> Paraguay</span>
              </a>
            </div>
          )}

          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-gray-900 hover:text-primary">{t.nav.contact}</Link>

          {/* Products dropdown */}
          <button onClick={() => setProductsOpen(!productsOpen)} className="flex items-center gap-1 w-full px-3 py-2 text-sm font-medium text-gray-900 hover:text-primary">
            {t.nav.store} <ChevronDown className={`w-3 h-3 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
          </button>
          {productsOpen && (
            <div className="pl-6 space-y-1">
              <Link to="/ghostcode-s10-product" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <img src={logoGhostcode} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
                GhostCode S10
              </Link>
              <Link to="/esim_home" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <img src={logoEsim} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
                Comprar eSIM
              </Link>
              <Link to="/crypto-card-firswe-visa" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <img src={logoFirswe} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
                Crypto Card Firswe Visa
              </Link>
              <Link to="/box_ai" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <img src={ironwatchAiLogoAsset.url} alt="" className="h-4 w-4 object-contain" loading="lazy" decoding="async" />
                IronWatch AI Box
              </Link>
              <Link to="/esim-status" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-primary">
                <Search className="h-4 w-4" />
                Consultar eSIM
              </Link>
              <a href="https://spyware.rpjsoftware.com/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm whitespace-nowrap">
                <img src={spywareShieldAsset.url} alt="" className="h-4 w-4 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                <span className="flex items-baseline gap-1.5">
                  <span className="font-bold tracking-wide bg-gradient-to-b from-gray-400 via-gray-700 to-gray-400 bg-clip-text text-transparent">SPYWARE</span>
                  <span className="text-primary font-semibold text-[0.6rem] uppercase tracking-wider">Forensic Analyzer</span>
                </span>
              </a>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
