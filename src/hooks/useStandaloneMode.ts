import { useEffect, useState } from 'react';

/**
 * Returns true when the page is running as an installed PWA / standalone web app
 * (Add to Home Screen on iOS, installed app on Android/desktop).
 *
 * IMPORTANT: Always returns false when the page is inside an iframe (e.g. the
 * Lovable editor preview), even if the browser reports display-mode: standalone.
 * Mini-app chrome stripping must only happen for real installed launches.
 */
function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  // Never treat iframe contexts as standalone — the Lovable editor preview
  // runs the app inside an iframe and would otherwise hide marketing chrome.
  try {
    if (window.self !== window.top) return false;
  } catch {
    return false; // cross-origin block → definitely in an iframe
  }

  try {
    const mq = window.matchMedia('(display-mode: standalone)').matches;
    const iosStandalone =
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    return mq || iosStandalone;
  } catch {
    return false;
  }
}

export function useStandaloneMode(): boolean {
  const [isStandalone, setIsStandalone] = useState<boolean>(() => detectStandalone());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(display-mode: standalone)');
    const handler = () => setIsStandalone(detectStandalone());
    try {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    } catch {
      mql.addListener(handler);
      return () => mql.removeListener(handler);
    }
  }, []);

  return isStandalone;
}
