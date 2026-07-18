import { Suspense, lazy, useEffect, useState, useMemo, useRef } from 'react';
import visaLogo from '@/assets/payment-logos/visa.svg';
import mastercardLogo from '@/assets/payment-logos/mastercard.svg';
import amexLogo from '@/assets/payment-logos/amex.svg';
import applePayLogo from '@/assets/payment-logos/applepay.svg';
import googlePayLogo from '@/assets/payment-logos/googlepay.svg';
import btcLogo from '@/assets/payment-logos/btc.svg';
import ethLogo from '@/assets/payment-logos/eth.svg';
import usdtLogo from '@/assets/payment-logos/usdt.svg';
import trxLogo from '@/assets/payment-logos/trx.svg';
import bnbLogo from '@/assets/payment-logos/bnb.svg';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { matchesCountrySearch, matchesCountryCodeSearch, getCountryNameByCode, getAllCountryCodes } from '@/lib/countryNames';
import { AFRICAN_COUNTRY_CODES, SOUTH_AMERICAN_COUNTRY_CODES } from '@/lib/countries';
import { REGION_ORDER, REGION_BUNDLES, getRegionLabel, getBundleLabel, type RegionKey } from '@/lib/esimRegions';
import { readEsimCache, fetchEsimPackages, prefetchEsimPackages, type EsimPackage as CachedEsimPackage } from '@/lib/esimCache';

import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Globe, Wifi, Clock, Zap, MapPin, Info, CreditCard, Bitcoin, X, ChevronDown, ArrowRight, Home } from 'lucide-react';
import intersoftiBall from '@/assets/intersofti-ball.png.asset.json';
import { assetUrl } from '@/lib/assetUrl';
import { VersionFooter } from '@/components/VersionFooter';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PaymentTestModeBanner } from '@/components/PaymentTestModeBanner';
import { isNativeApp } from '@/lib/isNativeApp';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useStandaloneMode } from '@/hooks/useStandaloneMode';

interface LocationNetwork {
  locationName?: string;
  locationCode?: string;
  locationLogo?: string;
}

type EsimPackage = CachedEsimPackage;

type FilterTab = 'none' | 'global' | 'europe' | 'africa' | 'southamerica' | 'country';

const StripeEmbeddedCheckout = lazy(() =>
  import('@/components/StripeEmbeddedCheckout').then((module) => ({ default: module.StripeEmbeddedCheckout }))
);

const paymentEnvironment = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN?.startsWith('pk_test_') ? 'sandbox' : 'live';

// Hero search copy
const HERO_COPY = {
  en: { title: 'Buy eSIM Online', placeholder: 'Where are you traveling to?', esim: 'eSIM', noResults: 'No destinations match your search.', searchAria: 'Search', regions: 'Regions', countries: 'Countries', typeToFilter: 'Type to filter destinations' },
  pt: { title: 'Comprar eSIM Online', placeholder: 'Para onde você vai viajar?', esim: 'eSIM', noResults: 'Nenhum destino corresponde à sua busca.', searchAria: 'Buscar', regions: 'Regiões', countries: 'Países', typeToFilter: 'Digite para filtrar destinos' },
  es: { title: 'Comprar eSIM Online', placeholder: '¿A dónde viajas?', esim: 'eSIM', noResults: 'Ningún destino coincide con tu búsqueda.', searchAria: 'Buscar', regions: 'Regiones', countries: 'Países', typeToFilter: 'Escribe para filtrar destinos' },
} as const;

type HeroAccent = { from: string; to: string; solid: string; ring: string };
const HERO_PALETTE: HeroAccent[] = [
  { from: '#2563eb', to: '#60a5fa', solid: '#2563eb', ring: 'rgba(37,99,235,0.35)' },
  { from: '#0d7a5f', to: '#22a37c', solid: '#0d7a5f', ring: 'rgba(13,122,95,0.35)' },
  { from: '#c9a84c', to: '#e8c56b', solid: '#a8862d', ring: 'rgba(200,168,76,0.40)' },
  { from: '#c44569', to: '#e8748a', solid: '#c44569', ring: 'rgba(196,69,105,0.35)' },
  { from: '#e85d3a', to: '#f78a56', solid: '#e85d3a', ring: 'rgba(232,93,58,0.35)' },
  { from: '#6c5ce7', to: '#9b8cf5', solid: '#6c5ce7', ring: 'rgba(108,92,231,0.35)' },
  { from: '#0c5460', to: '#2d8a9e', solid: '#0c5460', ring: 'rgba(12,84,96,0.40)' },
  { from: '#8b6f5e', to: '#c9955a', solid: '#8b6f5e', ring: 'rgba(139,111,94,0.35)' },
];
const heroAccentAt = (i: number) => HERO_PALETTE[i % HERO_PALETTE.length];
const heroNormalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const HERO_COUNTRY_CODES: string[] = Object.keys(getAllCountryCodes()).sort();

type HeroItem = { id: string; label: string; kind: 'region' | 'country'; value: string; code?: string; accent: HeroAccent };

function HeroThumb({ item }: { item: HeroItem }) {
  if (item.kind === 'region') {
    return (
      <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ boxShadow: `0 6px 16px -6px ${item.accent.ring}` }}>
        <img src={assetUrl(intersoftiBall)} alt="Intersofti" className="w-14 h-14 object-contain" />
      </div>
    );
  }
  const cc = (item.code || '').slice(0, 2).toLowerCase();
  return (
    <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 flex items-center justify-center p-[3px]" style={{ background: `linear-gradient(135deg, ${item.accent.from}, ${item.accent.to})` }}>
      <div className="w-full h-full rounded-full overflow-hidden bg-white">
        <img src={`https://flagcdn.com/w80/${cc}.png`} srcSet={`https://flagcdn.com/w160/${cc}.png 2x`} alt={cc} className="w-full h-full object-cover" loading="lazy" />
      </div>
    </div>
  );
}


function renderHeroTitle(title: string) {
  // Split into two lines: everything up to and including "eSIM", then the rest (e.g. "Online")
  const match = title.match(/^(.*?eSIM)\s*(.*)$/i);
  const firstLine = match ? match[1] : title;
  const secondLine = match ? match[2] : '';
  const renderPart = (text: string, keyPrefix: string) => {
    const parts = text.split(/(eSIM)/i);
    return parts.map((part, i) =>
      part.toLowerCase() === 'esim' ? (
        <span key={`${keyPrefix}-${i}`} className="relative inline-block text-blue-600">
          {part}
          <span className="pointer-events-none absolute -bottom-1 left-0 w-full h-1 md:h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full opacity-80" />
        </span>
      ) : (
        <span key={`${keyPrefix}-${i}`}>{part}</span>
      )
    );
  };
  return (
    <>
      <span className="block">{renderPart(firstLine, 'l1')}</span>
      {secondLine && <span className="block">{renderPart(secondLine, 'l2')}</span>}
    </>
  );
}

function formatData(bytes: number): string {
  if (bytes <= 0) return 'Unlimited';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb % 1 === 0 ? gb : gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${Math.round(mb)} MB`;
}

function formatPrice(price: number, markupPct: number): string {
  const base = price / 10000;
  const withMarkup = base * (1 + markupPct / 100);
  return `${withMarkup.toFixed(2)} €`;
}

function getAmountInCents(price: number, markupPct: number): number {
  const base = price / 10000;
  const withMarkup = base * (1 + markupPct / 100);
  return Math.round(withMarkup * 100);
}

function CountryFlag({ code, size = 20 }: { code: string; size?: number }) {
  if (!code || code.length < 2 || code.startsWith('!')) {
    return <Globe className="inline-block" style={{ width: size, height: size }} />;
  }
  const cc = code.slice(0, 2).toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w40/${cc}.png`}
      srcSet={`https://flagcdn.com/w80/${cc}.png 2x`}
      alt={cc}
      width={size}
      height={Math.round(size * 0.75)}
      className="inline-block rounded-sm object-cover"
      style={{ width: size, height: Math.round(size * 0.75) }}
      loading="lazy"
    />
  );
}

