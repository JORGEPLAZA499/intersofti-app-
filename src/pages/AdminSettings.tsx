import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Copy, Ticket } from 'lucide-react';

interface PromoToken {
  id: string;
  token_code: string;
  type: string;
  discount_percent: number;
  uses_count: number;
  active: boolean;
  created_at: string;
  first_used_at: string | null;
}

export default function AdminSettings() {
  const [markup, setMarkup] = useState('30');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [maintenance, setMaintenance] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);
  const [maintenanceSaving, setMaintenanceSaving] = useState(false);

  const [s10Price, setS10Price] = useState('495');
  const [s10Saving, setS10Saving] = useState(false);
  const [s10Loading, setS10Loading] = useState(true);

  // Promo tokens
  const [tokens, setTokens] = useState<PromoToken[]>([]);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [tokenType, setTokenType] = useState<'discount' | 'free'>('discount');
  const [tokenDiscount, setTokenDiscount] = useState('20');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      const [markupRes, maintRes, s10Res] = await Promise.all([
        supabase.from('esim_settings').select('value').eq('key', 'markup_percentage').maybeSingle(),
        supabase.from('esim_settings').select('value').eq('key', 'maintenance_mode').maybeSingle(),
        supabase.from('esim_settings').select('value').eq('key', 'ghostcode_s10_price').maybeSingle(),
      ]);
      if (markupRes.data) setMarkup(markupRes.data.value);
      if (maintRes.data) setMaintenance(maintRes.data.value === 'true');
      if (s10Res.data) setS10Price(s10Res.data.value);
      setLoading(false);
      setMaintenanceLoading(false);
      setS10Loading(false);
    }
    load();
    fetchTokens();
  }, []);

  async function fetchTokens() {
    const { data } = await supabase
      .from('promo_tokens')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setTokens(data as unknown as PromoToken[]);
    setTokensLoading(false);
  }

  async function handleSave() {
    const val = parseFloat(markup);
    if (isNaN(val) || val < 0) {
      toast.error('Introduce un porcentaje válido (0 o mayor)');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('esim_settings')
        .update({ value: String(val) })
        .eq('key', 'markup_percentage');
      if (error) throw error;
      toast.success('Markup actualizado correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleMaintenanceToggle(checked: boolean) {
    setMaintenanceSaving(true);
    try {
      const { error } = await supabase
        .from('esim_settings')
        .update({ value: checked ? 'true' : 'false' })
        .eq('key', 'maintenance_mode');
      if (error) throw error;
      setMaintenance(checked);
      toast.success(checked ? 'Modo mantenimiento activado' : 'Modo mantenimiento desactivado');
    } catch (err: any) {
      toast.error(err.message || 'Error al cambiar modo mantenimiento');
    } finally {
      setMaintenanceSaving(false);
    }
  }

  async function handleSaveS10Price() {
    const val = parseFloat(s10Price);
    if (isNaN(val) || val < 0) {
      toast.error('Introduce un precio válido (0 o mayor)');
      return;
    }
    setS10Saving(true);
    try {
      const { error } = await supabase
        .from('esim_settings')
        .update({ value: String(val) })
        .eq('key', 'ghostcode_s10_price');
      if (error) throw error;
      toast.success('Precio del GhostCode S10 actualizado');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setS10Saving(false);
    }
  }

  function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return `GIFT-${code}`;
  }

  async function handleGenerateToken() {
    if (tokenType === 'discount') {
      const pct = parseInt(tokenDiscount);
      if (isNaN(pct) || pct < 1 || pct > 100) {
        toast.error('El descuento debe ser entre 1 y 100');
        return;
      }
    }
    setGenerating(true);
    try {
      const code = generateCode();
      const { error } = await supabase.from('promo_tokens').insert({
        token_code: code,
        type: tokenType,
        discount_percent: tokenType === 'discount' ? parseInt(tokenDiscount) : 0,
      } as any);
      if (error) throw error;
      toast.success(`Token generado: ${code}`);
      fetchTokens();
    } catch (err: any) {
      toast.error(err.message || 'Error al generar token');
    } finally {
      setGenerating(false);
    }
  }

  async function toggleTokenActive(id: string, active: boolean) {
    const { error } = await supabase
      .from('promo_tokens')
      .update({ active: !active } as any)
      .eq('id', id);
    if (error) {
      toast.error('Error al actualizar token');
    } else {
      fetchTokens();
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Configuración</h1>
      <div className="max-w-lg space-y-6">
        {/* Maintenance Mode */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Modo Mantenimiento</h2>
              <p className="text-sm text-muted-foreground">
                Cuando está activo, los usuarios ven una página de mantenimiento. Tú puedes seguir trabajando desde Lovable.
              </p>
            </div>
            {maintenanceLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <Switch
                checked={maintenance}
                onCheckedChange={handleMaintenanceToggle}
                disabled={maintenanceSaving}
              />
            )}
          </div>
        </div>

        {/* Markup */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Markup de Precios eSIM</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Porcentaje de margen aplicado sobre el precio del proveedor. Ejemplo: 30 = los clientes pagan 30% más.
            </p>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <div className="flex gap-3 items-center">
                <Input type="number" min="0" step="1" value={markup} onChange={e => setMarkup(e.target.value)} className="w-32" />
                <span className="text-muted-foreground font-medium">%</span>
              </div>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Guardar
          </Button>
        </div>

        {/* S10 Price */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Precio GhostCode S10</h2>
            <p className="text-sm text-muted-foreground mb-4">Precio de venta del GhostCode S10 en EUR.</p>
            {s10Loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : (
              <div className="flex gap-3 items-center">
                <Input type="number" min="0" step="0.01" value={s10Price} onChange={e => setS10Price(e.target.value)} className="w-40" />
                <span className="text-muted-foreground font-medium">€</span>
              </div>
            )}
          </div>
          <Button onClick={handleSaveS10Price} disabled={s10Saving || s10Loading}>
            {s10Saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Guardar
          </Button>
        </div>

        {/* Promo Tokens */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              Tokens Promocionales
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Genera códigos de descuento o gratuitos para el GhostCode S10.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Tipo</label>
              <Select value={tokenType} onValueChange={(v: 'discount' | 'free') => setTokenType(v)}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Descuento %</SelectItem>
                  <SelectItem value="free">Gratis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {tokenType === 'discount' && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Descuento</label>
                <div className="flex gap-1 items-center">
                  <Input type="number" min="1" max="100" value={tokenDiscount} onChange={e => setTokenDiscount(e.target.value)} className="w-20" />
                  <span className="text-muted-foreground text-sm">%</span>
                </div>
              </div>
            )}
            <Button onClick={handleGenerateToken} disabled={generating}>
              {generating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Generar Token
            </Button>
          </div>

          {/* Tokens list */}
          {tokensLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : tokens.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay tokens creados.</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead>Activado</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map(tk => (
                    <TableRow key={tk.id}>
                      <TableCell>
                        <button onClick={() => copyCode(tk.token_code)} className="flex items-center gap-1.5 font-mono text-sm hover:text-primary transition-colors">
                          {tk.token_code}
                          <Copy className="w-3 h-3" />
                        </button>
                      </TableCell>
                      <TableCell>
                        {tk.type === 'free' ? (
                          <Badge variant="default" className="text-xs">Gratis</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">-{tk.discount_percent}%</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{tk.uses_count}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(tk.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {tk.first_used_at
                          ? new Date(tk.first_used_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={tk.active}
                          onCheckedChange={() => toggleTokenActive(tk.id, tk.active)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
