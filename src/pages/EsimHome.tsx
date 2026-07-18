import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import heroAsset from "@/assets/esim-hero-woman.png.asset.json";
import globeAsset from "@/assets/esim-globe-transparent.png.asset.json";
import { assetUrl } from "@/lib/assetUrl";
import { VersionFooter } from "@/components/VersionFooter";



const FlagES = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-5 h-5 rounded-sm flex-shrink-0">
    <rect width="750" height="500" fill="#AA151B" />
    <rect y="125" width="750" height="250" fill="#F1BF00" />
  </svg>
);

const FlagGB = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-5 rounded-sm flex-shrink-0">
    <clipPath id="s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const FlagBR = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 14" className="w-5 h-5 rounded-sm flex-shrink-0">
    <rect width="20" height="14" fill="#009C3B" />
    <path d="M10 1.5 L18.5 7 L10 12.5 L1.5 7 Z" fill="#FFDF00" />
    <circle cx="10" cy="7" r="3.5" fill="#002776" />
    <path d="M6.5 7 Q10 5 13.5 7 Q10 9 6.5 7" fill="#FFFFFF" />
  </svg>
);

const LANGS = [
  { code: "es", label: "Español", Flag: FlagES },
  { code: "en", label: "English", Flag: FlagGB },
  { code: "pt", label: "Português", Flag: FlagBR },
];

type Lang = "es" | "en" | "pt";

const COPY: Record<Lang, {
  title: (accent: string) => JSX.Element;
  accent: string;
  bullets: JSX.Element[];
  have: string;
  buy: string;
  myEsim: string;
  myEsimHint: string;
}> = {

  es: {
    accent: "mejor eSIM de viaje",
    title: (accent) => (
      <>
        Bienvenido a la <span className="text-[hsl(var(--esim-accent))]">{accent}</span>
      </>
    ),
    bullets: [
      <>Los mejores precios del mercado <strong>eSIM</strong>.</>,
      <>Internet confiable con <strong>velocidad de hasta 5G</strong>.</>,
      <><strong>Compartir datos</strong>.</>,
      <><strong>Soporte</strong> 24/7.</>,
    ],
    have: "Consultar saldo o recarga tu eSIM",
    buy: "Compra una eSIM",
    myEsim: "Mi eSIM",
    myEsimHint: "Ver mis datos",
  },

  en: {
    accent: "best travel eSIM",
    title: (accent) => (
      <>
        Welcome to the <span className="text-[hsl(var(--esim-accent))]">{accent}</span>
      </>
    ),
    bullets: [
      <>The best <strong>eSIM prices</strong> on the market.</>,
      <>Reliable internet at <strong>speeds up to 5G</strong>.</>,
      <><strong>Data sharing</strong>.</>,
      <><strong>Support</strong> 24/7.</>,
    ],
    have: "Check balance or top up your eSIM",
    buy: "Buy an eSIM",
    myEsim: "My eSIM",
    myEsimHint: "View my data",

  },
  pt: {
    accent: "melhor eSIM de viagem",
    title: (accent) => (
      <>
        Bem-vindo ao <span className="text-[hsl(var(--esim-accent))]">{accent}</span>
      </>
    ),
    bullets: [
      <>Os melhores preços de <strong>eSIM</strong> do mercado.</>,
      <>Internet confiável com <strong>velocidade de até 5G</strong>.</>,
      <><strong>Compartilhar dados</strong>.</>,
      <><strong>Suporte</strong> 24/7.</>,
    ],
    have: "Consultar saldo ou recarregar seu eSIM",
    buy: "Comprar um eSIM",
    myEsim: "Meu eSIM",
    myEsimHint: "Ver meus dados",
  },

};

