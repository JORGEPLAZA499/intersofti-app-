import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { PublicLayout } from "@/components/PublicLayout";
import { NativeRouteGuard } from "@/components/NativeRouteGuard";
import { NativeBackButton } from "@/components/NativeBackButton";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { useSafeArea } from "@/hooks/useSafeArea";

// Landing page eagerly imported so FCP isn't delayed by a Suspense fallback.
import Index from "./pages/Index";
// eSIM plan selector eagerly imported to avoid black flash on selection/navigation.
import Products from "./pages/Products";

// Lazy chunks — kept as named factories so we can prefetch them on idle.
const load = {
  GhostcodeS10: () => import("./pages/GhostcodeS10"),
  Contact: () => import("./pages/Contact"),
  HelpCenter: () => import("./pages/HelpCenter"),
  GhostcodeS10Product: () => import("./pages/GhostcodeS10Product"),
  CryptoCardFirsweVisa: () => import("./pages/CryptoCardFirsweVisa"),
  EsimStatus: () => import("./pages/EsimStatus"),
  CheckoutReturn: () => import("./pages/CheckoutReturn"),
  Activation: () => import("./pages/Activation"),
  OrderTracking: () => import("./pages/OrderTracking"),
  GhostcodeMessenger: () => import("./pages/GhostcodeMessenger"),
  GhostcodeToken: () => import("./pages/GhostcodeToken"),
  BlogArticle: () => import("./pages/BlogArticle"),
  Login: () => import("./pages/Login"),
  AdminLayout: () => import("./components/AdminLayout").then(m => ({ default: m.AdminLayout })),
  AdminDashboard: () => import("./pages/AdminDashboard"),
  AdminClients: () => import("./pages/AdminClients"),
  AdminSales: () => import("./pages/AdminSales"),
  AdminSettings: () => import("./pages/AdminSettings"),
  AdminEsim: () => import("./pages/AdminEsim"),
  AdminTickets: () => import("./pages/AdminTickets"),
  AdminOrders: () => import("./pages/AdminOrders"),
  AdminSystemHealth: () => import("./pages/AdminSystemHealth"),
  PrivacyPolicy: () => import("./pages/PrivacyPolicy"),
  TermsOfService: () => import("./pages/TermsOfService"),
  NotFound: () => import("./pages/NotFound"),
  Unsubscribe: () => import("./pages/Unsubscribe"),
  BoxAI: () => import("./pages/BoxAI"),
  BoxAISolutions: () => import("./pages/BoxAISolutions"),
  EsimHome: () => import("./pages/EsimHome"),
  Esim1: () => import("./pages/Esim1"),
  Esim2: () => import("./pages/Esim2"),
  Esim3: () => import("./pages/Esim3"),
};

const GhostcodeS10 = lazy(load.GhostcodeS10);
const Contact = lazy(load.Contact);
const HelpCenter = lazy(load.HelpCenter);
const GhostcodeS10Product = lazy(load.GhostcodeS10Product);
const CryptoCardFirsweVisa = lazy(load.CryptoCardFirsweVisa);
const EsimStatus = lazy(load.EsimStatus);
const CheckoutReturn = lazy(load.CheckoutReturn);
const Activation = lazy(load.Activation);
const OrderTracking = lazy(load.OrderTracking);
const GhostcodeMessenger = lazy(load.GhostcodeMessenger);
const GhostcodeToken = lazy(load.GhostcodeToken);
const BlogArticle = lazy(load.BlogArticle);
const Login = lazy(load.Login);
const AdminLayout = lazy(load.AdminLayout);
const AdminDashboard = lazy(load.AdminDashboard);
const AdminClients = lazy(load.AdminClients);
const AdminSales = lazy(load.AdminSales);
const AdminSettings = lazy(load.AdminSettings);
const AdminEsim = lazy(load.AdminEsim);
const AdminTickets = lazy(load.AdminTickets);
const AdminOrders = lazy(load.AdminOrders);
const AdminSystemHealth = lazy(load.AdminSystemHealth);
const PrivacyPolicy = lazy(load.PrivacyPolicy);
const TermsOfService = lazy(load.TermsOfService);
const NotFound = lazy(load.NotFound);
const Unsubscribe = lazy(load.Unsubscribe);
const BoxAI = lazy(load.BoxAI);
const BoxAISolutions = lazy(load.BoxAISolutions);
const EsimHome = lazy(load.EsimHome);
const Esim1 = lazy(load.Esim1);
const Esim2 = lazy(load.Esim2);
const Esim3 = lazy(load.Esim3);
const BestTravelEsimComparison = lazy(() => import("./pages/BestTravelEsimComparison"));

