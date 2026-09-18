import { Product, Appointment } from '../types';
import { REAL_INVENTORY_PRODUCTS } from '../data/realProductsData';

export const MOCK_PRODUCTS: Product[] = [
  ...REAL_INVENTORY_PRODUCTS
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    customer_name: 'Elena Rostova',
    customer_email: 'elena.rostova@example.com',
    customer_phone: '+57 312 345 6789',
    service_type: 'Visita de Diseño de Interiores',
    appointment_date: '2026-08-15',
    appointment_time: '10:00',
    status: 'confirmed',
    payment_status: 'paid',
    price: 600000,
    notes: 'Interés en renovación de salón principal con iluminación domótica.'
  },
  {
    id: 'app-2',
    customer_name: 'Carlos Mendoza',
    customer_email: 'carlos.m@example.com',
    customer_phone: '+57 300 887 7665',
    service_type: 'Asesoría de Iluminación',
    appointment_date: '2026-08-18',
    appointment_time: '16:30',
    status: 'pending',
    payment_status: 'paid',
    price: 600000,
    notes: 'Estudio lumínico para penthouse de 200m2.'
  }
];
