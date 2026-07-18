import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isNativeApp, isNativeAllowedPath } from "@/lib/isNativeApp";

/**
 * When running inside the Capacitor Android/iOS shell we restrict
 * navigation to the eSIM family. Any other public route (Ghostcode S10,
 * BoxAI, blog, Index landing, etc.) redirects to /esim_home so the
 * Play Store build behaves as a pure eSIM app.
 */
export function NativeRouteGuard({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const native = isNativeApp();

  useEffect(() => {
    if (native) document.documentElement.dataset.nativeApp = "true";
  }, [native]);

  if (native && pathname === "/") {
    return <Navigate to="/esim_home" replace />;
  }
  if (native && !isNativeAllowedPath(pathname)) {
    return <Navigate to="/esim_home" replace />;
  }
  return <>{children}</>;
}
