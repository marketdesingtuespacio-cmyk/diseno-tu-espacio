import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Calendar, 
  Tag, 
  FolderTree, 
  Settings, 
  Store, 
  ChevronRight,
  Users,
  LogOut,
  Sparkle
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
      badge: productsCount,
      subItems: [
        { id: 'products' as AdminTab, label: 'Lista de Inventario' },
        { id: 'add-product' as AdminTab, label: 'Alta Nuevo Producto ✨' }
      ]
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
      label: 'Configuración Global',
      icon: Settings,
      badge: null
    }] : [])
  ];

  return (
    <aside className="my-4 ml-4 w-64 bg-white/90 backdrop-blur-2xl text-neutral-900 rounded-[28px] border border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.04)] flex flex-col h-[calc(100vh-2rem)] shrink-0 font-sans p-4 justify-between overflow-hidden relative z-20">
      
      {/* Top Header: Sparkle Icon + Title (Ref Image Style) */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-neutral-900 text-white rounded-xl shadow-xs">
              <Sparkle className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-neutral-900 tracking-tight">
                Diseño Tu Espacio
              </h2>
              <p className="text-[9.5px] uppercase font-bold tracking-widest text-neutral-400">
                Back-office Manager
              </p>
            </div>
          </div>
        </div>

        {/* Logged in User Profile Card */}
        <div className="bg-neutral-100/70 border border-neutral-200/60 rounded-2xl p-3 space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-neutral-900 truncate max-w-[120px]">{user?.full_name || 'Usuario'}</span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[8px] uppercase font-bold tracking-wider ${
              user?.role === 'admin' ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-700'
            }`}>
              {user?.role === 'admin' ? '👑 Admin' : '🤝 Colaborador'}
            </span>
          </div>
          <p className="text-[9px] text-neutral-500 font-mono truncate">{user?.email}</p>
        </div>

        {/* Main Navigation List */}
        <div className="space-y-1 max-h-[58vh] overflow-y-auto pr-0.5">
          <span className="px-2 text-[9px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
            Navegación Principal
          </span>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.subItems && item.subItems.some(sub => sub.id === activeTab));

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#18181B] text-white font-semibold shadow-lg shadow-black/10 scale-[1.01]' 
                      : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                    <span className="tracking-tight text-xs font-semibold">{item.label}</span>
                  </div>

                  {item.badge !== null && (
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold font-mono ${
                      isActive 
                        ? 'bg-white text-black' 
                        : 'bg-neutral-200/80 text-neutral-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Sub-items nesting (Ref Image Vertical Guide Line Style) */}
                {item.subItems && isActive && (
                  <div className="border-l-2 border-neutral-200/80 ml-5 pl-3 space-y-1 my-1">
                    {item.subItems.map(sub => {
                      const isSubActive = activeTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveTab(sub.id)}
                          className={`w-full text-left py-1.5 px-3 rounded-full text-[11px] font-medium transition-all ${
                            isSubActive 
                              ? 'bg-white text-neutral-900 font-bold shadow-xs border border-neutral-200/80' 
                              : 'text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-3 border-t border-neutral-100">
        <Link 
          to="/" 
          className="w-full flex items-center justify-between text-xs text-neutral-700 hover:text-black py-2.5 px-3.5 rounded-2xl bg-neutral-100/70 hover:bg-neutral-100 border border-neutral-200/60 transition-all font-semibold"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-neutral-700" />
            <span className="text-[11px] font-semibold">Ver Tienda Cliente</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        </Link>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 text-xs text-red-500 hover:text-red-700 py-2 px-3.5 rounded-2xl hover:bg-red-50 font-bold text-[11px] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
};