// Prefetch the most-visited public routes as soon as the browser is idle
// so subsequent navigations are instant (no chunk request on click).
const PREFETCH_PRIORITY: Array<keyof typeof load> = [
  "EsimHome",
  "EsimStatus",
  "Esim1",
  "Esim2",
  "Esim3",
  "OrderTracking",
  "Activation",
  "HelpCenter",
  "Contact",
  "CheckoutReturn",
  "BoxAI",
  "BoxAISolutions",
  "PrivacyPolicy",
  "TermsOfService",
];

function prefetchRoutes() {
  const idle: (cb: () => void) => void =
    (window as any).requestIdleCallback?.bind(window) ??
    ((cb: () => void) => setTimeout(cb, 200));
  PREFETCH_PRIORITY.forEach((key, i) => {
    idle(() => {
      // Fire-and-forget; browser caches the chunk for instant navigation.
      load[key]?.().catch(() => {});
    });
    // Stagger to avoid saturating the network on slow connections.
    void i;
  });
}

// Warm the browser image cache for the eSIM navigation flow so
// hero images render instantly on route change.
async function prefetchCriticalImages() {
  const modules = await Promise.all([
    import("@/assets/esim-hero-woman.png.asset.json"),
    import("@/assets/esim-globe-transparent.png.asset.json"),
    import("@/assets/esim-status-hero.png.asset.json"),
    import("@/assets/intersofti-ball.png.asset.json"),
  ]).catch(() => [] as any[]);
  modules.forEach((mod: any) => {
    const url = mod?.default?.url || mod?.url;
    if (!url) return;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  });
}

const queryClient = new QueryClient();

const RoutePrefetcher = () => {
  useEffect(() => {
    prefetchRoutes();
    const idle: (cb: () => void) => void =
      (window as any).requestIdleCallback?.bind(window) ??
      ((cb: () => void) => setTimeout(cb, 300));
    idle(() => { prefetchCriticalImages(); });
  }, []);
  return null;
};

const SafeAreaInit = () => {
  useSafeArea();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RoutePrefetcher />
          <SafeAreaInit />
          <NativeRouteGuard>
          <NativeBackButton />
          <Suspense fallback={<div className="min-h-screen bg-white" />}>


            <Routes>
              {/* Public routes — shared layout persists across navigation */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/eSIM" element={<Products />} />
                <Route path="/esim/plan" element={<Products />} />
                <Route path="/products" element={<Navigate to="/eSIM" replace />} />
                <Route path="/ghostcode-s10" element={<GhostcodeS10 />} />
                <Route path="/ghostcode-s10/messenger" element={<GhostcodeMessenger />} />
                <Route path="/ghostcode-s10/token" element={<GhostcodeToken />} />
                <Route path="/ghostcode-s10-product" element={<GhostcodeS10Product />} />
                <Route path="/crypto-card-firswe-visa" element={<CryptoCardFirsweVisa />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/activation" element={<Activation />} />
                <Route path="/blog/best-travel-esim-comparison" element={<BestTravelEsimComparison />} />
                <Route path="/blog/:id" element={<BlogArticle />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/checkout/return" element={<CheckoutReturn />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/esim-status" element={<EsimStatus />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/box_ai" element={<BoxAI />} />
                <Route path="/box_ai/solutions" element={<BoxAISolutions />} />
              </Route>

              {/* Auth & Admin — own layouts */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="sales" element={<AdminSales />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="esim" element={<AdminEsim />} />
                <Route path="tickets" element={<AdminTickets />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="system-health" element={<AdminSystemHealth />} />
              </Route>

              {/* Standalone (no public layout) — not linked yet */}
              <Route path="/esim_home" element={<EsimHome />} />
              <Route path="/esim_1" element={<Esim1 />} />
              <Route path="/esim_2" element={<Esim2 />} />
              <Route path="/esim_3" element={<Esim3 />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <WhatsAppFloat />
          </NativeRouteGuard>
        </BrowserRouter>

      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
