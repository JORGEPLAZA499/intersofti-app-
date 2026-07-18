import { useEffect, useState } from 'react';
import { CreditCard, Zap, Globe, ShieldCheck, Smartphone, Coins } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import cardImage from '@/assets/crypto-card-firswe-visa.webp';
import logoFirswe from '@/assets/logo-firswe.webp';

export default function CryptoCardFirsweVisa() {
  const { t } = useLanguage();
  const c = t.cryptoCard;
  const [cardLoaded, setCardLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${c.title} | INTERSOFTI`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';
    if (meta) meta.setAttribute('content', c.description);
    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute('content', prevDesc);
    };
  }, [c.title, c.description]);

  const icons = [Globe, Zap, ShieldCheck, Coins, Smartphone, CreditCard];

  return (
    <section style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column: logo + card image */}
          <div className="flex flex-col items-center gap-6 md:ml-auto md:w-full md:max-w-md">
            <div
              className="w-full max-w-[314px] mx-auto"
              style={{ aspectRatio: '400 / 120' }}
            >
              <img
                src={logoFirswe}
                alt="Firswe"
                width={400}
                height={120}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setLogoLoaded(true)}
                className={`w-full h-full object-contain transition-opacity duration-200 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
            <div
              className={`w-full max-w-md rounded-2xl overflow-hidden bg-black transition-all duration-200 ${
                cardLoaded
                  ? 'border-4 border-white ring-1 ring-white/20 shadow-2xl shadow-black/60'
                  : 'border-0'
              }`}
              style={{ aspectRatio: '800 / 533' }}
            >
              <img
                src={cardImage}
                alt={c.title}
                width={800}
                height={533}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                onLoad={() => setCardLoaded(true)}
                className={`w-full h-full object-contain block transition-opacity duration-200 ${cardLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
            <div className="w-full max-w-md rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-center">
              <p className="text-white font-semibold">Próximamente disponible</p>
            </div>
          </div>

          {/* Right column: information */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {c.title}
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              {c.description}
            </p>

            <ul className="space-y-4 pt-2">
              {c.features.map((feature, i) => {
                const Icon = icons[i % icons.length];
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-1 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
