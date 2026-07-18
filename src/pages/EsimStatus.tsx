import { useState, useEffect, lazy, Suspense } from "react";
import { assetUrl } from "@/lib/assetUrl";
import { isNativeApp } from "@/lib/isNativeApp";
import { Link, useSearchParams } from "react-router-dom";
import { VersionFooter } from "@/components/VersionFooter";

import { useLanguage } from "@/i18n/LanguageContext";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Wifi, WifiOff, RefreshCw, Loader2, Signal, Clock, Database, Package, CreditCard, Bitcoin, Plus, Home } from "lucide-react";
import { toast } from "sonner";
import { getStripeEnvironment } from "@/lib/stripe";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import esimStatusHero from "@/assets/esim-status-hero.png.asset.json";
import intersoftiBall from "@/assets/intersofti-ball.png.asset.json";

const StripeEmbeddedCheckout = lazy(() =>
  import("@/components/StripeEmbeddedCheckout").then((m) => ({ default: m.StripeEmbeddedCheckout }))
);
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface UsageData {
  totalVolume: number;
  orderUsage: number;
  remaining: number;
  usagePercent: number;
  totalVolumeMB: number;
  orderUsageMB: number;
  remainingMB: number;
  remainingBytes: number;
  esimStatus: string;
  totalDuration: number;
  durationUnit: string;
  activateTime: string | null;
  expiredTime: string | null;
  installationTime: string | null;
  remainingDays: number;
  remainingHours: number;
  isExpired: boolean;
  timePercent: number;
  packageName: string;
  packageCode: string;
  slug: string;
  createTime: string | null;
  esimTranNo: string;
  orderNo: string;
  apn: string;
  ipExport: string;
  locationCode: string;
  price: number;
  iccid: string;
  customerEmail: string | null;
}

interface TopUpPackage {
  packageCode: string;
  name: string;
  price: number;
  currencyCode: string;
  volume: number;
  duration: number;
  location: string;
  locationCode: string;
  speed: string;
}

