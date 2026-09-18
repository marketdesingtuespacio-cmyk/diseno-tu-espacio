export type UserRole = 'admin' | 'collaborator' | 'customer';

export type UserPermission = 
  | 'manage_products'
  | 'manage_orders'
  | 'manage_appointments'
  | 'manage_coupons'
  | 'manage_team'
  | 'view_analytics'
  | 'edit_settings';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  permissions: UserPermission[];
  status: 'active' | 'suspended';
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  style: string;
  stock: number;
  images: string[];
  is_featured: boolean;
  dimensions?: string;
  materials?: string;
  original_price?: number | null;
  wholesale_price?: number | null;
  wholesale_min_qty?: number;
  colors?: { name: string; hex: string }[];
  brand_collection?: string;
  sku?: string;
  warehouse_stock?: number;
  store_stock?: number;
  web_stock?: number;
  boxes_count?: number;
  warranty?: string;
  inventory_status?: string;
  created_at?: string;
}

export interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_type: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  price: number;
  notes?: string;
  created_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  expiry_date: string;
  usage_count: number;
  is_active: boolean;
  created_at?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
}

export interface Order {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_tag?: 'VIP' | 'Arquitecto' | 'Residencial' | 'Proyecto Especial';
  shipping_address?: string;
  city?: string;
  carrier?: string;
  tracking_number?: string;
  subtotal?: number;
  shipping_cost?: number;
  discount?: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_gateway: string;
  items_count: number;
  items?: OrderItem[];
  notes?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductFilterState {
  category: string;
  style: string;
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  inStockOnly: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'name';
}

export interface ActivityLog {
  id: string;
  entity_type: 'product' | 'order' | 'appointment' | 'coupon' | 'team' | 'system';
  entity_id?: string;
  entity_name: string;
  action: 'create' | 'update' | 'delete' | 'status_change' | 'sync';
  description: string;
  user_email: string;
  user_name: string;
  user_role?: string;
  created_at: string;
  details?: string;
}
