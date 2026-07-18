import { useState, useEffect } from 'react';

import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Package, Eye, Save } from 'lucide-react';
import { toast } from 'sonner';

interface GhostcodeOrder {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state_province: string | null;
  postal_code: string;
  country_code: string;
  country_name: string;
  product: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_method: string;
  payment_status: string;
  payment_reference: string | null;
  stripe_session_id: string | null;
  notes: string | null;
  promo_token: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  paid: 'bg-green-500/15 text-green-400 border-green-500/30',
  shipped: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  delivered: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
  refunded: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<GhostcodeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<GhostcodeOrder | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editRef, setEditRef] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('ghostcode-orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ghostcode_orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('ghostcode_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data as unknown as GhostcodeOrder[]);
    setLoading(false);
  }

  function openDetail(order: GhostcodeOrder) {
    setSelectedOrder(order);
    setEditNotes(order.notes || '');
    setEditStatus(order.payment_status);
    setEditRef(order.payment_reference || '');
  }

  async function handleSave() {
    if (!selectedOrder) return;
    setSaving(true);
    const { error } = await supabase
      .from('ghostcode_orders')
      .update({
        payment_status: editStatus,
        payment_reference: editRef || null,
        notes: editNotes || null,
      } as any)
      .eq('id', selectedOrder.id);
    setSaving(false);
    if (error) {
      toast.error('Error al guardar');
    } else {
      toast.success('Pedido actualizado');
      setSelectedOrder(null);
      fetchOrders();
    }
  }

  const filtered = orders.filter(o => {
    const matchSearch = !search || 
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.payment_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Pedidos GhostCode</h1>
          <Badge variant="secondary" className="ml-auto">{orders.length} pedidos</Badge>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nº pedido, email o nombre..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="paid">Pagado</SelectItem>
              <SelectItem value="shipped">Enviado</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="refunded">Reembolsado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Cargando...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No hay pedidos</TableCell></TableRow>
              ) : filtered.map(order => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/30" onClick={() => openDetail(order)}>
                  <TableCell className="font-mono text-xs">{order.order_number}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                  </TableCell>
                  <TableCell className="text-sm">{order.country_name}</TableCell>
                  <TableCell className="font-semibold">€{Number(order.total_price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{order.payment_method === 'card' ? 'Tarjeta' : order.payment_method === 'token' ? 'Token' : 'Crypto'}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{order.promo_token || '—'}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs border ${STATUS_COLORS[order.payment_status] || ''}`}>{order.payment_status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell><Eye className="w-4 h-4 text-muted-foreground" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={!!selectedOrder} onOpenChange={open => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Pedido {selectedOrder.order_number}
                </DialogTitle>
                <DialogDescription>{new Date(selectedOrder.created_at).toLocaleString()}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Cliente</h3>
                  <p>{selectedOrder.customer_name}</p>
                  <p className="text-muted-foreground">{selectedOrder.customer_email}</p>
                  {selectedOrder.phone && <p className="text-muted-foreground">{selectedOrder.phone}</p>}
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Dirección de envío</h3>
                  <p>{selectedOrder.address_line1}</p>
                  {selectedOrder.address_line2 && <p>{selectedOrder.address_line2}</p>}
                  <p>{selectedOrder.postal_code} {selectedOrder.city}{selectedOrder.state_province ? `, ${selectedOrder.state_province}` : ''}</p>
                  <p>{selectedOrder.country_name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Producto</span>
                  <span>GhostCode S10 x{selectedOrder.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold">€{Number(selectedOrder.total_price).toFixed(2)}</span>
                </div>
                {selectedOrder.promo_token && (
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">Token usado</span>
                    <Badge variant="secondary" className="font-mono">{selectedOrder.promo_token}</Badge>
                  </div>
                )}
                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="text-xs font-medium text-muted-foreground">Estado de pago</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="paid">Pagado</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="refunded">Reembolsado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Referencia de pago</label>
                  <Input value={editRef} onChange={e => setEditRef(e.target.value)} placeholder="ID de transacción, referencia..." />
                </div>
                {selectedOrder.stripe_session_id && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Stripe Session</label>
                    <p className="font-mono text-xs break-all text-muted-foreground">{selectedOrder.stripe_session_id}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Notas internas</label>
                  <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Notas sobre este pedido..." rows={3} />
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