function formatDataDetailed(bytes: number): string {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function formatData(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

function formatDataFromBytes(bytes: number, unlimitedLabel: string): string {
  if (bytes <= 0) return unlimitedLabel;
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

function getStatusColor(status: string): string {
  switch (status) {
    case "IN_USE": return "text-green-600";
    case "NOT_ACTIVATED": return "text-amber-600";
    case "EXPIRED":
    case "DELETED": return "text-red-600";
    default: return "text-slate-500";
  }
}

function getStatusBg(status: string): string {
  switch (status) {
    case "IN_USE": return "bg-green-50 text-green-700 border-green-200";
    case "NOT_ACTIVATED": return "bg-amber-50 text-amber-700 border-amber-200";
    case "EXPIRED":
    case "DELETED": return "bg-red-50 text-red-700 border-red-200";
    default: return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "IN_USE": return <Wifi className="w-5 h-5 text-green-600" />;
    case "NOT_ACTIVATED": return <Signal className="w-5 h-5 text-amber-600" />;
    default: return <WifiOff className="w-5 h-5 text-red-600" />;
  }
}

function getLocaleForLanguage(lang: string): string {
  switch (lang) {
    case 'pt': return 'pt-PT';
    case 'es': return 'es-ES';
    default: return 'en-GB';
  }
}

function getLocationName(code: string, lang: string): string {
  const names: Record<string, Record<string, string>> = {
    en: { BR: "Brazil", US: "United States", MX: "Mexico", AR: "Argentina", CL: "Chile", CO: "Colombia", PE: "Peru", ES: "Spain", PT: "Portugal", GB: "United Kingdom", FR: "France", DE: "Germany", IT: "Italy" },
    pt: { BR: "Brasil", US: "Estados Unidos", MX: "México", AR: "Argentina", CL: "Chile", CO: "Colômbia", PE: "Peru", ES: "Espanha", PT: "Portugal", GB: "Reino Unido", FR: "França", DE: "Alemanha", IT: "Itália" },
    es: { BR: "Brasil", US: "Estados Unidos", MX: "México", AR: "Argentina", CL: "Chile", CO: "Colombia", PE: "Perú", ES: "España", PT: "Portugal", GB: "Reino Unido", FR: "Francia", DE: "Alemania", IT: "Italia" },
  };
  return (names[lang] || names.en)[code] || code;
}

function InfoRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-slate-200 last:border-b-0">
      <span className="text-sm text-slate-500 shrink-0 mr-4">{label}:</span>
      <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
  );
}

export default function EsimStatus() {
  const { t, language } = useLanguage();

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString(getLocaleForLanguage(language), {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const formatRemainingTime = (days: number, hours: number): string => {
    return t.esim.daysHours.replace('{days}', String(days)).replace('{hours}', String(hours));
  };
  const [searchParams] = useSearchParams();
  const [iccid, setIccid] = useState(searchParams.get("iccid") || "");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [directLookup, setDirectLookup] = useState(false);

  // Top-up state
  const [topUpPackages, setTopUpPackages] = useState<TopUpPackage[]>([]);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpFetched, setTopUpFetched] = useState(false);
  const [markup, setMarkup] = useState(0);
  const [selectedTopUp, setSelectedTopUp] = useState<TopUpPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);


  useEffect(() => {
    supabase
      .from("esim_settings")
      .select("value")
      .eq("key", "markup_percentage")
      .single()
      .then(({ data }) => {
        if (data) setMarkup(parseFloat(data.value) || 0);
      });
  }, []);

  useEffect(() => {
    const urlIccid = searchParams.get("iccid");
    if (urlIccid) {
      setDirectLookup(true);
      setIccid(urlIccid);
      fetchUsage(urlIccid);
    }
  }, []);

  const mapErrorCode = (code?: string): string => {
    switch (code) {
      case "ORDER_NOT_FOUND":
      case "No usage data available":
        return t.esim.notFoundDesc;
      case "MISSING_ICCID":
        return t.esim.invalidIccid;
      default:
        return t.esim.orderError;
    }
  };

  const fetchUsage = async (searchIccid?: string) => {
    const id = searchIccid || iccid.trim();
    if (!id) return;

    setLoading(true);
    setError(null);
    setTopUpFetched(false);
    setTopUpPackages([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("get-esim-usage", {
        body: { iccid: id },
      });

      if (fnError) {
        // Try to recover error code from the response body if function returned non-2xx
        let code: string | undefined;
        try {
          const body = await (fnError as any)?.context?.response?.json?.();
          code = body?.error;
        } catch {
          // ignore
        }
        setError(mapErrorCode(code));
        setUsage(null);
      } else if (data?.error && !data?.usage) {
        setError(mapErrorCode(data.error));
        setUsage(null);
      } else if (data?.usage) {
        setUsage(data.usage);
        try { localStorage.setItem("myEsimIccid", data.usage.iccid); } catch {}

      } else {
        setError(t.esim.notFoundDesc);
        setUsage(null);
      }
    } catch (e: any) {
      setError(t.esim.orderError);
      setUsage(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const fetchTopUpPackages = async () => {
    if (!usage?.iccid || topUpFetched) return;
    setTopUpLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("esim-api", {
        body: { action: "list_topup_packages", iccid: usage.iccid },
      });
      if (error) throw error;
      if (data?.obj?.packageList) {
        setTopUpPackages(data.obj.packageList);
      } else {
        setTopUpPackages([]);
      }
    } catch (e) {
      console.error("Failed to fetch top-up packages:", e);
      toast.error(t.esim.orderError);
    } finally {
      setTopUpLoading(false);
      setTopUpFetched(true);
    }
  };

  function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function openBuyDialog(pkg: TopUpPackage) {
    setSelectedTopUp(pkg);
    setPaymentMethod("card");
    setBuyerEmail("");
    setEmailError("");
  }

  async function handleTopUpBuy() {
    if (!selectedTopUp || !usage?.iccid) return;
    // Recharge flow: reuse email from original eSIM purchase when available.
    // If none was recorded, proceed without email (no receipt will be sent).
    const emailToUse = (usage.customerEmail || "").trim();
    setEmailError("");
    setCheckoutLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const amountInCents = getAmountInCents(selectedTopUp.price, markup);

      if (paymentMethod === "crypto") {
        const amountInEur = amountInCents / 100;
        const { data, error } = await supabase.functions.invoke("create-plisio-invoice", {
          body: {
            packageCode: selectedTopUp.packageCode,
            packageName: selectedTopUp.name,
            amountInEur,
            customerEmail: emailToUse || undefined,
            userId: user?.id || undefined,
            topup: true,
            iccid: usage.iccid,
            language,
          },
        });
        if (error || !data?.invoiceUrl) {
          throw new Error(error?.message || "Failed to create crypto invoice");
        }
        setSelectedTopUp(null);
        window.location.href = data.invoiceUrl;
      } else {
        const { data, error } = await supabase.functions.invoke("create-esim-checkout", {
          body: {
            packageCode: selectedTopUp.packageCode,
            packageName: selectedTopUp.name,
            amountInCents,
            currency: "eur",
            customerEmail: emailToUse || undefined,
            userId: user?.id || undefined,
            returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
            environment: getStripeEnvironment(),
            topup: true,
            iccid: usage.iccid,
            locale: language,
          },
        });
        if (error || !data?.clientSecret) {
          throw new Error(error?.message || "Failed to create checkout session");
        }
        if (data.sessionId && data.lookupToken) {
          sessionStorage.setItem(`esim_lookup_${data.sessionId}`, data.lookupToken);
        }
        setCheckoutClientSecret(data.clientSecret);
        setSelectedTopUp(null);
        setShowCheckout(true);
      }
    } catch (error) {
      console.error("Top-up checkout error:", error);
      toast.error(t.esim.orderError);
    } finally {
      setCheckoutLoading(false);
    }
  }

  const dataRemainingPercent = usage ? (usage.totalVolume > 0 ? Math.round(((usage.totalVolume - usage.orderUsage) / usage.totalVolume) * 100) : 0) : 0;

  // Show embedded checkout
  if (showCheckout && checkoutClientSecret) {
    return (
      <>
        <PaymentTestModeBanner />
        <section className="min-h-screen w-full px-4 pt-10 pb-10 bg-slate-50" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)' }}>
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-center text-slate-900">{t.esim.processing}</h1>
            <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>}>
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
                className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
              >
                ← {t.esim.checkStatus}
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (directLookup && loading && !usage && !error) {
    return (
      <section className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
            <Signal className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <p className="text-slate-700 font-semibold text-lg">{t.esim.loadingEsim}</p>
        <p className="text-slate-400 text-sm mt-2 font-mono break-all max-w-xs text-center">{iccid}</p>
      </section>
    );
  }

  return (
    <>
      <section className={usage ? "relative min-h-[100svh] w-full px-4 pt-3 pb-10 bg-slate-50" : "relative min-h-[100svh] w-full px-4 pt-3 pb-3 bg-slate-50 flex flex-col"} style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)' }}>
        <div className="absolute top-2 left-2 md:left-4 lg:left-6 z-40 flex items-center gap-2">
          <Link
            to="/esim_home"
            aria-label="eSIM Home"
            className="group relative w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 ring-1 ring-white/40 animate-[float_3s_ease-in-out_infinite] hover:scale-110 transition-transform"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/40 to-cyan-300/40 blur-md -z-10" />
            <img src={assetUrl(intersoftiBall)} alt="Intersofti" className="w-6 h-6 object-contain" />
          </Link>
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
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
        <div className={usage ? "max-w-2xl mx-auto w-full" : "max-w-2xl mx-auto w-full flex flex-col flex-1"}>
          <div className="mb-2 shrink-0 h-10" />
          <div className="text-center mb-4 shrink-0">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 mb-2">
              <Signal className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{t.esim.checkStatus}</h1>
            <p className="text-slate-500 mt-1 text-xs">{t.esim.checkStatusDesc}</p>
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-3 shrink-0">
            <Input
              value={iccid}
              onChange={(e) => setIccid(e.target.value)}
              onFocus={(e) => {
                setInputFocused(true);
                const el = e.currentTarget;
                setTimeout(() => {
                  try { el.scrollIntoView({ block: "center", behavior: "smooth" }); } catch {}
                }, 250);
              }}
              onBlur={() => setInputFocused(false)}
              placeholder={t.esim.iccidPlaceholder}
              name="esim-iccid"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="text"
              enterKeyHint="search"
              className="font-mono text-sm bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-600 focus-visible:ring-2 focus-visible:border-blue-600 shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && fetchUsage()}
            />

            <Button onClick={() => fetchUsage()} disabled={loading || !iccid.trim()} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {/* Hero image shown before searching and while loading */}
          {!usage && !inputFocused && (
            <div className="flex-1 min-h-0 flex items-center justify-center relative">
              <img
                src={assetUrl(esimStatusHero)}
                alt="eSIM status"
                className="w-full max-h-[58vh] object-contain rounded-2xl shadow-lg"
                loading="eager"
                decoding="sync"
                fetchPriority="high"
              />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[2px] rounded-2xl">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && searched && (
            <Card className="border-red-200 bg-white">
              <CardContent className="p-5 text-center space-y-1">
                <p className="text-sm font-semibold text-red-600">{t.esim.notFoundTitle}</p>
                <p className="text-sm text-slate-500">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Usage Data */}
          {usage && (
            <Card className="border-slate-200 bg-white overflow-hidden shadow-sm">
              <CardContent className="p-0">
                {/* Header with status */}
                <div className="bg-blue-600/10 p-5 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{t.esim.esimDetails}</h2>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBg(usage.esimStatus)}`}>
                      {getStatusIcon(usage.esimStatus)}
                      {t.esim.statuses[usage.esimStatus as keyof typeof t.esim.statuses] || usage.esimStatus}
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="data" className="w-full" onValueChange={(v) => {
                  if (v === "topup") fetchTopUpPackages();
                }}>
                  <TabsList className="w-full justify-start rounded-none border-b border-slate-200 bg-transparent h-auto p-0">
                    <TabsTrigger value="data" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3 text-sm text-slate-600">
                      {t.esim.dataPlan}
                    </TabsTrigger>
                    <TabsTrigger value="topup" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3 text-sm text-slate-600">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      {t.esim.topUpTab}
                    </TabsTrigger>
                    <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent px-4 py-3 text-sm text-slate-600">
                      {t.esim.details}
                    </TabsTrigger>
                  </TabsList>

                  {/* Data Plan Tab */}
                  <TabsContent value="data" className="p-5 space-y-5 mt-0">
                    {/* Time & Data summary */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Time */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4 text-blue-600" />
                          {t.esim.totalTime}
                        </div>
                        <p className="font-semibold text-slate-900">{usage.totalDuration} {usage.durationUnit === "DAY" ? t.esim.days : usage.durationUnit}</p>
                        
                        {(usage.remainingDays > 0 || usage.remainingHours > 0 || usage.isExpired) && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">{t.esim.timeRemaining}:</span>
                              <span className="font-medium text-slate-900">{usage.isExpired ? t.esim.expired : formatRemainingTime(usage.remainingDays, usage.remainingHours)}</span>
                            </div>
                            <Progress value={usage.timePercent} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                            <p className="text-xs text-right text-blue-600 font-medium">{usage.timePercent}%</p>
                          </div>
                        )}
                      </div>

                      {/* Data */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Database className="w-4 h-4 text-blue-600" />
                          {t.esim.totalData}
                        </div>
                        <p className="font-semibold text-slate-900">{formatData(usage.totalVolumeMB)}</p>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">{t.esim.dataRemaining}</span>
                            <span className="font-medium text-slate-900">{formatDataDetailed(usage.remainingBytes)}</span>
                          </div>
                          <Progress value={dataRemainingPercent} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                          <p className="text-xs text-right text-blue-600 font-medium">{dataRemainingPercent}%</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 italic">
                      {t.esim.cdrDisclaimer}
                    </p>

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 border-t border-slate-200 pt-4">
                      <InfoRow label={t.esim.totalAmount} value={`$${Number(usage.price).toFixed(2)}`} />
                      <InfoRow label={t.esim.billingStarts} value={t.esim.firstConnection} />
                      <InfoRow label={t.esim.region} value={getLocationName(usage.locationCode, language)} />
                      <InfoRow label="APN" value={usage.apn || "—"} />
                      <InfoRow label={t.esim.ipAddress} value={usage.ipExport || "—"} />
                    </div>

                    {/* Refresh */}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all"
                      onClick={() => fetchUsage()}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                      {t.esim.refreshData}
                    </Button>
                  </TabsContent>

                  {/* Top-Up Tab */}
                  <TabsContent value="topup" className="p-5 space-y-4 mt-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-slate-900">{t.esim.topUp}</h3>
                    </div>
                    <p className="text-sm text-slate-500">{t.esim.topUpDesc}</p>

                    {topUpLoading && (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                        <span className="text-sm text-slate-500">{t.esim.topUpLoading}</span>
                      </div>
                    )}

                    {topUpFetched && topUpPackages.length === 0 && !topUpLoading && (
                      <div className="text-center py-8 text-sm text-slate-500">
                        {t.esim.noTopUpPlans}
                      </div>
                    )}

                    {topUpPackages.length > 0 && (
                      <div className="space-y-3">
                        {topUpPackages.map((pkg) => (
                          <Card key={pkg.packageCode} className="border-slate-200 bg-white hover:border-blue-600/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="space-y-1">
                                  <p className="font-semibold text-slate-900 text-sm">{pkg.name}</p>
                                  <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                      <Database className="w-3 h-3 text-blue-600" />
                                      {formatDataFromBytes(pkg.volume, t.esim.unlimited)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-blue-600" />
                                      {pkg.duration} {t.esim.days}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  className="gap-1.5 text-xs whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={() => openBuyDialog(pkg)}
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  {formatPrice(pkg.price, markup)}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Details Tab */}
                  <TabsContent value="details" className="p-5 space-y-5 mt-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-slate-900">{t.esim.basicPlan}</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                      <InfoRow label={t.esim.name} value={usage.packageName} />
                      <InfoRow label={t.esim.code} value={usage.packageCode} />
                      <InfoRow label={t.esim.slug} value={usage.slug} />
                      <InfoRow label={t.esim.createTime} value={formatDate(usage.createTime)} />
                      <InfoRow label={t.esim.price} value={`$${Number(usage.price).toFixed(2)}`} />
                      <InfoRow label={t.esim.periodNumber} value="1" />
                      <InfoRow label="ICCID" value={<span className="font-mono text-xs text-slate-900">{usage.iccid}</span>} />
                      <InfoRow label="eSIM Transaction No" value={<span className="font-mono text-xs text-slate-900">{usage.esimTranNo}</span>} />
                      <InfoRow label="Order No" value={<span className="font-mono text-xs text-slate-900">{usage.orderNo}</span>} />
                    </div>

                    {usage.activateTime && (
                      <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                        <InfoRow label={t.esim.activation} value={formatDate(usage.activateTime)} />
                        <InfoRow label={t.esim.expiration} value={formatDate(usage.expiredTime)} />
                        {usage.installationTime && (
                          <InfoRow label={t.esim.installation} value={formatDate(usage.installationTime)} />
                        )}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Top-Up Purchase Dialog */}
      <Dialog open={!!selectedTopUp} onOpenChange={(open) => !open && setSelectedTopUp(null)}>
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-sm sm:max-w-md p-4 sm:p-6 bg-white border-slate-200 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 text-lg">{t.esim.confirmTitle}</DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              {t.esim.topUp}: {selectedTopUp?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTopUp && (
            <div className="space-y-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.esim.data}:</span>
                  <span className="font-medium text-slate-900">{formatDataFromBytes(selectedTopUp.volume, t.esim.unlimited)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.esim.duration}:</span>
                  <span className="font-medium text-slate-900">{selectedTopUp.duration} {t.esim.days}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.esim.price}:</span>
                  <span className="font-bold text-blue-600">{formatPrice(selectedTopUp.price, markup)}</span>
                </div>
              </div>

              {usage?.customerEmail ? (
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.esim.topUpEmailLabel}: <span className="font-medium text-slate-700">{usage.customerEmail}</span>
                </p>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.esim.topUpEmailLabel}: —
                </p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  className={`gap-1.5 ${paymentMethod === "card" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard className="w-4 h-4" />
                  {t.esim.payWithCard}
                </Button>
                <Button
                  size="sm"
                  className={`gap-1.5 ${paymentMethod === "crypto" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
                  onClick={() => setPaymentMethod("crypto")}
                >
                  <Bitcoin className="w-4 h-4" />
                  {t.esim.payWithCrypto}
                </Button>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
                <Button
                  onClick={() => setSelectedTopUp(null)}
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-none"
                >
                  {t.esim.cancel}
                </Button>
                <Button onClick={handleTopUpBuy} disabled={checkoutLoading} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                  {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    paymentMethod === "card" ? <CreditCard className="w-4 h-4" /> : <Bitcoin className="w-4 h-4" />
                  )}
                  {t.esim.confirm}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <VersionFooter />
    </>
  );
}

