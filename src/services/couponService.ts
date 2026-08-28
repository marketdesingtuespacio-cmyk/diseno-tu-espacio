import { Coupon } from '../types';

const LOCAL_STORAGE_COUPONS_KEY = 'luxe_coupons_cache';

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'WESTWING10',
    discount_type: 'percentage',
    discount_value: 10,
    min_purchase: 500000,
    expiry_date: '2026-12-31',
    usage_count: 42,
    is_active: true,
    created_at: '2026-08-01'
  },
  {
    id: 'c-2',
    code: 'LUXE150K',
    discount_type: 'fixed',
    discount_value: 150000,
    min_purchase: 1500000,
    expiry_date: '2026-10-15',
    usage_count: 18,
    is_active: true,
    created_at: '2026-08-10'
  },
  {
    id: 'c-3',
    code: 'BIENVENIDA2026',
    discount_type: 'percentage',
    discount_value: 15,
    min_purchase: 800000,
    expiry_date: '2026-09-30',
    usage_count: 87,
    is_active: true,
    created_at: '2026-07-15'
  }
];

const getStoredCoupons = (): Coupon[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_COUPONS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(LOCAL_STORAGE_COUPONS_KEY, JSON.stringify(INITIAL_COUPONS));
  return INITIAL_COUPONS;
};

const saveStoredCoupons = (coupons: Coupon[]) => {
  localStorage.setItem(LOCAL_STORAGE_COUPONS_KEY, JSON.stringify(coupons));
};

export const couponService = {
  async getCoupons(): Promise<Coupon[]> {
    return getStoredCoupons();
  },

  async createCoupon(coupon: Omit<Coupon, 'id' | 'usage_count' | 'created_at'>): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...coupon,
      id: `c-${Date.now()}`,
      usage_count: 0,
      created_at: new Date().toISOString().split('T')[0]
    };
    const current = getStoredCoupons();
    const updated = [newCoupon, ...current];
    saveStoredCoupons(updated);
    return newCoupon;
  },

  async toggleCouponActive(id: string): Promise<Coupon | null> {
    const current = getStoredCoupons();
    const idx = current.findIndex(c => c.id === id);
    if (idx !== -1) {
      current[idx].is_active = !current[idx].is_active;
      saveStoredCoupons(current);
      return current[idx];
    }
    return null;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const current = getStoredCoupons();
    const filtered = current.filter(c => c.id !== id);
    saveStoredCoupons(filtered);
    return true;
  }
};
