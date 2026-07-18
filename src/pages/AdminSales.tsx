import { useEffect, useState } from 'react';

import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown, Mail, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import logoIntersofti from '@/assets/logo-intersofti-full.png';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  user_id: string | null;
  customer_email: string | null;
  package_name: string | null;
  package_code: string;
  price: number;
  status: string;
  created_at: string;
  order_no: string | null;
  iccid: string | null;
  qr_code_url: string | null;
  activation_code: string | null;
  transaction_id: string | null;
}

const ACTIVE_STATUSES = ['completed', 'active', 'paid', 'provisioned'];
const ABANDONED_STATUSES = ['pending', 'pending_crypto', 'pending crypto'];

function classifyOrder(status: string): 'active' | 'abandoned' | 'failed' {
  if (ACTIVE_STATUSES.includes(status)) return 'active';
  if (ABANDONED_STATUSES.includes(status)) return 'abandoned';
  return 'failed';
}

function statusVariant(status: string) {
  if (status === 'completed' || status === 'active') return 'default' as const;
  if (status === 'pending' || status === 'paid' || status === 'provisioned') return 'secondary' as const;
  return 'destructive' as const;
}

function getInvoiceNo(o: Order) {
  return o.order_no || o.id.slice(0, 8).toUpperCase();
}

// Cache the logo as data URL once
let logoDataUrlPromise: Promise<string> | null = null;
function loadLogoDataUrl(): Promise<string> {
  if (!logoDataUrlPromise) {
    logoDataUrlPromise = fetch(logoIntersofti)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );
  }
  return logoDataUrlPromise;
}

async function buildInvoiceDoc(o: Order): Promise<jsPDF> {
  const salePrice = o.price;
  const invoiceNo = getInvoiceNo(o);
  const date = new Date(o.created_at).toLocaleDateString();

  const doc = new jsPDF();

  // Logo - keep real aspect ratio
  try {
    const logo = await loadLogoDataUrl();
    const props = doc.getImageProperties(logo);
    const targetWidth = 45;
    const targetHeight = (props.height * targetWidth) / props.width;
    doc.addImage(logo, 'PNG', 20, 12, targetWidth, targetHeight);
  } catch (e) {
    // ignore if logo fails
  }

  doc.setFontSize(20);
  doc.text('FACTURA', 190, 25, { align: 'right' });

  doc.setFontSize(11);
  doc.text(`Nº Factura: ${invoiceNo}`, 20, 50);
  doc.text(`Fecha: ${date}`, 20, 58);
  doc.text(`Cliente: ${o.customer_email || '—'}`, 20, 66);
  doc.text(`Estado: ${o.status}`, 20, 74);

  doc.line(20, 82, 190, 82);
  doc.setFont('helvetica', 'bold');
  doc.text('Concepto', 20, 90);
  doc.text('Importe', 170, 90, { align: 'right' });
  doc.line(20, 93, 190, 93);
  doc.setFont('helvetica', 'normal');

  doc.text(o.package_name || o.package_code, 20, 102);
  doc.text(`$${salePrice.toFixed(2)}`, 170, 102, { align: 'right' });

  doc.line(20, 110, 190, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL', 20, 120);
  doc.text(`$${salePrice.toFixed(2)} USD`, 170, 120, { align: 'right' });

  // eSIM details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Datos de la eSIM', 20, 145);
  doc.line(20, 148, 190, 148);

  // Embed QR code image (physical QR, not URL)
  let qrBottomY = 148;
  if (o.qr_code_url) {
    try {
      const qrResp = await fetch(o.qr_code_url);
      const qrBlob = await qrResp.blob();
      const qrDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(qrBlob);
      });
      const fmt = qrDataUrl.includes('image/jpeg') ? 'JPEG' : 'PNG';
      const qrSize = 45;
      doc.addImage(qrDataUrl, fmt, 145, 152, qrSize, qrSize);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text('Escanea para activar', 167.5, 202, { align: 'center' });
      doc.setTextColor(0);
      qrBottomY = 202;
    } catch (e) {
      // fallback: ignore QR if it can't be fetched
    }
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let y = 156;
  const row = (label: string, value: string | null | undefined, maxWidth = 65) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    const text = value && value.trim() ? value : '—';
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, 75, y);
    y += 6 * Math.max(1, lines.length);
  };
  row('Plan:', o.package_name || o.package_code);
  row('Código plan:', o.package_code);
  row('Nº Pedido:', o.order_no);
  row('Transaction ID:', o.transaction_id);
  row('ICCID:', o.iccid);

  // Activation code (full LPA string) — give it full width below the QR area
  if (y < qrBottomY + 6) y = qrBottomY + 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Código de activación (LPA):', 20, y);
  y += 6;
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  const acText = o.activation_code && o.activation_code.trim() ? o.activation_code : '—';
  const acLines = doc.splitTextToSize(acText, 170);
  doc.text(acLines, 20, y);
  y += 5 * acLines.length;

  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text('Gracias por su compra. — INTERSOFTI', 20, 285);

  return doc;
}

