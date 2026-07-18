import { Shield, Lock, KeyRound, ShieldCheck } from 'lucide-react';
import ghostcodeDevice from '@/assets/ghostcode-device.avif';
import baneImage from '@/assets/bane.jpg';
import marketingGifAsset from '@/assets/ghostcode-marketing.gif.asset.json';
const marketingGif = marketingGifAsset.url;
import ghostcodeS10Device from '@/assets/ghostcode-s10-device.avif';
import ghostcodeBanner from '@/assets/ghostcode-s10-banner.png';
import videoEnAsset from '@/assets/ghostcode-s10-en.mp4.asset.json';
import videoEsAsset from '@/assets/ghostcode-s10-es.mp4.asset.json';
import videoPtAsset from '@/assets/ghostcode-s10-pt.mp4.asset.json';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';

import { Button } from '@/components/ui/button';

export default function GhostcodeS10() {
  const { t, language } = useLanguage();
  const p = t.ghostcodeS10Page;

  return (
    <>
      <section className="min-h-[80vh] flex items-center justify-center px-4 relative z-0" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="tracking-[0.5em] uppercase text-lg mb-8" style={{ color: '#ffffff' }}>{p.heroLabel}</p>
          <h1 className="font-montserrat text-[2.5rem] sm:text-[3.563rem] md:text-[5.7rem] font-bold mb-6" style={{ color: '#ffffff' }}>{p.heroTitle}</h1>
          <p className="text-xl md:text-2xl mb-10" style={{ color: '#ffffff' }}>{p.heroSubtitle}</p>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="bg-white text-black border-white hover:bg-white/90 rounded-full px-10 text-base">{p.heroCta}</Button>
          </Link>
        </div>
      </section>

      <section className="relative px-4 flex flex-col items-center justify-center pt-16 pb-16" style={{ background: 'linear-gradient(to left, #c0c0c0 0%, #606060 30%, #1a1a1a 60%, #000000 100%)' }}>
        <img src="https://spudbndneoaltpseizye.supabase.co/storage/v1/object/public/assets/ghostcode-s10.avif" alt="Ghostcode S10 Device" className="max-w-[27.97rem] w-full mb-8 relative -mt-40 z-10" />
      </section>

      {/* How encryption works */}
      <section className="px-4 py-20" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl md:text-3xl font-light" style={{ color: '#ffffff' }}>
            {p.howTitle}
          </h2>
        </div>
      </section>

      {/* Encryption details */}
      <section className="px-4 py-16" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-[1.069rem] mb-10" style={{ color: '#333333' }}>{p.howIntro}</p>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
            <div>
              <h3 className="text-[1.069rem] font-bold mb-2" style={{ color: '#000000' }}>{p.step1Title}</h3>
              <p className="text-[0.95rem]" style={{ color: '#333333' }}>{p.step1Desc}</p>
            </div>
            <div>
              <h3 className="text-[1.069rem] font-bold mb-2" style={{ color: '#000000' }}>{p.step4Title}</h3>
              <p className="text-[0.95rem]" style={{ color: '#333333' }}>{p.step4Desc}</p>
            </div>
            <div>
              <h3 className="text-[1.069rem] font-bold mb-2" style={{ color: '#000000' }}>{p.step2Title}</h3>
              <p className="text-[0.95rem]" style={{ color: '#333333' }}>{p.step2Desc}</p>
            </div>
            <div>
              <h3 className="text-[1.069rem] font-bold mb-2" style={{ color: '#000000' }}>{p.step5Title}</h3>
              <p className="text-[0.95rem]" style={{ color: '#333333' }}>{p.step5Desc}</p>
            </div>
            <div>
              <h3 className="text-[1.069rem] font-bold mb-2" style={{ color: '#000000' }}>{p.step3Title}</h3>
              <p className="text-[0.95rem]" style={{ color: '#333333' }}>{p.step3Desc}</p>
            </div>
            <div>
              <h3 className="text-[1.069rem] font-bold mb-2" style={{ color: '#000000' }}>{p.privacyTitle}</h3>
              <p className="text-[0.95rem]" style={{ color: '#333333' }}>{p.privacyDesc}</p>
              <p className="mt-4 font-semibold text-[0.95rem]" style={{ color: '#000000' }}>{p.privacyResult}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video section */}
      <section className="px-0" style={{ backgroundColor: '#000000' }}>
        <video className="w-full" controls playsInline preload="metadata" key={language}>
          <source src={language === 'pt' ? videoPtAsset.url : language === 'en' ? videoEnAsset.url : videoEsAsset.url} type="video/mp4" />
        </video>
      </section>

      {/* Hybrid encryption section */}
      <section className="px-4 py-24" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl md:text-2xl font-light mb-6 text-white">{p.hybridTitle}</h2>
            <p className="text-white/90 mb-6">{p.hybridIntro}</p>
            <ul className="list-disc list-inside space-y-4 text-white/90 ml-2">
              <li>{p.hybridList1}</li>
              <li>{p.hybridList2}</li>
              <li>{p.hybridList3}</li>
            </ul>
            <p className="text-white/90 mt-6">{p.hybridOutro}</p>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-light mb-6 text-white">{p.encodingTitle}</h2>
            <p className="text-white/90 mb-6">{p.encodingIntro}</p>
            <ol className="list-decimal list-inside space-y-4 text-white/90 ml-2">
              <li>{p.encodingList1}</li>
              <li>{p.encodingList2}</li>
            </ol>
            <p className="text-white/90 mt-6">{p.encodingOutro}</p>
          </div>
        </div>
      </section>

      {/* Bane image */}
      <section style={{ backgroundColor: '#000000' }}>
        <img src={baneImage} alt="Ghostcode S10" className="w-full" />
      </section>

      {/* AES-256 white section */}
      <section className="px-4 py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[1.05rem] font-bold mb-8" style={{ color: '#000000' }}>{p.aesIntro}</p>
          <ul className="list-disc list-inside space-y-6 text-[1rem]" style={{ color: '#000000' }}>
            <li>{p.aesList1}</li>
            <li>{p.aesList2}</li>
            <li>{p.aesList3}</li>
          </ul>
        </div>
      </section>

      {/* Marketing Ético */}
      <section className="px-4 py-24" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 md:gap-16 items-center">
          <div className="text-justify">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-8 text-white text-left">{p.marketingTitle}</h2>
            <p className="text-white/90 mb-6">{p.marketingP1}</p>
            <p className="text-white/90 mb-6">{p.marketingP2}</p>
            <p className="text-white/90 mb-2">{p.marketingP3}</p>
            <p className="text-white/90 mb-2">{p.marketingP4}</p>
            <p className="text-white/90">{p.marketingP5}</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <img src={marketingGif} alt="Ghostcode S10" className="max-w-[280px] sm:max-w-[320px] w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Seguridad y Resistencia */}
      <section className="px-4 py-24" style={{ backgroundColor: '#ffffff' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-8 md:gap-12 items-start">
          <div className="pt-4 md:pt-8">
            <div className="w-16 h-px bg-black/40 mb-6"></div>
            <h3 className="text-xl font-light text-black mb-4">{p.securityTitle}</h3>
            <p className="text-black/80 text-sm leading-relaxed">{p.securityDesc}</p>
          </div>
          <div className="flex justify-center order-first md:order-none">
            <img src={ghostcodeS10Device} alt="Ghostcode S10" className="max-w-[300px] md:max-w-[500px] w-full" />
          </div>
          <div className="pt-4 md:pt-8">
            <div className="w-16 h-px bg-black/40 mb-6 md:ml-auto"></div>
            <h3 className="text-xl font-light text-black mb-4">{p.resistanceTitle}</h3>
            <p className="text-black/80 text-sm leading-relaxed">{p.resistanceDesc}</p>
          </div>
        </div>

        {/* Bottom text and CTA */}
        <div className="text-center mt-16">
          <div className="w-16 h-px bg-black/40 mx-auto mb-6"></div>
          <h3 className="text-xl font-light text-black mb-4">{p.noDepTitle}</h3>
          <p className="text-black/70 text-sm max-w-2xl mx-auto mb-8">{p.noDepDesc}</p>
          <Link to="/ghostcode-s10-product" onClick={() => window.scrollTo(0, 0)}>
            <Button className="bg-[#5bbcf2] hover:bg-[#4aaae0] text-white px-12 py-3 rounded-full text-sm uppercase tracking-wider">
              {p.buyBtn}
            </Button>
          </Link>
        </div>

        {/* Banner image */}
        <div className="mt-20 relative">
          <img src={ghostcodeBanner} alt="Ghostcode S10 banner" className="w-full rounded-2xl" />
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12">
            <a
              href={`/docs/${language === 'es' ? 'ES' : language === 'pt' ? 'PT' : 'EN'}.pdf`}
              download
            >
              <button className="font-poppins font-semibold text-sm sm:text-lg md:text-2xl px-4 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg transition-all duration-300 animate-bounce border-none outline-none opacity-100" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                {p.learnMoreBtn}
              </button>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-0 bg-white py-16 sm:py-20 px-4 sm:px-6 -mx-4 sm:-mx-6 md:-mx-12 lg:-mx-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-poppins font-extralight text-2xl md:text-4xl text-black text-center mb-16">
              {p.formTitle}
            </h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-sm text-black/70 mb-1 block">{p.formFirstName}</label>
                  <input type="text" className="w-full bg-transparent border-b border-black/40 py-2 text-black outline-none focus:border-black transition-colors" />
                </div>
                <div>
                  <label className="text-sm text-black/70 mb-1 block">{p.formLastName}</label>
                  <input type="text" className="w-full bg-transparent border-b border-black/40 py-2 text-black outline-none focus:border-black transition-colors" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-end gap-8">
                <div className="flex-1">
                  <label className="text-sm text-black/70 mb-1 block">{p.formEmail}</label>
                  <input type="email" required className="w-full bg-transparent border-b border-black/40 py-2 text-black outline-none focus:border-black transition-colors" />
                </div>
                <button type="submit" className="bg-black text-white px-12 py-3 rounded-full text-sm hover:bg-black/80 transition-colors whitespace-nowrap">
                  {p.formSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}