import { LayoutDashboard, Users, ShoppingCart, Settings, LogOut, Wifi, TicketCheck, Package, ExternalLink, Activity, Ghost, BarChart3 } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'eSIM', url: '/admin/esim', icon: Wifi },
  { title: 'Pedidos GhostCode', url: '/admin/orders', icon: Package },
  { title: 'Clientes', url: '/admin/clients', icon: Users },
  { title: 'Ventas', url: '/admin/sales', icon: ShoppingCart },
  { title: 'Tickets', url: '/admin/tickets', icon: TicketCheck },
  { title: 'Salud del Sistema', url: '/admin/system-health', icon: Activity },
  { title: 'Configuración', url: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && <span className="text-primary font-bold text-lg">Admin Panel</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
              <a href="https://analytics.rpjsoftware.com" target="_blank" rel="noopener noreferrer">
                <BarChart3 className="mr-2 h-4 w-4" />
                {!collapsed && <span>Analytics RPF SOFTWARE</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
              <a href="https://ghostcodemessenger.com/~entrada" target="_blank" rel="noopener noreferrer">
                <Ghost className="mr-2 h-4 w-4" />
                {!collapsed && <span>GhostCode Admin</span>}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-muted/50">
              <NavLink to="/" className="hover:bg-muted/50">
                <ExternalLink className="mr-2 h-4 w-4" />
                {!collapsed && <span>Ir al sitio</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" />
              {!collapsed && <span>Cerrar sesión</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
