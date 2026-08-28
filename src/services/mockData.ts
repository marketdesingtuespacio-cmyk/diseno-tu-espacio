import { Product, Appointment } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'w-2',
    name: 'Walter',
    slug: 'lampara-de-pie-retro-walter',
    brand_collection: 'Diseño Tu Espacio Collection',
    description: 'Lámpara de pie retro de silueta cilíndrica escultural con cúpula reflectora en cromo pulido espejado. Reinterpretación Bauhaus contemporánea que ilumina ambientando estancias de autor.',
    price: 1650000,
    category: 'Lámparas de Pie',
    style: 'Bauhaus',
    stock: 9,
    images: [
      '/images/lampara_walter_1786563440748.jpg',
      '/images/walter_lifestyle_1786565061538.jpg'
    ],
    is_featured: true,
    colors: [
      { name: 'Cromo Espejo', hex: '#E0E0E0' },
      { name: 'Negro Azabache', hex: '#111111' },
      { name: 'Beige Nude', hex: '#D6C8BC' },
      { name: 'Verde Oliva', hex: '#485244' }
    ],
    dimensions: '160cm alto x 38cm diámetro base',
    materials: 'Aluminio cromo espejado de alta densidad, Base ponderada'
  },
  {
    id: 'w-1',
    name: 'Bowie',
    slug: 'lampara-arco-grande-bowie',
    brand_collection: 'Diseño Tu Espacio Collection',
    description: 'Lámpara de pie de arco continuo en acero cepillado y reflector semiesférico en latón satinado. Ideal para proyectar luz directa sobre sofás y mesas de centro.',
    price: 890000,
    category: 'Lámparas de Pie',
    style: 'Contemporáneo',
    stock: 14,
    images: [
      '/images/lampara_bowie_1786563431628.jpg',
      '/images/bowie_lifestyle_1786565071854.jpg'
    ],
    is_featured: true,
    colors: [
      { name: 'Latón Dorado', hex: '#CDB375' },
      { name: 'Plata Níquel', hex: '#D4D4D2' },
      { name: 'Negro Mate', hex: '#1C1C1C' }
    ],
    dimensions: '215cm alto x 180cm vuelo',
    materials: 'Latón cepillado, Acero satinado, Base de mármol'
  },
  {
    id: 'w-3',
    name: 'Liara',
    slug: 'lampara-de-techo-grande-liara',
    brand_collection: 'Diseño Tu Espacio Collection',
    description: 'Suspensión lineal de tres tulipas en tejido de lino natural con estructura horizontal metálica champán.',
    price: 790000,
    original_price: 890000,
    category: 'Lámparas de Techo',
    style: 'Nórdico',
    stock: 20,
    images: [
      '/images/lampara_liara_1786563449013.jpg',
      '/images/liara_lifestyle_1786565080366.jpg'
    ],
    is_featured: true,
    colors: [
      { name: 'Lino Crema', hex: '#E4DDD3' },
      { name: 'Negro Mate', hex: '#181818' }
    ],
    dimensions: '130cm ancho x 25cm alto',
    materials: 'Lino tejido a mano, Acero champán'
  },
  {
    id: 'w-4',
    name: 'Lace',
    slug: 'plafon-de-lino-lace',
    brand_collection: 'Diseño Tu Espacio Collection',
    description: 'Plafón de techo escalonado confeccionado en cuerda orgánica de lino natural.',
    price: 790000,
    category: 'Lámparas de Techo',
    style: 'Minimalista',
    stock: 18,
    images: [
      '/images/plafon_lace_1786563458884.jpg',
      '/images/lace_lifestyle_1786565089169.jpg'
    ],
    is_featured: true,
    colors: [
      { name: 'Lino Natural', hex: '#D6C4B0' },
      { name: 'Negro & Lino', hex: '#443F38' }
    ],
    dimensions: '60cm diámetro x 28cm alto',
    materials: 'Cuerda de lino natural'
  }
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
