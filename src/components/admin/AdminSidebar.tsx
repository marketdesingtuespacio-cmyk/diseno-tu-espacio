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
    {
      id: 'team' as AdminTab,
      label: 'Equipo & Permisos',
      icon: Users,
      badge: null
    },
    {
      id: 'categories' as AdminTab,
      label: 'Categorías & Estilos',
      icon: FolderTree,
      badge: null
    },
    {
      id: 'settings' as AdminTab,
      label: 'Configuración Tienda',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-brand-black text-white flex flex-col h-full border-r border-brand-charcoal shrink-0 font-sans">
      
      {/* Brand Header & Logged-in User Profile Badge */}
      <div className="p-5 border-b border-neutral-800 space-y-3">
        <Link to="/" className="flex flex-col group">
          <span className="font-bold tracking-[0.2em] text-sm text-white group-hover:opacity-80 transition-opacity uppercase">
            Diseño Tu Espacio
          </span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-neutral-400 font-light -mt-0.5">
            Back-office Manager
          </span>
        </Link>

        {/* User Badge */}
        <div className="bg-neutral-900 border border-neutral-800 p-2.5 space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-white truncate max-w-[120px]">{user?.full_name || 'Usuario'}</span>
            <span className={`px-1.5 py-0.2 font-mono text-[8px] uppercase font-bold ${
              user?.role === 'admin' ? 'bg-emerald-800 text-white' : 'bg-neutral-700 text-neutral-200'
            }`}>
              {user?.role === 'admin' ? '👑 Admin' : '🤝 Colaborador'}
            </span>
          </div>
          <p className="text-[9px] text-neutral-400 font-mono truncate">{user?.email}</p>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
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
              className={`w-full flex items-center justify-between px-3 py-3 text-xs font-medium transition-all group ${
                isActive 
                  ? 'bg-white text-brand-black font-bold shadow-subtle' 
                  : item.highlight
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-700'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-black' : 'text-neutral-400 group-hover:text-white'}`} />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge !== null && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 ${
                  isActive 
                    ? 'bg-brand-black text-white' 
                    : item.highlight 
                      ? 'bg-emerald-700 text-white font-bold' 
                      : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Return to Store & Logout Link at Bottom */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-2">
        <Link 
          to="/" 
          className="w-full flex items-center justify-between text-xs text-neutral-400 hover:text-white py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            <span className="uppercase text-[10px] font-bold tracking-wider">Ver Tienda Cliente</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 py-1.5 px-3 uppercase font-bold text-[10px]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
};
