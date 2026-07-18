import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Session-level cache so we only query once per app load
let cachedResult: { maintenance: boolean; isAdmin: boolean } | null = null;

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(cachedResult?.maintenance ?? false);
  const [isAdmin, setIsAdmin] = useState(cachedResult?.isAdmin ?? false);
  const [checked, setChecked] = useState(!!cachedResult);

  const isLovable = window.location.hostname.includes('lovable.app');

  useEffect(() => {
    if (cachedResult) return;
    let cancelled = false;
    async function check() {
      try {
        const { data } = await supabase
          .from('esim_settings')
          .select('value')
          .eq('key', 'maintenance_mode')
          .maybeSingle();

        if (cancelled) return;
        const active = data?.value === 'true';
        let admin = false;

        if (active && !isLovable) {
          const { data: { user } } = await supabase.auth.getUser();
          if (cancelled) return;
          if (user) {
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id)
              .eq('role', 'admin');
            admin = !!(roles && roles.length > 0);
          }
        }

        if (!cancelled) {
          cachedResult = { maintenance: active, isAdmin: admin };
          setMaintenance(active);
          setIsAdmin(admin);
          setChecked(true);
        }
      } catch {
        if (!cancelled) {
          cachedResult = { maintenance: false, isAdmin: false };
          setChecked(true);
        }
      }
    }

    // Defer the check off the critical path so it doesn't appear in the
    // initial network dependency chain measured by Lighthouse.
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (w.requestIdleCallback) {
      w.requestIdleCallback(check, { timeout: 2000 });
    } else {
      timeoutId = setTimeout(check, 1200);
    }

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLovable]);

  // Don't block render while checking — show content optimistically
  if (!checked) return <>{children}</>;

  if (maintenance && !isLovable && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
        <h1 className="text-4xl font-bold text-primary mb-4">INTERSOFTI</h1>
        <div className="text-6xl mb-6">🔧</div>
        <h2 className="text-2xl font-semibold mb-2">Sitio en mantenimiento</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Estamos realizando mejoras en nuestro sitio. Volveremos pronto. Gracias por tu paciencia.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
