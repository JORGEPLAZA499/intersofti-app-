import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

import { BinaryBackground } from '@/components/BinaryBackground';
import { Button } from '@/components/ui/button';
import blog1Img from '@/assets/blog-1-sm.avif';
import blog2Img from '@/assets/blog-2-sm.avif';
import blog3Img from '@/assets/blog-3.avif';
import blog4Img from '@/assets/blog-4-sm.avif';
import esimHero from '@/assets/esim-hero.avif';
import ghostcodeChipHero from '@/assets/ghostcode-s10-chip-hero.png';

const Index = () => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#noticias') {
      const noticiasSection = document.getElementById('noticias');

      if (noticiasSection) {
        noticiasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash]);

  // Preload eSIM hero image after the page is idle so /eSIM shows it instantly
  // when navigated to, without competing with critical homepage resources.
  useEffect(() => {
    const schedule = (cb: () => void) => {
      const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(cb);
      } else {
        setTimeout(cb, 2000);
      }
    };
    let link: HTMLLinkElement | null = null;
    schedule(() => {
      link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = esimHero;
      link.type = 'image/avif';
      document.head.appendChild(link);
    });
    return () => {
      if (link && link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <BinaryBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/40 to-background" />
        <div className="relative z-10 flex flex-col items-center justify-center mx-auto px-4">
            <h1 className="font-poppins text-[1.75rem] sm:text-[2rem] md:text-[2.494rem] lg:text-[3.99rem] font-extralight mb-6 leading-tight text-white whitespace-normal lg:whitespace-nowrap text-center">
              {t.hero.title}
            </h1>
            <h1 className="font-poppins text-[1.75rem] sm:text-[2rem] md:text-[2.494rem] lg:text-[3.99rem] font-extralight mb-6 leading-tight text-white whitespace-normal lg:whitespace-nowrap text-center">
              {t.hero.subtitle}
            </h1>
            <Link to="/eSIM" onClick={() => window.scrollTo(0, 0)} aria-label={t.hero.buyEsim} className="mt-4 group relative inline-block">
              <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary via-white to-primary opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500 animate-pulse" aria-hidden="true" />
              <Button
                size="lg"
                className="relative bg-white text-black hover:bg-white rounded-full px-10 py-6 text-base font-medium shadow-[0_8px_30px_rgb(255,255,255,0.25)] hover:shadow-[0_12px_40px_rgb(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary/20 to-transparent" aria-hidden="true" />
                <span className="relative flex items-center gap-2">
                  {t.hero.buyEsim}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="pb-48 pt-24 px-4 bg-white relative">
        <div className="max-w-6xl mx-auto">
           <div className="max-w-6xl mx-auto text-left">
              <h2 className="font-poppins text-4xl font-extralight mb-6 text-black text-center">{t.about.title}</h2>
              <p className="text-black/70 mb-6 leading-relaxed">{t.about.description}</p>
              <p className="text-black/70 leading-relaxed whitespace-pre-line">{t.about.missionText}</p>
            </div>
        </div>
      </section>

      {/* Ghostcode chip hero banner - fixed parallax */}
      <section
        className="w-full h-[280px] md:h-[380px] lg:h-[460px] bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${ghostcodeChipHero})` }}
        aria-label="GhostCode S-10 chip"
      />

      {/* Ghostcode S10 Preview */}
      <section className="pt-24 pb-24 px-4 bg-[#0a0a0a] relative z-10">

        <div className="max-w-6xl mx-auto text-center">
          <img src="https://spudbndneoaltpseizye.supabase.co/storage/v1/object/public/assets/ghostcode-s10.avif" alt="Ghostcode S10" className="mx-auto mb-8 max-w-[27.97rem] w-full relative -mt-48 z-10" />
          <h2 className="font-poppins text-4xl font-extralight mb-2 text-white">{t.ghostcode.title}</h2>
          <h3 className="font-poppins text-2xl font-extralight mb-4 text-white">{t.ghostcode.subtitle}</h3>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">{t.ghostcode.description}</p>
          <div className="flex justify-center">
            <Link to="/ghostcode-s10" onClick={() => window.scrollTo(0, 0)} aria-label="More information about Ghostcode S10 secure smartphone">
              <Button variant="outline" size="lg" aria-label="More information about Ghostcode S10 secure smartphone" className="bg-white text-black border-white hover:bg-white/90 rounded-full px-8">{t.ghostcode.learnMore}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section id="noticias" className="py-24 px-4 bg-white scroll-mt-24">
        <div className="max-w-full mx-auto px-4">
          <h2 className="font-poppins text-4xl font-extralight mb-12 text-center text-black">{t.blog.title}</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {t.blog.posts.map((post, i) => (
              <div key={i} className="bg-white border border-black/10 rounded-xl p-6 hover:border-black/30 transition-colors group">
                {[blog1Img, blog2Img, blog3Img, blog4Img][i] ? (
                  <img src={[blog1Img, blog2Img, blog3Img, blog4Img][i]} alt={post.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg mb-4" />
                )}
                <h3 className="font-montserrat font-normal mb-2 text-black group-hover:text-black/70 transition-colors">{post.title}</h3>
                <Link to={`/blog/${i + 1}`} className="text-sm text-black hover:underline">{t.blog.readMore} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
