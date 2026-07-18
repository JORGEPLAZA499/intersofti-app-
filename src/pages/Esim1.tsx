import { useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useNavigate } from "react-router-dom";
import { assetUrl } from "@/lib/assetUrl";
import { VersionFooter } from "@/components/VersionFooter";
import illustrationAsset from "@/assets/esim-onboarding-1.png.asset.json";
import nextIllustration2 from "@/assets/esim-onboarding-2.png.asset.json";
import nextIllustration3 from "@/assets/esim-onboarding-3.png.asset.json";
const illustration = assetUrl(illustrationAsset);


type Lang = "es" | "en" | "pt";

const COPY: Record<Lang, {
  skip: string;
  title: JSX.Element;
  next: string;
}> = {
  es: {
    skip: "Saltar",
    title: (
      <>
        Asegúrate de que tu{" "}
        <span className="text-[#2e6b8a] font-semibold">dispositivo</span> sea
        compatible con la{" "}
        <span className="text-[#2e6b8a] font-semibold">tecnología eSIM.</span>
      </>
    ),
    next: "Siguiente",
  },
  en: {
    skip: "Skip",
    title: (
      <>
        Make sure your{" "}
        <span className="text-[#2e6b8a] font-semibold">device</span> is
        compatible with{" "}
        <span className="text-[#2e6b8a] font-semibold">eSIM technology.</span>
      </>
    ),
    next: "Next",
  },
  pt: {
    skip: "Pular",
    title: (
      <>
        Certifique-se de que seu{" "}
        <span className="text-[#2e6b8a] font-semibold">dispositivo</span> é
        compatível com a{" "}
        <span className="text-[#2e6b8a] font-semibold">tecnologia eSIM.</span>
      </>
    ),
    next: "Próximo",
  },
};

export default function Esim1() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = COPY[language as Lang];

  useEffect(() => {
    // Preload next onboarding illustrations
    [assetUrl(nextIllustration2), assetUrl(nextIllustration3)].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);


  return (
    <div
      className="min-h-screen w-full flex flex-col px-6 pt-8 pb-8"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F4FAFD 25%, #E8F4FA 55%, #DBEEF7 100%)",
      }}
    >
      {/* Skip */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/eSIM")}
          className="text-slate-800 text-[15px] underline underline-offset-4"
        >
          {t.skip}
        </button>
      </div>

      {/* Step indicator */}
      <div className="mt-6 flex justify-center">
        <div className="w-14 h-14 rounded-full border-2 border-[#2e6b8a] bg-white flex items-center justify-center shadow-sm">
          <span className="text-[22px] font-semibold text-[#2e6b8a]">1</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="mt-6 text-center text-[28px] leading-[1.2] font-medium text-slate-900 max-w-md mx-auto">
        {t.title}
      </h1>

      {/* Illustration */}
      <div className="mt-6 flex-1 flex items-center justify-center">
        <img
          src={illustration}
          alt=""
          width={900}
          height={1100}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="max-h-[46vh] w-auto object-contain"
        />
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mt-4 mb-6">
        <span className="h-1.5 w-10 rounded-full bg-[#2e6b8a]" />
        <span className="h-1.5 w-8 rounded-full bg-slate-300" />
        <span className="h-1.5 w-8 rounded-full bg-slate-300" />
        <span className="h-1.5 w-8 rounded-full bg-slate-300" />
      </div>

      {/* CTAs */}
      <button
        onClick={() => navigate("/esim_2")}
        className="w-full h-14 rounded-2xl bg-[#2e6b8a] text-white text-[17px] font-semibold shadow-lg active:scale-[0.99] transition hover:bg-[#265a76]"
      >
        {t.next}
      </button>
      <VersionFooter />
    </div>
  );
}

