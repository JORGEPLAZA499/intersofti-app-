import { Capacitor } from "@capacitor/core";

// Detects whether the app is running inside the Capacitor Android/iOS shell.
export function isNativeApp(): boolean {
  // Use the bundled Capacitor API instead of waiting for window.Capacitor to
  // be injected. This is available synchronously on the very first render.
  if (Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "web") return true;

  if (typeof window === "undefined") return false;
  const w = window as any;

  // Fallbacks for older native shells.
  const ua = navigator.userAgent || "";
  if (/capacitor/i.test(ua)) return true;

  // Capacitor default scheme on Android is https://localhost, on iOS capacitor://localhost.
  // The web preview never uses these hostnames.
  const host = window.location.hostname;
  const proto = window.location.protocol;
  if (proto === "capacitor:") return true;
  if (host === "localhost" && (proto === "https:" || proto === "http:")) {
    // Extra safeguard: only treat as native if there is no dev-server hint.
    // Vite dev on localhost uses port 5173/8080 with hot-reload script; native has no ws.
    if (!("__vite_plugin_react_preamble_installed__" in w)) return true;
  }

  return false;
}

export const NATIVE_ALLOWED_ROUTES = [
  "/esim_home",
  "/esim_1",
  "/esim_2",
  "/esim_3",
  "/eSIM",
  "/esim/plan",
  "/esim-status",
  "/order-tracking",
  "/activation",
  "/checkout/return",
  "/help",
  "/contact",
  "/privacy",
  "/terms",
  "/unsubscribe",
];

export function isNativeAllowedPath(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return NATIVE_ALLOWED_ROUTES.some((r) => {
    const rl = r.toLowerCase();
    return p === rl || p.startsWith(rl + "/");
  });
}
