import { useEffect } from 'react';
import { isNativeApp } from '@/lib/isNativeApp';

/**
 * Configure Capacitor safe-area insets so fixed/sticky footers can use
 * padding-bottom: env(safe-area-inset-bottom) or var(--safe-area-inset-bottom)
 * to avoid overlapping Android/iOS system navigation bars.
 *
 * The @capacitor-community/safe-area plugin auto-injects CSS variables when
 * viewport-fit=cover is set. We also set the navigation bar style here so it
 * matches the white footer (dark icons on light background).
 */
export function useSafeArea() {
  useEffect(() => {
    if (!isNativeApp()) return;

    (async () => {
      try {
        const { SafeArea, SystemBarsStyle, SystemBarsType } = await import('@capacitor-community/safe-area');
        await SafeArea.setSystemBarsStyle({
          style: SystemBarsStyle.Light,
          type: SystemBarsType.NavigationBar,
        });
      } catch {
        // Plugin not available in web builds; env(safe-area-inset-bottom) still works on iOS.
      }
    })();
  }, []);
}
