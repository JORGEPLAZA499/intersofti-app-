// Prefetch lazy route chunks on hover/focus so navigation feels instant.
// Each entry must match the dynamic import used in src/App.tsx so Vite
// reuses the same chunk.
const prefetchers: Record<string, () => Promise<unknown>> = {
  '/privacy': () => import('@/pages/PrivacyPolicy'),
  '/terms': () => import('@/pages/TermsOfService'),
  '/help': () => import('@/pages/HelpCenter'),
  '/esim-status': () => import('@/pages/EsimStatus'),
  '/eSIM': () => import('@/pages/Products'),
  '/ghostcode-s10': () => import('@/pages/GhostcodeS10'),
  '/crypto-card-firswe-visa': () => import('@/pages/CryptoCardFirsweVisa'),
  '/contact': () => import('@/pages/Contact'),
  '/order-tracking': () => import('@/pages/OrderTracking'),
};

const triggered = new Set<string>();

export function prefetchRoute(path: string) {
  const key = path.split('#')[0].split('?')[0];
  if (triggered.has(key)) return;
  const fn = prefetchers[key];
  if (!fn) return;
  triggered.add(key);
  fn().catch(() => triggered.delete(key));
}
