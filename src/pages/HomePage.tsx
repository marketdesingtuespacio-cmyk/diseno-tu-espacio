import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Calendar } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { AnimatedHeroHeader } from '../components/AnimatedHeroHeader';
import { GrandOpeningEditorialGrid } from '../components/GrandOpeningEditorialGrid';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    productService.getProducts().then(products => {
      setFeaturedProducts(products.filter(p => p.is_featured).slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Animated Architectural House Lighting Hero Header */}
      <AnimatedHeroHeader />

      {/* Westwing-Style Category Carousel */}
      <CategoryCarousel />

      {/* 4 Elegant Editorial Cards: Gran Apertura 16 de Octubre & Categorías de Autor */}
      <GrandOpeningEditorialGrid />

      {/* Brand Pillars */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-y border-brand-border py-10 bg-brand-surface">
        <div className="space-y-2 p-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-brand-black text-white flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Diseño de Autor</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">Piezas fabricadas artesanalmente con materiales nobles y acabados mate.</p>
        </div>

        <div className="space-y-2 p-4 border-y md:border-y-0 md:border-x border-brand-border">
          <div className="w-10 h-10 mx-auto rounded-full bg-brand-black text-white flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Asesoría In-Situ</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">Visitas técnicas de arquitectos especializados para el cálculo lumínico.</p>
        </div>

        <div className="space-y-2 p-4">
          <div className="w-10 h-10 mx-auto rounded-full bg-brand-black text-white flex items-center justify-center mb-3">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black">Envío Asegurado</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">Embalaje reforzado y protección total durante el transporte.</p>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Categorías Destacadas</span>
            <h2 className="text-2xl font-light text-brand-black tracking-tight">Mobiliario & Arquitectura de Interiores</h2>
          </div>
          <Link to="/catalog" className="text-xs font-bold uppercase tracking-widest text-brand-black hover:underline flex items-center gap-1">
            Ver Todo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/catalog?category=Espejos" className="group relative h-96 overflow-hidden bg-neutral-900">
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
              alt="Espejos de Autor"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">Colección Espejos</span>
              <h3 className="text-lg font-medium text-white">Espejos Minimalistas & Orgánicos</h3>
            </div>
          </Link>

          <Link to="/catalog?category=Lavamanos" className="group relative h-96 overflow-hidden bg-neutral-900">
            <img 
              src="https://ukvoqxsmrpicnpelkhex.supabase.co/storage/v1/object/public/product-images/sync_A691CBKUG04M_1.jpg" 
              alt="Lavamanos Esculturales"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">Línea Baño de Lujo</span>
              <h3 className="text-lg font-medium text-white">Lavamanos Esculturales</h3>
            </div>
          </Link>

          <Link to="/catalog?category=Papel de Colgadura" className="group relative h-96 overflow-hidden bg-neutral-900">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80" 
              alt="Papel de Colgadura"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-300">Texturas & Muros</span>
              <h3 className="text-lg font-medium text-white">Papel de Colgadura & Revestimientos</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">Catálogo Exclusivo</span>
            <h2 className="text-2xl font-light text-brand-black tracking-tight">Piezas de Autor</h2>
          </div>
          <Link to="/catalog" className="text-xs font-bold uppercase tracking-widest text-brand-black hover:underline">
            Explorar Colección
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4].map(i => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Booking Banner */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-brand-surface border border-brand-border p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-black bg-brand-white border border-brand-border py-1 px-3 inline-block">
              Servicio VIP de Interiorismo
            </span>
            <h2 className="text-3xl font-light text-brand-black tracking-tight leading-tight">
              ¿Necesita una visita técnica para su proyecto?
            </h2>
            <p className="text-xs text-neutral-600 leading-relaxed font-light">
              Nuestros arquitectos de interiores y especialistas en iluminación se desplazan a su propiedad para diseñar un esquema de luz a medida. Agende su fecha y hora en tiempo real.
            </p>
            <Link 
              to="/booking"
              className="inline-flex items-center gap-2 bg-brand-black text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 hover:bg-neutral-800 transition-colors"
            >
              <Calendar className="w-4 h-4" /> Reservar Cita de Asesoría (€150)
            </Link>
          </div>

          <div className="relative aspect-4/3 overflow-hidden border border-brand-border">
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop" 
              alt="Estudio de Interiorismo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
};
