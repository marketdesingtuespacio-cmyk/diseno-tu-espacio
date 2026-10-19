export interface ShippingRate {
  id: string;
  city: string;
  department: string;
  cost: number;
  deliveryDays: string;
  isFreeThreshold: boolean;
}

export const COLOMBIAN_SHIPPING_RATES: ShippingRate[] = [
  {
    id: 'ship-pickup',
    city: '🏬 Retiro en Tienda / Showroom (Sin Costo)',
    department: 'Medellín',
    cost: 0,
    deliveryDays: 'Inmediato / Coordinar recogida',
    isFreeThreshold: false
  },
  {
    id: 'ship-bog',
    city: 'Bogotá D.C.',
    department: 'Cundinamarca',
    cost: 30000,
    deliveryDays: '1 - 2 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-med',
    city: 'Medellín / Área Metropolitana',
    department: 'Antioquia',
    cost: 30000,
    deliveryDays: '2 - 3 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-cal',
    city: 'Cali / Yumbo',
    department: 'Valle del Cauca',
    cost: 30000,
    deliveryDays: '2 - 3 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-bar',
    city: 'Barranquilla / Soledad',
    department: 'Atlántico',
    cost: 30000,
    deliveryDays: '3 - 4 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-ctg',
    city: 'Cartagena de Indias',
    department: 'Bolívar',
    cost: 30000,
    deliveryDays: '3 - 4 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-buc',
    city: 'Bucaramanga / Floridablanca',
    department: 'Santander',
    cost: 30000,
    deliveryDays: '2 - 3 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-per',
    city: 'Pereira / Eje Cafetero',
    department: 'Risaralda',
    cost: 30000,
    deliveryDays: '2 - 3 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-nat',
    city: 'Otras Ciudades y Municipios (Nacional)',
    department: 'Colombia',
    cost: 30000,
    deliveryDays: '4 - 6 días hábiles',
    isFreeThreshold: true
  }
];

const LOCAL_STORAGE_SHIPPING_KEY = 'luxe_shipping_rates_cache_v3';

export const shippingService = {
  getRates(): ShippingRate[] {
    const stored = localStorage.getItem(LOCAL_STORAGE_SHIPPING_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    localStorage.setItem(LOCAL_STORAGE_SHIPPING_KEY, JSON.stringify(COLOMBIAN_SHIPPING_RATES));
    return COLOMBIAN_SHIPPING_RATES;
  },

  getRateForCity(city: string): ShippingRate {
    const rates = this.getRates();
    const match = rates.find(r => r.city.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(r.city.toLowerCase()));
    return match || rates[rates.length - 1]; // fallback to national
  },

  updateRateCost(id: string, newCost: number): ShippingRate[] {
    const current = this.getRates();
    const updated = current.map(r => r.id === id ? { ...r, cost: newCost } : r);
    localStorage.setItem(LOCAL_STORAGE_SHIPPING_KEY, JSON.stringify(updated));
    return updated;
  }
};
