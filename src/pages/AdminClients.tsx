import { useEffect, useState } from 'react';

import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

interface Client {
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: orders } = await supabase.from('esim_orders').select('customer_email, price, created_at, status').in('status', ['completed', 'active', 'paid', 'provisioned']);
      if (orders) {
        const map = new Map<string, { orders: number; totalSpent: number; lastOrder: string }>();
        orders.forEach((o) => {
          const email = o.customer_email || 'unknown';
          const existing = map.get(email);
          if (existing) {
            existing.orders++;
            existing.totalSpent += Number(o.price);
            if (o.created_at > existing.lastOrder) existing.lastOrder = o.created_at;
          } else {
            map.set(email, { orders: 1, totalSpent: Number(o.price), lastOrder: o.created_at });
          }
        });
        setClients(
          Array.from(map.entries()).map(([email, data]) => ({
            email,
            ...data,
          }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Clientes</h1>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : clients.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No hay clientes registrados aún.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Último Pedido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.email}>
                  <TableCell className="text-sm">{c.email}</TableCell>
                  <TableCell>{c.orders}</TableCell>
                  <TableCell>${(c.totalSpent / 10000).toFixed(2)}</TableCell>
                  <TableCell>{new Date(c.lastOrder).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