function Badge5G({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="relative shrink-0 animate-float">
        <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white ring-1 ring-white/25 shadow-lg shadow-blue-900/20">
          <Zap className="relative w-4 h-4" fill="currentColor" fillOpacity={0.3} />
          <span className="relative font-black text-sm tracking-tight">5G</span>
        </div>
      </div>
    );
  }
  return (
    <div className="relative shrink-0 animate-float">
      <div className="relative flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white ring-1 ring-white/25 shadow-lg shadow-blue-900/20">
        <Zap className="relative w-5 h-5" fill="currentColor" fillOpacity={0.3} />
        <div className="relative flex flex-col leading-none">
          <span className="text-[9px] uppercase tracking-wider font-bold opacity-90">Velocidad</span>
          <span className="font-black text-base tracking-tight">5G</span>
        </div>
      </div>
    </div>
  );
}


export default function Products() {
  
  const { t, language } = useLanguage();
  const [packages, setPackages] = useState<EsimPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('none');
  const [selectedRegion, setSelectedRegion] = useState<RegionKey | 'country' | null>(null);
  const [selectedBundleCode, setSelectedBundleCode] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<EsimPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [markup, setMarkup] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [noEmail, setNoEmail] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedGB, setSelectedGB] = useState('');
  const [countriesDialogOpen, setCountriesDialogOpen] = useState(false);
  const [countriesDialogList, setCountriesDialogList] = useState<LocationNetwork[]>([]);
  const [countriesDialogTitle, setCountriesDialogTitle] = useState('');
  
  const [selectedCoverageIdx, setSelectedCoverageIdx] = useState<number | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ type: string; discount_percent: number | null } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [highlightTabs, setHighlightTabs] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [freeConfirmation, setFreeConfirmation] = useState<{
    packageName: string;
    quantity: number;
    email: string;
    orderIds: string[];
    orders: { id: string; orderNo: string | null; iccid: string | null }[];
    tokenCode: string;
  } | null>(null);
  const [heroReady] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [savedIccid, setSavedIccid] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("myEsimIccid");
      if (stored) setSavedIccid(stored);
    } catch {}
  }, []);

  // Hero search state
  const heroCopy = HERO_COPY[(language as 'en' | 'pt' | 'es')] ?? HERO_COPY.en;
  const [heroQuery, setHeroQuery] = useState('');
  const [heroSelected, setHeroSelected] = useState<HeroItem | null>(null);
  const [heroOpen, setHeroOpen] = useState(false);
  const [heroHighlight, setHeroHighlight] = useState(0);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  const heroRegionItems: HeroItem[] = useMemo(
    () => REGION_ORDER.map((r, i) => ({ id: `r-${r}`, label: getRegionLabel(r as RegionKey, language), kind: 'region' as const, value: r, accent: heroAccentAt(i) })),
    [language]
  );
  const heroCountryItems: HeroItem[] = useMemo(
    () => HERO_COUNTRY_CODES.map((code, i) => ({ id: `c-${code}`, label: getCountryNameByCode(code, language as any) ?? code, kind: 'country' as const, value: code, code, accent: heroAccentAt(i + 2) }))
      .sort((a, b) => a.label.localeCompare(b.label, language)),
    [language]
  );
  const heroAllItems = useMemo(() => [...heroCountryItems, ...heroRegionItems], [heroCountryItems, heroRegionItems]);
  const heroSuggestions: HeroItem[] = useMemo(() => {
    const q = heroNormalize(heroQuery.trim());
    if (!q) return heroAllItems;
    return heroAllItems.filter((it) => heroNormalize(it.label).includes(q)).slice(0, 16);
  }, [heroQuery, heroAllItems]);
  const heroCountrySugs = useMemo(() => heroSuggestions.filter((it) => it.kind === 'country'), [heroSuggestions]);
  const heroRegionSugs = useMemo(() => heroSuggestions.filter((it) => it.kind === 'region'), [heroSuggestions]);

  useEffect(() => setHeroHighlight(0), [heroQuery]);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!heroContainerRef.current?.contains(e.target as Node)) setHeroOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const goHero = (item: HeroItem) => {
    prefetchEsimPackages(item.value);
    if (item.kind === 'country') handleRegionChange('country', item.value);
    else handleRegionChange(item.value);
    setHeroOpen(false);
    setHeroQuery(item.label);
    setHeroSelected(item);
  };

  const onHeroKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHeroOpen(true); setHeroHighlight((h) => Math.min(h + 1, heroSuggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHeroHighlight((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (heroSuggestions[heroHighlight]) goHero(heroSuggestions[heroHighlight]); }
    else if (e.key === 'Escape') { setHeroOpen(false); }
  };

  // PWA mini-app: detect standalone mode for layout adjustments
  const isStandalone = useStandaloneMode();

  useEffect(() => {
    supabase
      .from('esim_settings')
      .select('value')
      .eq('key', 'markup_percentage')
      .single()
      .then(({ data }) => {
        if (data) setMarkup(parseFloat(data.value) || 0);
      });
  }, []);

  // In-memory cache for package lists keyed by locationCode (or 'ALL')
  const packagesCacheRef = useRef<Map<string, EsimPackage[]>>(new Map());

  // Warm the full catalog on mount so region selections load instantly.
  useEffect(() => {
    const cacheKey = 'ALL';
    const local = readEsimCache(cacheKey);
    if (local && !packagesCacheRef.current.has(cacheKey)) {
      packagesCacheRef.current.set(cacheKey, local);
    }
    // Always refresh in background to keep cache warm
    fetchEsimPackages().then((list) => {
      packagesCacheRef.current.set(cacheKey, list);
    }).catch(() => {});

    // Prefetch popular country catalogs in the background (idle time),
    // so country searches resolve instantly from cache.
    const POPULAR = ['US','GB','FR','ES','IT','DE','PT','JP','TH','TR','MX','BR','AR','MA','AE','CN','KR','IN','CA','AU','GR','NL','CH','EG','ID'];
    const runPrefetch = () => {
      POPULAR.forEach((code, i) => {
        setTimeout(() => {
          const c = code.toUpperCase();
          const cached = readEsimCache(c);
          if (cached && !packagesCacheRef.current.has(c)) {
            packagesCacheRef.current.set(c, cached);
          }
          // SWR: refresh in background regardless
          fetchEsimPackages(c).then((list) => {
            packagesCacheRef.current.set(c, list);
          }).catch(() => {});
        }, i * 250); // stagger to avoid API rate limits
      });
    };
    const ric = (window as any).requestIdleCallback;
    if (typeof ric === 'function') ric(runPrefetch, { timeout: 2000 });
    else setTimeout(runPrefetch, 1500);
  }, []);

  async function fetchPackages(locationCode?: string) {
    const cacheKey = locationCode || 'ALL';

    // 1. Serve instantly from in-memory cache
    const memCached = packagesCacheRef.current.get(cacheKey);
    if (memCached) {
      setPackages(memCached);
      setLoading(false);
      return;
    }

    // 2. Serve instantly from persistent localStorage cache
    const localCached = readEsimCache(cacheKey);
    if (localCached) {
      packagesCacheRef.current.set(cacheKey, localCached);
      setPackages(localCached);
      setLoading(false);
      // Refresh in background to keep data fresh
      fetchEsimPackages(locationCode).then((fresh) => {
        packagesCacheRef.current.set(cacheKey, fresh);
        setPackages(fresh);
      }).catch(() => {});
      return;
    }

    // 3. Cold load: show spinner while fetching
    try {
      setLoading(true);
      const list = await fetchEsimPackages(locationCode);
      packagesCacheRef.current.set(cacheKey, list);
      setPackages(list);
    } catch (error) {
      console.error('Failed to fetch eSIM packages:', error);
      toast.error('Failed to load eSIM plans');
    } finally {
      setLoading(false);
    }
  }

  function handleTabClick(tab: FilterTab) {
    if (tab === activeTab) {
      setActiveTab('none');
      setPackages([]);
      setCountrySearch('');
      setDebouncedSearch('');
      setSelectedGB('');
      setSelectedCountryCode(null);
      setShowCountrySuggestions(false);
      return;
    }
    setActiveTab(tab);
    setCountrySearch('');
    setDebouncedSearch('');
    setSelectedGB('');
    setSelectedCountryCode(null);
    setShowCountrySuggestions(false);

    if (tab === 'global') fetchPackages('!GL');
    else if (tab === 'europe') fetchPackages('!RG');
    else if (tab === 'africa') fetchPackages();
    else if (tab === 'southamerica') fetchPackages();
    else if (tab === 'country') fetchPackages();
  }

  function handleRegionChange(value: string, countryCode?: string) {
    // Reset downstream state
    setSelectedGB('');
    setSelectedCoverageIdx(null);
    setSelectedCountryCode(null);
    setShowCountrySuggestions(false);
    setCountrySearch('');
    setDebouncedSearch('');
    setSelectedBundleCode(null);
    setHighlightTabs(false);

    if (value === 'country') {
      setSelectedRegion('country');
      setActiveTab('country');
      if (countryCode) {
        // Fetch only that country’s packages for instant loading
        fetchPackages(countryCode.toUpperCase());
        selectCountry(countryCode.toUpperCase());
      } else {
        fetchPackages();
      }
      return;
    }

    const region = value as RegionKey;
    setSelectedRegion(region);
    // Map to internal tab to keep existing UI conditionals working
    const tabMap: Record<RegionKey, FilterTab> = {
      global: 'global',
      europe: 'europe',
      africa: 'africa',
      asia: 'none',
      middleeast: 'none',
      northamerica: 'none',
      southamerica: 'southamerica',
      caribbean: 'none',
      oceania: 'none',
    };
    setActiveTab(tabMap[region]);

    // Fetch full catalog so we can filter by any bundle's locationCode
    fetchPackages();

    // Auto-select bundle if region has only one
    const bundles = REGION_BUNDLES[region];
    if (bundles.length === 1) {
      setSelectedBundleCode(bundles[0].locationCode);
    }
  }

  function handleCountryInput(value: string) {
    setCountrySearch(value);
    setSelectedGB('');
    setSelectedCoverageIdx(null);
    setSelectedCountryCode(null);
    if (value.trim().length >= 4) {
      setShowCountrySuggestions(true);
    } else {
      setShowCountrySuggestions(false);
      setDebouncedSearch('');
    }
  }

  function selectCountry(code: string) {
    const name = getCountryNameByCode(code, language) || code;
    setCountrySearch(name);
    setSelectedCountryCode(code);
    setDebouncedSearch(name);
    setShowCountrySuggestions(false);
    setSelectedGB('');
    setSelectedCoverageIdx(null);
    // Mirror the selection in the hero search bar so the flag + name appear at the top
    const heroItem = heroCountryItems.find((it) => it.code === code);
    if (heroItem) {
      setHeroSelected(heroItem);
      setHeroQuery(heroItem.label);
    } else {
      setHeroSelected(null);
      setHeroQuery(name);
    }
  }

  // Preselect region or country from ?region=/?country= query params (on mount)
  const didPreselect = useRef(false);
  useEffect(() => {
    if (didPreselect.current) return;
    const region = searchParams.get('region');
    const country = searchParams.get('country');
    if (region && (REGION_ORDER as string[]).includes(region)) {
      didPreselect.current = true;
      handleRegionChange(region);
    } else if (country) {
      didPreselect.current = true;
      // Pass country code so we fetch only that country’s plans instantly
      handleRegionChange('country', country);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Get unique country codes from packages for autocomplete
  const countrySuggestions = useMemo(() => {
    if (!showCountrySuggestions || countrySearch.trim().length < 4) return [];
    const uniqueCodes = new Set<string>();
    packages.forEach(p => {
      const codes = p.location?.split(',').map(c => c.trim()) ?? [];
      if (codes.length === 1) uniqueCodes.add(codes[0].toUpperCase());
    });
    const q = countrySearch.trim();
    return Array.from(uniqueCodes)
      .filter(code => matchesCountryCodeSearch(code, q))
      .map(code => ({ code, name: getCountryNameByCode(code, language) || code }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 8);
  }, [packages, countrySearch, showCountrySuggestions, language]);

  // Pre-filter by location (before GB selection)
  const locationFilteredPackages = useMemo(() => {
    let result = packages;
    // Country search uses its own filter
    if (selectedRegion === 'country') {
      if (selectedCountryCode) {
        result = result.filter((p) => {
          const codes = p.location?.split(',').map(c => c.trim().toUpperCase()) ?? [];
          return codes.length === 1 && codes[0] === selectedCountryCode.toUpperCase();
        });
      } else {
        return [];
      }
      return result;
    }
    // Region + bundle: exact locationCode match
    if (selectedRegion && selectedBundleCode) {
      const target = selectedBundleCode.toUpperCase();
      result = result.filter((p) => p.locationCode?.toUpperCase() === target);
      return result;
    }
    // Region selected but no bundle yet → show nothing
    if (selectedRegion) return [];
    return result;
  }, [packages, selectedRegion, selectedBundleCode, selectedCountryCode]);

  const individualPackages = useMemo(() => {
    const sorted = [...locationFilteredPackages];
    sorted.sort((a, b) => a.volume - b.volume || a.duration - b.duration || a.price - b.price);
    return sorted;
  }, [locationFilteredPackages]);

  const selectedPkgFromDropdown = useMemo(() => {
    if (!selectedGB) return null;
    return individualPackages.find(p => p.packageCode === selectedGB) || null;
  }, [individualPackages, selectedGB]);

  const hasCountrySearch = selectedRegion === 'country' && !!selectedCountryCode;
  const showCountryPlanSelector = hasCountrySearch && locationFilteredPackages.length > 0;
  const showPaymentButtons = !loading && selectedGB !== '' && !!selectedPkgFromDropdown;

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const promoDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handlePromoInput(value: string) {
    const upper = value.toUpperCase();
    setPromoCode(upper);
    setPromoError('');
    setPromoApplied(null);
    if (promoDebounceRef.current) clearTimeout(promoDebounceRef.current);
    if (!upper.trim()) return;
    promoDebounceRef.current = setTimeout(async () => {
      setPromoLoading(true);
      try {
        const { data, error } = await supabase
          .rpc('validate_promo_token', { _code: upper.trim() });
        if (error) throw error;
        const row = Array.isArray(data) ? data[0] : data;
        if (!row?.valid) {
          setPromoError('Código no válido, agotado o expirado');
          setPromoApplied(null);
        } else {
          setPromoApplied({ type: row.type, discount_percent: row.discount_percent });
          setPromoError('');
        }
      } catch {
        setPromoError('Error al validar el código');
        setPromoApplied(null);
      } finally {
        setPromoLoading(false);
      }
    }, 600);
  }

  function getEffectiveAmountInCents(price: number, markupPct: number, qty: number = 1): number {
    const base = getAmountInCents(price, markupPct);
    if (!promoApplied) return base * qty;
    if (promoApplied.type === 'free') return 0;
    if (promoApplied.type === 'discount' && promoApplied.discount_percent) {
      return Math.round(base * (1 - promoApplied.discount_percent / 100)) * qty;
    }
    return base * qty;
  }

  function getEffectivePriceDisplay(price: number, markupPct: number, qty: number = 1): string {
    const cents = getEffectiveAmountInCents(price, markupPct, qty);
    return `${(cents / 100).toFixed(2)} €`;
  }

  async function handleBuy() {
    if (!selectedPkg) return;
    if (!acceptedTerms) {
      toast.error(t.esim.acceptTermsRequired);
      return;
    }
    if (!noEmail) {
      if (!buyerEmail.trim()) {
        setEmailError(t.esim.emailRequired);
        return;
      }
      if (!validateEmail(buyerEmail.trim())) {
        setEmailError(t.esim.emailInvalid);
        return;
      }
    }
    setEmailError('');
    setCheckoutLoading(true);

    const amountCheck = selectedPkg ? getEffectiveAmountInCents(selectedPkg.price, markup, quantity) : 0;
    if (paymentMethod === 'card' && amountCheck > 0 && amountCheck < 50) {
      toast.error('El importe con descuento es inferior a 0.50 €. Stripe no permite importes menores. Usa un código gratuito o selecciona un plan de mayor valor.');
      setCheckoutLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const amountInCents = getEffectiveAmountInCents(selectedPkg.price, markup, quantity);
      const effectiveEmail = noEmail ? '' : buyerEmail.trim();

      // If free via promo, redeem server-side (create order + provision eSIM)
      if (amountInCents === 0) {
        if (!effectiveEmail) {
          toast.error(t.esim.freeEmailRequired);
          setCheckoutLoading(false);
          return;
        }
        const { data: redeemData, error: redeemError } = await supabase.functions.invoke('redeem-esim-promo', {
          body: {
            tokenCode: promoCode.trim().toUpperCase(),
            packageCode: selectedPkg.packageCode,
            packageName: selectedPkg.name,
            customerEmail: effectiveEmail,
            userId: user?.id || undefined,
            quantity,
            locale: language,
          },
        });
        if (redeemError || !redeemData?.success) {
          throw new Error(redeemError?.message || redeemData?.error || t.esim.freeTokenRedeemError);
        }
        const orderIds: string[] = Array.isArray(redeemData?.orderIds) ? redeemData.orderIds : [];
        const orders = Array.isArray(redeemData?.orders) ? redeemData.orders : [];
        setFreeConfirmation({
          packageName: selectedPkg.name,
          quantity,
          email: effectiveEmail,
          orderIds,
          orders,
          tokenCode: promoCode.trim().toUpperCase(),
        });
        try {
          const firstIccid = orders.find((o: any) => o?.iccid)?.iccid;
          if (firstIccid) localStorage.setItem("myEsimIccid", firstIccid);
        } catch {}
        toast.success(t.esim.freeOrderSuccess);

        setSelectedPkg(null);
        setBuyerEmail('');
        setPromoCode('');
        setPromoApplied(null);
        setQuantity(1);
        setCheckoutLoading(false);
        return;
      }

      if (paymentMethod === 'crypto') {
        const amountInEur = amountInCents / 100;
        const { data, error } = await supabase.functions.invoke('create-plisio-invoice', {
          body: {
            packageCode: selectedPkg.packageCode,
            packageName: selectedPkg.name,
            amountInEur,
            customerEmail: effectiveEmail,
            userId: user?.id || undefined,
            quantity,
            language,
          },
        });

        if (error || !data?.invoiceUrl) {
          throw new Error(error?.message || 'Failed to create crypto invoice');
        }

        setSelectedPkg(null);
        setBuyerEmail('');
        setPromoCode('');
        setPromoApplied(null);
        setQuantity(1);
        window.location.href = data.invoiceUrl;
      } else {
        const { data, error } = await supabase.functions.invoke('create-esim-checkout', {
          body: {
            packageCode: selectedPkg.packageCode,
            packageName: selectedPkg.name,
            amountInCents,
            currency: 'eur',
            customerEmail: effectiveEmail,
            userId: user?.id || undefined,
            quantity,
            returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
            environment: paymentEnvironment,
            locale: language,
          },
        });

        if (error || !data?.clientSecret) {
          throw new Error(error?.message || 'Failed to create checkout session');
        }

        if (data.sessionId && data.lookupToken) {
          sessionStorage.setItem(`esim_lookup_${data.sessionId}`, data.lookupToken);
        }
        setCheckoutClientSecret(data.clientSecret);
        setSelectedPkg(null);
        setBuyerEmail('');
        setPromoCode('');
        setPromoApplied(null);
        setQuantity(1);
        setShowCheckout(true);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(t.esim.orderError);
    } finally {
      setCheckoutLoading(false);
    }
  }

  function openBuyDialog(pkg: EsimPackage, method: 'card' | 'crypto') {
    setSelectedPkg(pkg);
    setPaymentMethod(method);
  }

  const tabs: { key: FilterTab; label: string; icon: React.ReactNode }[] = [
    { key: 'global', label: t.esim.filterGlobal, icon: <Globe className="w-4 h-4" /> },
    { key: 'europe', label: t.esim.filterEurope, icon: <MapPin className="w-4 h-4" /> },
    { key: 'africa', label: t.esim.filterAfrica, icon: <MapPin className="w-4 h-4" /> },
    { key: 'southamerica', label: t.esim.filterSouthAmerica, icon: <MapPin className="w-4 h-4" /> },
    { key: 'country', label: t.esim.filterCountry, icon: <Search className="w-4 h-4" /> },
  ];

  // Show embedded checkout
  if (showCheckout && checkoutClientSecret) {
    return (
      <>
        <PaymentTestModeBanner />
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center text-foreground">{t.esim.processing}</h1>
            <Suspense fallback={<div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">{t.esim.processing}</div>}>
              <StripeEmbeddedCheckout clientSecret={checkoutClientSecret} />
            </Suspense>
            <div className="mt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCheckout(false);
                  setCheckoutClientSecret(null);
                }}
                className="gap-2"
              >
                ← {t.esim.title}
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <div
      className="h-screen w-full overflow-hidden flex flex-col relative"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <PaymentTestModeBanner />
      <div
        className="absolute left-2 md:left-4 lg:left-6 z-40 flex items-center gap-2"
        style={{ top: 'calc(env(safe-area-inset-top) + 0.5rem)' }}
      >
        <button
          type="button"
          onClick={() => navigate('/esim_home')}
          aria-label="eSIM Home"
          className="group relative w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <img
            src={assetUrl(intersoftiBall)}
            alt="Intersofti"
            className="w-10 h-10 object-contain drop-shadow-lg animate-float"
            style={{ imageRendering: 'auto' }}
          />
        </button>
        {!isNativeApp() && (
          <a
            href="https://www.rpjsoftware.com"
            aria-label="rpjsoftware.com"
            className="group w-10 h-10 rounded-full flex items-center justify-center bg-white text-slate-700 shadow-md ring-1 ring-slate-200 hover:bg-slate-50 hover:scale-110 transition-transform"
          >
            <Home className="w-5 h-5" />
          </a>
        )}
      </div>
      <section
        className={isStandalone ? 'flex-1 min-h-0 py-2 px-3 bg-slate-50 flex flex-col' : 'flex-1 min-h-0 w-full px-3 py-2 md:py-4 bg-slate-50 flex flex-col'}
      >
        <div className="max-w-3xl mx-auto w-full h-full flex flex-col">
          {!isStandalone && (
            <div className="mb-2 md:mb-4 shrink-0">
              <h1 className="text-center text-2xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-0.5 md:mb-2">
                {renderHeroTitle(heroCopy.title)}
              </h1>
              <p className="text-center text-slate-600 mb-1 md:mb-3 text-xs md:text-base">
                {heroCopy.placeholder}
              </p>
              <div ref={heroContainerRef} className="relative mx-auto">
                <div className="group flex items-stretch rounded-full bg-white border-2 border-blue-500 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.12)] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(37,99,235,0.18)] hover:border-blue-600 focus-within:border-blue-600 focus-within:ring-[6px] focus-within:ring-blue-500/20 focus-within:shadow-[0_24px_60px_-20px_rgba(37,99,235,0.22)]">
                  <div className="pl-4 pr-2 flex items-center text-slate-400 transition-colors group-focus-within:text-blue-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="self-center text-slate-200">|</span>
                  {heroSelected && heroSelected.kind === 'country' && heroSelected.code && (
                    <div className="ml-2 self-center w-6 h-6 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                      <img
                        src={`https://flagcdn.com/w80/${heroSelected.code.slice(0,2).toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w160/${heroSelected.code.slice(0,2).toLowerCase()}.png 2x`}
                        alt={heroSelected.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={heroQuery}
                    onFocus={() => setHeroOpen(true)}
                    onChange={(e) => { setHeroQuery(e.target.value); setHeroOpen(true); setHeroSelected(null); }}
                    onKeyDown={onHeroKeyDown}
                    placeholder={heroCopy.placeholder}
                    className="flex-1 bg-transparent outline-none px-2 py-2.5 md:py-3.5 text-sm md:text-lg text-slate-800 placeholder:text-slate-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => { setHeroOpen(true); if (heroSuggestions[0]) goHero(heroSuggestions[0]); }}
                    aria-label={heroCopy.searchAria}
                    className="my-1 mr-1 px-4 rounded-full flex items-center justify-center text-white shadow-md bg-blue-600 hover:bg-blue-700 hover:shadow-[0_8px_24px_-6px_rgba(37,99,235,0.45)] active:scale-95 transition-all duration-200"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {heroOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-3 rounded-2xl bg-white border border-slate-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] overflow-hidden">
                    {heroSuggestions.length === 0 ? (
                      <p className="text-center text-slate-600 py-8">{heroCopy.noResults}</p>
                    ) : (
                      <ul className="max-h-[60vh] overflow-y-auto py-2">
                        {!heroQuery.trim() && (
                          <li className="px-4 py-2 text-xs text-slate-500 bg-slate-50/50">
                            {heroCopy.typeToFilter}
                          </li>
                        )}
                        {heroCountrySugs.length > 0 && (
                          <li className="sticky top-0 z-10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-100">
                            {heroCopy.countries}
                          </li>
                        )}
                        {heroCountrySugs.map((it, idx) => {
                          const active = idx === heroHighlight;
                          return (
                            <li key={it.id}>
                              <button
                                type="button"
                                onMouseEnter={() => setHeroHighlight(idx)}
                                onClick={() => goHero(it)}
                                className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${active ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
                              >
                                <HeroThumb item={it} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: it.accent.solid }}>{heroCopy.esim}</p>
                                  <p className="text-base md:text-lg font-bold text-slate-900 truncate">{it.label}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
                              </button>
                            </li>
                          );
                        })}
                        {heroRegionSugs.length > 0 && (
                          <li className="sticky top-0 z-10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border-b border-slate-100">
                            {heroCopy.regions}
                          </li>
                        )}
                        {heroRegionSugs.map((it, idx) => {
                          const globalIdx = heroCountrySugs.length + idx;
                          const active = globalIdx === heroHighlight;
                          return (
                            <li key={it.id}>
                              <button
                                type="button"
                                onMouseEnter={() => setHeroHighlight(globalIdx)}
                                onClick={() => goHero(it)}
                                className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${active ? 'bg-slate-50' : 'bg-white hover:bg-slate-50'}`}
                              >
                                <HeroThumb item={it} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: it.accent.solid }}>{heroCopy.esim}</p>
                                  <p className="text-base md:text-lg font-bold text-slate-900 truncate">{it.label}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-400 shrink-0" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-200 p-3 md:p-5 flex-1 flex flex-col overflow-hidden h-full">
            <div className="flex flex-col items-start gap-2 overflow-hidden flex-1 min-h-0 w-full">
            <div className={`w-full flex-1 min-h-0 flex flex-col items-center md:items-start gap-2`}>
              {!isStandalone && (
                <>
                  <div className="flex items-center justify-between w-full gap-2">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.05] max-w-[7ch] md:max-w-none">{t.esim.title}</h1>
                    <Badge5G />
                  </div>

                  <p className="text-xs md:text-lg text-slate-500">{t.esim.subtitle}</p>
                </>
              )}


              {isStandalone && (
                <div className="w-full flex items-center justify-between gap-2 pb-1">
                  <h1 className="text-xl font-bold text-slate-900">eSIM</h1>
                  <Badge5G compact />
                </div>
              )}





              {/* Selector 1: Region / Continent (1 column) */}
              <Select value={selectedRegion ?? undefined} onValueChange={handleRegionChange}>
                <SelectTrigger
                  className={`box-border w-[calc(100%-0.5rem)] mx-1 md:w-full md:mx-0 h-10 md:h-12 rounded-xl border-slate-200 bg-white shadow-sm hover:border-blue-400 hover:shadow-[0_0_16px_rgba(37,99,235,0.08)] transition-all focus:ring-0 focus:ring-offset-0 data-[placeholder]:text-blue-600 data-[placeholder]:font-semibold data-[placeholder]:animate-pulse ${highlightTabs && selectedRegion === null ? 'ring-2 ring-inset ring-blue-500/20' : ''}`}
                >
                  <SelectValue placeholder={t.esim.selectCoverage} />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <div className="flex relative md:absolute shrink-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 pointer-events-none w-full md:w-[min(200px,85%)] rounded-t-2xl md:rounded-[1.5rem] bg-white/95 border-b-2 md:border-2 border-blue-200 shadow-lg flex-col items-center justify-center gap-1 md:gap-0 p-2 md:p-4 text-center overflow-visible md:overflow-hidden">
                    {/* Decorative top accent */}
                    <div className="static md:absolute md:top-2 md:left-1/2 md:-translate-x-1/2 w-6 h-6 md:w-10 md:h-10 bg-blue-600 rounded-lg rotate-12 flex items-center justify-center shadow-md shrink-0">
                      <Info className="w-3 h-3 md:w-5 md:h-5 text-white -rotate-12" />
                    </div>
                    <p className="text-[9px] md:text-xs font-semibold text-slate-700 leading-snug md:mt-10">
                      {t.esim.regionSearchHint}
                    </p>
                  </div>
                  <SelectItem value="country">
                    <span className="flex items-center gap-2 text-slate-700">
                      <Search className="w-4 h-4 text-blue-600" />
                      {t.esim.filterCountrySearch}
                    </span>
                  </SelectItem>
                  {REGION_ORDER.map((region) => (
                    <SelectItem key={region} value={region}>
                      <span className="flex items-center gap-2 text-slate-700">
                        {region === 'global' ? <Globe className="w-4 h-4 text-blue-600" /> : <MapPin className="w-4 h-4 text-blue-600" />}
                        {getRegionLabel(region, language)}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Middle scrollable cascade area — grows without pushing sticky bottom */}
              <div className="w-full flex-1 min-h-0 overflow-y-auto flex flex-col items-center md:items-start gap-2 pr-0.5">



              {/* Selector 2: Bundle within region (2 columns, right-aligned) + Info button */}
              {selectedRegion && selectedRegion !== 'country' && REGION_BUNDLES[selectedRegion].length > 0 && (() => {
                const selectedBundle = selectedBundleCode
                  ? REGION_BUNDLES[selectedRegion].find(b => b.locationCode === selectedBundleCode)
                  : null;
                const selectedBundlePkg = selectedBundleCode
                  ? packages.find(p => p.locationCode?.toUpperCase() === selectedBundleCode.toUpperCase())
                  : null;
                const selectedCountries = selectedBundlePkg?.locationNetworkList || [];
                return (
                  <div className="box-border w-[calc(100%-0.5rem)] mx-1 md:w-full md:mx-0 flex items-center gap-2 min-w-0">
                    <Select
                      value={selectedBundleCode ?? undefined}
                      onValueChange={(v) => { setSelectedBundleCode(v); setSelectedGB(''); setSelectedCoverageIdx(null); }}
                    >
                      <SelectTrigger className="flex-1 min-w-0 h-10 md:h-12 rounded-xl border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-400 hover:shadow-[0_0_16px_rgba(37,99,235,0.08)] transition-all focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder={t.esim.coverage} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {REGION_BUNDLES[selectedRegion].map((b) => (
                          <SelectItem key={b.locationCode} value={b.locationCode}>
                            <span className="grid grid-cols-[1fr_auto] items-center w-full gap-4 text-slate-700">
                              <span className="text-left">{getBundleLabel(b, language)}</span>
                              <span className="tabular-nums text-right text-slate-500">
                                {b.countryCount} {language === 'en' ? 'countries' : 'países'}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(() => {
                      const includedLabel = language === 'en' ? 'Included countries' : language === 'pt' ? 'Países incluídos' : 'Países incluidos';
                      return (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={!selectedBundle || selectedCountries.length === 0}
                          onClick={() => {
                            if (!selectedBundle || selectedCountries.length === 0) return;
                            setCountriesDialogList(selectedCountries);
                            setCountriesDialogTitle(getBundleLabel(selectedBundle, language));
                            setCountriesDialogOpen(true);
                          }}
                          aria-label={includedLabel}
                          title={includedLabel}
                          className="shrink-0 gap-1.5 h-10 md:h-12 rounded-xl border-slate-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all px-3"
                        >
                          <Info className="w-4 h-4" />
                          <span className="text-xs hidden sm:inline">{includedLabel}</span>
                        </Button>
                      );
                    })()}
                  </div>
                );
              })()}



              {selectedRegion === 'country' ? (
                <div className="w-full space-y-3 px-1">
                  {loading ? (
                    <div className="h-10 md:h-12 flex items-center gap-3 px-4 rounded-xl border border-slate-200 bg-white">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-xs text-slate-500">{t.esim.loading}</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative overflow-hidden rounded-xl">
                        {selectedCountryCode ? (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                            <CountryFlag code={selectedCountryCode} size={20} />
                          </span>
                        ) : (
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        )}
                        <Input
                          placeholder={t.esim.searchCountry}
                          value={countrySearch}
                          onChange={(e) => handleCountryInput(e.target.value)}
                          className={`${selectedCountryCode ? 'pl-11' : 'pl-9'} pr-4 h-10 md:h-12 rounded-xl border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 shadow-sm hover:border-blue-400 focus-visible:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm w-full`}
                          autoFocus
                        />
                        {showCountrySuggestions && countrySuggestions.length > 0 && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/5 overflow-hidden">
                            {countrySuggestions.map((item) => (
                              <button
                                key={item.code}
                                type="button"
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                                onClick={() => selectCountry(item.code)}
                              >
                                <CountryFlag code={item.code} size={24} />
                                <span className="truncate">{item.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {showCountrySuggestions && countrySearch.trim().length >= 4 && countrySuggestions.length === 0 && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-center text-sm text-slate-500">
                            No se encontraron resultados
                          </div>
                        )}
                      </div>

                      {showCountryPlanSelector && !showPaymentButtons && (
                        <Select value={selectedGB || undefined} onValueChange={(v) => { setSelectedGB(v); setSelectedCoverageIdx(null); }}>
                          <SelectTrigger className="w-full h-10 md:h-12 rounded-xl border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-400 hover:shadow-[0_0_16px_rgba(37,99,235,0.08)] transition-all text-sm focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Selecciona el plan" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-slate-200">
                            {individualPackages.map((p) => (
                              <SelectItem className="group" key={p.packageCode} value={p.packageCode}>
                                <span className="grid grid-cols-[5rem_7rem_5rem] items-center w-full gap-2 text-slate-700">
                                  <span className="tabular-nums text-right">{p.volume <= 0 ? t.esim.unlimited : formatData(p.volume)}</span>
                                  <span className="tabular-nums text-right">{p.duration} {t.esim.days}</span>
                                  <span className="font-semibold text-blue-600 tabular-nums text-right ml-auto transition-colors group-focus:!text-blue-700 group-data-[highlighted]:!text-blue-700 group-data-[state=checked]:!text-blue-700">{formatPrice(p.price, markup)}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </>
                  )}
                </div>
              ) : selectedRegion && selectedBundleCode && !showPaymentButtons ? (
                <div
                  className="box-border w-[calc(100%-0.5rem)] mx-1 md:w-full md:mx-0"
                  onMouseEnter={() => { if (selectedRegion === null) setHighlightTabs(true); }}
                  onMouseLeave={() => setHighlightTabs(false)}
                >
                  {loading ? (
                    <div className="h-10 md:h-12 flex items-center gap-3 px-4 rounded-xl border border-slate-200 bg-white">
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-xs text-slate-500">{t.esim.loading}</span>
                    </div>
                  ) : (
                    <Select value={selectedGB || undefined} onValueChange={(v) => { setSelectedGB(v); setSelectedCoverageIdx(null); }} disabled={individualPackages.length === 0}>
                      <SelectTrigger className="w-full h-10 md:h-12 rounded-xl border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-400 hover:shadow-[0_0_16px_rgba(37,99,235,0.08)] transition-all text-sm focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Selecciona el plan" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {individualPackages.map((p) => (
                          <SelectItem className="group" key={p.packageCode} value={p.packageCode}>
                            <span className="grid grid-cols-[5rem_7rem_5rem] items-center w-full gap-2 text-slate-700">
                              <span className="tabular-nums text-right">{p.volume <= 0 ? t.esim.unlimited : formatData(p.volume)}</span>
                              <span className="tabular-nums text-right">{p.duration} {t.esim.days}</span>
                              <span className="font-semibold text-blue-600 tabular-nums text-right ml-auto transition-colors group-focus:!text-blue-700 group-data-[highlighted]:!text-blue-700 group-data-[state=checked]:!text-blue-700">{formatPrice(p.price, markup)}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ) : null}

              {/* Selected package info + Payment buttons */}
              {showPaymentButtons && selectedPkgFromDropdown && (
                <div className="box-border w-[calc(100%-0.5rem)] mx-1 md:w-full md:mx-0 flex flex-col gap-3 min-w-0">
                  <Select
                    value={selectedGB || undefined}
                    onValueChange={(v) => { setSelectedGB(v); setSelectedCoverageIdx(null); }}
                  >
                    <SelectTrigger
                      className="w-full h-auto px-3 py-2 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100/60 transition-colors focus:ring-0 focus:ring-offset-0 [&>span]:flex-1 [&>span]:line-clamp-none text-sm"
                    >
                      <span className="flex flex-col w-full min-w-0 text-left gap-1">
                        <span className="flex items-center justify-between gap-2 w-full">
                          <span className="font-semibold text-slate-800 text-sm leading-tight truncate">
                            {selectedPkgFromDropdown.name}
                          </span>
                          <span className="text-base font-bold text-blue-600 shrink-0 whitespace-nowrap">
                            {formatPrice(selectedPkgFromDropdown.price, markup)}
                          </span>
                        </span>
                        {(selectedPkgFromDropdown.locationNetworkList?.length || 0) > 0 && (
                          <span
                            role="button"
                            className="text-xs text-slate-500 hover:text-blue-600 transition-colors cursor-pointer self-start inline-flex items-center gap-1.5"
                            onPointerDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCountriesDialogList(selectedPkgFromDropdown.locationNetworkList || []);
                              setCountriesDialogTitle(selectedPkgFromDropdown.name);
                              setCountriesDialogOpen(true);
                            }}
                          >
                            <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{selectedPkgFromDropdown.locationNetworkList!.length} países</span>
                            <Info className="w-3 h-3" />
                          </span>
                        )}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {individualPackages.map((p) => (
                        <SelectItem className="group" key={p.packageCode} value={p.packageCode}>
                          <span className="grid grid-cols-[5rem_7rem_5rem] items-center w-full gap-2 text-slate-700">
                            <span className="tabular-nums text-right">{p.volume <= 0 ? t.esim.unlimited : formatData(p.volume)}</span>
                            <span className="tabular-nums text-right">{p.duration} {t.esim.days}</span>
                            <span className="font-semibold text-blue-600 tabular-nums text-right ml-auto transition-colors group-focus:!text-blue-700 group-data-[highlighted]:!text-blue-700 group-data-[state=checked]:!text-blue-700">{formatPrice(p.price, markup)}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      onClick={() => openBuyDialog(selectedPkgFromDropdown, 'card')}
                      className="gap-1.5 h-9 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all text-xs min-w-0"
                      variant="default"
                    >
                      <CreditCard className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{t.esim.payWithCard}</span>
                    </Button>
                    <Button
                      onClick={() => openBuyDialog(selectedPkgFromDropdown, 'crypto')}
                      className="gap-1.5 h-9 px-2 rounded-xl border-slate-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all text-xs min-w-0"
                      variant="outline"
                    >
                      <Bitcoin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{t.esim.payWithCrypto}</span>
                    </Button>
                  </div>
                </div>
              )}

              {!loading && (((selectedRegion === 'country' && hasCountrySearch && locationFilteredPackages.length === 0) || (selectedRegion !== 'country' && selectedRegion !== null && selectedBundleCode && selectedGB !== '' && !selectedPkgFromDropdown))) && (
                <div className="w-full text-center py-4">
                  <Globe className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-slate-500 text-sm">{t.esim.noPlans}</p>
                </div>
              )}

              {!loading && selectedRegion === 'country' && !countrySearch.trim() && (
                <div className="w-full text-center py-4">
                  <Search className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-40" />
                  <p className="text-slate-500 text-sm">{t.esim.searchCountry}</p>
                </div>
              )}
              </div>
              {/* /Middle scrollable cascade area */}

              {/* Zone C — sticky bottom: My eSIM + status + payment icons */}
              <div className="w-full shrink-0 mt-auto pt-2 border-t border-slate-100 bg-white flex flex-col gap-2 safe-area-bottom">
                {/* My eSIM shortcut — only when user has a saved ICCID */}
                {savedIccid && (
                  <div className="w-full">
                    <Link
                      to={`/esim-status?iccid=${encodeURIComponent(savedIccid)}`}
                      className="relative inline-flex items-center justify-center w-full gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:-translate-y-0.5 overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, #2e6b8a 0%, #3b82f6 55%, #06b6d4 100%)",
                      }}
                    >
                      <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
                      <span className="relative flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                        My eSIM
                      </span>
                    </Link>
                  </div>
                )}

                {/* Check eSIM Status / Recarga button */}
                <div className="w-full">
                  <Link
                    to="/esim-status"
                    className="relative inline-flex items-center justify-center w-full gap-2 rounded-xl border-2 border-blue-500 bg-white px-4 py-2 text-xs font-semibold text-slate-700 overflow-hidden transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600 hover:-translate-y-0.5"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/60 to-transparent -translate-x-full hover:animate-shimmer" />
                    <span className="relative">{t.esim.checkStatus}</span>
                  </Link>
                </div>

                {/* Payment method icons - always visible */}
                <div className="flex flex-col gap-2 w-full">
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1.5 text-center italic">Card Payments</p>
                    <div className="flex flex-wrap justify-center items-center gap-2">
                      <div className="h-8 w-14 flex items-center justify-center bg-white rounded-md ring-1 ring-slate-200/70 shadow-sm p-1">
                        <img src={visaLogo} alt="Visa" className="w-full h-full object-contain" style={{ imageRendering: 'auto' }} decoding="async" />
                      </div>
                      <div className="h-8 w-14 flex items-center justify-center bg-white rounded-md ring-1 ring-slate-200/70 shadow-sm p-1">
                        <img src={mastercardLogo} alt="Mastercard" className="w-full h-full object-contain" decoding="async" />
                      </div>
                      <div className="h-8 w-14 flex items-center justify-center bg-white rounded-md ring-1 ring-slate-200/70 shadow-sm p-1">
                        <img src={amexLogo} alt="American Express" className="w-full h-full object-contain" decoding="async" />
                      </div>
                      <div className="h-8 w-14 flex items-center justify-center bg-white rounded-md ring-1 ring-slate-200/70 shadow-sm p-1">
                        <img src={applePayLogo} alt="Apple Pay" className="w-full h-full object-contain" decoding="async" />
                      </div>
                      <div className="h-8 w-14 flex items-center justify-center bg-white rounded-md ring-1 ring-slate-200/70 shadow-sm p-1">
                        <img src={googlePayLogo} alt="Google Pay" className="w-full h-full object-contain" decoding="async" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1.5 text-center italic">Crypto Payments</p>
                    <div className="flex justify-center items-center gap-3">
                      <img src={btcLogo} alt="Bitcoin" className="w-6 h-6" loading="lazy" />
                      <img src={ethLogo} alt="Ethereum" className="w-6 h-6" loading="lazy" />
                      <img src={usdtLogo} alt="Tether USDT" className="w-6 h-6" loading="lazy" />
                      <img src={trxLogo} alt="TRON" className="w-6 h-6" loading="lazy" />
                      <img src={bnbLogo} alt="BNB Binance" className="w-6 h-6" loading="lazy" />
                    </div>
                  </div>
                </div>
                <VersionFooter fixed={false} />
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>


      {/* Countries dialog */}
      <Dialog open={countriesDialogOpen} onOpenChange={setCountriesDialogOpen}>
        <DialogContent className="sm:max-w-md w-[calc(100vw-24px)] max-h-[82dvh] p-4 sm:p-6 flex flex-col bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10">
          <DialogHeader className="pb-2 shrink-0">
            <DialogTitle className="text-slate-900 text-base sm:text-lg">Países admitidos</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs sm:text-sm">{countriesDialogTitle}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-0 pr-1">
            <div className="space-y-0">
              {countriesDialogList.map((country, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 px-1 sm:px-2 py-2 sm:py-2.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors">
                    <img
                      src={`https://flagcdn.com/w40/${(country.locationCode || '').toLowerCase()}.png`}
                      alt={country.locationName || country.locationCode || ''}
                      className="w-6 h-4 sm:w-7 sm:h-5 rounded-sm object-cover shadow-sm"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <span className="text-xs sm:text-sm text-slate-700">{country.locationName || country.locationCode}</span>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Confirm dialog */}
      <ErrorBoundary>
        <Dialog open={!!selectedPkg} onOpenChange={(open) => { if (!open) { setSelectedPkg(null); setBuyerEmail(''); setEmailError(''); setPaymentMethod('card'); setPromoCode(''); setPromoApplied(null); setPromoError(''); setQuantity(1); setNoEmail(false); setAcceptedTerms(false); } }}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg w-full max-h-[90vh] overflow-y-auto top-4 translate-y-0 sm:top-1/2 sm:-translate-y-1/2 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10" suppressHydrationWarning onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle className="text-slate-900">{t.esim.confirmTitle}</DialogTitle>
              <DialogDescription className="text-slate-500">{t.esim.confirmMessage}</DialogDescription>
            </DialogHeader>
            {selectedPkg && (
              <div className="space-y-3 py-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-medium text-slate-800">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.esim.data}</span>
                  <span className="font-medium text-slate-800">
                    {selectedPkg.volume <= 0 ? t.esim.unlimited : formatData(selectedPkg.volume)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.esim.duration}</span>
                  <span className="font-medium text-slate-800">
                    {selectedPkg.duration} {t.esim.days}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">{t.esim.quantity}</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-slate-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </Button>
                    <span className="font-medium text-slate-800 w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg border-slate-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all"
                      onClick={() => setQuantity(q => Math.min(10, q + 1))}
                      disabled={quantity >= 10}
                    >
                      +
                    </Button>
                  </div>
                </div>
                {promoApplied?.type !== 'free' && (
                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-500">{t.esim.price} {quantity > 1 ? `(×${quantity})` : ''}</span>
                    <div className="text-right">
                      {promoApplied ? (
                        <>
                          <span className="text-sm text-slate-400 line-through mr-2">{getEffectivePriceDisplay(selectedPkg.price, markup, 1)}</span>
                          <span className="text-xl font-bold text-emerald-600">{getEffectivePriceDisplay(selectedPkg.price, markup, quantity)}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-blue-600">{getEffectivePriceDisplay(selectedPkg.price, markup, quantity)}</span>
                      )}
                    </div>
                  </div>
                )}
                {promoApplied?.type === 'free' && (
                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-500">{t.esim.price}</span>
                    <span className="text-xl font-bold text-emerald-600">GRATIS</span>
                  </div>
                )}
                <div className="border-t border-slate-100 pt-3">
                  <label className="text-sm font-medium text-slate-800 mb-1.5 block">{t.esim.emailLabel}</label>
                  <Input
                    type="email"
                    placeholder={t.esim.emailPlaceholder}
                    value={buyerEmail}
                    onChange={(e) => { setBuyerEmail(e.target.value); setEmailError(''); }}
                    className={`h-12 rounded-xl border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/15 ${emailError ? 'border-destructive' : ''}`}
                    disabled={noEmail}
                  />
                  {emailError && <p className="text-sm text-destructive mt-1">{emailError}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <Checkbox
                      id="no-email"
                      checked={noEmail}
                      onCheckedChange={(checked) => {
                        const v = checked === true;
                        setNoEmail(v);
                        if (v) { setBuyerEmail(''); setEmailError(''); }
                      }}
                      className="border-slate-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label htmlFor="no-email" className="text-sm text-slate-500 cursor-pointer select-none">
                      {t.esim.noEmailLabel}
                    </label>
                  </div>
                  {noEmail && (
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-slate-700">
                      {t.esim.noEmailNotice}
                    </div>
                  )}
                  <div className="flex items-start gap-2 mt-3">
                    <Checkbox
                      id="accept-terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className="mt-0.5 border-slate-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label htmlFor="accept-terms" className="text-sm text-slate-500 cursor-pointer select-none">
                      {t.esim.acceptTermsLabel}{' '}
                      <Link to="/terms" target="_blank" className="text-blue-600 hover:underline">
                        ({t.esim.acceptTermsLink})
                      </Link>
                    </label>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <label className="text-sm font-medium text-slate-800 mb-1.5 block">Código promocional</label>
                  <div className="relative">
                    <Input
                      placeholder="Introduce tu código"
                      value={promoCode}
                      onChange={(e) => handlePromoInput(e.target.value)}
                      className="h-12 rounded-xl border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/15"
                    />
                    {promoLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-400" />
                    )}
                  </div>
                  {promoError && <p className="text-sm text-destructive mt-1">{promoError}</p>}
                  {promoApplied && (
                    <p className="text-sm text-emerald-600 mt-1">
                      {promoApplied.type === 'free' ? '¡Código gratuito aplicado!' : `Descuento del ${promoApplied.discount_percent}% aplicado`}
                    </p>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => { setSelectedPkg(null); setBuyerEmail(''); setEmailError(''); setPaymentMethod('card'); setPromoCode(''); setPromoApplied(null); setPromoError(''); setQuantity(1); setNoEmail(false); setAcceptedTerms(false); }} className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
                {t.esim.cancel}
              </Button>
              <Button onClick={handleBuy} disabled={checkoutLoading || promoLoading || !acceptedTerms} className="gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all">
                {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : paymentMethod === 'crypto' ? <Bitcoin className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                {promoApplied?.type === 'free' ? t.esim.getFree : paymentMethod === 'crypto' ? t.esim.payWithCrypto : t.esim.payWithCard}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Free-token purchase confirmation */}
        <Dialog open={!!freeConfirmation} onOpenChange={(open) => { if (!open) setFreeConfirmation(null); }}>
          <DialogContent className="max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-slate-900">
                <Zap className="w-5 h-5 text-blue-600" fill="currentColor" fillOpacity={0.2} />
                {t.esim.freeOrderTitle}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                {t.esim.freeOrderDesc}
              </DialogDescription>
            </DialogHeader>
            {freeConfirmation && (
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.esim.plan}</span>
                  <span className="font-medium text-slate-800 text-right">{freeConfirmation.packageName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.esim.quantity}</span>
                  <span className="font-medium text-slate-800">{freeConfirmation.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.esim.email}</span>
                  <span className="font-medium text-slate-800 break-all text-right">{freeConfirmation.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.esim.code}</span>
                  <span className="font-mono text-slate-800">{freeConfirmation.tokenCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{t.esim.total}</span>
                  <span className="font-semibold text-blue-600">0,00 €</span>
                </div>
                {freeConfirmation.orders.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    {freeConfirmation.orders.map((o, idx) => (
                      <div key={o.id} className="space-y-1">
                        {freeConfirmation.orders.length > 1 && (
                          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                            eSIM #{idx + 1}
                          </p>
                        )}
                        <div className="flex justify-between items-start gap-2 text-xs">
                          <span className="text-slate-500 shrink-0">Nº do pedido</span>
                          <span className="font-mono text-slate-800 break-all text-right">
                            {o.orderNo || '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-start gap-2 text-xs">
                          <span className="text-slate-500 shrink-0">ICCID (ID do eSIM)</span>
                          <span className="font-mono text-slate-800 break-all text-right">
                            {o.iccid || '—'}
                          </span>
                        </div>
                      </div>
                    ))}
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Use o <strong>Nº do pedido</strong> para acompanhar em "Acompanhar Encomenda" ou o <strong>ICCID</strong> para consultar o estado do eSIM.
                    </p>
                  </div>
                )}
                <p className="text-xs text-slate-500 pt-2">
                  {t.esim.freeEmailInstructions}
                </p>
              </div>
            )}
            <DialogFooter className="gap-2">
              <Button variant="outline" asChild className="rounded-xl border-slate-200 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all">
                <Link to={freeConfirmation?.orders?.[0]?.iccid ? `/esim-status?iccid=${freeConfirmation.orders[0].iccid}` : '/esim-status'}>
                  {t.esim.viewOrders}
                </Link>
              </Button>
              <Button onClick={() => setFreeConfirmation(null)} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all">{t.esim.close}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ErrorBoundary>
    </div>
  );
}
