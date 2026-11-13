import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface BestsellerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  alt: string;
}

const DEFAULT_BESTSELLERS: BestsellerProduct[] = [
  {
    id: '087698bf-b4c5-4a84-9f3f-49d54c914db7',
    name: 'Lavamanos Escultural A691 Black & Gold',
    category: 'Lavamanos',
    price: 739321,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A691CBKUG04M_1.jpg',
    alt: 'Lavamanos de sobreponer negro y dorado de autor',
  },
  {
    id: 'f0bd2659-5a17-4b41-be6e-a3d5de096be9',
    name: 'Espejo Orgánico Minimalista SF021',
    category: 'Espejos',
    price: 944126,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/products/Espejo_moderno_SF021_1792157157728.jpeg',
    alt: 'Espejo moderno silueta orgánica de autor',
  },
  {
    id: '8dda535f-0291-48d7-9c45-cf6e931a4bb9',
    name: 'Lavamanos Piedra Caliza Gris A787',
    category: 'Lavamanos',
    price: 603266,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A787P45M_1.jpg',
    alt: 'Lavamanos acabado mate piedra arquitectónica',
  },
  {
    id: 'a2b03b6a-9e5e-409f-a6b1-8a3360aff35e',
    name: 'Espejo Circular Gold Arch AHR80006',
    category: 'Espejos',
    price: 697287,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/products/Espejos__AHR80006GD_1792100214224.jpeg',
    alt: 'Espejo redondo contemporáneo con marco dorado',
  },
  {
    id: '9b63cf15-840b-4bd9-a7ac-19e10ba901b3',
    name: 'Lienzo Abstracto Texturado GY77',
    category: 'Cuadros',
    price: 483748,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_GY77X1171589_1.jpg',
    alt: 'Cuadro de autor con textura al relieve',
  },
  {
    id: '373222d4-467a-4cc5-b19f-f7c2cccecbbb',
    name: 'Lavamanos Escultural A544 Matte Charcoal',
    category: 'Lavamanos',
    price: 744455,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A544GGCBK18_1.jpg',
    alt: 'Lavamanos monolítico de diseño en acabado negro mate',
  },
  {
    id: '2cdb02a9-7285-4fa0-9734-23c57616b56d',
    name: 'Espejo Silueta Asimétrica 5343',
    category: 'Espejos',
    price: 670529,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/products/Espejos_modernos_5343_1792009823989.jpeg',
    alt: 'Espejo orgánico fluido de autor',
  },
  {
    id: '05147f93-f59f-4d82-87cd-f4be4a747eff',
    name: 'Obra Editorial de Autor HP120',
    category: 'Cuadros',
    price: 747523,
    image: 'https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_HP120X900948_1.jpg',
    alt: 'Cuadro de autor formato galería',
  },
];

const formatCOP = (val: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val);

interface EditorialBestsellersGridProps {
  products?: BestsellerProduct[];
}

export const EditorialBestsellersGrid: React.FC<EditorialBestsellersGridProps> = ({
  products = DEFAULT_BESTSELLERS,
}) => {
  return (
    <section
      aria-label="Nuestros más vendidos"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Editorial Header Column */}
        <div className="lg:col-span-3 flex flex-col justify-center space-y-4 text-left">
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-neutral-400 block font-mono">
            Nuestros Más Vendidos
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-light text-neutral-900 leading-[1.15] tracking-tight">
            Las piezas más populares de esta temporada
          </h2>

          <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm pt-1">
            Una curaduría de nuestros diseños más solicitados en espejos, lavamanos de autor y arte mural.
          </p>

          <div className="pt-2">
            <Link
              to="/catalog"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              <span>Explorar Todo el Catálogo</span>
              <ArrowRight
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Right 4x2 Clean Product Grid (8 items total) */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {products.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded-xl"
              >
                <article className="relative bg-[#fafafa] hover:bg-[#f4f4f4] transition-all duration-300 rounded-xl overflow-hidden border border-neutral-100 hover:border-neutral-200/80 flex flex-col justify-between p-4 sm:p-5 aspect-[4/5] sm:aspect-square group-hover:shadow-sm">
                  {/* Centered Isolated Product Cutout */}
                  <div className="relative flex-1 flex items-center justify-center overflow-hidden w-full">
                    <img
                      src={product.image}
                      alt={product.alt || product.name}
                      width={300}
                      height={300}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain filter contrast-[1.02] transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Subtle Minimalist Details on hover & mobile */}
                  <div className="mt-3 pt-2 border-t border-neutral-200/50 flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium truncate w-full">
                      {product.category}
                    </span>
                    <h3 className="text-xs font-medium text-neutral-900 truncate w-full mt-0.5 group-hover:text-black">
                      {product.name}
                    </h3>
                    <span className="text-xs font-semibold text-neutral-800 mt-1">
                      {formatCOP(product.price)}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