export default function EsimHome() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const lang = language as Lang;
  const [openLang, setOpenLang] = useState(false);
  const [savedIccid, setSavedIccid] = useState<string | null>(null);
  const t = COPY[lang];

  useEffect(() => {
    try {
      const stored = localStorage.getItem("myEsimIccid");
      if (stored) setSavedIccid(stored);
    } catch {}
  }, []);


  return (
    <div
      className="min-h-screen w-full flex flex-col px-5 pb-6 items-center justify-center lg:px-16 xl:px-24"
      style={{
        // Arctic Frost corporate gradient: white → soft ice blue
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F4FAFD 30%, #E8F4FA 65%, #DBEEF7 100%)",
        // @ts-expect-error -- CSS var
        "--esim-accent": "200 52% 36%",
        paddingTop: 'calc(env(safe-area-inset-top) + 1.5rem)',
      }}
    >
      {/* Language pill — top-right on mobile, absolute top-right on desktop */}
      <div className="fixed right-4 z-20 lg:absolute" style={{ top: 'calc(env(safe-area-inset-top) + 1rem)' }}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenLang((v) => !v)}
            className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-2.5 py-1.5 shadow-sm text-[13px] text-slate-800 border border-slate-200/60"
          >
            {(() => {
              const CurrentFlag = LANGS.find((l) => l.code === lang)?.Flag;
              return CurrentFlag ? <CurrentFlag /> : null;
            })()}
            <span>{LANGS.find((l) => l.code === lang)?.label}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {openLang && (
            <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white shadow-lg overflow-hidden z-30 border border-slate-100">
              {LANGS.map((l) => {
                const Flag = l.Flag;
                return (
                  <button
                    key={l.code}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 text-[13px] text-slate-800 hover:bg-slate-50"
                    onClick={() => {
                      setLanguage(l.code as Lang);
                      setOpenLang(false);
                    }}
                  >
                    <Flag />
                    <span>{l.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Single column: copy + CTAs + hero image */}
      <div className="flex flex-col justify-center w-full max-w-xl mx-auto mt-2 lg:mt-0">
        {/* Hero */}
        <div className="mt-2 lg:mt-0">
          <div className="mb-3 flex items-center justify-start gap-3">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 flex-shrink-0">
              <img
                src={assetUrl(globeAsset)}
                alt="Globo eSIM"
                width={440}
                height={440}
                loading="eager"
                className="relative w-full h-full object-contain globe-fx"
              />
            </div>
            {!savedIccid && (
              <h1 className="flex-1 text-[22px] sm:text-[26px] lg:text-[28px] leading-[1.15] font-semibold tracking-tight text-slate-900">
                {t.title(t.accent)}
              </h1>
            )}
            {savedIccid && (
              <button
                type="button"
                onClick={() => navigate(`/esim-status?iccid=${encodeURIComponent(savedIccid)}`)}
                className="my-esim-card group relative flex-1 max-w-[160px] rounded-2xl bg-gradient-to-br from-[#2e6b8a] to-[#3B82F6] text-white p-3 shadow-lg text-left active:scale-[0.97] transition hover:shadow-xl"
                aria-label={t.myEsim}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20 backdrop-blur">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <rect x="5" y="2" width="14" height="20" rx="2.5" />
                      <path d="M9 18h6" />
                    </svg>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold leading-tight">{t.myEsim}</div>
                    <div className="text-[9px] text-white/80 truncate">{t.myEsimHint}</div>
                  </div>
                </div>
                <span className="pointer-events-none absolute -inset-1 rounded-2xl ring-2 ring-[#3B82F6]/40 opacity-0 group-hover:opacity-100 transition" />
              </button>
            )}
          </div>

          {savedIccid && (
            <h1 className="text-[30px] leading-[1.08] font-semibold tracking-tight text-slate-900 lg:text-[38px] xl:text-[44px]">
              {t.title(t.accent)}
            </h1>
          )}
        </div>

        {/* Bullets */}
        <ul className="mt-3 space-y-3 lg:mt-4">
          {t.bullets.map((b, i) => (
            <li
              key={i}
              className="group flex items-start gap-4 cursor-default"
            >
              <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-[#2e6b8a] flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#265a76] group-hover:shadow-[0_0_14px_rgba(46,107,138,0.45)]">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </span>
              <span className="text-[15px] leading-snug text-slate-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#2e6b8a]">
                {b}
              </span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-4 mt-8 lg:mt-10">
          <button
            onClick={() => navigate("/esim-status")}
            className="group relative h-24 lg:h-28 rounded-3xl bg-gradient-to-br from-[#2e6b8a] to-[#3B82F6] text-white p-4 flex flex-col justify-between text-left shadow-[0_10px_30px_-8px_rgba(59,130,246,0.5)] active:scale-[0.98] transition hover:shadow-[0_14px_40px_-8px_rgba(59,130,246,0.65)] border-[3px] border-white/90 ring-2 ring-[#3B82F6]/40 ring-offset-2 ring-offset-[#E8F4FA] overflow-hidden cta-pulse"
          >
            <span className="pointer-events-none absolute inset-0 rounded-3xl border border-white/30" />
            <span className="relative z-10 text-[14px] lg:text-[16px] font-semibold leading-tight drop-shadow-sm">{t.have}</span>
            <ArrowRight className="relative z-10 w-5 h-5 text-white group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => navigate("/esim_1")}
            className="group h-24 lg:h-28 rounded-3xl bg-[#3B82F6] text-white p-4 flex flex-col justify-between text-left shadow-lg active:scale-[0.98] transition hover:bg-[#2563EB]"
          >
            <span className="text-[14px] lg:text-[16px] font-semibold leading-tight">{t.buy}</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* Hero image below the cards */}
        <div className="w-full flex items-center justify-center mt-8 lg:mt-10">
          <img
            src={assetUrl(heroAsset)}
            alt="eSIM"
            width={900}
            height={1100}
            loading="eager"
            className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[400px] h-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <style>{`
        @keyframes esim-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .globe-fx {
          animation: esim-float 4s ease-in-out infinite;
        }
        @keyframes my-esim-pulse {
          0%, 100% { transform: translateY(0); box-shadow: 0 10px 25px -8px rgba(59,130,246,0.45); }
          50% { transform: translateY(-4px); box-shadow: 0 18px 32px -8px rgba(59,130,246,0.6); }
        }
        .my-esim-card { animation: my-esim-pulse 3.2s ease-in-out infinite; }
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.45), 0 10px 30px -8px rgba(59,130,246,0.5); }
          50% { box-shadow: 0 0 0 12px rgba(59,130,246,0), 0 14px 40px -8px rgba(59,130,246,0.65); }
        }
        .cta-pulse { animation: cta-pulse 2.2s ease-in-out infinite; }
      `}</style>
      <VersionFooter />
    </div>
  );
}

