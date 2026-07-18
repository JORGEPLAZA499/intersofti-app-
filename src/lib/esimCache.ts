import { supabase } from '@/integrations/supabase/client';

const CACHE_KEY = 'esim_packages_cache';
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export interface EsimPackage {
  packageCode: string;
  name: string;
  price: number;
  currencyCode: string;
  volume: number;
  duration: number;
  location: string;
  locationCode: string;
  speed: string;
  smsStatus: number;
  dataType: number;
  unusedValidDay: number;
  activeType: number;
  description?: string;
  locationNetworkList?: {
    locationName?: string;
    locationCode?: string;
    locationLogo?: string;
  }[];
}

export function readEsimCache(key: string): EsimPackage[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as Record<string, { data: EsimPackage[]; ts: number }>;
    const entry = cache[key];
    if (entry && Date.now() - entry.ts < CACHE_TTL_MS) {
      return entry.data;
    }
  } catch {
    // ignore corrupt cache
  }
  return null;
}

export function writeEsimCache(key: string, data: EsimPackage[]) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const cache = raw ? (JSON.parse(raw) as Record<string, { data: EsimPackage[]; ts: number }>) : {};
    cache[key] = { data, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore storage errors
  }
}

export async function fetchEsimPackages(locationCode?: string): Promise<EsimPackage[]> {
  const body: Record<string, unknown> = { action: 'list_packages' };
  if (locationCode) body.locationCode = locationCode;
  const { data, error } = await supabase.functions.invoke('esim-api', { body });
  if (error) throw error;
  const list: EsimPackage[] = data?.obj?.packageList ?? [];
  const cacheKey = locationCode || 'ALL';
  writeEsimCache(cacheKey, list);
  return list;
}

export async function prefetchEsimPackages(locationCode?: string) {
  const cacheKey = locationCode || 'ALL';
  if (readEsimCache(cacheKey)) return;
  try {
    await fetchEsimPackages(locationCode);
  } catch {
    // silent prefetch failure
  }
}
