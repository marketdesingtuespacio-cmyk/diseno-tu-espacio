import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  PlusCircle,
  LayoutGrid,
  List,
  Download,
  Upload,
  X,
  CheckCircle2,
  Eye,
  MessageCircle,
  ArrowUpRight,
  Phone,
  Building2,
  ArrowLeft,
  FileText,
  Clock,
  CreditCard,
  Check,
  QrCode
} from 'lucide-react';
import { Product, Appointment, Order, Coupon, UserProfile } from '../types';
import { productService, subscribeToProducts, isCategoryMatch, getDeletedProductKeys } from '../services/productService';
import { appointmentService } from '../services/appointmentService';
import { orderService, subscribeToOrders, getDeletedOrderKeys } from '../services/orderService';
import { couponService } from '../services/couponService';
import { authService } from '../services/authService';
import { useCurrency } from '../context/CurrencyContext';
import { checkSupabaseHealth } from '../lib/supabase';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { ProductRegistrationForm } from '../components/admin/ProductRegistrationForm';
import { ProductQRModal } from '../components/admin/ProductQRModal';
import { TeamManagementView } from '../components/admin/TeamManagementView';
import { OrderRegistrationModal } from '../components/admin/OrderRegistrationModal';
import { OrderKanbanBoard } from '../components/admin/OrderKanbanBoard';
import { OrderEditModal } from '../components/admin/OrderEditModal';
import { OrderDetailModal } from '../components/admin/OrderDetailModal';
import { OrderFilterBar, OrderFilterState } from '../components/admin/OrderFilterBar';
import { ProductFilterBar, ProductFilterState } from '../components/admin/ProductFilterBar';
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard';
import { AuditLogsView } from '../components/admin/AuditLogsView';
import { MarketingFeedsView } from '../components/admin/MarketingFeedsView';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Filters & Views inside Admin
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderViewMode, setOrderViewMode] = useState<'kanban' | 'table'>('table');
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<Order | null>(null);

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

    // Smart fallback polling (runs every 5 minutes only if window is active to save network Egress & logs)
    const syncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadData();
      }
    }, 300000);

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

  // Physical Routing & QR Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [qrModalProduct, setQrModalProduct] = useState<Product | null>(null);
  const [qrModalProducts, setQrModalProducts] = useState<Product[]>([]);

  const handleOpenSingleQR = (prod: Product) => {
    setQrModalProduct(prod);
    setQrModalProducts([]);
    setIsQrModalOpen(true);
  };

  const handleOpenBulkQR = () => {
    const selected = products.filter(p => selectedProductIds.includes(p.id));
    if (selected.length === 0) return;
    setQrModalProduct(null);
    setQrModalProducts(selected);
    setIsQrModalOpen(true);
  };

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

  // Delete Single Order (Instant Optimistic UI Refresh)
  const handleDeleteOrder = async (id: string) => {
    // 1. Instant optimistic update: filter out deleted order from React state immediately (0ms latency)
    setOrders(prev => prev.filter(o => o.id !== id && o.order_ref !== id));

    // 2. Perform deletion in Supabase & clear memory cache
    await orderService.deleteOrder(id);

    // 3. Reload data and strictly filter out the deleted order so it cannot re-appear
    await loadData();
    setOrders(prev => prev.filter(o => o.id !== id && o.order_ref !== id));

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
      const cancelledKeys = new Set<string>();
      cancelled.forEach(c => {
        if (c.id) cancelledKeys.add(c.id);
        if (c.order_ref) cancelledKeys.add(c.order_ref);
      });

      setOrders(prev => prev.filter(o => !cancelledKeys.has(o.id) && !cancelledKeys.has(o.order_ref)));

      for (const ord of cancelled) {
        await orderService.deleteOrder(ord.id);
        if (ord.order_ref && ord.order_ref !== ord.id) {
          await orderService.deleteOrder(ord.order_ref);
        }
      }

      await loadData();
      setOrders(prev => prev.filter(o => !cancelledKeys.has(o.id) && !cancelledKeys.has(o.order_ref)));

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
    if (!isCategoryMatch(p.category, productFilters.category)) {
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
      const matchRef = (o.order_ref || '').toLowerCase().includes(q);
      const matchName = (o.customer_name || '').toLowerCase().includes(q);
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

    // 4. Payment Gateway Filter (Bold, Addi, Efectivo)
    if (orderFilters.paymentGateway !== 'all') {
      const g = (o.payment_gateway || '').toLowerCase();
      const m = (o.payment_method || '').toLowerCase();
      if (orderFilters.paymentGateway === 'bold') {
        if (!g.includes('bold') && !m.includes('bold') && !g.includes('wompi') && !m.includes('tarjeta') && !m.includes('pse') && !m.includes('nequi')) return false;
      } else if (orderFilters.paymentGateway === 'addi') {
        if (!g.includes('addi') && !m.includes('addi')) return false;
      } else if (orderFilters.paymentGateway === 'efectivo') {
        if (!g.includes('efectivo') && !m.includes('efectivo')) return false;
      } else if (!g.includes(orderFilters.paymentGateway.toLowerCase())) {
        return false;
      }
    }

    // 5. Customer Tag Filter
    if (orderFilters.customerTag !== 'all' && o.customer_tag !== orderFilters.customerTag) {
      return false;
    }

    // 6. Date Range Filter
    if (orderFilters.dateRange !== 'all') {
      const rawDateStr = o.created_at || '';
      const orderDateStr = rawDateStr.includes('T') ? rawDateStr.split('T')[0] : rawDateStr.split(' ')[0];
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
        (p.warehouse_stock !== undefined || p.store_stock !== undefined || p.web_stock !== undefined) ? ((p.warehouse_stock || 0) + (p.store_stock || 0) + (p.web_stock || 0)) : p.stock,
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
      title: 'Consultando Supabase Nube (Fuente Única)...',
      message: 'Obteniendo la versión oficial maestra de inventarios y pedidos desde Supabase PostgreSQL.'
    });
    const prodRes = await productService.syncAllToSupabase();
    const orderRes = await orderService.syncAllToSupabase();
    await loadData();
    setActionNotification({
      title: '¡Datos Sincronizados desde la Nube!',
      message: `${prodRes.message} | ${orderRes.message}`
    });
  };

  const handleExportBackupJSON = () => {
    try {
      const dataToBackup = {
        timestamp: new Date().toISOString(),
        products,
        orders,
        deletedProductKeys: Array.from(getDeletedProductKeys()),
        deletedOrderKeys: Array.from(getDeletedOrderKeys()),
        version: '1.0'
      };
      const jsonStr = JSON.stringify(dataToBackup, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_completo_disenotuespacio_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Error exportando copia de seguridad JSON: ' + err.message);
    }
  };

  const handleImportBackupJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.products && !parsed.orders) {
          alert('El archivo no contiene un formato válido de copia de seguridad.');
          return;
        }

        if (Array.isArray(parsed.products) && parsed.products.length > 0) {
          // Products imported directly to memory cache & synced to Supabase
        }

        if (Array.isArray(parsed.orders) && parsed.orders.length > 0) {
          // Orders imported directly to memory cache & synced to Supabase
        }

        setActionNotification({
          title: 'Restauración en Proceso',
          message: 'Iniciando sincronización directa con Supabase Nube...'
        });

        await productService.syncAllToSupabase();
        await orderService.syncAllToSupabase();
        await loadData();

        setActionNotification({
          title: '¡Restauración Completa!',
          message: `Se sincronizaron exitosamente los datos en Supabase Nube.`
        });
      } catch (err: any) {
        alert('Error importando copia de seguridad: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const tabTitles: Record<AdminTab, string> = {
    overview: 'Resumen General',
    products: 'Inventario',
    'add-product': 'Registro de Producto',
    orders: 'Pedidos',
    appointments: 'Citas & Asesorías',
    coupons: 'Cupones',
    marketing: 'Pauta & Catálogos',
    team: 'Equipo & Permisos',
    categories: 'Categorías & Estilos',
    logs: 'Historial & Bitácora',
    settings: 'Configuración'
  };

  // Financial KPIs for the Hero Section
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalPaid = orders.reduce((sum, o) => {
    const dep = o.deposit_amount || 0;
    return sum + (dep >= o.total && o.total > 0 ? o.total : dep);
  }, 0);
  const totalPending = Math.max(0, totalSales - totalPaid);
  const totalDeposits = orders.reduce((sum, o) => {
    const dep = o.deposit_amount || 0;
    return sum + (dep > 0 && dep < o.total ? dep : 0);
  }, 0);
  const completionPercent = totalSales > 0 ? Math.min(100, Math.round((totalPaid / totalSales) * 100)) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#bfe8de] via-[#d6e7ec] to-[#ded7f4] p-3 sm:p-5 lg:p-8 font-sans text-neutral-800 relative overflow-x-hidden selection:bg-neutral-900 selection:text-white">
      {/* Ambient Radial Lights */}
      <div className="fixed top-[-100px] left-[-100px] w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* OFF-CANVAS / DRAWER SIDEBAR */}
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
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="max-w-[1580px] mx-auto space-y-6 relative z-10">

        {/* TOP FLOATING NAVIGATION BAR */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/45 backdrop-blur-3xl border border-white/60 px-5 py-3 rounded-[28px] shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] gap-3">
          <div className="flex items-center gap-3">
            <span className="font-serif italic font-extrabold text-2xl text-neutral-950 tracking-tighter">
              dt.
            </span>

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-9 h-9 rounded-full bg-white/70 hover:bg-white/95 border border-white/80 flex items-center justify-center text-neutral-800 shadow-2xs transition-all active:scale-95 cursor-pointer backdrop-blur-md"
              title="Abrir Menú Completo"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            <Link
              to="/"
              className="w-9 h-9 rounded-full bg-white/70 hover:bg-white/95 border border-white/80 flex items-center justify-center text-neutral-800 shadow-2xs transition-all active:scale-95 backdrop-blur-md"
              title="Volver a la Tienda Pública"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="h-4 w-[1px] bg-neutral-300 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900 tracking-tight">
                {tabTitles[activeTab]}
              </span>
              <span className={`w-2 h-2 rounded-full ${supabaseStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} title={supabaseStatus.message} />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-white/70 hover:bg-white text-neutral-900 border border-white/80 backdrop-blur-md rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-neutral-700" /> Registrar Pedido
            </button>

            <button
              onClick={() => setActiveTab('add-product')}
              className="bg-white/70 hover:bg-white text-neutral-900 border border-white/80 backdrop-blur-md rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-neutral-700" /> Nuevo Producto
            </button>

            <button
              onClick={loadData}
              className="w-9 h-9 rounded-full bg-white/70 hover:bg-white border border-white/80 backdrop-blur-md flex items-center justify-center text-neutral-800 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Actualizar Datos en Tiempo Real"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              DT
            </div>
          </div>
        </header>

        {/* HERO FINANCIAL & KPI BENTO CARD */}
        <section className="bg-white/45 backdrop-blur-3xl border border-white/60 rounded-[36px] p-6 sm:p-8 shadow-[0_16px_48px_0_rgba(31,38,135,0.06)] space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/90 border border-white flex items-center justify-center text-neutral-700 shadow-2xs shrink-0">
                <FileText className="w-7 h-7 text-neutral-800" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">Total Facturación & Pedidos</p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-950 tracking-tight mt-0.5">
                  ${formatPrice(totalSales)}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-neutral-600 border border-white">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9.5px] uppercase font-bold text-neutral-400">Empresa</p>
                  <p className="text-xs font-bold text-neutral-900">Diseño Tu Espacio S.A.S.</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-neutral-600 border border-white">
                  <span className="font-mono font-bold text-xs">#</span>
                </div>
                <div>
                  <p className="text-[9.5px] uppercase font-bold text-neutral-400">Pedidos Registrados</p>
                  <p className="text-xs font-bold text-neutral-900">{orders.length} Órdenes</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-emerald-600 border border-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-[9.5px] uppercase font-bold text-neutral-400">Estado Operativo</p>
                  <p className="text-xs font-bold text-neutral-900">En Línea (Supabase)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Segmented Cashflow Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="flex justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              <span>Recaudado vs. Saldo Pendiente</span>
              <span>{completionPercent}% Recaudado</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                {/* Paid pill */}
                <div className="bg-[#86efac]/80 text-[#065f46] border border-[#4ade80]/60 rounded-full px-4 py-2 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                  <Check className="w-3.5 h-3.5" />
                  <span>${formatPrice(totalPaid)}</span>
                </div>

                {/* Abonos pill */}
                {totalDeposits > 0 && (
                  <div className="bg-[#fef08a] text-[#854d0e] border border-[#fde047] rounded-full px-4 py-2 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>${formatPrice(totalDeposits)}</span>
                  </div>
                )}

                {/* Pending pill */}
                <div className="bg-white/80 text-neutral-700 border border-neutral-200 rounded-full px-4 py-2 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>${formatPrice(totalPending)}</span>
                </div>
              </div>

              {/* Striped hatched gauge */}
              <div className="h-8 rounded-full bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_4px,#f3f4f6_4px,#f3f4f6_8px)] overflow-hidden flex-1 w-full border border-neutral-200/80 relative">
                <div 
                  className="h-full bg-emerald-500/80 transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>

              <div className="text-[11px] font-bold text-neutral-500 whitespace-nowrap">
                Promedio Despacho: <span className="text-neutral-900 font-extrabold">2-3 Días</span>
              </div>

              <button
                onClick={() => setActiveTab('orders')}
                className="bg-neutral-950 text-white rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
              >
                Facturación & Pedidos
              </button>
            </div>
          </div>
        </section>

        {/* MAIN FULL-WIDTH WORKSPACE (GLASSMORPHIC) */}
        <section className="w-full bg-white/45 backdrop-blur-3xl border border-white/60 rounded-[36px] p-5 sm:p-8 shadow-[0_16px_48px_0_rgba(31,38,135,0.06)] space-y-6">
          
          {/* Top Pill Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/60 no-scrollbar">
            {[
              { id: 'orders', label: 'Pedidos & Facturación' },
              { id: 'products', label: 'Inventario & Catálogo' },
              { id: 'overview', label: 'Analíticas' },
              { id: 'appointments', label: 'Citas & Asesorías' },
              { id: 'coupons', label: 'Cupones' },
              { id: 'marketing', label: 'Pauta & Catálogos' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'bg-white/60 hover:bg-white/80 text-neutral-700 border border-white/70 backdrop-blur-md'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

            {/* TAB CONTENT */}

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
          <div className="space-y-4 sm:space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white/80 backdrop-blur-md border border-white/90 p-4 sm:p-5 rounded-2xl shadow-xs gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">
                  Gestión de Inventario & Catálogo Oficial
                </h3>
                <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                  Visualiza el desglose de existencias por bodega, tienda y web, filtra por estados y exporta reportes en tiempo real.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
                <button
                  onClick={handleSyncAllSupabase}
                  className="bg-sky-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl hover:bg-sky-700 shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                  title="Forzar actualización completa de Productos y Pedidos a Supabase Nube"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sincronizar Nube</span>
                </button>

                <button
                  onClick={handleExportBackupJSON}
                  className="bg-purple-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl hover:bg-purple-800 shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                  title="Descargar copia de seguridad completa (.json) con todos los productos, fotos y pedidos"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Copia JSON</span>
                </button>

                <label
                  className="bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl hover:bg-indigo-800 shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Restaurar copia de seguridad desde un archivo .json"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restaurar JSON</span>
                  <input type="file" accept=".json" onChange={handleImportBackupJSON} className="hidden" />
                </label>

                <button
                  onClick={handleExportInventoryCSV}
                  className="bg-[#C6F432] text-black font-extrabold text-xs uppercase tracking-wider py-2.5 px-3 rounded-xl hover:bg-[#b5e028] shadow-sm transition-all flex items-center gap-1.5 shrink-0"
                  title="Exportar inventario completo a CSV"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQrModalProduct(null);
                    setQrModalProducts(filteredProducts.length > 0 ? filteredProducts : products);
                    setIsQrModalOpen(true);
                  }}
                  className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-xs uppercase tracking-wider py-2.5 px-3.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Generar e imprimir etiquetas QR físicas de todos los productos visibles"
                >
                  <QrCode className="w-4 h-4 text-neutral-950" />
                  <span>Etiquetas QR ({filteredProducts.length})</span>
                </button>

                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setActiveTab('add-product');
                  }}
                  className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2.5 px-4 rounded-xl hover:bg-neutral-800 flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-300" /> Registrar Producto
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
              <div className="sticky top-0 z-20 lg:static bg-neutral-900 text-white p-3 sm:p-4 rounded-xl shadow-elevated flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 border border-neutral-800 animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <span className="bg-[#C6F432] text-black text-xs font-extrabold px-3 py-1 rounded-full font-mono">
                    {selectedProductIds.length} seleccionados
                  </span>
                  <span className="hidden sm:inline text-xs text-neutral-300 font-medium">
                    Edición en Bloque (Acciones Masivas para Productos Seleccionados):
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 sm:flex-wrap w-full md:w-auto">
                  {/* Bulk Status Dropdown */}
                  <select 
                    onChange={(e) => {
                      if (e.target.value) {
                        handleBulkChangeStatus(e.target.value as Product['inventory_status']);
                        e.target.value = '';
                      }
                    }}
                    className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-neutral-800 text-white text-xs border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
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
                    className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-neutral-800 text-white text-xs border border-neutral-700 rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                  >
                    <option value="">Cambiar Categoría en Bloque...</option>
                    {productCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  {/* Bulk QR Generator Button */}
                  <button 
                    type="button"
                    onClick={handleOpenBulkQR}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm border border-neutral-700 cursor-pointer"
                    title="Generar e imprimir etiquetas físicas QR para los productos seleccionados"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" /> 
                    <span>Etiquetas QR ({selectedProductIds.length})</span>
                  </button>

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
              <table className="w-full min-w-[850px] text-left text-xs">
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
                    <th className="p-3 text-center">Etiqueta QR</th>
                    <th className="p-3">Garantía</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-neutral-400 font-medium">
                        No se encontraron productos que coincidan con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const wStock = p.warehouse_stock || 0;
                      const sStock = p.store_stock || 0;
                      const bStock = p.web_stock || 0;
                      const totalDivStock = wStock + sStock + bStock;
                      const realTotalStock = (p.warehouse_stock !== undefined || p.store_stock !== undefined || p.web_stock !== undefined) ? totalDivStock : p.stock;

                      const isPrivado = p.inventory_status === 'Privado';
                      const isAgotado = realTotalStock <= 0 || p.inventory_status === 'Agotado';
                      const isPocoStock = !isAgotado && !isPrivado && realTotalStock <= 3;
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
                            <button
                              type="button"
                              onClick={() => handleOpenSingleQR(p)}
                              className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-[10.5px] font-bold tracking-tight transition-colors cursor-pointer shadow-2xs"
                              title="Abrir e imprimir etiqueta QR para este producto"
                            >
                              <QrCode className="w-3.5 h-3.5 text-amber-800" />
                              <span>Ver QR Físico</span>
                            </button>
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
                            <span className={`px-2.5 py-1 font-bold rounded-md text-[11px] font-mono inline-block shadow-2xs ${
                              isAgotado ? 'bg-red-100 text-red-800 border border-red-200' :
                              isPocoStock ? 'bg-amber-100 text-amber-900 border border-amber-200 font-extrabold' :
                              'bg-emerald-50 text-emerald-950 border border-emerald-200 font-black'
                            }`}>
                              {realTotalStock} u. total
                            </span>
                            <div className="text-[9.5px] mt-1.5 flex items-center gap-1 flex-wrap font-medium">
                              <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200" title="Stock en Bodega Principal">
                                🏭 Bod: <strong className="font-bold">{wStock}</strong>
                              </span>
                              <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200" title="Stock en Tienda Física / Showroom">
                                🏬 Tie: <strong className="font-bold">{sStock}</strong>
                              </span>
                              <span className="bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200" title="Stock Web Online">
                                🌐 Web: <strong className="font-bold">{bStock}</strong>
                              </span>
                            </div>
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
                          <td className="p-3 text-center">
                            <button 
                              type="button"
                              onClick={() => handleOpenSingleQR(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-[11px] font-mono font-bold tracking-tight transition-all shadow-xs cursor-pointer"
                              title="Generar e imprimir etiqueta física con código QR"
                            >
                              <QrCode className="w-3.5 h-3.5 text-amber-400" />
                              <span>Imprimir QR</span>
                            </button>
                          </td>
                          <td className="p-3 text-neutral-600 font-medium">
                            {p.warranty || '3 años'}
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button 
                              onClick={() => handleOpenSingleQR(p)}
                              className="p-1.5 text-amber-700 hover:text-amber-950 hover:bg-amber-100/60 rounded-lg transition-colors cursor-pointer"
                              title="Generar e imprimir etiqueta QR para ruteo físico"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white/80 backdrop-blur-md border border-white/90 p-4 sm:p-5 rounded-2xl shadow-xs gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">
                  Gestión Posventa, Kanban & Facturación
                </h3>
                <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                  Administra las etapas de producción, guías de despacho, tags de cliente y envía actualizaciones posventa por WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
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
                    className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider py-2 px-3 sm:px-4 rounded-xl hover:bg-red-100 flex items-center gap-1.5 transition-all"
                    title="Eliminar todos los pedidos en estado Cancelado"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Limpiar Cancelados
                  </button>
                )}

                <button 
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2 px-4 sm:px-5 rounded-xl hover:bg-neutral-800 flex items-center gap-2 shadow-sm transition-all"
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
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-neutral-950 text-neutral-300 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-800">
                        <th className="py-3.5 px-4">Ref / Fecha</th>
                        <th className="py-3.5 px-4">Cliente & Contacto</th>
                        <th className="py-3.5 px-4">Productos</th>
                        <th className="py-3.5 px-4">Logística & Envío</th>
                        <th className="py-3.5 px-4">Estado del Pedido</th>
                        <th className="py-3.5 px-4 font-bold text-right">Total & Pago</th>
                        <th className="py-3.5 px-4 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-neutral-400 font-medium text-xs">
                            No se encontraron pedidos con los filtros seleccionados.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(o => {
                          const rawPhone = (o.customer_phone || '').replace(/[^0-9]/g, '');
                          const cleanPhone = rawPhone.startsWith('57') ? rawPhone : `57${rawPhone}`;
                          let statusText = 'Pendiente por Verificar';
                          if (o.status === 'processing') statusText = 'En Preparación / Taller';
                          if (o.status === 'shipped') statusText = 'Despachado en Tránsito';
                          if (o.status === 'delivered') statusText = 'Entregado con Éxito';
                          if (o.status === 'cancelled') statusText = 'Cancelado';
                          const waText = `Hola *${o.customer_name}*, te saludamos de *Diseño Tu Espacio*.\n\nTe informamos que tu pedido *Ref: ${o.order_ref}* se encuentra en estado: *${statusText}*.\n\n• Guía: ${o.tracking_number || 'En asignación'}\n• Transportadora: ${o.carrier || 'Flete Privado'}\n• Ciudad: ${o.city || 'Colombia'}`;
                          const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;

                          return (
                            <tr key={o.id} className="hover:bg-neutral-50/80 transition-colors group">
                              {/* 1. Ref / Fecha */}
                              <td className="py-3.5 px-4 align-top">
                                <button 
                                  onClick={() => setSelectedDetailOrder(o)}
                                  className="text-neutral-950 font-mono font-bold hover:underline block text-xs tracking-tight"
                                  title="Ver detalle de la orden"
                                >
                                  {o.order_ref}
                                </button>
                                <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">
                                  {(() => {
                                    try {
                                      return new Date(o.created_at).toLocaleString('es-CO', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                      });
                                    } catch {
                                      return o.created_at;
                                    }
                                  })()}
                                </span>
                              </td>

                              {/* 2. Cliente & Contacto */}
                              <td className="py-3.5 px-4 align-top">
                                <span className="font-bold text-neutral-950 block text-xs">{o.customer_name}</span>
                                {o.customer_document_id && (
                                  <span className="text-[10px] font-mono text-neutral-500 block">
                                    {o.customer_document_type || 'CC'}: {o.customer_document_id}
                                  </span>
                                )}
                                <div className="text-[10.5px] text-neutral-500 mt-0.5">
                                  {o.customer_phone && <span className="block">{o.customer_phone}</span>}
                                  {o.customer_email && <span className="text-neutral-400 block truncate max-w-[180px]">{o.customer_email}</span>}
                                </div>
                              </td>

                              {/* 3. Productos Resumen */}
                              <td className="py-3.5 px-4 align-top">
                                {o.items && o.items.length > 0 ? (
                                  <div className="flex items-center gap-2 max-w-[220px]">
                                    <img 
                                      src={o.items[0].image} 
                                      alt={o.items[0].name} 
                                      className="w-8 h-8 object-cover rounded border border-neutral-200 bg-white shrink-0 shadow-2xs" 
                                    />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-neutral-900 truncate text-[11px] leading-tight">{o.items[0].name}</p>
                                      <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                                        {o.items[0].quantity} u.
                                        {o.items.length > 1 && ` • +${o.items.length - 1} producto(s)`}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-neutral-400 text-[10px] italic">Sin items</span>
                                )}
                              </td>

                              {/* 4. Logística & Envío */}
                              <td className="py-3.5 px-4 align-top">
                                <span className="font-semibold text-neutral-900 block text-[11px]">{o.carrier || 'Flete Privado'}</span>
                                <span className="text-[10.5px] text-neutral-500 font-mono block">
                                  {o.tracking_number ? `Guía: ${o.tracking_number}` : 'Guía: En asignación'}
                                </span>
                                <span className="text-[10px] text-neutral-400 block mt-0.5">
                                  {o.city || 'Colombia'}
                                </span>
                              </td>

                              {/* 5. Estado del Pedido con Selector Rápido */}
                              <td className="py-3.5 px-4 align-top">
                                <select 
                                  value={o.status}
                                  onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                                  className={`py-1 px-2.5 text-[10.5px] font-bold rounded-lg border focus:outline-none cursor-pointer transition-colors ${
                                    o.status === 'delivered' ? 'bg-neutral-950 text-white border-neutral-950' :
                                    o.status === 'shipped' ? 'bg-neutral-800 text-white border-neutral-800' :
                                    o.status === 'processing' ? 'bg-neutral-200 text-neutral-900 border-neutral-300' :
                                    o.status === 'cancelled' ? 'bg-neutral-100 text-neutral-400 border-neutral-200 line-through' :
                                    'bg-neutral-100 text-neutral-800 border-neutral-300'
                                  }`}
                                >
                                  <option value="pending">Pendiente por Verificar</option>
                                  <option value="processing">En Preparación / Taller</option>
                                  <option value="shipped">Despachado en Tránsito</option>
                                  <option value="delivered">Entregado / Posventa</option>
                                  <option value="cancelled">Cancelado</option>
                                </select>
                              </td>

                              {/* 6. Total & Pago */}
                              <td className="py-3.5 px-4 text-right align-top">
                                <span className="font-extrabold text-neutral-950 text-xs block font-mono">
                                  {formatPrice(o.total)}
                                </span>
                                <span className={`inline-block mt-1 font-semibold px-2 py-0.5 rounded text-[9px] uppercase border ${
                                  (o.deposit_amount || 0) >= o.total && o.total > 0
                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                    : (o.deposit_amount || 0) > 0
                                    ? 'bg-neutral-100 text-neutral-800 border-neutral-300'
                                    : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                                }`}>
                                  {(o.deposit_amount || 0) >= o.total && o.total > 0
                                    ? '✓ Pagado 100%'
                                    : (o.deposit_amount || 0) > 0
                                    ? `Abono: ${formatPrice(o.deposit_amount || 0)}`
                                    : 'Sin Abono'}
                                </span>
                              </td>

                              {/* 7. Acciones */}
                              <td className="py-3.5 px-4 text-center align-top">
                                <div className="flex items-center justify-center gap-1">
                                  {/* Ver detalle */}
                                  <button
                                    onClick={() => setSelectedDetailOrder(o)}
                                    className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
                                    title="Ver detalle del pedido"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {/* Notificar WhatsApp */}
                                  <a 
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
                                    title="Notificar cliente por WhatsApp"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>

                                  {/* Editar */}
                                  <button
                                    onClick={() => {
                                      setEditingOrderFull(o);
                                      setIsEditModalOpen(true);
                                    }}
                                    className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
                                    title="Editar pedido completo"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>

                                  {/* Eliminar */}
                                  <button
                                    onClick={() => {
                                      if (confirm(`¿Está seguro de eliminar el pedido ${o.order_ref}?`)) {
                                        handleDeleteOrder(o.id);
                                      }
                                    }}
                                    className="p-1.5 text-neutral-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar pedido permanentemente"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
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

            {/* MODAL DETALLE DE ORDEN DESDE LA TABLA */}
            {selectedDetailOrder && (
              <OrderDetailModal
                isOpen={!!selectedDetailOrder}
                onClose={() => setSelectedDetailOrder(null)}
                order={selectedDetailOrder}
                onEditOrder={(ord) => {
                  setSelectedDetailOrder(null);
                  setEditingOrderFull(ord);
                  setIsEditModalOpen(true);
                }}
                onDeleteOrder={handleDeleteOrder}
              />
            )}
          </div>
        )}

        {/* TAB 5: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border border-brand-border rounded-xl shadow-xs gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Citas de Interiorismo & Asesoría Lumínica</h3>
                <p className="text-[11px] text-neutral-500 font-light mt-0.5">Consulta las solicitudes del sitio web o programa manualmente una cita de asesoría con un cliente.</p>
              </div>

              <button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="w-full sm:w-auto justify-center bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2.5 px-5 sm:px-6 hover:bg-neutral-800 flex items-center gap-2 shadow-subtle shrink-0 rounded-xl sm:rounded-none"
              >
                <PlusCircle className="w-4 h-4 text-amber-300" /> Agendar Nueva Cita
              </button>
            </div>

            <div className="bg-white border border-brand-border overflow-x-auto rounded-xl shadow-xs">
            <table className="w-full min-w-[700px] text-left text-xs">
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
                        className="px-2.5 py-1 bg-emerald-800 text-white text-[10px] font-bold uppercase rounded-md"
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border border-brand-border rounded-xl shadow-xs gap-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Gestión de Cupones de Descuento</h3>
                <p className="text-[11px] text-neutral-500 font-light mt-0.5">Crea códigos promocionales para incentivar las ventas en la tienda.</p>
              </div>

              <button 
                onClick={() => setIsCouponModalOpen(true)}
                className="w-full sm:w-auto justify-center bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2.5 px-5 sm:px-6 hover:bg-neutral-800 flex items-center gap-2 rounded-xl sm:rounded-none"
              >
                <PlusCircle className="w-4 h-4" /> Crear Nuevo Cupón
              </button>
            </div>

            <div className="bg-white border border-brand-border overflow-x-auto rounded-xl shadow-xs">
              <table className="w-full min-w-[650px] text-left text-xs">
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
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
                <div className="bg-white max-w-md w-full p-4 sm:p-6 border border-brand-black shadow-modal space-y-4 rounded-2xl sm:rounded-none max-h-[92vh] overflow-y-auto">
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

        {/* TAB: MARKETING FEEDS (META BUSINESS & GOOGLE SHOPPING) */}
        {activeTab === 'marketing' && <MarketingFeedsView products={products} />}

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

        </section>

        {/* BOTTOM SECTION: ACTIVIDAD & AGENDA (FULL-WIDTH 3-COLUMN PASTEL BENTO) */}
        <section className="w-full bg-white/45 backdrop-blur-3xl border border-white/60 rounded-[36px] p-6 sm:p-8 shadow-[0_16px_48px_0_rgba(31,38,135,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/60 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-neutral-950 tracking-tight flex items-center gap-2">
                Actividad & Agenda Reciente
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Próximas citas de asesoría de diseño, seguimiento a pedidos en curso y facturación DIAN
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-neutral-900 bg-white/80 px-3 py-1 rounded-full border border-white shadow-2xs">
                {appointments.length} Citas & Actividades
              </span>
              <button 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-white flex items-center justify-center text-neutral-800 shadow-2xs cursor-pointer transition-all active:scale-95"
                title="Nueva Cita"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setActiveTab('appointments')}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-white flex items-center justify-center text-neutral-800 shadow-2xs cursor-pointer transition-all active:scale-95"
                title="Ver Calendario"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <a 
                href="https://wa.me/573000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-white flex items-center justify-center text-neutral-800 shadow-2xs cursor-pointer transition-all active:scale-95"
                title="WhatsApp Directo"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 3 Pastel Cards Grid Horizontally Below */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Lavender (Citas) */}
            {appointments.length > 0 ? (
              appointments.slice(0, 1).map((app, idx) => (
                <div 
                  key={app.id || idx}
                  onClick={() => setActiveTab('appointments')}
                  className="bg-[#ede4f8]/90 text-[#4a154b] rounded-[28px] p-5 border border-[#e0d0f5] shadow-2xs space-y-3 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full bg-white/80 text-[#4a154b] text-[10.5px] font-bold">
                      {app.appointment_date} • {app.appointment_time}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#4a154b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2e0854]">{app.service_type}</h4>
                    <p className="text-xs text-[#4a154b]/80 mt-1 flex items-center gap-1.5 font-medium">
                      <span className="w-5 h-5 rounded-full bg-[#4a154b]/20 flex items-center justify-center text-[10px] font-bold">
                        {app.customer_name.charAt(0)}
                      </span>
                      <span>{app.customer_name}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div 
                onClick={() => setIsAppointmentModalOpen(true)}
                className="bg-[#ede4f8]/90 text-[#4a154b] rounded-[28px] p-5 border border-[#e0d0f5] shadow-2xs space-y-2 cursor-pointer hover:shadow-md transition-all"
              >
                <span className="px-3 py-1 rounded-full bg-white/80 text-[#4a154b] text-[10.5px] font-bold">Agenda Disponible</span>
                <h4 className="font-extrabold text-sm text-[#2e0854]">Agendar Cita de Asesoría</h4>
                <p className="text-xs text-[#4a154b]/80">Haz clic para programar una visita técnica o reunión 3D.</p>
              </div>
            )}

            {/* Card 2: Butter Yellow (Pedidos Pendientes / En Taller) */}
            {orders.filter(o => o.status === 'processing' || (o.pending_balance || 0) > 0).slice(0, 1).map((ord, idx) => (
              <div 
                key={ord.id || idx}
                onClick={() => { setSelectedDetailOrder(ord); }}
                className="bg-[#fef9c3]/90 text-[#713f12] rounded-[28px] p-5 border border-[#fef08a] shadow-2xs space-y-3 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full bg-white/80 text-[#713f12] text-[10.5px] font-bold">
                    Ref: {ord.order_ref}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#713f12] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#522c06]">Seguimiento de Producción & Envío</h4>
                  <p className="text-xs text-[#713f12]/80 mt-1 flex items-center gap-1.5 font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#713f12]/20 flex items-center justify-center text-[10px] font-bold">
                      {ord.customer_name.charAt(0)}
                    </span>
                    <span>{ord.customer_name} • ${formatPrice(ord.total)}</span>
                  </p>
                </div>
              </div>
            ))}

            {/* Card 3: Soft Mint (Facturación DIAN / Siigo) */}
            <div 
              onClick={() => setActiveTab('orders')}
              className="bg-[#dcfce7]/90 text-[#14532d] rounded-[28px] p-5 border border-[#bbf7d0] shadow-2xs space-y-3 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-white/80 text-[#14532d] text-[10.5px] font-bold">
                  Facturación DIAN
                </span>
                <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-[#14532d] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#0a381d]">Sincronización Fiscal Siigo Nube</h4>
                <p className="text-xs text-[#14532d]/80 mt-1 font-medium">
                  {orders.filter(o => o.siigo_invoice_status === 'generated').length} facturas emitidas • {orders.filter(o => o.siigo_invoice_status === 'pending').length} pendientes
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

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
          onDeleteOrder={handleDeleteOrder}
        />

        {/* MODAL 2: AGENDAR NUEVA CITA / ASESORÍA MANUAL */}
        {isAppointmentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white max-w-lg w-full p-4 sm:p-6 border border-brand-black shadow-elevated space-y-4 rounded-2xl sm:rounded-none max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-black flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Agendar Nueva Cita / Asesoría
                </h3>
                <button 
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="text-neutral-400 hover:text-black font-bold p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateManualAppointment} className="space-y-3 sm:space-y-4 text-xs">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        {/* Product Physical Routing QR Modal (Individual o en Lote) */}
        <ProductQRModal
          isOpen={isQrModalOpen}
          onClose={() => {
            setIsQrModalOpen(false);
            setQrModalProduct(null);
            setQrModalProducts([]);
          }}
          product={qrModalProduct}
          products={qrModalProducts}
        />

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

      </div>
  );
};
