import { useEffect, useState } from 'react';

import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Search, Ticket, Eye } from 'lucide-react';

interface SupportTicket {
  id: string;
  ticket_number: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  open: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  in_progress: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  closed: 'bg-muted text-muted-foreground border-border',
};

const statusLabels: Record<string, string> = {
  open: 'Abierto',
  in_progress: 'En progreso',
  resolved: 'Resuelto',
  closed: 'Cerrado',
};

const categoryLabels: Record<string, string> = {
  technical: 'Técnico',
  commercial: 'Comercial',
  general: 'General',
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    setLoading(true);
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    setTickets((data as SupportTicket[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(true);
    await supabase.from('support_tickets').update({ status }).eq('id', id);
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
    setUpdating(false);
  }

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.ticket_number.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-6">Tickets de Soporte</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`bg-card border rounded-xl p-4 text-left transition-colors ${
                filterStatus === key ? 'border-primary' : 'border-border'
              }`}
            >
              <p className="text-sm text-muted-foreground">
                {key === 'all' ? 'Todos' : statusLabels[key]}
              </p>
              <p className="text-2xl font-bold text-foreground">{counts[key]}</p>
            </button>
          ))}
        </div>
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por ticket, nombre, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No se encontraron tickets.</p>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[1%] whitespace-nowrap">Ticket</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead className="w-[1%] whitespace-nowrap">Categoría</TableHead>
                    <TableHead className="w-[1%] whitespace-nowrap">Estado</TableHead>
                    <TableHead className="w-[1%] whitespace-nowrap">Fecha</TableHead>
                    <TableHead className="w-[1%] whitespace-nowrap">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="font-mono text-xs">{t.ticket_number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground text-sm">{t.subject}</p>
                          <p className="text-xs text-muted-foreground">{t.name} · {t.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{categoryLabels[t.category] || t.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[t.status] || ''}`}>
                          {statusLabels[t.status] || t.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => setSelected(t)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              {selected?.ticket_number}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nombre</p>
                  <p className="font-medium text-foreground">{selected.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{selected.email}</p>
                </div>
                {selected.phone && (
                  <div>
                    <p className="text-muted-foreground">Teléfono</p>
                    <p className="font-medium text-foreground">{selected.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Categoría</p>
                  <Badge variant="outline">{categoryLabels[selected.category] || selected.category}</Badge>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Asunto</p>
                <p className="font-medium text-foreground">{selected.subject}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Mensaje</p>
                <p className="text-foreground text-sm bg-muted/50 rounded-lg p-3 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">Cambiar estado</p>
                <Select value={selected.status} onValueChange={(val) => updateStatus(selected.id, val)} disabled={updating}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Abierto</SelectItem>
                    <SelectItem value="in_progress">En progreso</SelectItem>
                    <SelectItem value="resolved">Resuelto</SelectItem>
                    <SelectItem value="closed">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
