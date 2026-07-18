import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';


import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import { Package, CheckCircle, Truck, Home, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = [
  { key: 'paid', icon: CheckCircle, label: { en: 'Confirmed', pt: 'Confirmado', es: 'Confirmado' } },
  { key: 'shipped', icon: Truck, label: { en: 'Shipped', pt: 'Enviado', es: 'Enviado' } },
  { key: 'delivered', icon: Home, label: { en: 'Delivered', pt: 'Entregue', es: 'Entregado' } },
];

const STATUS_INDEX: Record<string, number> = { pending: -1, paid: 0, shipped: 1, delivered: 2, cancelled: -2, refunded: -2 };

interface OrderData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state_province: string | null;
  postal_code: string;
  country_name: string;
  payment_status: string;
  product: string;
  total_price: number;
  created_at: string;
}

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderParam = searchParams.get('order');
  const [orderNumber, setOrderNumber] = useState(orderParam || '');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const { language } = useLanguage();

  const content = {
    en: {
      title: 'Track Your Order',
      placeholder: 'Order number (GC-… physical, B… eSIM, or ICCID)',
      search: 'Search',
      notFound: 'Order not found. Please check the number.',
      promoInfo: 'This is a promo/gift code, not an order number. Look for a code starting with "B" (eSIM) or "GC-" (physical) in your confirmation email.',
      redirectingEsim: 'This is an eSIM order — redirecting…',
      orderLabel: 'Order',
      dateLabel: 'Date',
      productLabel: 'Product',
      totalLabel: 'Total',
      shippingLabel: 'Shipping Address',
      statusLabel: 'Status',
      cancelled: 'Order cancelled',
      refunded: 'Order refunded',
      pending: 'Payment pending',
    },
    pt: {
      title: 'Acompanhar Encomenda',
      placeholder: 'Número (GC-… físico, B… eSIM, ou ICCID)',
      search: 'Pesquisar',
      notFound: 'Encomenda não encontrada. Verifique o número.',
      promoInfo: 'Este é um código promocional/oferta, não um número de encomenda. Procure no seu email de confirmação um código que começa por "B" (eSIM) ou "GC-" (físico).',
      redirectingEsim: 'Esta é uma encomenda eSIM — a redirecionar…',
      orderLabel: 'Encomenda',
      dateLabel: 'Data',
      productLabel: 'Produto',
      totalLabel: 'Total',
      shippingLabel: 'Morada de envio',
      statusLabel: 'Estado',
      cancelled: 'Encomenda cancelada',
      refunded: 'Encomenda reembolsada',
      pending: 'Pagamento pendente',
    },
    es: {
      title: 'Seguimiento de Pedido',
      placeholder: 'Número (GC-… físico, B… eSIM, o ICCID)',
      search: 'Buscar',
      notFound: 'Pedido no encontrado. Verifica el número.',
      promoInfo: 'Este es un código promocional/regalo, no un número de pedido. Busca en tu email de confirmación un código que empiece por "B" (eSIM) o "GC-" (físico).',
      redirectingEsim: 'Este es un pedido eSIM — redirigiendo…',
      orderLabel: 'Pedido',
      dateLabel: 'Fecha',
      productLabel: 'Producto',
      totalLabel: 'Total',
      shippingLabel: 'Dirección de envío',
      statusLabel: 'Estado',
      cancelled: 'Pedido cancelado',
      refunded: 'Pedido reembolsado',
      pending: 'Pago pendiente',
    },
  };


  const c = content[language];

  async function fetchOrder(num: string) {
    const raw = num.trim();
    if (!raw) return;
    setLoading(true);
    setNotFound(false);
    setInfoMsg(null);
    setOrder(null);

    const upper = raw.toUpperCase();

    // 1) Physical GhostCode order (GC-…)
    const { data: gcRows } = await supabase
      .rpc('lookup_ghostcode_order', { _order_number: upper });
    const gc = Array.isArray(gcRows) ? gcRows[0] : gcRows;

    if (gc) {
      setOrder(gc as OrderData);
      setLoading(false);
      return;
    }

    // 2) Promo/gift token → tell the user this is not an order number
    if (/^(GIFT|PROMO)-/i.test(raw)) {
      const { data } = await supabase.rpc('validate_promo_token', { _code: upper });
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.valid) {
        setInfoMsg(c.promoInfo);
        setLoading(false);
        return;
      }
    }

    // 3) eSIM order: match by order_no, id (UUID) or iccid
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw);
    let esimQuery = supabase.from('esim_orders').select('id, iccid, order_no').limit(1);
    if (isUuid) {
      esimQuery = esimQuery.eq('id', raw.toLowerCase());
    } else if (/^\d{15,25}$/.test(raw)) {
      esimQuery = esimQuery.eq('iccid', raw);
    } else {
      esimQuery = esimQuery.eq('order_no', upper);
    }
    const { data: esimRows } = await esimQuery;
    const esim = esimRows && esimRows[0];
    if (esim) {
      setInfoMsg(c.redirectingEsim);
      setLoading(false);
      const target = esim.iccid
        ? `/esim-status?iccid=${encodeURIComponent(esim.iccid)}`
        : `/esim-status?orderId=${encodeURIComponent(esim.id)}`;
      setTimeout(() => navigate(target), 800);
      return;
    }

    setNotFound(true);
    setLoading(false);
  }


  useEffect(() => {
    if (orderParam) fetchOrder(orderParam);
  }, [orderParam]);

  const currentStep = order ? (STATUS_INDEX[order.payment_status] ?? -1) : -1;
  const isCancelled = order && (order.payment_status === 'cancelled' || order.payment_status === 'refunded');

  return (
    <>
      <section className="py-32 px-4 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Package className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">{c.title}</h1>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-10">
          <Input
            placeholder={c.placeholder}
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchOrder(orderNumber)}
            className="flex-1"
          />
          <Button onClick={() => fetchOrder(orderNumber)} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span className="ml-2">{c.search}</span>
          </Button>
        </div>

        {infoMsg && (
          <p className="text-center text-primary mb-4">{infoMsg}</p>
        )}

        {notFound && (
          <p className="text-center text-destructive">{c.notFound}</p>
        )}


        {order && (
          <Card className="border-border bg-card">
            <CardContent className="p-6 space-y-8">
              {/* Order header */}
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{c.orderLabel}</p>
                  <p className="text-lg font-bold font-mono text-foreground">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{c.dateLabel}</p>
                  <p className="text-sm text-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Progress bar */}
              {isCancelled ? (
                <div className="text-center py-4">
                  <p className="text-destructive font-semibold">
                    {order.payment_status === 'cancelled' ? c.cancelled : c.refunded}
                  </p>
                </div>
              ) : currentStep < 0 ? (
                <div className="text-center py-4">
                  <p className="text-yellow-400 font-semibold">{c.pending}</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Line behind icons */}
                  <div className="absolute top-5 left-[16.66%] right-[16.66%] h-1 bg-muted rounded-full" />
                  <div
                    className="absolute top-5 left-[16.66%] h-1 bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(currentStep / (STEPS.length - 1), 1) * 66.66}%` }}
                  />

                  <div className="relative flex justify-between">
                    {STEPS.map((step, i) => {
                      const isActive = i <= currentStep;
                      const Icon = step.icon;
                      return (
                        <div key={step.key} className="flex flex-col items-center w-1/3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                            isActive
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'bg-card border-border text-muted-foreground'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs mt-2 font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                            {step.label[language]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order details */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">{c.productLabel}</p>
                  <p className="text-sm font-medium text-foreground">GhostCode S10</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{c.totalLabel}</p>
                  <p className="text-lg font-bold text-foreground">€{Number(order.total_price).toFixed(2)}</p>
                </div>
              </div>

              {/* Shipping address */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">{c.shippingLabel}</p>
                <div className="text-sm text-foreground space-y-0.5">
                  <p className="font-medium">{order.customer_name}</p>
                  <p>{order.address_line1}</p>
                  {order.address_line2 && <p>{order.address_line2}</p>}
                  <p>{order.postal_code} {order.city}{order.state_province ? `, ${order.state_province}` : ''}</p>
                  <p>{order.country_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </>
  );
}
