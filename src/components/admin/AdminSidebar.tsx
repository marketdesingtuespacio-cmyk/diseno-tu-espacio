import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingBag, 
  Calendar, 
  Tag, 
  FolderTree, 
  Settings, 
  Store, 
  ChevronRight,
  Users,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 
  | 'overview' 
  | 'products' 
  | 'add-product' 
  | 'orders' 
  | 'appointments' 
  | 'coupons' 
  | 'categories'
  | 'team' 
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  productsCount: number;
  ordersCount: number;
  appointmentsCount: number;
  couponsCount: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  productsCount,
  ordersCount,
  appointmentsCount,
  couponsCount
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Resumen General',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'products' as AdminTab,
      label: 'Catálogo & Productos',
      icon: Package,
      badge: productsCount
    },
    {
      id: 'add-product' as AdminTab,
      label: 'Registrar Producto',
      icon: PlusCircle,
      badge: 'NUEVO',
      highlight: true
    },
    {
      id: 'orders' as AdminTab,
      label: 'Gestión de Pedidos',
      icon: ShoppingBag,
      badge: ordersCount
    },
    {
      id: 'appointments' as AdminTab,
      label: 'Citas & Asesorías',
      icon: Calendar,
      badge: appointmentsCount
    },
    {
      id: 'coupons' as AdminTab,
      label: 'Cupones & Ofertas',
      icon: Tag,
      badge: couponsCount
    },
    ...(user?.role === 'admin' ? [{
      id: 'team' as AdminTab,
      label: 'Equipo & Permisos',
      icon: Users,
      badge: null
    }] : []),
    {
      id: 'categories' as AdminTab,
      label: 'Categorías & Estilos',
      icon: FolderTree,
      badge: null
    },
    ...(user?.role === 'admin' ? [{
      id: 'settings' as AdminTab,
      label: 'Configuración Tienda',
      icon: Settings,
      badge: null
    }] : [])
  ];

  return (
    <aside className="w-64 bg-neutral-950/95 backdrop-blur-2xl text-white flex flex-col h-full border-r border-white/10 shrink-0 font-sans shadow-2xl relative z-20">
      
      {/* Brand Header & Logged-in User Profile Badge */}
      <div className="p-5 border-b border-white/10 space-y-3">
        <Link to="/" className="flex flex-col group">
          <span className="font-bold tracking-[0.2em] text-sm text-white group-hover:text-amber-200 transition-colors uppercase">
            Diseño Tu Espacio
          </span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-light -mt-0.5">
            Back-office Manager
          </span>
        </Link>

        {/* User Profile Glass Badge */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-white truncate max-w-[120px]">{user?.full_name || 'Usuario'}</span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[8px] uppercase font-bold tracking-wider ${
              user?.role === 'admin' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-white/10 text-neutral-300 border border-white/20'
            }`}>
              {user?.role === 'admin' ? '👑 Admin' : '🤝 Colaborador'}
            </span>
          </div>
          <p className="text-[9px] text-neutral-400 font-mono truncate">{user?.email}</p>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
        <span className="px-3 text-[9px] font-bold uppercase tracking-widest text-neutral-500 block mb-2">
          Navegación Principal
        </span>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive 
                  ? 'bg-white text-brand-black font-bold shadow-lg shadow-white/10' 
                  : item.highlight
                    ? 'bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 border border-amber-400/30'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-black' : 'text-neutral-400 group-hover:text-white'}`} />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge !== null && (
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-brand-black text-white' 
                    : item.highlight 
                      ? 'bg-amber-400 text-black font-bold' 
                      : 'bg-white/10 text-neutral-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Return to Store & Logout Link at Bottom */}
      <div className="p-4 border-t border-white/10 bg-neutral-950/80 backdrop-blur-md space-y-2">
        <Link 
          to="/" 
          className="w-full flex items-center justify-between text-xs text-neutral-400 hover:text-white py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span className="uppercase text-[10px] font-bold tracking-wider">Ver Tienda Cliente</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 py-1.5 px-3 uppercase font-bold text-[10px] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
};
