import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  RefreshCw,
  Database,
  HardDrive,
  ShieldCheck,
  Wifi,
  CreditCard,
  Bitcoin,
  Mail,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Loader2,
  Send,
} from 'lucide-react';

type CheckStatus = 'ok' | 'slow' | 'error' | 'timeout' | 'loading';

interface HealthResult {
  service: string;
  status: CheckStatus;
  latency: number;
  error?: string;
  detail?: string;
}

const SERVICE_META: Record<string, { label: string; icon: any; group: 'internal' | 'external' }> = {
  database: { label: 'Base de datos', icon: Database, group: 'internal' },
  storage: { label: 'Almacenamiento', icon: HardDrive, group: 'internal' },
  auth: { label: 'Autenticación', icon: ShieldCheck, group: 'internal' },
  esim_access: { label: 'eSIM Access', icon: Wifi, group: 'external' },
  stripe_sandbox: { label: 'Stripe (Sandbox)', icon: CreditCard, group: 'external' },
  stripe_live: { label: 'Stripe (Live)', icon: CreditCard, group: 'external' },
  plisio: { label: 'Plisio', icon: Bitcoin, group: 'external' },
  emails: { label: 'Emails (Lovable)', icon: Mail, group: 'internal' },
  edge_functions: { label: 'Órdenes / Webhooks', icon: Activity, group: 'internal' },
};

function statusBadge(status: CheckStatus) {
  switch (status) {
    case 'ok':
      return { label: 'OK', cls: 'bg-green-500/15 text-green-500 border-green-500/30', Icon: CheckCircle2 };
    case 'slow':
      return { label: 'Lento', cls: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30', Icon: Clock };
    case 'error':
      return { label: 'Error', cls: 'bg-destructive/15 text-destructive border-destructive/30', Icon: XCircle };
    case 'timeout':
      return { label: 'Timeout', cls: 'bg-destructive/15 text-destructive border-destructive/30', Icon: AlertTriangle };
    default:
      return { label: 'Comprobando…', cls: 'bg-muted text-muted-foreground border-border', Icon: Loader2 };
  }
}

function HealthCard({ result }: { result: HealthResult }) {
  const meta = SERVICE_META[result.service] ?? { label: result.service, icon: Database, group: 'internal' as const };
  const Icon = meta.icon;
  const b = statusBadge(result.status);
  const BIcon = b.Icon;
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-md bg-muted">
              <Icon className="h-4 w-4 text-foreground" />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-foreground truncate">{meta.label}</div>
              <div className="text-xs text-muted-foreground truncate">
                {result.status === 'loading' ? 'Comprobando…' : `${result.latency} ms`}
              </div>
            </div>
          </div>
          <Badge variant="outline" className={b.cls}>
            <BIcon className={`h-3 w-3 mr-1 ${result.status === 'loading' ? 'animate-spin' : ''}`} />
            {b.label}
          </Badge>
        </div>
        {(result.detail || result.error) && (
          <p className={`mt-3 text-xs ${result.error ? 'text-destructive' : 'text-muted-foreground'}`}>
            {result.error ?? result.detail}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminSystemHealth() {
  const ALL_SERVICES = Object.keys(SERVICE_META);
  const [results, setResults] = useState<HealthResult[]>(
    ALL_SERVICES.map((s) => ({ service: s, status: 'loading', latency: 0 }))
  );
  const [loading, setLoading] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [maintenance, setMaintenance] = useState(false);
  const [maintLoading, setMaintLoading] = useState(false);

  async function loadMaintenance() {
    const { data } = await supabase
      .from('esim_settings')
      .select('value')
      .eq('key', 'maintenance_mode')
      .maybeSingle();
    setMaintenance(data?.value === 'true');
  }

  async function toggleMaintenance(checked: boolean) {
    setMaintLoading(true);
    const { error } = await supabase
      .from('esim_settings')
      .update({ value: checked ? 'true' : 'false', updated_at: new Date().toISOString() })
      .eq('key', 'maintenance_mode');
    if (error) {
      toast.error('Error: ' + error.message);
    } else {
      setMaintenance(checked);
      toast.success(checked ? 'Modo mantenimiento activado' : 'Modo mantenimiento desactivado');
    }
    setMaintLoading(false);
  }

  async function runChecks() {
    setLoading(true);
    setResults(ALL_SERVICES.map((s) => ({ service: s, status: 'loading', latency: 0 })));
    try {
      const { data, error } = await supabase.functions.invoke('system-health-check');
      if (error) throw error;
      if (data?.results) {
        setResults(data.results);
        setCheckedAt(data.checked_at ?? new Date().toISOString());
      }
    } catch (e: any) {
      toast.error('Error al comprobar: ' + (e?.message ?? e));
      setResults(
        ALL_SERVICES.map((s) => ({
          service: s,
          status: 'error',
          latency: 0,
          error: 'No se pudo ejecutar la comprobación',
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMaintenance();
    runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const internal = results.filter((r) => SERVICE_META[r.service]?.group === 'internal');
  const external = results.filter((r) => SERVICE_META[r.service]?.group === 'external');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Salud del Sistema</h1>
          <p className="text-sm text-muted-foreground">
            {checkedAt
              ? `Última comprobación: ${new Date(checkedAt).toLocaleString()}`
              : 'Comprobando estado de los servicios…'}
          </p>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="bg-green-500/15 text-green-500 border-green-500/30"
            >
              <Send className="h-3 w-3 mr-1" />
              Alertas Telegram: Activas
            </Badge>
            <span className="text-xs text-muted-foreground">
              Chequeo automático cada 5 min
            </span>
          </div>
        </div>
        <Button onClick={runChecks} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Ejecutar comprobación
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servicios internos</CardTitle>
          <CardDescription>Base de datos, almacenamiento y autenticación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {internal.map((r) => (
              <HealthCard key={r.service} result={r} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>APIs externas</CardTitle>
          <CardDescription>Proveedores eSIM, pagos y email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {external.map((r) => (
              <HealthCard key={r.service} result={r} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modo mantenimiento</CardTitle>
          <CardDescription>
            Cuando está activo, el sitio público muestra una pantalla de mantenimiento. Los administradores
            siguen pudiendo acceder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="maintenance" className="text-foreground">
              Activar modo mantenimiento
            </Label>
            <Switch
              id="maintenance"
              checked={maintenance}
              onCheckedChange={toggleMaintenance}
              disabled={maintLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
