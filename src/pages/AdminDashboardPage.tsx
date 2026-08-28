import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Calendar, 
  Trash2, 
  Edit3, 
  Search, 
  RefreshCw, 
  ShoppingBag, 
  TrendingUp, 
  PlusCircle
} from 'lucide-react';
import { Product, Appointment, Order, Coupon } from '../types';
import { productService } from '../services/productService';
import { appointmentService } from '../services/appointmentService';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';
import { useCurrency } from '../context/CurrencyContext';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { ProductRegistrationForm } from '../components/admin/ProductRegistrationForm';
import { TeamManagementView } from '../components/admin/TeamManagementView';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Filters inside Admin
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const { formatPrice } = useCurrency();

  const loadData = async () => {
    const [pList, aList, oList, cList] = await Promise.all([
      productService.getProducts(),
      appointmentService.getAppointments(),
      orderService.getOrders(),
      couponService.getCoupons()
    ]);
    setProducts(pList);
    setAppointments(aList);
    setOrders(oList);
    setCoupons(cList);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este producto del inventario?')) {
      await productService.deleteProduct(id);
      loadData();
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    await orderService.updateOrderStatus(id, status);
    loadData();
  };

  // Update Appointment Status
  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    await appointmentService.updateAppointmentStatus(id, status);
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

  // Filtered Lists
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.order_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculations
  const totalProductStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalSalesCOP = orders.reduce((acc, o) => acc + o.total, 0);
  const totalAppointmentsCOP = appointments.reduce((acc, a) => acc + a.price, 0);

  return (
    <div className="flex h-screen bg-brand-surface overflow-hidden font-sans">
      
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
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        
        {/* Top Action Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-brand-border bg-white p-4 shadow-subtle">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold text-neutral-400">Panel Activo:</span>
            <span className="text-sm font-bold uppercase tracking-wider text-brand-black">
              {activeTab === 'overview' && '📊 Resumen General & Analíticas'}
              {activeTab === 'products' && '📦 Inventario & Catálogo Oficial'}
              {activeTab === 'add-product' && '➕ Alta & Registro de Producto'}
              {activeTab === 'orders' && '🛍️ Pedidos & Facturación'}
              {activeTab === 'appointments' && '📅 Citas de Interiorismo & Asesoría'}
              {activeTab === 'coupons' && '🏷️ Cupones & Descuentos'}
              {activeTab === 'team' && '👥 Gestión de Equipo & Permisos'}
              {activeTab === 'categories' && '📂 Categorías & Estilos'}
              {activeTab === 'settings' && '⚙️ Configuración Global'}
            </span>
          </div>

          <button 
            onClick={loadData}
            className="text-xs font-bold uppercase tracking-wider border border-brand-border px-3.5 py-1.5 hover:bg-brand-surface flex items-center gap-1.5 text-neutral-700"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualizar Datos
          </button>
        </div>

        {/* TAB 1: OVERVIEW ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-brand-border space-y-2 shadow-subtle">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Ventas de Productos</span>
                <div className="text-2xl font-bold text-brand-black flex items-center justify-between">
                  {formatPrice(totalSalesCOP)}
                  <TrendingUp className="w-5 h-5 text-emerald-600 stroke-[1.5]" />
                </div>
              </div>

              <div className="bg-white p-6 border border-brand-border space-y-2 shadow-subtle">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Total Pedidos</span>
                <div className="text-2xl font-bold text-brand-black flex items-center justify-between">
                  {orders.length}
                  <ShoppingBag className="w-5 h-5 text-neutral-400 stroke-[1.5]" />
                </div>
              </div>

              <div className="bg-white p-6 border border-brand-border space-y-2 shadow-subtle">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Productos en Stock</span>
                <div className="text-2xl font-bold text-brand-black flex items-center justify-between">
                  {totalProductStock} u.
                  <Package className="w-5 h-5 text-neutral-400 stroke-[1.5]" />
                </div>
              </div>

              <div className="bg-white p-6 border border-brand-border space-y-2 shadow-subtle">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">Ingresos Asesorías</span>
                <div className="text-2xl font-bold text-brand-black flex items-center justify-between">
                  {formatPrice(totalAppointmentsCOP)}
                  <Calendar className="w-5 h-5 text-neutral-400 stroke-[1.5]" />
                </div>
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white p-6 border border-brand-border space-y-4">
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Últimos Pedidos Recibidos</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-neutral-500 hover:text-black uppercase">
                  Ver Todos →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-surface uppercase text-[10px] tracking-widest text-neutral-500 border-b">
                    <tr>
                      <th className="p-3">Ref. Pedido</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Pasarela</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-brand-surface/50">
                        <td className="p-3 font-mono font-bold text-brand-black">{o.order_ref}</td>
                        <td className="p-3">{o.customer_name}</td>
                        <td className="p-3 text-neutral-500">{o.payment_gateway}</td>
                        <td className="p-3 font-bold">{formatPrice(o.total)}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-neutral-900 text-white">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS LIST & INVENTORY */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border border-brand-border">
              <div className="relative w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Buscar producto por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border py-1.5 pl-9 pr-3 text-xs focus:outline-none"
                />
              </div>

              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setActiveTab('add-product');
                }}
                className="bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-2.5 px-6 hover:bg-neutral-800 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Registrar Nuevo Producto
              </button>
            </div>

            <div className="bg-white border border-brand-border overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-surface uppercase text-[10px] tracking-widest text-neutral-500 border-b">
                  <tr>
                    <th className="p-3">Foto (1900×2375)</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Categoría</th>
                    <th className="p-3">Precio (COP)</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-brand-surface/50">
                      <td className="p-3">
                        <img src={p.images[0]} alt="" className="w-10 h-12 object-cover border bg-brand-surface" />
                      </td>
                      <td className="p-3 font-medium">
                        <div className="font-bold text-brand-black">{p.name}</div>
                        <div className="text-[10px] text-neutral-400">{p.brand_collection || 'Diseño Tu Espacio Collection'}</div>
                      </td>
                      <td className="p-3 text-neutral-500">{p.category}</td>
                      <td className="p-3 font-bold">{formatPrice(p.price)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 font-bold ${p.stock > 5 ? 'bg-neutral-100 text-brand-black' : 'bg-red-100 text-red-800'}`}>
                          {p.stock} u.
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setEditingProduct(p);
                            setActiveTab('add-product');
                          }}
                          className="p-1.5 text-neutral-600 hover:text-black"
                          title="Editar"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
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

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white border border-brand-border overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-surface uppercase text-[10px] tracking-widest text-neutral-500 border-b">
                  <tr>
                    <th className="p-3.5">Ref. Orden</th>
                    <th className="p-3.5">Cliente & Contacto</th>
                    <th className="p-3.5">Pasarela</th>
                    <th className="p-3.5">Total Pagado</th>
                    <th className="p-3.5">Estado Pedido</th>
                    <th className="p-3.5 text-right">Actualizar Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-brand-surface/50">
                      <td className="p-3.5 font-mono font-bold text-brand-black">{o.order_ref}</td>
                      <td className="p-3.5">
                        <div className="font-bold">{o.customer_name}</div>
                        <div className="text-[10px] text-neutral-400">{o.customer_email} • {o.customer_phone}</div>
                      </td>
                      <td className="p-3.5 font-medium text-neutral-600">{o.payment_gateway}</td>
                      <td className="p-3.5 font-bold text-brand-black">{formatPrice(o.total)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                          o.status === 'delivered' ? 'bg-emerald-900 text-white' :
                          o.status === 'shipped' ? 'bg-black text-white' : 'bg-neutral-200 text-black'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <select 
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          className="bg-brand-surface border border-brand-border py-1 px-2 text-xs font-bold focus:outline-none"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Despachado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: APPOINTMENTS MANAGEMENT */}
        {activeTab === 'appointments' && (
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

      </main>
    </div>
  );
};
