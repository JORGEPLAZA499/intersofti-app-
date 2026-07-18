import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Bitcoin, Loader2, Mail, CalendarClock, User, Phone, MapPin, Building, Hash, Info, ShieldCheck, Tag, Check } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { SHIPPING_COUNTRIES } from '@/lib/countries';
import { CountdownTimer } from '@/components/CountdownTimer';

const PRODUCT_IMAGE = 'https://spudbndneoaltpseizye.supabase.co/storage/v1/object/public/assets/ghostcode-s10.avif';

export default function GhostcodeS10Product() {
  // Preload product image for faster above-the-fold rendering
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = PRODUCT_IMAGE;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [processing, setProcessing] = useState(false);
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsDetail, setShowTermsDetail] = useState(false);

  // Promo token state
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ type: string; discount_percent: number; token_code: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Shipping form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    countryCode: '',
  });

  useEffect(() => {
    supabase.from('esim_settings').select('value').eq('key', 'ghostcode_s10_price').maybeSingle()
      .then(({ data }) => {
        if (data) setPrice(parseFloat(data.value));
        setLoading(false);
      });
  }, []);

  const content = {
    en: {
      title: 'GhostCode S10',
      subtitle: 'Military-Grade Encrypted Communication Device',
      description: 'The GhostCode S10 is the ultimate encrypted communication device, designed for those who demand absolute privacy and security. Built with military-grade encryption technology, it ensures that your conversations, messages, and data remain completely private and inaccessible to third parties.',
      features: [
        'End-to-end AES-256 encryption',
        'Tamper-proof hardware design',
        'Secure mesh networking capability',
        'Self-destructing messages',
        'No metadata storage',
        'Sale-restricted countries + info',
      ],
      prelaunchLabel: 'Buy before launch for',
      discount: 'Discount',
      saleDateLabel: 'On sale from',
      retailPrice: 'RRP:',
      shippingTitle: 'Shipping Details',
      namePlaceholder: 'Full name',
      phonePlaceholder: 'Phone (optional)',
      addressPlaceholder: 'Address line 1',
      address2Placeholder: 'Address line 2 (optional)',
      cityPlaceholder: 'City',
      statePlaceholder: 'State / Province',
      postalPlaceholder: 'Postal code',
      countryPlaceholder: 'Select country',
      proceedPayment: 'Proceed to payment',
    },
    pt: {
      title: 'GhostCode S10',
      subtitle: 'Dispositivo de Comunicação Encriptada de Grau Militar',
      description: 'O GhostCode S10 é o dispositivo de comunicação encriptada definitivo, projetado para quem exige privacidade e segurança absolutas. Construído com tecnologia de encriptação de grau militar, garante que as suas conversas, mensagens e dados permaneçam completamente privados e inacessíveis a terceiros.',
      features: [
        'Encriptação AES-256 ponta a ponta',
        'Design de hardware à prova de adulteração',
        'Capacidade de rede mesh segura',
        'Mensagens autodestrutivas',
        'Sem armazenamento de metadados',
        'Países com restrição de venda + informações',
      ],
      prelaunchLabel: 'Compre antes do lançamento por',
      discount: 'Desconto',
      saleDateLabel: 'À venda a partir de',
      retailPrice: 'PVP:',
      shippingTitle: 'Dados de envio',
      namePlaceholder: 'Nome completo',
      phonePlaceholder: 'Telefone (opcional)',
      addressPlaceholder: 'Morada linha 1',
      address2Placeholder: 'Morada linha 2 (opcional)',
      cityPlaceholder: 'Cidade',
      statePlaceholder: 'Estado / Província',
      postalPlaceholder: 'Código postal',
      countryPlaceholder: 'Selecionar país',
      proceedPayment: 'Prosseguir para pagamento',
    },
    es: {
      title: 'GhostCode S10',
      subtitle: 'Dispositivo de Encriptación',
      description: 'El GhostCode S10 es el dispositivo de comunicación encriptada definitivo, diseñado para quienes exigen privacidad y seguridad absolutas. Construido con tecnología de encriptación de grado militar, garantiza que sus conversaciones, mensajes y datos permanezcan completamente privados e inaccesibles para terceros.',
      features: [
        'Encriptación AES-256 de extremo a extremo',
        'Diseño de hardware a prueba de manipulaciones',
        'Capacidad de red mesh segura',
        'Mensajes autodestructivos',
        'Sin almacenamiento de metadatos',
        'Países con restricción de venta + información',
      ],
      prelaunchLabel: 'Compra antes del lanzamiento por',
      discount: 'Descuento',
      saleDateLabel: 'A la venta a partir del',
      retailPrice: 'PVP:',
      shippingTitle: 'Datos de envío',
      namePlaceholder: 'Nombre completo',
      phonePlaceholder: 'Teléfono (opcional)',
      addressPlaceholder: 'Dirección línea 1',
      address2Placeholder: 'Dirección línea 2 (opcional)',
      cityPlaceholder: 'Ciudad',
      statePlaceholder: 'Estado / Provincia',
      postalPlaceholder: 'Código postal',
      countryPlaceholder: 'Seleccionar país',
      proceedPayment: 'Proceder al pago',
    },
  };

  const c = content[language];

  function validateEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function openBuyDialog(method: 'card' | 'crypto') {
    setPaymentMethod(method);
    setDialogOpen(true);
    setFormData({ name: '', email: '', phone: '', address1: '', address2: '', city: '', stateProvince: '', postalCode: '', countryCode: '' });
    setTermsAccepted(false);
    setPromoCode('');
    setPromoApplied(null);
    setPromoError('');
  }

  async function handleApplyPromo() {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    setPromoLoading(true);
    setPromoError('');
    setPromoApplied(null);
    try {
      const { data, error } = await supabase
        .rpc('validate_promo_token', { _code: code });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.valid) {
        setPromoError(language === 'en' ? 'Invalid, exhausted or expired code' : language === 'pt' ? 'Código inválido, esgotado ou expirado' : 'Código inválido, agotado o expirado');
      } else {
        setPromoApplied({ type: row.type, discount_percent: row.discount_percent ?? 0, token_code: code });
      }
    } catch {
      setPromoError('Error');
    } finally {
      setPromoLoading(false);
    }
  }

  function getEffectivePrice(): number {
    if (!price) return 0;
    if (!promoApplied) return price;
    if (promoApplied.type === 'free') return 0;
    return Math.round(price * (1 - promoApplied.discount_percent / 100) * 100) / 100;
  }

  function updateField(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function isFormValid() {
    return formData.name && validateEmail(formData.email) && formData.address1 && formData.city && formData.postalCode && formData.countryCode && termsAccepted;
  }

  async function handleBuy() {
    if (!isFormValid()) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const selectedCountry = SHIPPING_COUNTRIES.find(c => c.code === formData.countryCode);
    const orderNumber = `GC-${Date.now().toString(36).toUpperCase()}`;
    const effectivePrice = getEffectivePrice();
    const isFree = promoApplied?.type === 'free';

    setProcessing(true);
    try {
      // Create order in DB
      const { data: orderRow, error: orderError } = await supabase.from('ghostcode_orders').insert({
        order_number: orderNumber,
        customer_email: formData.email,
        customer_name: formData.name,
        phone: formData.phone || null,
        address_line1: formData.address1,
        address_line2: formData.address2 || null,
        city: formData.city,
        state_province: formData.stateProvince || null,
        postal_code: formData.postalCode,
        country_code: formData.countryCode,
        country_name: selectedCountry?.name || formData.countryCode,
        payment_method: isFree ? 'token' : paymentMethod,
        payment_status: isFree ? 'paid' : 'pending',
        unit_price: price || 495,
        total_price: effectivePrice,
        promo_token: promoApplied?.token_code || null,
      } as any).select().single();

      if (orderError) throw orderError;

      // Atomically record token usage (enforces max_uses on the server)
      if (promoApplied) {
        supabase.rpc('consume_promo_token', { _code: promoApplied.token_code }).then(() => {});
      }

      if (isFree) {
        // Free token: skip payment entirely
        toast.success(language === 'en' ? 'Order confirmed!' : language === 'pt' ? 'Pedido confirmado!' : '¡Pedido confirmado!');
        setDialogOpen(false);
        navigate(`/order-tracking?order=${orderNumber}`);
        return;
      }

      if (paymentMethod === 'crypto') {
        const { data, error } = await supabase.functions.invoke('create-plisio-invoice', {
          body: {
            packageCode: 'ghostcode-s10',
            packageName: 'GhostCode S10',
            amountInEur: effectivePrice,
            customerEmail: formData.email,
            language,
          },
        });
        if (error || !data?.invoiceUrl) throw new Error(error?.message || 'Error creating invoice');
        window.location.href = data.invoiceUrl;
      } else {
        const amountInCents = Math.round(effectivePrice * 100);
        const { data, error } = await supabase.functions.invoke('create-esim-checkout', {
          body: {
            packageCode: 'ghostcode-s10',
            packageName: 'GhostCode S10',
            amountInCents,
            currency: 'eur',
            customerEmail: formData.email,
            returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&gc_order=${orderNumber}`,
            environment: getStripeEnvironment(),
            ghostcodeOrderNumber: orderNumber,
            locale: language,
          },
        });
        if (error || !data?.clientSecret) throw new Error(error?.message || 'Error creating checkout');
        if (data.sessionId && data.lookupToken) {
          sessionStorage.setItem(`esim_lookup_${data.sessionId}`, data.lookupToken);
        }
        setCheckoutClientSecret(data.clientSecret);
        setDialogOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Error processing order');
    } finally {
      setProcessing(false);
    }
  }

  const fetchClientSecret = useCallback(() => {
    return Promise.resolve(checkoutClientSecret!);
  }, [checkoutClientSecret]);

  if (checkoutClientSecret) {
    return (
      <>
        <section className="max-w-2xl mx-auto py-12 px-4">
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="py-32 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div className="flex justify-center">
            <div className="w-full max-w-[280px] sm:max-w-sm md:max-w-md rounded-2xl overflow-hidden">
              <img src={PRODUCT_IMAGE} alt="GhostCode S10" className="w-full h-auto rounded-2xl" fetchPriority="high" loading="eager" decoding="async" />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{c.title}</h1>
            <p className="text-lg text-primary font-semibold">{c.subtitle}</p>
            <p className="text-muted-foreground leading-relaxed">{c.description}</p>
            <ul className="space-y-2 text-muted-foreground">
              {c.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary shrink-0" />
                  {i === c.features.length - 1 ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-left hover:text-foreground transition-colors underline decoration-dotted underline-offset-2">
                          {f}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 text-sm bg-white text-gray-900 border-gray-200" side="bottom" align="start">
                        <p className="font-semibold mb-2 text-gray-900">{language === 'en' ? 'Not available for sale in:' : language === 'pt' ? 'Não disponível para venda em:' : 'No disponible a la venta en:'}</p>
                        <p className="text-gray-600 leading-relaxed text-xs">
                          Algeria, Angola, Bahrain, Benin, Botswana, Burkina Faso, Burundi, Cabo Verde, Cameroon, Central African Republic, Chad, Comoros, Congo, Côte d'Ivoire, Djibouti, Egypt, Equatorial Guinea, Eritrea, Eswatini, Ethiopia, Gabon, Gambia, Ghana, Guinea, Guinea-Bissau, Iraq, Jordan, Kenya, Kuwait, Lebanon, Lesotho, Liberia, Libya, Madagascar, Malawi, Mali, Mauritania, Morocco, Mozambique, Namibia, Niger, Nigeria, Oman, Palestine, Qatar, Rwanda, São Tomé and Príncipe, Saudi Arabia, Senegal, Seychelles, Sierra Leone, Somalia, South Africa, South Sudan, Sudan, Syria, Tanzania, Togo, Tunisia, Uganda, United Arab Emirates ({language === 'en' ? 'except' : language === 'pt' ? 'exceto' : 'excepto'} Dubai), Yemen, Zambia, Zimbabwe
                        </p>
                      </PopoverContent>
                    </Popover>
                  ) : f}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {c.prelaunchLabel}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-white">€495.00</span>
                </div>
              </div>
              <div className="flex flex-col items-center px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/20">
                <span className="text-[10px] uppercase tracking-wider text-green-300 font-medium">{c.discount}</span>
                <span className="text-green-400 text-lg font-bold leading-tight">-34%</span>
              </div>
              <CountdownTimer targetDate={new Date('2026-10-01T00:00:00')} />
            </div>

            {/* Sale date banner */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
              <CalendarClock className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground tracking-wide">
                {c.saleDateLabel} <span className="text-primary font-bold">01/10/2026</span> — <span className="text-muted-foreground">{c.retailPrice} <span className="font-bold text-foreground">€755.00</span></span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button className="gap-2 h-12 text-base" variant="default" onClick={() => openBuyDialog('card')} disabled={loading}>
                <CreditCard className="w-5 h-5" />
                {t.esim.payWithCard}
              </Button>
              <Button className="gap-2 h-12 text-base border-white/30 text-white hover:bg-white/10" variant="outline" onClick={() => openBuyDialog('crypto')} disabled={loading}>
                <Bitcoin className="w-5 h-5" />
                {t.esim.payWithCrypto}
              </Button>
            </div>

            {/* Payment method icons */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <div>
                <p className="text-[10px] text-muted-foreground mb-2 text-center italic">Card Payments</p>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-10 h-7 flex items-center justify-center bg-white rounded shadow-sm">
                    <svg viewBox="0 0 48 32" className="w-8 h-5"><rect width="48" height="32" rx="4" fill="#f5f5f5"/><circle cx="18" cy="16" r="10" fill="#EB001B"/><circle cx="30" cy="16" r="10" fill="#F79E1B"/><path d="M24 8.8a10 10 0 010 14.4 10 10 0 000-14.4z" fill="#FF5F00"/></svg>
                  </div>
                  <div className="w-10 h-7 flex items-center justify-center bg-white rounded shadow-sm">
                    <svg viewBox="0 0 48 32" className="w-8 h-5"><rect width="48" height="32" rx="4" fill="#1A1F71"/><text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">VISA</text></svg>
                  </div>
                  <div className="w-10 h-7 flex items-center justify-center bg-white rounded shadow-sm">
                    <svg viewBox="0 0 48 32" className="w-8 h-5"><rect width="48" height="32" rx="4" fill="#016FD0"/><text x="24" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">AMEX</text></svg>
                  </div>
                  <div className="w-10 h-7 flex items-center justify-center bg-white rounded shadow-sm">
                    <svg viewBox="0 0 48 32" className="w-8 h-5"><rect width="48" height="32" rx="4" fill="#000"/><text x="24" y="18" textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif"> Pay</text></svg>
                  </div>
                  <div className="w-10 h-7 flex items-center justify-center bg-white rounded shadow-sm">
                    <svg viewBox="0 0 48 32" className="w-8 h-5"><rect width="48" height="32" rx="4" fill="#fff" stroke="#ddd"/><text x="24" y="18" textAnchor="middle" fill="#4285F4" fontSize="7" fontFamily="sans-serif">G Pay</text></svg>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-2 text-center italic">Crypto Payments</p>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-7 h-7">
                    <svg viewBox="0 0 32 32" className="w-full h-full"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path d="M22.5 14.2c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.4-.3l.7-2.6-1.7-.4-.7 2.7c-.3-.1-.7-.2-1-.2l-2.3-.6-.4 1.8s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 0 .1 0 .1 0l-.1 0-1.1 4.5c-.1.2-.3.5-.7.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.2.5c.4.1.8.2 1.2.3l-.7 2.7 1.7.4.7-2.7c.5.1.9.2 1.4.3l-.7 2.7 1.7.4.7-2.7c2.8.5 5 .3 5.9-2.2.7-2-.1-3.2-1.5-3.9 1.1-.2 1.9-1.1 2.1-2.6zm-3.7 5.2c-.5 2-4 .9-5.1.7l.9-3.7c1.1.3 4.7.8 4.2 3zm.5-5.3c-.5 1.8-3.4.9-4.3.7l.8-3.3c1 .2 4 .7 3.5 2.6z" fill="white"/></svg>
                  </div>
                  <div className="w-7 h-7">
                    <svg viewBox="0 0 32 32" className="w-full h-full"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path d="M16.5 4v8.9l7.5 3.3z" fill="#fff" fillOpacity=".6"/><path d="M16.5 4L9 16.2l7.5-3.3z" fill="white"/><path d="M16.5 21.9v6.1l7.5-10.4z" fill="#fff" fillOpacity=".6"/><path d="M16.5 28v-6.1L9 17.6z" fill="white"/><path d="M16.5 20.6l7.5-4.4-7.5-3.3z" fill="#fff" fillOpacity=".2"/><path d="M9 16.2l7.5 4.4v-7.7z" fill="#fff" fillOpacity=".6"/></svg>
                  </div>
                  <div className="w-7 h-7">
                    <svg viewBox="0 0 32 32" className="w-full h-full"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.9 17.9v0c-.1 0-.7.1-2 .1-1 0-1.7-.1-1.9-.1v0c-3.8-.2-6.6-.9-6.6-1.8s2.8-1.6 6.6-1.8v2.9c.3 0 .9.1 2 .1 1.3 0 1.8-.1 1.9-.1v-2.9c3.8.2 6.6.9 6.6 1.8s-2.8 1.6-6.6 1.8zm0-3.9v-2.6h5.3V8h-14.4v3.4h5.3v2.6c-4.3.2-7.5 1.2-7.5 2.3s3.2 2.1 7.5 2.3v8.3h3.8v-8.3c4.3-.2 7.5-1.2 7.5-2.3s-3.2-2.1-7.5-2.3z" fill="white"/></svg>
                  </div>
                  <div className="w-7 h-7">
                    <svg viewBox="0 0 32 32" className="w-full h-full"><circle cx="16" cy="16" r="16" fill="#EF0027"/><path d="M21.9 10.3L9.5 7.7l7 16.8 9.2-10.5-3.8-3.7zm-.4 1.3l2.4 2.3-5.6 6.4-1-7 4.2-1.7zm-5.2 1.2l1 7.2-4.6-11 3.6 3.8z" fill="white"/></svg>
                  </div>
                  <div className="w-7 h-7">
                    <svg viewBox="0 0 32 32" className="w-full h-full"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path d="M12.1 14.3L16 10.4l3.9 3.9 2.3-2.3L16 5.8 9.8 12l2.3 2.3zm-6.3 1.7l2.3-2.3 2.3 2.3-2.3 2.3-2.3-2.3zm6.3 1.7L16 21.6l3.9-3.9 2.3 2.3L16 26.2 9.8 20l2.3-2.3zm8.3-1.7l2.3-2.3 2.3 2.3-2.3 2.3-2.3-2.3zM18.7 16L16 13.3 13.3 16 16 18.7 18.7 16z" fill="white"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white text-gray-900 border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <MapPin className="w-5 h-5 text-blue-600" />
              {c.shippingTitle}
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              {promoApplied?.type === 'free' ? (
                <span className="text-green-600 font-bold">{language === 'en' ? 'FREE' : 'GRATIS'}</span>
              ) : promoApplied?.type === 'discount' ? (
                <span>
                  <span className="line-through text-gray-400 mr-2">€{(price || 495).toFixed(2)}</span>
                  <span className="text-green-600 font-bold">€{getEffectivePrice().toFixed(2)}</span>
                  <span className="text-green-600 text-xs ml-1">(-{promoApplied.discount_percent}%)</span>
                </span>
              ) : (
                <>{paymentMethod === 'card' ? t.esim.payWithCard : t.esim.payWithCrypto} — €{(price || 495).toFixed(2)}</>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <Input className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" placeholder={c.namePlaceholder} value={formData.name} onChange={e => updateField('name', e.target.value)} required />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <Input className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" type="email" placeholder="email@example.com" value={formData.email} onChange={e => updateField('email', e.target.value)} required />
            </div>

            {/* Promo code */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                <Input
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 flex-1"
                  placeholder={language === 'en' ? 'Promo code' : language === 'pt' ? 'Código promocional' : 'Código promocional'}
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                  disabled={!!promoApplied}
                />
                {promoApplied ? (
                  <button onClick={() => { setPromoApplied(null); setPromoCode(''); }} className="text-xs text-red-500 hover:underline shrink-0">
                    {language === 'en' ? 'Remove' : 'Quitar'}
                  </button>
                ) : (
                  <button onClick={handleApplyPromo} disabled={promoLoading || !promoCode.trim()} className="text-xs text-blue-600 hover:underline font-medium shrink-0 disabled:opacity-50">
                    {promoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : (language === 'en' ? 'Apply' : 'Aplicar')}
                  </button>
                )}
              </div>
              {promoError && <p className="text-xs text-red-500 ml-6">{promoError}</p>}
              {promoApplied && (
                <p className="text-xs text-green-600 ml-6 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {promoApplied.type === 'free'
                    ? (language === 'en' ? 'Free token applied!' : '¡Token gratis aplicado!')
                    : (language === 'en' ? `${promoApplied.discount_percent}% discount applied!` : `¡${promoApplied.discount_percent}% de descuento aplicado!`)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <Input className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" placeholder={`${c.phonePlaceholder} (${language === 'en' ? 'optional' : language === 'pt' ? 'opcional' : 'opcional'})`} value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <Input className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" placeholder={c.addressPlaceholder} value={formData.address1} onChange={e => updateField('address1', e.target.value)} required />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 shrink-0" />
                <Input className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" placeholder={`${c.address2Placeholder} (${language === 'en' ? 'optional' : 'opcional'})`} value={formData.address2} onChange={e => updateField('address2', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" placeholder={c.cityPlaceholder} value={formData.city} onChange={e => updateField('city', e.target.value)} required />
                </div>
                <Input className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" placeholder={`${c.statePlaceholder} (${language === 'en' ? 'optional' : 'opcional'})`} value={formData.stateProvince} onChange={e => updateField('stateProvince', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400" placeholder={c.postalPlaceholder} value={formData.postalCode} onChange={e => updateField('postalCode', e.target.value)} required />
                </div>
                <Select value={formData.countryCode} onValueChange={v => updateField('countryCode', v)}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                    <SelectValue placeholder={c.countryPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <ScrollArea className="h-[200px]">
                      {SHIPPING_COUNTRIES.map(country => (
                        <SelectItem key={country.code} value={country.code} className="text-gray-900 focus:bg-gray-100">{country.name}</SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Terms & Conditions checkbox */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="terms" className="text-xs text-gray-700 cursor-pointer flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                {language === 'en' ? 'I accept the terms and conditions of sale' : language === 'pt' ? 'Aceito os termos e condições de venda' : 'Acepto los términos y condiciones de venta'}
              </label>
              <button
                type="button"
                onClick={() => setShowTermsDetail(prev => !prev)}
                className="ml-auto text-blue-600 hover:text-blue-700 text-xs underline shrink-0"
              >
                {showTermsDetail
                  ? (language === 'en' ? 'Hide' : language === 'pt' ? 'Ocultar' : 'Ocultar')
                  : (language === 'en' ? 'Read' : language === 'pt' ? 'Ler' : 'Leer')}
              </button>
            </div>
            {showTermsDetail && (
              <div className="p-3 rounded-lg bg-gray-100 border border-gray-200 text-xs text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-1">
                {language === 'en' ? (
                  <>This product is covered by a manufacturer warranty in accordance with international consumer protection regulations, including the United Nations Convention on Contracts for the International Sale of Goods (CISG), EU Directive 2019/771 on conformity of goods, and applicable local consumer laws. The buyer has the right to a 14-day withdrawal period from the date of delivery (EU Consumer Rights Directive 2011/83/EU). Defective products may be returned or replaced within the warranty period as stipulated by the applicable jurisdiction. All international shipments are subject to customs regulations of the destination country.</>
                ) : language === 'pt' ? (
                  <>Este produto está coberto por garantia do fabricante em conformidade com as regulamentações internacionais de proteção ao consumidor, incluindo a Convenção das Nações Unidas sobre Contratos de Compra e Venda Internacional de Mercadorias (CISG), a Diretiva UE 2019/771 sobre conformidade de bens, e as leis locais de defesa do consumidor aplicáveis. O comprador tem direito a um período de desistência de 14 dias a partir da data de entrega (Diretiva UE 2011/83/UE sobre os Direitos do Consumidor). Produtos defeituosos podem ser devolvidos ou substituídos dentro do período de garantia conforme estipulado pela jurisdição aplicável. Todos os envios internacionais estão sujeitos às regulamentações aduaneiras do país de destino.</>
                ) : (
                  <>Este producto está cubierto por la garantía del fabricante conforme a las normativas internacionales de protección al consumidor, incluyendo la Convención de las Naciones Unidas sobre los Contratos de Compraventa Internacional de Mercaderías (CISG), la Directiva UE 2019/771 sobre conformidad de bienes, y las leyes locales de defensa del consumidor aplicables. El comprador tiene derecho a un período de desistimiento de 14 días desde la fecha de entrega (Directiva UE 2011/83/UE sobre los Derechos del Consumidor). Los productos defectuosos podrán ser devueltos o sustituidos dentro del período de garantía según lo estipulado por la jurisdicción aplicable. Todos los envíos internacionales están sujetos a las regulaciones aduaneras del país de destino.</>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleBuy} disabled={processing || !isFormValid()} className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              {processing && <Loader2 className="w-4 h-4 animate-spin" />}
              {promoApplied?.type === 'free'
                ? (language === 'en' ? 'Confirm free order' : language === 'pt' ? 'Confirmar pedido grátis' : 'Confirmar pedido gratis')
                : c.proceedPayment}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
