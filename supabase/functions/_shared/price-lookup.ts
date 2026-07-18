// Server-side authoritative price resolution for eSIM checkout paths.
// Never trust client-supplied amounts.
import { createClient } from "npm:@supabase/supabase-js@2";

const ESIM_API_BASE = "https://api.esimaccess.com";

type PackageListItem = {
  packageCode: string;
  name?: string;
  price?: number; // eSIM API returns price in cents (integer)
  currencyCode?: string;
};

type CacheEntry = { at: number; pkgs: PackageListItem[] };
const listCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

async function fetchPackages(opts: { topup?: boolean; iccid?: string }): Promise<PackageListItem[]> {
  const accessCode = Deno.env.get("ESIM_ACCESS_CODE");
  if (!accessCode) throw new Error("ESIM_ACCESS_CODE not configured");

  const key = opts.topup ? `topup:${opts.iccid || ''}` : 'all';
  const cached = listCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.pkgs;

  const body: Record<string, unknown> = opts.topup
    ? { type: "TOPUP", iccid: opts.iccid }
    : {};

  const res = await fetch(`${ESIM_API_BASE}/api/v1/open/package/list`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "RT-AccessCode": accessCode },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const pkgs: PackageListItem[] = data?.obj?.packageList || data?.obj || [];
  listCache.set(key, { at: Date.now(), pkgs });
  return pkgs;
}

export type ResolvedPrice = {
  unitPriceCents: number; // final unit price in cents (EUR)
  totalCents: number; // unit * quantity
  unitPriceEur: number;
  totalEur: number;
  packageName: string;
  markupPct: number;
  discountPct: number;
};

export async function resolveEsimPrice(params: {
  packageCode: string;
  quantity: number;
  topup?: boolean;
  iccid?: string;
  promoTokenCode?: string | null;
}): Promise<ResolvedPrice> {
  const { packageCode, quantity, topup, iccid, promoTokenCode } = params;
  if (!packageCode) throw new Error("packageCode required");
  const qty = Math.max(1, Math.min(10, Math.floor(quantity || 1)));

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1. Fetch authoritative package from eSIM provider
  const pkgs = await fetchPackages({ topup, iccid });
  const pkg = pkgs.find((p) => p.packageCode === packageCode);
  if (!pkg) throw new Error(`Package ${packageCode} not found`);
  const providerPriceCents = Number(pkg.price);
  if (!Number.isFinite(providerPriceCents) || providerPriceCents <= 0) {
    throw new Error(`Invalid provider price for ${packageCode}`);
  }
  // Provider price is in cents (integer). Convert to EUR.
  const providerPriceEur = providerPriceCents / 10000; // eSIM API uses 1/10000 units

  // 2. Load markup from settings
  const { data: markupRow } = await supabase
    .from("esim_settings")
    .select("value")
    .eq("key", "markup_percentage")
    .maybeSingle();
  const markupPct = Number(markupRow?.value ?? 0) || 0;

  // 3. Optional promo token discount (partial only; 100% goes via redeem-esim-promo)
  let discountPct = 0;
  if (promoTokenCode) {
    const code = String(promoTokenCode).trim().toUpperCase();
    const { data: token } = await supabase
      .from("promo_tokens")
      .select("type, discount_percent, active")
      .eq("token_code", code)
      .maybeSingle();
    if (token?.active && token.type === "discount") {
      const d = Number(token.discount_percent) || 0;
      if (d > 0 && d < 100) discountPct = d;
    }
  }

  const withMarkup = providerPriceEur * (1 + markupPct / 100);
  const finalUnit = withMarkup * (1 - discountPct / 100);
  const unitPriceEur = Math.round(finalUnit * 100) / 100;
  const unitPriceCents = Math.round(unitPriceEur * 100);
  const totalCents = unitPriceCents * qty;
  const totalEur = Math.round(totalCents) / 100;

  return {
    unitPriceCents,
    totalCents,
    unitPriceEur,
    totalEur,
    packageName: pkg.name || packageCode,
    markupPct,
    discountPct,
  };
}
