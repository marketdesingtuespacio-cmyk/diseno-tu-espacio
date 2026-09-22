import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  PlusCircle,
  LayoutGrid,
  List,
  Download,
  X,
  CheckCircle2
} from 'lucide-react';
import { Product, Appointment, Order, Coupon, UserProfile } from '../types';
import { productService, subscribeToProducts } from '../services/productService';
import { appointmentService } from '../services/appointmentService';
import { orderService, subscribeToOrders } from '../services/orderService';
import { couponService } from '../services/couponService';
import { authService } from '../services/authService';
import { useCurrency } from '../context/CurrencyContext';
import { checkSupabaseHealth } from '../lib/supabase';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { ProductRegistrationForm } from '../components/admin/ProductRegistrationForm';
import { TeamManagementView } from '../components/admin/TeamManagementView';
import { OrderRegistrationModal } from '../components/admin/OrderRegistrationModal';
import { OrderKanbanBoard } from '../components/admin/OrderKanbanBoard';
import { OrderEditModal } from '../components/admin/OrderEditModal';
import { OrderFilterBar, OrderFilterState } from '../components/admin/OrderFilterBar';
import { ProductFilterBar, ProductFilterState } from '../components/admin/ProductFilterBar';
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard';
import { AuditLogsView } from '../components/admin/AuditLogsView';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Filters & Views inside Admin
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderViewMode, setOrderViewMode] = useState<'kanban' | 'table'>('kanban');

  // Smart Product Filters State
  const initialProductFilters: ProductFilterState = {
    searchQuery: '',
    category: 'all',
    inventoryStatus: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: ''
  };
  const [productFilters, setProductFilters] = useState<ProductFilterState>(initialProductFilters);

  // Smart Order Filters State
  const initialOrderFilters: OrderFilterState = {
    searchQuery: '',
    status: 'all',
    carrier: 'all',
    paymentGateway: 'all',
    customerTag: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: ''
  };
  const [orderFilters, setOrderFilters] = useState<OrderFilterState>(initialOrderFilters);

  // Manual Order Registration Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Full Order Editing State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrderFull, setEditingOrderFull] = useState<Order | null>(null);

  // New Coupon Form State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    min_purchase: 500000,
    expiry_date: '2026-12-31',
    is_active: true
  });

  // Manual Appointment Booking State
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    service_type: 'Asesoría Lumínica & Geometría de Luz',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00 AM',
    price: 600000,
    notes: ''
  });

  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<{ isConnected: boolean; message: string }>({
    isConnected: false,
    message: 'Comprobando conexión con Supabase...'
  });

  const { formatPrice } = useCurrency();

  const loadData = async () => {
    const [pList, aList, oList, cList, sHealth, tList] = await Promise.all([
      productService.getProducts(undefined, true),
      appointmentService.getAppointments(),
      orderService.getOrders(),
      couponService.getCoupons(),
      checkSupabaseHealth(),
      authService.getTeamMembers()
    ]);
    setProducts(pList);
    setAppointments(aList);
    setOrders(oList);
    setCoupons(cList);
    setSupabaseStatus(sHealth);
    setTeamMembers(tList);
  };

  useEffect(() => {
    loadData();

    const unsubProds = subscribeToProducts(() => {
      loadData();
    });
    const unsubOrders = subscribeToOrders(() => {
      loadData();
    });

    // Auto-sync polling every 10 seconds across all devices/computers
    const syncInterval = setInterval(() => {
      loadData();
    }, 10000);

    return () => {
      unsubProds();
      unsubOrders();
      clearInterval(syncInterval);
    };
  }, []);

  // Server Action Confirmation Pop-up State
  const [actionNotification, setActionNotification] = useState<{ title: string; message: string } | null>(null);

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este producto del inventario?')) {
      await productService.deleteProduct(id);
      await loadData();
      setActionNotification({
        title: '¡Producto Eliminado!',
        message: 'El producto ha sido eliminado exitosamente del inventario y sincronizado en el servidor.'
      });
    }
  };

  // Single Product Status Change
  const handleSingleProductStatusChange = async (product: Product, newStatus: Product['inventory_status']) => {
    await productService.updateProduct(product.id, { inventory_status: newStatus });
    if (product.slug) {
      await productService.updateProduct(product.slug, { inventory_status: newStatus });
    }
    await loadData();
    setActionNotification({
      title: '¡Estado Guardado en Servidor!',
      message: `El producto "${product.name}" (SKU: ${product.sku || product.id}) fue actualizado a "${newStatus}" exitosamente.`
    });
  };

  // Bulk Selection & Bulk Operations State
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Bulk Change Status
  const handleBulkChangeStatus = async (newStatus: Product['inventory_status']) => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    if (!confirm(`¿Confirmar cambio de estado a "${newStatus}" para los ${count} productos seleccionados?`)) return;

    for (const id of selectedProductIds) {
      const targetProd = products.find(p => p.id === id);
      await productService.updateProduct(id, { inventory_status: newStatus });
      if (targetProd && targetProd.slug) {
        await productService.updateProduct(targetProd.slug, { inventory_status: newStatus });
      }
    }
    setSelectedProductIds([]);
    await loadData();
    setActionNotification({
      title: '¡Cambios Sincronizados con Éxito!',
      message: `Se actualizó el estado a "${newStatus}" para los ${count} productos seleccionados en el servidor y base de datos.`
    });
  };

  // Bulk Change Category
  const handleBulkChangeCategory = async (newCategory: string) => {
    if (selectedProductIds.length === 0 || !newCategory) return;
    const count = selectedProductIds.length;
    if (!confirm(`¿Confirmar asignación de categoría "${newCategory}" a los ${count} productos seleccionados?`)) return;

    for (const id of selectedProductIds) {
      await productService.updateProduct(id, { category: newCategory });
    }
    setSelectedProductIds([]);
    await loadData();
    setActionNotification({
      title: '¡Categorías Actualizadas!',
      message: `Se asignó la categoría "${newCategory}" a los ${count} productos seleccionados exitosamente en el servidor.`
    });
  };

  // Bulk Delete Products
  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    const count = selectedProductIds.length;
    if (!confirm(`¿Está seguro de eliminar los ${count} productos seleccionados? Esta acción es irreversible.`)) return;

    for (const id of selectedProductIds) {
      await productService.deleteProduct(id);
    }
    setSelectedProductIds([]);
    await loadData();
    setActionNotification({
      title: '¡Eliminación Masiva Exitosa!',
      message: `Se eliminaron ${count} productos correctamente del catálogo y servidor.`
    });
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    await orderService.updateOrderStatus(id, status);
    loadData();
  };

  // Delete Single Order
  const handleDeleteOrder = async (id: string) => {
    await orderService.deleteOrder(id);
    await loadData();
    setActionNotification({
      title: '¡Pedido Eliminado!',
      message: 'El pedido fue eliminado exitosamente del sistema.'
    });
  };

  // Delete All Cancelled Orders
  const handleDeleteCancelledOrders = async () => {
    const cancelled = orders.filter(o => o.status === 'cancelled');
    if (cancelled.length === 0) {
      return alert('No hay pedidos en estado Cancelado para eliminar.');
    }
    if (confirm(`¿Está seguro de eliminar los ${cancelled.length} pedidos en estado Cancelado?`)) {
      for (const ord of cancelled) {
        await orderService.deleteOrder(ord.id);
      }
      await loadData();
      setActionNotification({
        title: '¡Pedidos Cancelados Eliminados!',
        message: `Se eliminaron ${cancelled.length} pedidos cancelados correctamente.`
      });
    }
  };



  // Update Appointment Status
  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await appointmentService.updateAppointmentStatus(id, status);
    loadData();
  };

  // Create Manual Appointment
  const handleCreateManualAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.customer_name.trim()) return alert('Ingrese el nombre del cliente.');
    if (!appointmentForm.customer_phone.trim()) return alert('Ingrese el teléfono de contacto.');

    await appointmentService.createAppointment({
      customer_name: appointmentForm.customer_name.trim(),
      customer_email: appointmentForm.customer_email.trim() || 'cliente@diseñotuespacio.com',
      customer_phone: appointmentForm.customer_phone.trim(),
      service_type: appointmentForm.service_type,
      appointment_date: appointmentForm.appointment_date,
      appointment_time: appointmentForm.appointment_time,
      status: 'confirmed',
      payment_status: 'paid',
      price: Number(appointmentForm.price),
      notes: appointmentForm.notes.trim(),
      created_at: new Date().toISOString()
    });

    setIsAppointmentModalOpen(false);
    setAppointmentForm({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      service_type: 'Asesoría Lumínica & Geometría de Luz',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '10:00 AM',
      price: 600000,
      notes: ''
    });
    loadData();
  };

  // Toggle Coupon Active State
  const handleToggleCoupon = async (id: string) => {
    await couponService.toggleCouponActive(id);
    loadData();
  };

  // Save New Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return alert('Ingrese un código de cupón.');
    await couponService.createCoupon(couponForm);
    setIsCouponModalOpen(false);
    setCouponForm({
      code: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_purchase: 500000,
      expiry_date: '2026-12-31',
      is_active: true
    });
    loadData();
  };

  // Filtered Lists & Categories
  const productCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const filteredProducts = products.filter(p => {
    // 1. Search Query
    if (productFilters.searchQuery.trim()) {
      const q = productFilters.searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = (p.sku || '').toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchStyle = p.style.toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchMat = (p.materials || '').toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchCat && !matchStyle && !matchDesc && !matchMat) {
        return false;
      }
    }

    // 2. Category Filter
    if (productFilters.category !== 'all' && p.category !== productFilters.category) {
      return false;
    }

    // 3. Inventory Status Filter (Privado, Disponible, Poco Stock, Agotado)
    if (productFilters.inventoryStatus !== 'all') {
      const status = p.inventory_status || 'Disponible';
      if (productFilters.inventoryStatus === 'Privado') {
        if (status !== 'Privado') return false;
      } else if (productFilters.inventoryStatus === 'Agotado') {
        if (p.stock > 0 && status !== 'Agotado') return false;
      } else if (productFilters.inventoryStatus === 'Poco Stock') {
        if (p.stock <= 0 || p.stock > 3) return false;
      } else if (productFilters.inventoryStatus === 'Disponible') {
        if (p.stock <= 3 || status === 'Agotado' || status === 'Privado') return false;
      }
    }

    // 4. Date Range Filter (Fecha de Ingreso)
    if (productFilters.dateRange !== 'all') {
      const dateStr = (p.created_at || '').split(' ')[0];
      if (dateStr) {
        const now = new Date();

        if (productFilters.dateRange === 'today') {
          const todayStr = new Date().toISOString().split('T')[0];
          if (!dateStr.startsWith(todayStr)) return false;
        } else if (productFilters.dateRange === '7days') {
          const past = new Date();
          past.setDate(now.getDate() - 7);
          if (new Date(dateStr) < past) return false;
        } else if (productFilters.dateRange === '30days') {
          const past = new Date();
          past.setDate(now.getDate() - 30);
          if (new Date(dateStr) < past) return false;
        } else if (productFilters.dateRange === 'custom') {
          if (productFilters.startDate && dateStr < productFilters.startDate) return false;
          if (productFilters.endDate && dateStr > productFilters.endDate) return false;
        }
      }
    }

    return true;
  });

  const filteredOrders = orders.filter(o => {
    // 1. Free text search
    if (orderFilters.searchQuery.trim()) {
      const q = orderFilters.searchQuery.toLowerCase().trim();
      const matchRef = o.order_ref.toLowerCase().includes(q);
      const matchName = o.customer_name.toLowerCase().includes(q);
      const matchEmail = (o.customer_email || '').toLowerCase().includes(q);
      const matchPhone = (o.customer_phone || '').toLowerCase().includes(q);
      const matchCarrier = (o.carrier || '').toLowerCase().includes(q);
      const matchTracking = (o.tracking_number || '').toLowerCase().includes(q);
      if (!matchRef && !matchName && !matchEmail && !matchPhone && !matchCarrier && !matchTracking) {
        return false;
      }
    }

    // 2. Status Filter
    if (orderFilters.status !== 'all' && o.status !== orderFilters.status) {
      return false;
    }

    // 3. Carrier Filter
    if (orderFilters.carrier !== 'all') {
      if (orderFilters.carrier === 'Flete Privado Luxe') {
        if (!o.carrier || (!o.carrier.includes('Flete Privado') && o.carrier !== 'Flete Privado Luxe')) return false;
      } else if (o.carrier !== orderFilters.carrier) {
        return false;
      }
    }

    // 4. Payment Gateway Filter
    if (orderFilters.paymentGateway !== 'all') {
      if (orderFilters.paymentGateway === 'Transferencia Directa Bancaria') {
        if (!o.payment_gateway?.includes('Transferencia') && !o.payment_gateway?.includes('Bancaria')) return false;
      } else if (o.payment_gateway !== orderFilters.paymentGateway) {
        return false;
      }
    }

    // 5. Customer Tag Filter
    if (orderFilters.customerTag !== 'all' && o.customer_tag !== orderFilters.customerTag) {
      return false;
    }

    // 6. Date Range Filter
    if (orderFilters.dateRange !== 'all') {
      const orderDateStr = o.created_at.split(' ')[0];
      const now = new Date();

      if (orderFilters.dateRange === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (!orderDateStr.startsWith(todayStr)) return false;
      } else if (orderFilters.dateRange === '7days') {
        const past = new Date();
        past.setDate(now.getDate() - 7);
        if (new Date(orderDateStr) < past) return false;
      } else if (orderFilters.dateRange === '30days') {
        const past = new Date();
        past.setDate(now.getDate() - 30);
        if (new Date(orderDateStr) < past) return false;
      } else if (orderFilters.dateRange === 'custom') {
        if (orderFilters.startDate && orderDateStr < orderFilters.startDate) return false;
        if (orderFilters.endDate && orderDateStr > orderFilters.endDate) return false;
      }
    }

    return true;
  });

  const filteredOrdersTotalCOP = filteredOrders.reduce((acc, o) => acc + o.total, 0);

  const handleExportInventoryCSV = () => {
    const csvRows = [
      ['ID', 'SKU', 'Nombre', 'Categoria', 'Estilo', 'Precio Venta (COP)', 'Precio Oferta (COP)', 'Stock Total', 'Stock Bodega', 'Stock Tienda', 'Stock Web', 'Cajas', 'Garantia', 'Estado', 'Dimensiones', 'Materiales'],
      ...products.map(p => [
        p.id,
        `"${p.sku || ''}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        `"${p.style}"`,
        p.price,
        p.original_price || '',
        p.stock,
        p.warehouse_stock || 0,
        p.store_stock || 0,
        p.web_stock || 0,
        p.boxes_count || 0,
        `"${p.warranty || ''}"`,
        `"${p.inventory_status || 'Disponible'}"`,
        `"${(p.dimensions || '').replace(/"/g, '""')}"`,
        `"${(p.materials || '').replace(/"/g, '""')}"`
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventario_completo_disenotuespacio_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSyncAllSupabase = async () => {
    setActionNotification({
      title: 'Sincronizando con Supabase Nube...',
      message: 'Enviando todos los productos con sus SKUs, existencias por ubicación y garantías a la base de datos Supabase.'
    });
    const res = await productService.syncAllToSupabase();
    await loadData();
    setActionNotification({
      title: '¡Sincronización Total Exitosa!',
      message: res.message
    });
  };

  return (
    <div className="flex h-screen bg-[#ECECED] overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'add-product') setEditingProduct(null);
          setActiveTab(tab);
        }}
        productsCount={products.length}
        ordersCount={orders.length}
        appointmentsCount={appointments.length}
        couponsCount={coupons.length}
      />

      {/* RIGHT MAIN WORKSPACE AREA */}
      <main className="my-6 px-6 lg:px-[100px] flex-1 overflow-y-auto space-y-6 pb-20">
        
        {/* Top Action Bar (Reference Style Header) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/90 backdrop-blur-2xl border border-white/90 p-4 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">Panel Activo:</span>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              {activeTab === 'overview' && 'Resumen General & Analíticas'}
              {activeTab === 'products' && 'Inventario & Catálogo Oficial'}
              {activeTab === 'add-product' && 'Alta & Registro de Producto'}
              {activeTab === 'orders' && 'Pedidos, Kanban & Facturación'}
              {activeTab === 'appointments' && 'Citas de Interiorismo & Asesoría'}
              {activeTab === 'coupons' && 'Cupones & Descuentos'}
              {activeTab === 'team' && 'Gestión de Equipo & Permisos'}
              {activeTab === 'categories' && 'Categorías & Estilos'}
              {activeTab === 'settings' && 'Configuración Global'}
            </span>

            {/* Supabase Realtime Health Pill */}
            <span 
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                supabaseStatus.isConnected 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`} 
              title={supabaseStatus.message}
            >
              <span className={`w-2 h-2 rounded-full ${supabaseStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {supabaseStatus.isConnected ? 'Nube Supabase Activa' : 'Persistencia Local Resguardada'}
            </span>
          </div>

          <button 
            onClick={loadData}
            className="text-xs font-bold uppercase tracking-wider border border-neutral-200 bg-white hover:bg-neutral-50 rounded-full px-4.5 py-2 flex items-center gap-2 text-neutral-800 shadow-2xs transition-all shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-900" /> Actualizar Datos
          </button>
        </div>

        {/* TAB 1: OVERVIEW ANALYTICS (Multi-Role Analytics & Seller Productivity) */}
        {activeTab === 'overview' && (
          <AnalyticsDashboard 
            orders={orders} 
            products={products} 
            appointments={appointments} 
            teamMembers={teamMembers}
          />
        )}

        {/* TAB 2: PRODUCTS LIST & INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-md border border-white/90 p-5 rounded-2xl shadow-xs gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">
                  Gestión de Inventario & Catálogo Oficial
                </h3>
                <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                  Visualiza el desglose de existencias por bodega, tienda y web, filtra por estados y exporta reportes en tiempo real.
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleSyncAllSupabase}
                  className="bg-sky-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-sky-700 shadow-sm transition-all flex items-center gap-2 shrink-0"
                  title="Forzar actualización completa de SKU, existencias por ubicación y garantías en Supabase Nube"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sincronizar Supabase</span>
                </button>

                <button
                  onClick={handleExportInventoryCSV}
                  className="bg-[#C6F432] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-[#b5e028] shadow-sm transition-all flex items-center gap-2 shrink-0"
                  title="Exportar inventario completo con todas las casillas a CSV"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Exportar Inventario</span>
                </button>

                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setActiveTab('add-product');
                  }}
                  className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2.5 px-5 rounded-xl hover:bg-neutral-800 flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-amber-300" /> Registrar Producto
                </button>
              </div>
            </div>

            {/* Smart Product Filters */}
            <ProductFilterBar 
              filters={productFilters}
              onFilterChange={setProductFilters}
              onResetFilters={() => setProductFilters(initialProductFilters)}
              filteredCount={filteredProducts.length}
              totalCount={products.length}
              categories={productCategories}
            />

            {/* Sticky Bulk Action Toolbar */}
            {selectedProductIds.length > 0 && (
              <div className="bg-neutral-900 text-white p-4 rounded-xl shadow-elevated flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-neutral-800 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <span className="bg-[#C6F432] text-black text-xs font-extrabold px-3 py-1 rounded-full font-mono">
                    {selectedProductIds.length} seleccionados
                  </span>
                  <span className="text-xs text-neutral-300 font-medium">
                    Edición en Bloque (Acciones Masivas para Productos Seleccionados):
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Bulk Status Dropdown */}
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkChangeStatus(e.target.value as Product['inventory_status']);
                        e.target.value = '';
                      }
                    }}
                    className="bg-neutral-800 text-white text-xs border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                  >
                    <option value="">Cambiar Estado en Bloque...</option>
                    <option value="Disponible">✅ Disponible</option>
                    <option value="Privado">🔒 Privado</option>
                    <option value="Agotado">❌ Agotado</option>
                    <option value="Poco Stock">⚠️ Por Agotarse</option>
                  </select>

                  {/* Bulk Category Dropdown */}
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkChangeCategory(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-neutral-800 text-white text-xs border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                  >
                    <option value="">Cambiar Categoría en Bloque...</option>
                    {productCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* Bulk Delete Button */}
                  <button 
                    onClick={handleBulkDelete}
                    className="bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold py-2 px-3.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar ({selectedProductIds.length})
                  </button>

                  {/* Clear Selection */}
                  <button 
                    onClick={() => setSelectedProductIds([])}
                    className="text-neutral-400 hover:text-white text-xs underline px-2"
                  >
                    Desmarcar
                  </button>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-white border border-brand-border overflow-x-auto rounded-xl shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-surface uppercase text-[10px] tracking-widest text-neutral-500 border-b">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                        onChange={() => {
                          if (selectedProductIds.length === filteredProducts.length) {
                            setSelectedProductIds([]);
                          } else {
                            setSelectedProductIds(filteredProducts.map(p => p.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-neutral-300 accent-black cursor-pointer"
                        title="Seleccionar / Desmarcar Todos los Productos Visibles"
                      />
                    </th>
                    <th className="p-3">Foto</th>
                    <th className="p-3">Referencia / SKU</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Precio (COP)</th>
                    <th className="p-3">Stock & Ubicaciones</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Garantía</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-neutral-400 font-medium">
                        No se encontraron productos que coincidan con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const isPrivado = p.inventory_status === 'Privado';
                      const isAgotado = p.stock <= 0 || p.inventory_status === 'Agotado';
                      const isPocoStock = !isAgotado && !isPrivado && p.stock <= 3;
                      const isSelected = selectedProductIds.includes(p.id);

                      return (
                        <tr key={p.id} className={`transition-colors ${isSelected ? 'bg-amber-50/70 hover:bg-amber-100/60' : 'hover:bg-brand-surface/50'}`}>
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                if (isSelected) {
                                  setSelectedProductIds(selectedProductIds.filter(id => id !== p.id));
                                } else {
                                  setSelectedProductIds([...selectedProductIds, p.id]);
                                }
                              }}
                              className="w-4 h-4 rounded border-neutral-300 accent-black cursor-pointer"
                            />
                          </td>
                          <td className="p-3">
                            <img src={p.images[0]} alt="" className="w-10 h-12 object-cover border bg-brand-surface rounded-md shadow-2xs" />
                          </td>
                          <td className="p-3 font-medium">
                            <div className="font-bold text-brand-black">{p.name}</div>
                            {p.sku && (
                              <div className="text-[10px] text-neutral-500 font-mono font-bold">SKU: {p.sku}</div>
                            )}
                            {(p.updated_at || p.created_at) && (
                              <div className="text-[9.5px] text-indigo-700 font-medium mt-0.5 flex flex-col gap-0.5">
                                <span>{p.updated_at ? 'Última mod:' : 'Ingreso:'} {(() => {
                                  try {
                                    const d = new Date((p.updated_at || p.created_at)!);
                                    if (isNaN(d.getTime())) return p.updated_at || p.created_at;
                                    return d.toLocaleString('es-CO', {
                                      timeZone: 'America/Bogota',
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                      hour12: true
                                    });
                                  } catch {
                                    return p.updated_at || p.created_at;
                                  }
                                })()}</span>
                                {p.updated_by && <span className="text-neutral-500 font-normal">Por: {p.updated_by}</span>}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-neutral-500 font-medium">{p.category}</td>
                          <td className="p-3 font-bold">
                            <div>{formatPrice(p.price)}</div>
                            {p.original_price && p.original_price > p.price && (
                              <div className="text-[10px] text-neutral-400 line-through">{formatPrice(p.original_price)}</div>
                            )}
                            {p.wholesale_price && p.wholesale_price > 0 && (
                              <div className="text-[10px] text-emerald-700 font-semibold tracking-tight mt-0.5">
                                Mayor: {formatPrice(p.wholesale_price)} ({p.wholesale_min_qty || 5}+ u/cajas)
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 font-bold rounded-md text-[11px] ${
                              isAgotado ? 'bg-red-100 text-red-800' :
                              isPocoStock ? 'bg-amber-100 text-amber-900 font-extrabold' :
                              'bg-neutral-100 text-brand-black'
                            }`}>
                              {p.stock} u. total
                            </span>
                            {(p.warehouse_stock || p.store_stock || p.web_stock) ? (
                              <div className="text-[9px] text-neutral-500 mt-1 font-mono">
                                Bodega: {p.warehouse_stock || 0} | Tienda: {p.store_stock || 0} | Web: {p.web_stock || 0}
                              </div>
                            ) : null}
                          </td>
                          <td className="p-3">
                            <select
                              value={p.inventory_status || (isAgotado ? 'Agotado' : 'Disponible')}
                              onChange={async (e) => {
                                const newStatus = e.target.value as Product['inventory_status'];
                                await handleSingleProductStatusChange(p, newStatus);
                              }}
                              className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border focus:outline-none cursor-pointer transition-all ${
                                isPrivado ? 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100' :
                                isAgotado ? 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100' :
                                isPocoStock ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 font-extrabold' :
                                'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              }`}
                              title="Haz clic para cambiar el estado de este producto en el servidor"
                            >
                              <option value="Disponible">✅ Disponible</option>
                              <option value="Privado">🔒 Privado</option>
                              <option value="Agotado">❌ Agotado</option>
                              <option value="Poco Stock">⚠️ Por Agotarse</option>
                            </select>
                          </td>
                          <td className="p-3 text-neutral-600 font-medium">
                            {p.warranty || '3 años'}
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setEditingProduct(p);
                                setActiveTab('add-product');
                              }}
                              className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTER NEW PRODUCT / EDIT PRODUCT */}
        {activeTab === 'add-product' && (
          <ProductRegistrationForm 
            initialProduct={editingProduct}
            onSuccess={() => {
              setEditingProduct(null);
              setActiveTab('products');
              loadData();
            }}
          />
        )}

        {/* TAB 4: ORDERS & KANBAN MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-md border border-white/90 p-5 rounded-2xl shadow-xs gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">
                  Gestión Posventa, Kanban & Facturación
                </h3>
                <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                  Administra las etapas de producción, guías de despacho, tags de cliente y envía actualizaciones posventa por WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {/* View Switcher Toggle */}
                <div className="flex border border-neutral-200 bg-neutral-100/80 p-1 rounded-xl">
                  <button 
                    onClick={() => setOrderViewMode('kanban')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                      orderViewMode === 'kanban' ? 'bg-brand-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Pipeline Kanban
                  </button>
                  <button 
                    onClick={() => setOrderViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 ${
                      orderViewMode === 'table' ? 'bg-brand-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" /> Tabla Lista
                  </button>
                </div>

                {orders.some(o => o.status === 'cancelled') && (
                  <button 
                    onClick={handleDeleteCancelledOrders}
                    className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-red-100 flex items-center gap-1.5 transition-all"
                    title="Eliminar todos los pedidos en estado Cancelado"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Limpiar Cancelados
                  </button>
                )}

                <button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2.5 px-5 rounded-xl hover:bg-neutral-800 flex items-center gap-2 shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-amber-300" /> Registrar Pedido
                </button>
              </div>
            </div>

            {/* Smart Filters Bar */}
            <OrderFilterBar
              filters={orderFilters}
              onFilterChange={setOrderFilters}
              onResetFilters={() => setOrderFilters(initialOrderFilters)}
              filteredCount={filteredOrders.length}
              totalCount={orders.length}
              filteredTotalCOP={filteredOrdersTotalCOP}
            />

            {/* Render Kanban or Table */}
            {orderViewMode === 'kanban' ? (
              <OrderKanbanBoard 
                orders={filteredOrders} 
                onOrderUpdated={loadData}
                onEditOrder={(order) => {
                  setEditingOrderFull(order);
                  setIsEditModalOpen(true);
                }}
                onDeleteOrder={handleDeleteOrder}
              />
            ) : (
              <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 uppercase font-bold text-neutral-500 text-[10px]">
                      <th className="p-3.5">Ref / Fecha</th>
                      <th className="p-3.5">Cliente</th>
                      <th className="p-3.5">Transportadora / Guía</th>
                      <th className="p-3.5">Estado</th>
                      <th className="p-3.5 font-bold text-right">Total</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="p-3.5 font-bold">
                          <span className="text-neutral-900 block font-extrabold">{o.order_ref}</span>
                          <span className="text-[10px] text-neutral-400 font-normal">{o.created_at}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-neutral-900 block">{o.customer_name}</span>
                          <div className="text-[10px] text-neutral-400">{o.customer_email} • {o.customer_phone}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="font-medium text-neutral-900 block">{o.carrier || 'Flete Privado'}</span>
                          <div className="text-neutral-400 text-[10px]">{o.tracking_number ? `Guía: ${o.tracking_number}` : 'Sin guía'}</div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase border ${
                            o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            o.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            o.status === 'processing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-neutral-100 text-neutral-700 border-neutral-200'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3.5 font-extrabold text-right text-neutral-900">
                          {formatPrice(o.total)}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingOrderFull(o);
                              setIsEditModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-black hover:text-white text-brand-black font-bold text-[10px] uppercase rounded-lg transition-colors border inline-flex items-center gap-1"
                          >
                            Editar <Edit3 className="w-3 h-3" />
                          </button>
                          <select 
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                            className="bg-brand-surface border border-brand-border py-1 px-2 text-xs font-bold focus:outline-none rounded-lg"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="processing">Procesando</option>
                            <option value="shipped">Despachado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                          <button
                            onClick={() => {
                              if (confirm(`¿Está seguro de eliminar el pedido ${o.order_ref}?`)) {
                                handleDeleteOrder(o.id);
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-lg transition-colors border border-red-200 inline-flex items-center"
                            title="Eliminar pedido"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border border-brand-border">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Citas de Interiorismo & Asesoría Lumínica</h3>
                <p className="text-[11px] text-neutral-500 font-light">Consulta las solicitudes del sitio web o programa manualmente una cita de asesoría con un cliente.</p>
              </div>

              <button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2.5 px-6 hover:bg-neutral-800 flex items-center gap-2 shadow-subtle shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" /> Agendar Nueva Cita
              </button>
            </div>

            <div className="bg-white border border-brand-border overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-surface uppercase text-[10px] tracking-widest text-neutral-500 border-b">
                <tr>
                  <th className="p-3.5">Fecha & Hora</th>
                  <th className="p-3.5">Cliente</th>
                  <th className="p-3.5">Servicio Solicatado</th>
                  <th className="p-3.5">Pago</th>
                  <th className="p-3.5">Estado Cita</th>
                  <th className="p-3.5 text-right">Gestión</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map(a => (
                  <tr key={a.id} className="hover:bg-brand-surface/50">
                    <td className="p-3.5 font-bold">{a.appointment_date} <span className="font-normal text-neutral-500">a las {a.appointment_time}</span></td>
                    <td className="p-3.5">
                      <div className="font-bold">{a.customer_name}</div>
                      <div className="text-[10px] text-neutral-400">{a.customer_email} • {a.customer_phone}</div>
                    </td>
                    <td className="p-3.5 text-neutral-600">{a.service_type}</td>
                    <td className="p-3.5 font-bold text-emerald-700">{formatPrice(a.price)}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold ${
                        a.status === 'confirmed' ? 'bg-black text-white' : 'bg-neutral-200 text-black'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button 
                        onClick={() => handleUpdateAppointmentStatus(a.id, 'completed')}
                        className="px-2.5 py-1 bg-emerald-800 text-white text-[10px] font-bold uppercase"
                      >
                        Completar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {/* TAB 6: COUPONS & PROMOTIONS MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border border-brand-border">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Gestión de Cupones de Descuento</h3>
                <p className="text-[11px] text-neutral-500 font-light">Crea códigos promocionales para incentivar las ventas en la tienda.</p>
              </div>

              <button 
                onClick={() => setIsCouponModalOpen(true)}
                className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2.5 px-6 hover:bg-neutral-800 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Crear Nuevo Cupón
              </button>
            </div>

            <div className="bg-white border border-brand-border overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-surface uppercase text-[10px] tracking-widest text-neutral-500 border-b">
                  <tr>
                    <th className="p-3.5">Código Cupón</th>
                    <th className="p-3.5">Descuento</th>
                    <th className="p-3.5">Compra Mínima</th>
                    <th className="p-3.5">Vencimiento</th>
                    <th className="p-3.5">Usos</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {coupons.map(c => (
                    <tr key={c.id} className="hover:bg-brand-surface/50">
                      <td className="p-3.5 font-mono font-bold text-brand-black bg-brand-surface w-fit">{c.code}</td>
                      <td className="p-3.5 font-bold text-emerald-700">
                        {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : formatPrice(c.discount_value)}
                      </td>
                      <td className="p-3.5 text-neutral-600">{formatPrice(c.min_purchase)}</td>
                      <td className="p-3.5 text-neutral-500">{c.expiry_date}</td>
                      <td className="p-3.5 font-mono">{c.usage_count} usos</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold ${
                          c.is_active ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-500'
                        }`}>
                          {c.is_active ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button 
                          onClick={() => handleToggleCoupon(c.id)}
                          className="text-xs font-bold underline hover:text-red-600"
                        >
                          {c.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Create Coupon Modal */}
            {isCouponModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white max-w-md w-full p-6 border border-brand-black shadow-modal space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-2">
                    Crear Nuevo Cupón Promocional
                  </h3>

                  <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                    <div>
                      <label className="block uppercase font-bold text-neutral-500 mb-1">Código del Cupón *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. DESCUENTO2026"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        className="w-full bg-brand-surface border border-brand-border p-2.5 font-mono uppercase font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase font-bold text-neutral-500 mb-1">Tipo de Descuento</label>
                        <select 
                          value={couponForm.discount_type}
                          onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value as any })}
                          className="w-full bg-brand-surface border border-brand-border p-2.5"
                        >
                          <option value="percentage">Porcentaje (%)</option>
                          <option value="fixed">Monto Fijo (COP)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block uppercase font-bold text-neutral-500 mb-1">Valor Descuento</label>
                        <input 
                          type="number" 
                          required
                          min="1"
                          value={couponForm.discount_value}
                          onChange={(e) => setCouponForm({ ...couponForm, discount_value: Number(e.target.value) })}
                          className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-neutral-500 mb-1">Compra Mínima Requerida (COP)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="50000"
                        value={couponForm.min_purchase}
                        onChange={(e) => setCouponForm({ ...couponForm, min_purchase: Number(e.target.value) })}
                        className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block uppercase font-bold text-neutral-500 mb-1">Fecha de Expiración</label>
                      <input 
                        type="date" 
                        required
                        value={couponForm.expiry_date}
                        onChange={(e) => setCouponForm({ ...couponForm, expiry_date: e.target.value })}
                        className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                      <button 
                        type="button" 
                        onClick={() => setIsCouponModalOpen(false)}
                        className="px-4 py-2 border border-brand-border uppercase font-bold text-xs"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="px-6 py-2 bg-brand-black text-white uppercase font-bold text-xs hover:bg-neutral-800"
                      >
                        Guardar Cupón
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 7: CATEGORIES & STYLES */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 border border-brand-border space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
                Categorías Oficiales
              </h3>
              <ul className="space-y-2 text-xs">
                {['Lámparas de Techo', 'Iluminación de Pared', 'Lámparas de Pie', 'Lámparas de Mesa', 'Diseño Mobiliario'].map(c => (
                  <li key={c} className="p-3 bg-brand-surface border border-brand-border flex justify-between font-bold text-brand-black">
                    <span>{c}</span>
                    <span className="text-neutral-400 font-normal">
                      {products.filter(p => p.category === c).length} productos
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 border border-brand-border space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
                Estilos Arquitectónicos
              </h3>
              <ul className="space-y-2 text-xs">
                {['Contemporáneo', 'Minimalista', 'Bauhaus', 'Nórdico'].map(s => (
                  <li key={s} className="p-3 bg-brand-surface border border-brand-border flex justify-between font-bold text-brand-black">
                    <span>{s}</span>
                    <span className="text-neutral-400 font-normal">
                      {products.filter(p => p.style === s).length} productos
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 8: TEAM & PERMISSIONS MANAGEMENT */}
        {activeTab === 'team' && <TeamManagementView />}

        {/* TAB: AUDIT LOGS & MODIFICATION HISTORY */}
        {activeTab === 'logs' && <AuditLogsView />}

        {/* TAB 9: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 border border-brand-border space-y-6 max-w-2xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black border-b border-brand-border pb-3">
              Configuración de Tienda & Monedas
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Nombre Comercial de la Tienda</label>
                <input 
                  type="text" 
                  readOnly 
                  value="Diseño Tu Espacio • Iluminación & Interiores"
                  className="w-full bg-brand-surface border border-brand-border p-3 font-bold text-brand-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Tasa de Cambio Oficial (1 USD = COP)</label>
                <input 
                  type="text" 
                  readOnly 
                  value="$ 4.000 COP"
                  className="w-full bg-brand-surface border border-brand-border p-3 font-mono font-bold text-brand-black"
                />
              </div>

              <div>
                <label className="block uppercase font-bold text-neutral-500 mb-1">Umbral Envío Gratis en Colombia</label>
                <input 
                  type="text" 
                  readOnly 
                  value="$ 1.500.000 COP"
                  className="w-full bg-brand-surface border border-brand-border p-3 font-mono font-bold text-brand-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: REGISTRAR NUEVO PEDIDO INTELIGENTE & CRM */}
        <OrderRegistrationModal 
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          onSuccess={loadData}
          products={products}
        />

        {/* MODAL EDITAR PEDIDO COMPLETO */}
        <OrderEditModal 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingOrderFull(null);
          }}
          onSuccess={loadData}
          order={editingOrderFull}
          products={products}
        />

        {/* MODAL 2: AGENDAR NUEVA CITA / ASESORÍA MANUAL */}
        {isAppointmentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full p-6 border border-brand-black shadow-elevated space-y-4">
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Agendar Nueva Cita / Asesoría
                </h3>
                <button 
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="text-neutral-400 hover:text-black font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateManualAppointment} className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase font-bold text-neutral-500 mb-1">Nombre del Cliente *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej. Arq. Carlos Mendoza"
                    value={appointmentForm.customer_name}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, customer_name: e.target.value })}
                    className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-bold text-neutral-500 mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      placeholder="cliente@ejemplo.com"
                      value={appointmentForm.customer_email}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customer_email: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border p-2.5"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-neutral-500 mb-1">Teléfono de Contacto *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="+57 310 987 6543"
                      value={appointmentForm.customer_phone}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customer_phone: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-500 mb-1">Tipo de Servicio Solicitado</label>
                  <select 
                    value={appointmentForm.service_type}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, service_type: e.target.value })}
                    className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                  >
                    <option value="Asesoría Lumínica & Geometría de Luz">Asesoría Lumínica & Geometría de Luz</option>
                    <option value="Visita de Interiorismo In-Situ">Visita de Interiorismo In-Situ</option>
                    <option value="Proyecto Residencial & Contract">Proyecto Residencial & Contract</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase font-bold text-neutral-500 mb-1">Fecha de la Cita</label>
                    <input 
                      type="date" 
                      required
                      value={appointmentForm.appointment_date}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_date: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-neutral-500 mb-1">Hora de la Cita</label>
                    <input 
                      type="text" 
                      required
                      placeholder="10:00 AM"
                      value={appointmentForm.appointment_time}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, appointment_time: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-500 mb-1">Valor Asesoría (COP)</label>
                  <input 
                    type="number" 
                    required
                    step="50000"
                    value={appointmentForm.price}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, price: Number(e.target.value) })}
                    className="w-full bg-brand-surface border border-brand-border p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block uppercase font-bold text-neutral-500 mb-1">Notas de la Cita / Requerimientos Especiales</label>
                  <textarea 
                    rows={2}
                    placeholder="Ubicación de la residencia, preferencias del cliente..."
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                    className="w-full bg-brand-surface border border-brand-border p-2.5"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                  <button 
                    type="button" 
                    onClick={() => setIsAppointmentModalOpen(false)}
                    className="px-4 py-2 border border-brand-border uppercase font-bold text-xs"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-brand-black text-white uppercase font-bold text-xs hover:bg-neutral-800"
                  >
                    Agendar Cita
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Server Action Confirmation Pop-Up Modal */}
        {actionNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-neutral-200 space-y-4 text-center transform scale-100 transition-all">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  {actionNotification.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1 font-medium leading-relaxed">
                  {actionNotification.message}
                </p>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => setActionNotification(null)}
                  className="w-full bg-brand-black text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl hover:bg-neutral-800 transition-colors shadow-sm"
                >
                  Aceptar y Entendido
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
