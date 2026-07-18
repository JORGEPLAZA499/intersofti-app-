// Resolves Lovable asset URLs to absolute CDN URLs.
// Necessary for native (Capacitor) builds where "/__l5e/..." would resolve
// to the file:// or capacitor:// origin instead of Lovable's CDN.
const CDN_ORIGIN = "https://intersofti.lovable.app";

export function assetUrl(input: string | { url?: string } | undefined | null): string {
  if (!input) return "";
  const raw = typeof input === "string" ? input : input.url ?? "";
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/")) return `${CDN_ORIGIN}${raw}`;
  return raw;
}