async function downloadInvoice(o: Order) {
  const doc = await buildInvoiceDoc(o);
  doc.save(`factura-${getInvoiceNo(o)}.pdf`);
}

async function uploadInvoicePdf(o: Order): Promise<string> {
  const doc = await buildInvoiceDoc(o);
  const blob = doc.output('blob');
  const path = `invoices/${o.id}/factura-${getInvoiceNo(o)}.pdf`;
  const { error } = await supabase.storage
    .from('assets')
    .upload(path, blob, { contentType: 'application/pdf', upsert: true });
  if (error) throw error;
  // Signed URL (10 years) — invoices are no longer publicly readable via RLS.
  const { data, error: signErr } = await supabase.storage
    .from('assets')
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !data?.signedUrl) throw signErr ?? new Error('Failed to sign invoice URL');
  return data.signedUrl;
}

function OrderTable({
  orders,
  markup,
  showInvoice,
  sentMap,
  sendingId,
  onSend,
}: {
  orders: Order[];
  markup: number;
  showInvoice?: boolean;
  sentMap?: Record<string, boolean>;
  sendingId?: string | null;
  onSend?: (o: Order) => void;
}) {
  if (orders.length === 0) {
    return <p className="text-muted-foreground text-center py-12">No hay ventas en esta categoría.</p>;
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Pedido</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Coste</TableHead>
            <TableHead>Venta</TableHead>
            <TableHead>Beneficio</TableHead>
            <TableHead>Estado</TableHead>
            {showInvoice && <TableHead>Factura</TableHead>}
            {showInvoice && <TableHead>Envío</TableHead>}
            {showInvoice && <TableHead>Acción</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => {
            const salePrice = o.price;
            const costPrice = markup > 0 ? salePrice / (1 + markup / 100) : salePrice;
            const profit = salePrice - costPrice;
            const sent = sentMap?.[o.id] ?? false;
            const sending = sendingId === o.id;

            return (
              <TableRow key={o.id}>
                <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
                <TableCell className="font-mono text-sm">{o.order_no || o.id.slice(0, 8)}</TableCell>
                <TableCell className="text-sm">{o.customer_email || '—'}</TableCell>
                <TableCell>{o.package_name || o.package_code}</TableCell>
                <TableCell>${costPrice.toFixed(2)}</TableCell>
                <TableCell>${salePrice.toFixed(2)}</TableCell>
                <TableCell className="text-green-400">${profit.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                </TableCell>
                {showInvoice && (
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => downloadInvoice(o)}>
                      <FileDown className="w-4 h-4 mr-1" /> PDF
                    </Button>
                  </TableCell>
                )}
                {showInvoice && (
                  <TableCell>
                    {sent ? (
                      <Badge variant="default" className="gap-1">
                        <Check className="w-3 h-3" /> Enviada
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No enviada</Badge>
                    )}
                  </TableCell>
                )}
                {showInvoice && (
                  <TableCell>
                    <Button
                      size="sm"
                      variant={sent ? 'outline' : 'default'}
                      disabled={sending || !o.customer_email}
                      onClick={() => onSend?.(o)}
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 mr-1" />
                      )}
                      {sent ? 'Reenviar' : 'Enviar'}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminSales() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [markup, setMarkup] = useState(0);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});
  const [sendingId, setSendingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [ordersRes, markupRes] = await Promise.all([
        supabase
          .from('esim_orders')
          .select('id, user_id, customer_email, package_name, package_code, price, status, created_at, order_no, iccid, qr_code_url, activation_code, transaction_id')
          .order('created_at', { ascending: false })
          .limit(200),
        supabase
          .from('esim_settings')
          .select('value')
          .eq('key', 'markup_percentage')
          .maybeSingle(),
      ]);
      if (ordersRes.data) {
        setOrders(ordersRes.data);
        // Look up which invoices were already sent via email_send_log metadata
        const ids = ordersRes.data.map((o) => o.id);
        if (ids.length) {
          const { data: logs } = await supabase
            .from('email_send_log')
            .select('metadata, status')
            .eq('template_name', 'invoice-delivery')
            .eq('status', 'sent');
          const map: Record<string, boolean> = {};
          (logs || []).forEach((l: any) => {
            const oid = l?.metadata?.order_id;
            if (oid && ids.includes(oid)) map[oid] = true;
          });
          setSentMap(map);
        }
      }
      if (markupRes.data) setMarkup(parseFloat(markupRes.data.value) || 0);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSendInvoice(o: Order) {
    if (!o.customer_email) {
      toast({ title: 'Sin email', description: 'Este pedido no tiene email de cliente.', variant: 'destructive' });
      return;
    }
    setSendingId(o.id);
    try {
      const invoiceNo = getInvoiceNo(o);
      const invoiceUrl = await uploadInvoicePdf(o);
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'invoice-delivery',
          recipientEmail: o.customer_email,
          idempotencyKey: `invoice-${o.id}-${Date.now()}`,
          templateData: {
            invoiceNo,
            date: new Date(o.created_at).toLocaleDateString(),
            customerEmail: o.customer_email,
            packageName: o.package_name || o.package_code,
            packageCode: o.package_code,
            amount: o.price.toFixed(2),
            status: o.status,
            orderNo: o.order_no,
            transactionId: o.transaction_id,
            iccid: o.iccid,
            activationCode: o.activation_code,
            qrCodeUrl: o.qr_code_url,
            invoiceUrl,
          },
          metadata: { order_id: o.id },
        },
      });
      if (error) throw error;
      setSentMap((prev) => ({ ...prev, [o.id]: true }));
      toast({ title: 'Factura enviada', description: `Enviada a ${o.customer_email}` });
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudo enviar la factura', variant: 'destructive' });
    } finally {
      setSendingId(null);
    }
  }

  const activeOrders = orders.filter(o => classifyOrder(o.status) === 'active');
  const abandonedOrders = orders.filter(o => classifyOrder(o.status) === 'abandoned');
  const failedOrders = orders.filter(o => classifyOrder(o.status) === 'failed');

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Últimas Ventas</h1>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Activadas ({activeOrders.length})</TabsTrigger>
            <TabsTrigger value="abandoned">Abandonadas ({abandonedOrders.length})</TabsTrigger>
            <TabsTrigger value="failed">Fallidas ({failedOrders.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <OrderTable
              orders={activeOrders}
              markup={markup}
              showInvoice
              sentMap={sentMap}
              sendingId={sendingId}
              onSend={handleSendInvoice}
            />
          </TabsContent>
          <TabsContent value="abandoned">
            <OrderTable orders={abandonedOrders} markup={markup} />
          </TabsContent>
          <TabsContent value="failed">
            <OrderTable orders={failedOrders} markup={markup} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
