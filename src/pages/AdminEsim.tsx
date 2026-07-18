import { useEffect, useState, useMemo } from 'react';

import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Wifi, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LocationNetwork {
  locationName?: string;
  locationCode?: string;
}

interface EsimPackage {
  packageCode: string;
  name: string;
  price: number;
  currencyCode: string;
  volume: number;
  duration: number;
  location: string;
  locationCode: string;
  speed: string;
  locationNetworkList?: LocationNetwork[];
}

type Tab = 'global' | 'europe' | 'all';

function formatData(bytes: number): string {
  if (bytes <= 0) return 'Unlimited';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb % 1 === 0 ? gb : gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${Math.round(mb)} MB`;
}

export default function AdminEsim() {
  const [packages, setPackages] = useState<EsimPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [markup, setMarkup] = useState(0);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('all');

  useEffect(() => {
    supabase
      .from('esim_settings')
      .select('value')
      .eq('key', 'markup_percentage')
      .maybeSingle()
      .then(({ data }) => {
        if (data) setMarkup(parseFloat(data.value) || 0);
      });
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [activeTab]);

  async function fetchPackages() {
    setLoading(true);
    try {
      const body: Record<string, unknown> = { action: 'list_packages' };
      if (activeTab === 'global') body.locationCode = '!GL';
      else if (activeTab === 'europe') body.locationCode = '!RG';

      const { data, error } = await supabase.functions.invoke('esim-api', { body });
      if (error) throw error;
      setPackages(data?.obj?.packageList || []);
    } catch {
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return packages;
    const q = search.toLowerCase();
    return packages.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.locationCode?.toLowerCase().includes(q) ||
        p.packageCode?.toLowerCase().includes(q)
    );
  }, [packages, search]);

  const totalProviderCost = filtered.reduce((s, p) => s + p.price / 10000, 0);
  const totalSalePrice = filtered.reduce((s, p) => s + (p.price / 10000) * (1 + markup / 100), 0);
  const totalProfit = totalSalePrice - totalProviderCost;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'global', label: 'Global' },
    { key: 'europe', label: 'Europa' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-6">eSIM Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Total Planes</p>
          <p className="text-2xl font-bold text-foreground">{filtered.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Coste Proveedor</p>
          <p className="text-2xl font-bold text-foreground">${totalProviderCost.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Precio Venta Total</p>
          <p className="text-2xl font-bold text-foreground">${totalSalePrice.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground">Beneficio Total ({markup}%)</p>
          <p className="text-2xl font-bold text-foreground">${totalProfit.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <Button key={tab.key} variant={activeTab === tab.key ? 'default' : 'outline'} size="sm" onClick={() => { setActiveTab(tab.key); setSearch(''); }}>
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre, país, código..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No se encontraron planes.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-auto">Plan</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap">Ubicación</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap">Datos</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap">Duración</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">Coste</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">Venta</TableHead>
                  <TableHead className="w-[1%] whitespace-nowrap text-right">Beneficio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((pkg) => {
                  const cost = pkg.price / 10000;
                  const sale = cost * (1 + markup / 100);
                  const profit = sale - cost;
                  return (
                    <TableRow key={pkg.packageCode}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground text-sm">{pkg.name}</p>
                            <p className="text-xs text-muted-foreground">{pkg.packageCode}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-pointer">
                              <Globe className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                              <span className="text-sm text-muted-foreground">{pkg.locationCode}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs max-h-64 overflow-y-auto">
                            <p className="font-semibold text-xs mb-2">{pkg.location || pkg.locationCode}</p>
                            {pkg.locationNetworkList && pkg.locationNetworkList.length > 0 && (
                              <>
                                <p className="text-xs text-muted-foreground mb-1">{pkg.locationNetworkList.length} países</p>
                                <div className="flex flex-wrap gap-1">
                                  {pkg.locationNetworkList.map((loc, i) => (
                                    <span key={i} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                                      {loc.locationName || loc.locationCode}
                                    </span>
                                  ))}
                                </div>
                              </>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{pkg.volume <= 0 ? 'Unlimited' : formatData(pkg.volume)}</TableCell>
                      <TableCell>{pkg.duration} días</TableCell>
                      <TableCell className="text-right font-mono">${cost.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono font-medium">${sale.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">${profit.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
