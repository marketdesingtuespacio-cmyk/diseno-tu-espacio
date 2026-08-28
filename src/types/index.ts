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
  original_price?: number;
  colors?: { name: string; hex: string }[];
  brand_collection?: string;
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

export interface Order {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_gateway: string;
  items_count: number;
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
