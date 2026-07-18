import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { useLanguage } from "@/i18n/LanguageContext";
import { CheckCircle, XCircle, Clock, Copy, ExternalLink, Loader2, Wifi, WifiOff, Signal, RefreshCw, Package, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoIntersofti from "@/assets/logo-intersofti-full.png";
import jsPDF from "jspdf";
import QRCode from "qrcode";

interface EsimOrder {
  package_name: string | null;
  iccid: string | null;
  qr_code_url: string | null;
  activation_code: string | null;
  status: string;
  customer_email: string | null;
}

interface UsageData {
  totalVolumeMB: number;
  orderUsageMB: number;
  remainingMB: number;
  usagePercent: number;
  esimStatus: string;
  expiredTime: string | null;
  packageName: string;
}

function formatData(mb: number): string {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
}

export default function CheckoutReturn() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const transactionId = searchParams.get("transaction_id");
  const method = searchParams.get("method");
  const gcOrder = searchParams.get("gc_order");
  // Ownership token. For crypto (Plisio) it is passed via ?t=... in the URL.
  // For Stripe embedded checkout it is stashed in sessionStorage keyed by session id.
  const urlToken = searchParams.get("t");
  const lookupToken = urlToken
    || (sessionId ? sessionStorage.getItem(`esim_lookup_${sessionId}`) : null)
    || "";
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [order, setOrder] = useState<EsimOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const orderRef = useRef<EsimOrder | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper: load image URL into a dataURL for jsPDF (handles CORS via fetch)
  const loadImageAsDataUrl = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const handleDownloadPdf = useCallback(async () => {
    if (!order) return;
    setDownloading(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let y = margin;

      // Force white background (some viewers honour transparency oddly)
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - margin) {
          pdf.addPage();
          pdf.setFillColor(255, 255, 255);
          pdf.rect(0, 0, pageWidth, pageHeight, "F");
          y = margin;
        }
      };

      // Logo (top center)
      const logoData = await loadImageAsDataUrl(logoIntersofti);
      if (logoData) {
        const logoW = 50;
        const logoH = 15;
        pdf.addImage(logoData, "PNG", (pageWidth - logoW) / 2, y, logoW, logoH);
        y += logoH + 6;
      } else {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor(0, 0, 0);
        pdf.text("INTERSOFTI", pageWidth / 2, y + 6, { align: "center" });
        y += 12;
      }

      // Title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text(t.esim.esimReady, pageWidth / 2, y, { align: "center" });
      y += 7;

      // Package name
      if (order.package_name) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);
        pdf.text(order.package_name, pageWidth / 2, y, { align: "center" });
        y += 8;
      }

      // QR — try the provider URL first, fall back to local generation from the activation code
      let qrData: string | null = null;
      if (order.qr_code_url) {
        qrData = await loadImageAsDataUrl(order.qr_code_url);
      }
      if (!qrData && order.activation_code) {
        try {
          qrData = await QRCode.toDataURL(order.activation_code, {
            errorCorrectionLevel: "M",
            margin: 1,
            width: 600,
            color: { dark: "#000000", light: "#FFFFFF" },
          });
        } catch (err) {
          console.warn("Local QR generation failed:", err);
        }
      }
      if (qrData) {
        const qrSize = 70;
        ensureSpace(qrSize + 16);
        const qrX = (pageWidth - qrSize) / 2;
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(220, 220, 220);
        pdf.roundedRect(qrX - 4, y - 4, qrSize + 8, qrSize + 8, 2, 2, "FD");
        pdf.addImage(qrData, "PNG", qrX, y, qrSize, qrSize);
        y += qrSize + 6;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(t.esim.scanQr, pageWidth / 2, y, { align: "center" });
        y += 8;
      }

      // Credentials block
      const drawField = (label: string, value: string) => {
        const lines = pdf.splitTextToSize(value, pageWidth - margin * 2);
        ensureSpace(5 + lines.length * 5 + 4);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(110, 110, 110);
        pdf.text(label, margin, y);
        y += 5;
        pdf.setFont("courier", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(lines, margin, y);
        y += lines.length * 5 + 4;
      };

      if (order.iccid) drawField(t.esim.iccidLabel, order.iccid);
      if (order.activation_code) drawField(t.esim.activationCodeLabel, order.activation_code);

      // Instructions
      y += 4;
      const bodyLines = pdf.splitTextToSize(t.esim.pdfInstructionsBody, pageWidth - margin * 2);
      ensureSpace(6 + bodyLines.length * 5);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(t.esim.pdfInstructionsTitle, margin, y);
      y += 6;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      pdf.text(bodyLines, margin, y);

      // Footer on every page
      const totalPages = pdf.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(140, 140, 140);
        pdf.text("rpjsoftware.com", pageWidth / 2, pageHeight - 10, { align: "center" });
      }

      const idPart = (order.iccid || sessionId || transactionId || "page").toString().slice(-10);
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      pdf.save(`esim-${idPart}-${today}.pdf`);
      toast.success(t.esim.downloadSuccess);
    } catch (e) {
      console.error("PDF download error:", e);
      toast.error(t.esim.downloadError);
    } finally {
      setDownloading(false);
    }
  }, [order, sessionId, transactionId, t.esim]);

  const isCrypto = method === "crypto";
  const hasIdentifier = !!(sessionId || transactionId);

  const fetchUsage = useCallback(async (iccid: string) => {
    setUsageLoading(true);
    try {
      const { data } = await supabase.functions.invoke("get-esim-usage", {
        body: { iccid },
      });
      if (data?.usage) setUsage(data.usage);
    } catch (e) {
      console.error("Usage fetch error:", e);
    } finally {
      setUsageLoading(false);
    }
  }, []);

  const fetchOrder = useCallback(async () => {
    if (!hasIdentifier) return;

    try {
      const body = transactionId
        ? { transaction_id: transactionId, token: lookupToken }
        : { session_id: sessionId, token: lookupToken };
      const { data, error } = await supabase.functions.invoke("get-esim-order", {
        body,
      });

      if (error) {
        console.error("Error fetching order:", error);
        return;
      }

      if (data?.order) {
        orderRef.current = data.order;
        setOrder(data.order);
        if (data.order.status === "active") {
          setLoading(false);
          // Stop polling and cancel timeout — order is ready, page must stay open
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      }
    } catch (e) {
      console.error("Fetch error:", e);
    }
  }, [hasIdentifier, transactionId, sessionId, lookupToken]);

  useEffect(() => {
    if (!hasIdentifier) {
      setLoading(false);
      return;
    }

    fetchOrder();

    intervalRef.current = setInterval(() => {
      fetchOrder();
    }, 3000);

    timeoutRef.current = setTimeout(() => {
      // Only mark as not-found if we never received an order
      if (!orderRef.current) {
        setLoading(false);
        setNotFound(true);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 60000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      intervalRef.current = null;
      timeoutRef.current = null;
    };
  }, [hasIdentifier, fetchOrder]);

  // Fetch usage once order becomes active
  useEffect(() => {
    if (order?.status === "active" && order.iccid) {
      fetchUsage(order.iccid);
    }
  }, [order?.status, order?.iccid, fetchUsage]);

  const handleClose = () => {
    // Try to close the tab; fall back to navigating home if blocked
    try {
      window.close();
    } catch {
      // ignore
    }
    setTimeout(() => {
      if (!window.closed) navigate("/");
    }, 200);
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t.esim.copySuccess);
  };

  // GhostCode S10 order completed
  if (gcOrder) {
    return (
      <>
        <section className="py-32 px-4">
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-2 text-foreground">¡Pedido Confirmado!</h1>
            <p className="text-lg text-primary font-mono font-bold mb-4">{gcOrder}</p>
            <p className="text-muted-foreground mb-8">
              Tu compra del GhostCode S10 ha sido confirmada. Recibirás un email con los detalles del pedido y un enlace para hacer seguimiento.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate(`/order-tracking?order=${gcOrder}`)} className="gap-2">
                <Package className="w-4 h-4" />
                Seguimiento de pedido
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Volver al inicio
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  // No session or transaction
  if (!hasIdentifier) {
    return (
      <>
        <section className="py-32 px-4">
          <div className="max-w-lg mx-auto text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">{t.esim.orderError}</h1>
            <p className="text-muted-foreground mb-8">No session information found.</p>
            <Button onClick={() => navigate("/eSIM")}>{t.esim.backToPlans}</Button>
          </div>
        </section>
      </>
    );
  }

  // Provision failed - show error with reference
  if (order && (order.status === "failed" || order.status === "provision_failed")) {
    const ref = (sessionId || transactionId || "").toString();
    return (
      <>
        <section className="py-32 px-4">
          <div className="max-w-lg mx-auto text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">{t.esim.provisionFailedTitle}</h1>
            <p className="text-muted-foreground mb-6">{t.esim.provisionFailedDesc}</p>
            {ref && (
              <div className="bg-muted/50 rounded-lg p-3 mb-6 text-sm">
                <p className="text-muted-foreground">{t.esim.orderReference}</p>
                <p className="font-mono text-foreground break-all">{ref}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate("/contact")} className="gap-2">
                {t.esim.contactSupport}
              </Button>
              <Button variant="outline" onClick={() => navigate("/eSIM")}>
                {t.esim.backToPlans}
              </Button>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Loading / provisioning
  if (loading || (order && order.status !== "active")) {
    return (
      <>
        <section className="py-32 px-4">
          <div className="max-w-lg mx-auto text-center">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">{t.esim.provisioningTitle}</h1>
            <p className="text-muted-foreground mb-8">{t.esim.provisioningDesc}</p>
          </div>
        </section>
      </>
    );
  }

  // Not found after timeout
  if (notFound || !order) {
    return (
      <>
        <section className="py-32 px-4">
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">{t.esim.orderSuccess}</h1>
            <p className="text-muted-foreground mb-8">{t.esim.checkoutSuccessDesc}</p>
            <Button onClick={() => navigate("/eSIM")}>{t.esim.backToPlans}</Button>
          </div>
        </section>
      </>
    );
  }

  // eSIM ready - show details
  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-border bg-card overflow-hidden" data-print-root>
            <CardContent className="p-0">
              <div className="bg-card" data-print-keep-together>
              {/* Header with logo */}
              <div className="bg-white p-4 text-center">
                <img
                  src={logoIntersofti}
                  alt="INTERSOFTI"
                  className="h-12 mx-auto object-contain"
                />
              </div>
              <div className="bg-primary/10 p-6 text-center border-b border-border">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h1 className="text-xl font-bold text-foreground">{t.esim.esimReady}</h1>
                <p className="text-sm text-muted-foreground mt-1">{order.package_name}</p>
              </div>

              {/* Quick Install button */}
              {order.activation_code && (
                <div className="p-4 border-b border-border">
                  <a
                    href={order.activation_code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground rounded-lg py-3 px-4 font-medium hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t.esim.quickInstall}
                  </a>
                </div>
              )}

              {/* QR Code */}
              {order.qr_code_url && (
                <div className="p-6 border-b border-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">{t.esim.scanQr}</p>
                  <div className="bg-white rounded-lg p-4 inline-block">
                    <img
                      src={order.qr_code_url}
                      alt="eSIM QR Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="p-4 space-y-3">
                {/* ICCID */}
                {order.iccid && (
                  <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground font-medium">{t.esim.iccidLabel}</p>
                      <p className="text-sm text-foreground font-mono truncate">{order.iccid}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(order.iccid!)}
                      className="shrink-0 ml-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Activation Code */}
                {order.activation_code && (
                  <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground font-medium">{t.esim.activationCodeLabel}</p>
                      <p className="text-sm text-foreground font-mono truncate">{order.activation_code}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(order.activation_code!)}
                      className="shrink-0 ml-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              </div>
              {/* /esimCardRef */}
              {usage && (
                <div className="p-4 border-t border-border space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">{t.esim.dataUsage}</span>
                      <span className="font-medium text-foreground">
                        {formatData(usage.orderUsageMB)} / {formatData(usage.totalVolumeMB)}
                      </span>
                    </div>
                    <Progress value={usage.usagePercent} className="h-3" />
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-muted-foreground">{usage.usagePercent}% {t.esim.used}</span>
                      <span className="text-muted-foreground">{formatData(usage.remainingMB)} {t.esim.remaining}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {usage.esimStatus === "IN_USE" ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-destructive" />}
                    <span className={usage.esimStatus === "IN_USE" ? "text-green-500" : "text-destructive"}>
                      {t.esim.statuses[usage.esimStatus as keyof typeof t.esim.statuses] || usage.esimStatus}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => order.iccid && fetchUsage(order.iccid)}
                    disabled={usageLoading}
                  >
                    {usageLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <RefreshCw className="w-3 h-3 mr-1" />}
                    {t.esim.refreshData}
                  </Button>
                </div>
              )}

              {usageLoading && !usage && (
                <div className="p-4 border-t border-border text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                </div>
              )}

              {/* Footer */}
              <div className="p-4 border-t border-border text-center space-y-2">
                <Button onClick={handleDownloadPdf} disabled={downloading} className="w-full gap-2">
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {t.esim.downloadEsimPage}
                </Button>
                <Button variant="outline" onClick={() => navigate("/eSIM")} className="w-full">
                  {t.esim.backToPlans}
                </Button>
                <Button variant="ghost" onClick={handleClose} className="w-full gap-2">
                  <X className="w-4 h-4" />
                  {t.esim.close}
                </Button>
                {order.iccid && (
                  <Link to={`/esim-status?iccid=${order.iccid}`} className="block text-xs text-primary hover:underline mt-2">
                    {t.esim.checkStatus}
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
