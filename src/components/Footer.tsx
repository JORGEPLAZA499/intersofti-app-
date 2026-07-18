import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { prefetchRoute } from '@/lib/prefetchRoutes';
import logoIntersofti from '@/assets/logo-footer.avif';
import logoAgricredit from '@/assets/logo-agricredit.webp';
import logoGhostcodeMessenger from '@/assets/logo-ghostcode-messenger.webp';
import logoVehistory from '@/assets/logo-vehistory.webp';
import logoUsdx from '@/assets/logo-usdx.webp';
import logoEsim from '@/assets/logo-esim.png';
import logoFirswe from '@/assets/icono-firswe.webp';
import spywareShieldAsset from '@/assets/spyware-shield.png.asset.json';
import ironwatchAiLogoAsset from '@/assets/ironwatch-ai-logo.png.asset.json';

const INSTAGRAM_URLS: Record<string, string> = {
  es: 'https://www.instagram.com/intersofti_es',
  pt: 'https://www.instagram.com/intersofti_pt',
  en: 'https://www.instagram.com/intersofti_en',
  fr: 'https://www.instagram.com/intersofti_fr',
};

export const Footer = React.forwardRef<HTMLElement>(
  function Footer(_props, ref) {
    const { t, language } = useLanguage();
    const instagramUrl = INSTAGRAM_URLS[language] ?? INSTAGRAM_URLS.en;


    return (
      <footer ref={ref} className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-7 items-start">
            <div>
              <div className="flex justify-start mb-3">
                <img src={logoIntersofti} alt="INTERSOFTI" className="h-[4.5rem]" loading="lazy" decoding="async" />
              </div>
              <p className="text-[0.675rem] text-white font-normal">RPJ SOFTWARE INNOVATION LIMITADA</p>
              <p className="text-[0.675rem] text-white font-normal">54 Parnell Square West, Dublín, Irlanda | D01 H0X9</p>
              <p className="text-[0.675rem] text-white font-normal mt-1">info@rpjsoftware.com</p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center mt-3 text-white hover:text-primary transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-white text-[0.788rem]">{t.footer.products}</h4>
              <div className="space-y-1.5">
                <Link to="/ghostcode-s10" onMouseEnter={() => prefetchRoute('/ghostcode-s10')} onFocus={() => prefetchRoute('/ghostcode-s10')} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="flex items-center gap-2 text-[0.788rem] text-white hover:text-primary hover:translate-x-1 transition-all duration-300">
                  <img src={logoGhostcodeMessenger} alt="Ghostcode S10" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                  Ghostcode S10
                </Link>
                <a href="https://www.ghostcodemessenger.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.788rem] text-white hover:text-primary hover:translate-x-1 transition-all duration-300">
                  <img src={logoGhostcodeMessenger} alt="GhostCode Messenger" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                  GhostCode Messenger
                </a>
                <a href="https://www.ghostcodetoken.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.788rem] text-white hover:text-primary hover:translate-x-1 transition-all duration-300">
                  <img src={logoUsdx} alt="USDX" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                  GhostCode Token
                </a>
                <Link to="/eSIM" onMouseEnter={() => prefetchRoute('/eSIM')} onFocus={() => prefetchRoute('/eSIM')} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="flex items-center gap-2 text-[0.788rem] text-white hover:text-primary hover:translate-x-1 transition-all duration-300">
                  <img src={logoEsim} alt="eSIM" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                  eSIM
                </Link>
                <Link to="/crypto-card-firswe-visa" onMouseEnter={() => prefetchRoute('/crypto-card-firswe-visa')} onFocus={() => prefetchRoute('/crypto-card-firswe-visa')} onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="flex items-center gap-2 text-[0.788rem] text-white hover:text-primary hover:translate-x-1 transition-all duration-300 whitespace-nowrap">
                  <img src={logoFirswe} alt="Crypto Card Firswe Visa" className="h-5 w-5 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                  Crypto Card Firswe Visa
                </Link>
                <Link to="/box_ai" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })} className="flex items-center gap-2 text-[0.788rem] text-white hover:text-primary hover:translate-x-1 transition-all duration-300 whitespace-nowrap">
                  <img src={ironwatchAiLogoAsset.url} alt="IronWatch AI Box" className="h-5 w-5 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                  IronWatch AI Box
                </Link>
                <a href="https://spyware.rpjsoftware.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:translate-x-1 transition-all duration-300 whitespace-nowrap">
                  <img src={spywareShieldAsset.url} alt="SPYWARE Forensic Analyzer" className="h-5 w-5 object-contain flex-shrink-0" loading="lazy" decoding="async" />
                  <span className="flex items-baseline gap-1.5">
                    <span className="font-bold tracking-wide text-[0.788rem] bg-gradient-to-b from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">SPYWARE</span>
                    <span className="text-blue-400 font-semibold text-[0.6rem] uppercase tracking-wider">Forensic Analyzer</span>
                  </span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-white text-[0.788rem]">{t.footer.company}</h4>
              <div className="space-y-1.5">
                <a href="https://www.agricreditscore.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.788rem] hover:translate-x-1 transition-all duration-300">
                  <img src={logoAgricredit} alt="AgriCreditScore" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                  <span><span className="text-green-400 font-semibold">AgriCreditScore</span> <span className="text-blue-400 font-semibold">Global</span></span>
                </a>
                <a href="https://www.vehistorybrasil.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.788rem] hover:translate-x-1 transition-all duration-300">
                  <img src={logoVehistory} alt="VeHistory" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                  <span><span className="text-white font-semibold">VE</span><span className="text-blue-400 font-semibold">HISTORY</span> <span className="text-white">Brasil</span></span>
                </a>
                <a href="https://www.vehistoryparaguay.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.788rem] hover:translate-x-1 transition-all duration-300">
                  <img src={logoVehistory} alt="VeHistory" className="h-5 w-5 object-contain" loading="lazy" decoding="async" />
                  <span><span className="text-white font-semibold">VE</span><span className="text-blue-400 font-semibold">HISTORY</span> <span className="text-white">Paraguay</span></span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-white text-[0.788rem]">{t.footer.legal}</h4>
              <div className="space-y-1.5">
                <Link to="/privacy" onMouseEnter={() => prefetchRoute('/privacy')} onFocus={() => prefetchRoute('/privacy')} className="block text-[0.788rem] text-white hover:translate-x-1 transition-all duration-300">{t.footer.privacy}</Link>
                <Link to="/terms" onMouseEnter={() => prefetchRoute('/terms')} onFocus={() => prefetchRoute('/terms')} className="block text-[0.788rem] text-white hover:translate-x-1 transition-all duration-300">{t.footer.terms}</Link>
                <Link to="/help" onMouseEnter={() => prefetchRoute('/help')} onFocus={() => prefetchRoute('/help')} className="block text-[0.788rem] text-white hover:translate-x-1 transition-all duration-300">{t.footer.helpCenter}</Link>
                <Link to="/esim-status" onMouseEnter={() => prefetchRoute('/esim-status')} onFocus={() => prefetchRoute('/esim-status')} className="block text-[0.788rem] text-white hover:translate-x-1 transition-all duration-300">{t.esim.checkStatus}</Link>
                <Link to="/help#contacto" onMouseEnter={() => prefetchRoute('/help')} onFocus={() => prefetchRoute('/help')} className="block text-[0.788rem] text-white hover:translate-x-1 transition-all duration-300">{t.footer.customerService}</Link>
              </div>
            </div>
          </div>

          <div className="mt-7 pt-7 border-t border-border text-center text-[0.788rem] text-white">
            © {new Date().getFullYear()} INTERSOFTI. {t.footer.rights}
          </div>
        </div>
      </footer>
    );
  }
);
