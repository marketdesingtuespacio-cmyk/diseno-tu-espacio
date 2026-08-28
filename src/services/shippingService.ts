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
    id: 'ship-bog',
    city: 'Bogotá D.C.',
    department: 'Cundinamarca',
    cost: 15000,
    deliveryDays: '1 - 2 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-med',
    city: 'Medellín / Área Metropolitana',
    department: 'Antioquia',
    cost: 25000,
    deliveryDays: '2 - 3 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-cal',
    city: 'Cali / Yumbo',
    department: 'Valle del Cauca',
    cost: 25000,
    deliveryDays: '2 - 3 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-bar',
    city: 'Barranquilla / Soledad',
    department: 'Atlántico',
    cost: 32000,
    deliveryDays: '3 - 4 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-ctg',
    city: 'Cartagena de Indias',
    department: 'Bolívar',
    cost: 35000,
    deliveryDays: '3 - 4 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-buc',
    city: 'Bucaramanga / Floridablanca',
    department: 'Santander',
    cost: 28000,
    deliveryDays: '2 - 3 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-per',
    city: 'Pereira / Eje Cafetero',
    department: 'Risaralda',
    cost: 26000,
    deliveryDays: '2 - 3 días hábiles',
    isFreeThreshold: true
  },
  {
    id: 'ship-nat',
    city: 'Otras Ciudades y Municipios (Nacional)',
    department: 'Colombia',
    cost: 45000,
    deliveryDays: '4 - 6 días hábiles',
    isFreeThreshold: true
  }
];

const LOCAL_STORAGE_SHIPPING_KEY = 'luxe_shipping_rates_cache';

export const shippingService = {
  getRates(): ShippingRate[] {
    const stored = localStorage.getItem(LOCAL_STORAGE_SHIPPING_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
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
