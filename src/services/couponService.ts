import { Coupon } from '../types';
import { activityLogService } from './activityLogService';

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

    activityLogService.logActivity({
      entity_type: 'coupon',
      entity_id: newCoupon.id,
      entity_name: newCoupon.code,
      action: 'create',
      description: `Creó el cupón de descuento "${newCoupon.code}"`,
      details: `Tipo: ${newCoupon.discount_type === 'percentage' ? newCoupon.discount_value + '%' : '$' + newCoupon.discount_value.toLocaleString('es-CO')} | Compra mín: $${newCoupon.min_purchase.toLocaleString('es-CO')}`
    });

    return newCoupon;
  },

  async toggleCouponActive(id: string): Promise<Coupon | null> {
    const current = getStoredCoupons();
    const idx = current.findIndex(c => c.id === id);
    if (idx !== -1) {
      current[idx].is_active = !current[idx].is_active;
      saveStoredCoupons(current);

      activityLogService.logActivity({
        entity_type: 'coupon',
        entity_id: id,
        entity_name: current[idx].code,
        action: 'status_change',
        description: `Cambió estado del cupón "${current[idx].code}" a ${current[idx].is_active ? 'Activo' : 'Inactivo'}`,
        details: `Código: ${current[idx].code}`
      });

      return current[idx];
    }
    return null;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const current = getStoredCoupons();
    const target = current.find(c => c.id === id);
    const filtered = current.filter(c => c.id !== id);
    saveStoredCoupons(filtered);

    activityLogService.logActivity({
      entity_type: 'coupon',
      entity_id: id,
      entity_name: target?.code || id,
      action: 'delete',
      description: `Eliminó el cupón de descuento "${target?.code || id}"`,
      details: `ID: ${id}`
    });

    return true;
  }
};
