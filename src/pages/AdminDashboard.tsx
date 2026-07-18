import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/integrations/supabase/client';
import { Users, ShoppingCart, DollarSign, TrendingUp, Wallet, RefreshCw } from 'lucide-react';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

interface Balance {
  amount: number;
  currency: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, pendingOrders: 0, completedOrders: 0 });
  const [balance, setBalance] = useState<Balance | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  const loadBalance = useCallback(async () => {
    setBalanceLoading(true);
    setBalanceError(null);
    try {
      const { data, error } = await supabase.functions.invoke('esim-api', {
        body: { action: 'get_balance' },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.errorMsg || 'API error');
      const d = data.obj || data.data || {};
      const rawAmount = d.balance ?? d.amount ?? 0;
      // eSIM Access returns balance in cents (×10000 for some accounts). Heuristic: if very large, assume cents.
      const amount = typeof rawAmount === 'number' ? (rawAmount > 100000 ? rawAmount / 10000 : rawAmount) : Number(rawAmount) || 0;
      setBalance({ amount, currency: d.currency || 'USD' });
    } catch (e) {
      console.error('Balance fetch error:', e);
      setBalanceError('No se pudo obtener el saldo');
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  useEffect(() => {
    async function loadStats() {
      const { data: orders } = await supabase.from('esim_orders').select('price, status');
      if (orders) {
        setStats({
          totalOrders: orders.length,
          totalRevenue: orders.reduce((s, o) => s + Number(o.price), 0),
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          completedOrders: orders.filter(o => o.status === 'completed').length,
        });
      }
    }
    loadStats();
    loadBalance();
  }, [loadBalance]);

  const cards = [
    { label: 'Total Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Ingresos', value: `$${(stats.totalRevenue / 10000).toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Pendientes', value: stats.pendingOrders, icon: TrendingUp, color: 'text-yellow-500' },
    { label: 'Completados', value: stats.completedOrders, icon: Users, color: 'text-emerald-500' },
  ];

  const balanceColor = balance
    ? balance.amount < 10
      ? 'text-red-500'
      : balance.amount < 50
        ? 'text-yellow-500'
        : 'text-green-500'
    : 'text-foreground';

  const formattedBalance = balance
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: balance.currency || 'USD' }).format(balance.amount)
    : '—';

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo eSIM Access</p>
              <p className="text-xs text-muted-foreground/70">Cuenta del administrador</p>
            </div>
          </div>
          <button
            onClick={loadBalance}
            disabled={balanceLoading}
            className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            aria-label="Refrescar saldo"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${balanceLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {balanceLoading ? (
          <div className="h-9 w-40 bg-muted animate-pulse rounded" />
        ) : balanceError ? (
          <p className="text-sm text-destructive">{balanceError}</p>
        ) : (
          <p className={`text-3xl font-bold ${balanceColor}`}>
            {formattedBalance} <span className="text-base font-medium text-muted-foreground">{balance?.currency}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
