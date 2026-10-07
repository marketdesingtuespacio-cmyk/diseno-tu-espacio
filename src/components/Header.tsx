import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Search, 
  ShoppingBag, 
  Calendar, 
  User, 
  DollarSign, 
  Globe, 
  LogOut,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { MegaMenu } from './MegaMenu';

export const Header: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { currency, setCurrency, language, setLanguage } = useCurrency();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation Drawer State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Active Category Tab in Drawer
  const [activeTab, setActiveTab] = useState<'PRODUCTOS' | 'INSPIRACIÓN' | 'NOVEDADES' | 'NAVIDAD' | 'OFERTAS' | 'PROFESIONALES'>('PRODUCTOS');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Sticky / Scrolled state for Header
  const [isScrolled, setIsScrolled] = useState(false);

  // Desktop Hover MegaMenu
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when Drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  // Primary Horizontal Navigation Tabs
  const primaryTabs: Array<'PRODUCTOS' | 'INSPIRACIÓN' | 'NOVEDADES' | 'NAVIDAD' | 'OFERTAS' | 'PROFESIONALES'> = [
    'PRODUCTOS',
    'INSPIRACIÓN',
    'NOVEDADES',
    'NAVIDAD',
    'OFERTAS',
    'PROFESIONALES'
  ];

  // Secondary Vertical Navigation Items for "PRODUCTOS"
  const secondaryProducts = [
    { label: 'NUEVOS', path: '/catalog?filter=nuevos', badge: 'New' },
    { label: 'ESPEJOS', path: '/catalog?category=Espejos' },
    { label: 'PAPEL DE COLGADURA', path: '/catalog?category=Papel de Colgadura' },
    { label: 'LAVAMANOS', path: '/catalog?category=Lavamanos' },
    { label: 'CUADROS', path: '/catalog?category=Cuadros' },
    { label: 'REVESTIMIENTOS', path: '/catalog?category=Revestimientos' },
    { label: 'LÁMPARAS DE TECHO', path: '/catalog?category=Lámparas de Techo' },
    { label: 'ILUMINACIÓN DE PARED', path: '/catalog?category=Iluminación de Pared' },
    { label: 'LÁMPARAS DE PIE', path: '/catalog?category=Lámparas de Pie' },
    { label: 'LÁMPARAS DE MESA', path: '/catalog?category=Lámparas de Mesa' },
    { label: 'OFERTAS', path: '/catalog?filter=ofertas', isSpecialOffer: true },
  ];

  return (
    <>
      {/* =========================================================================
          MAIN HEADER COMPONENT
      ========================================================================= */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 font-sans ${
          isScrolled 
            ? 'bg-white text-stone-900 shadow-subtle border-b border-brand-border' 
            : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent text-white border-b border-white/10'
        }`}
      >
        {/* Top Utility Announcement Bar */}
        <div 
          className={`text-[11px] font-light py-1.5 px-4 sm:px-8 flex justify-between items-center tracking-widest uppercase transition-colors duration-300 ${
            isScrolled 
              ? 'bg-brand-black text-white' 
              : 'bg-black/50 text-neutral-200 border-b border-white/10 backdrop-blur-xs'
          }`}
        >
          <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] font-medium text-neutral-300">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Mobiliario, Arquitectura de Interiores & Asesoría Especializada • Colombia</span>
          </div>

          <div className="mx-auto md:mx-0 flex items-center space-x-6 text-[10px]">
            {/* Currency Switcher */}
            <div className="flex items-center space-x-1.5 bg-black/40 border border-white/15 px-2 py-0.5">
              <DollarSign className="w-3 h-3 text-amber-300" />
              <button 
                onClick={() => setCurrency('COP')}
                className={`font-bold transition-colors ${currency === 'COP' ? 'text-white underline' : 'text-neutral-400 hover:text-white'}`}
              >
                COP ($)
              </button>
              <span className="text-neutral-500">|</span>
              <button 
                onClick={() => setCurrency('USD')}
                className={`font-bold transition-colors ${currency === 'USD' ? 'text-white underline' : 'text-neutral-400 hover:text-white'}`}
              >
                USD ($)
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1.5 bg-black/40 border border-white/15 px-2 py-0.5">
              <Globe className="w-3 h-3 text-amber-300" />
              <button 
                onClick={() => setLanguage('es')}
                className={`font-bold transition-colors ${language === 'es' ? 'text-white underline' : 'text-neutral-400 hover:text-white'}`}
              >
                ES
              </button>
              <span className="text-neutral-500">|</span>
              <button 
                onClick={() => setLanguage('en')}
                className={`font-bold transition-colors ${language === 'en' ? 'text-white underline' : 'text-neutral-400 hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Main Navbar Row */}
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 md:h-24 flex items-center justify-between relative">
          
          {/* LEFT: Menu / Categories Button */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`group flex items-center gap-2.5 px-3 py-2 border transition-all duration-300 focus:outline-none ${
                isScrolled
                  ? 'border-stone-300 hover:border-black text-stone-900 bg-stone-50/70 hover:bg-black hover:text-white'
                  : 'border-white/30 hover:border-white text-white bg-black/30 hover:bg-white hover:text-black backdrop-blur-xs'
              }`}
              aria-label="Abrir Menú de Categorías"
            >
              <Menu className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] hidden sm:inline">
                Menú / Categorías
              </span>
            </button>
          </div>

          {/* CENTER: Official Logo */}
          <Link to="/" className="flex items-center group py-2">
            <img 
              src="/images/logo_black.png" 
              alt="Diseña Tu Espacio - Mobiliario & Diseño de Interiores"
              className={`h-14 sm:h-16 md:h-20 w-auto object-contain transition-all duration-500 drop-shadow-sm ${
                isScrolled 
                  ? 'brightness-100' 
                  : 'brightness-0 invert'
              }`}
            />
          </Link>

          {/* RIGHT: Search Bar + Back-office / Account + Cart */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            
            {/* Clean Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <input 
                type="text" 
                placeholder="Buscar espejos, papel, lavamanos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-44 xl:w-64 transition-all duration-300 text-xs py-2 pl-3 pr-8 focus:outline-none rounded-none ${
                  isScrolled
                    ? 'bg-stone-50 border border-stone-300 text-stone-900 focus:border-stone-900'
                    : 'bg-transparent border-b border-white/60 text-white placeholder-neutral-300 focus:border-white'
                }`}
              />
              <button 
                type="submit" 
                className={`absolute right-2 transition-colors ${
                  isScrolled ? 'text-stone-500 hover:text-black' : 'text-white/80 hover:text-white'
                }`}
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Catalog Desktop Link */}
            <div 
              className={`hidden md:flex relative py-6 cursor-pointer items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                isScrolled ? 'text-stone-800 hover:text-black' : 'text-white hover:text-amber-200'
              }`}
              onMouseEnter={() => setIsMegaMenuOpen(true)}
            >
              <span>Catálogo</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Booking Link */}
            <Link 
              to="/booking" 
              className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                isScrolled ? 'text-stone-800 hover:text-black' : 'text-white hover:text-amber-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden xl:inline">Agendar Visita</span>
            </Link>

            {/* User Profile / Back-office Indicator */}
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link 
                  to="/admin" 
                  className={`p-1.5 transition-colors flex items-center gap-1.5 border px-2 sm:px-2.5 py-1 ${
                    isScrolled
                      ? 'border-brand-border bg-brand-surface text-brand-black'
                      : 'border-white/30 bg-black/40 text-white backdrop-blur-xs'
                  }`}
                  title={`Portal Back-office (${user.role})`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline-block text-[10px] font-bold uppercase truncate max-w-[80px]">
                    {user.full_name.split(' ')[0]}
                  </span>
                  <span className={`text-[8px] uppercase font-bold px-1 py-0.2 ${
                    user.role === 'admin' ? 'bg-black text-white' : 'bg-stone-700 text-white'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : 'Collab'}
                  </span>
                </Link>

                <button 
                  onClick={logout}
                  className={`p-1.5 transition-colors ${
                    isScrolled ? 'text-stone-400 hover:text-red-600' : 'text-white/70 hover:text-red-400'
                  }`}
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className={`p-2 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${
                  isScrolled ? 'text-stone-800 hover:text-black' : 'text-white hover:text-amber-200'
                }`}
                title="Iniciar Sesión"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline-block">Entrar</span>
              </Link>
            )}

            {/* Shopping Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className={`p-2 relative transition-colors ${
                isScrolled ? 'text-stone-900 hover:text-black' : 'text-white hover:text-amber-200'
              }`}
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-0 bg-[#81c0b1] text-stone-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-subtle">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Desktop MegaMenu Dropdown */}
          <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
        </nav>
      </header>

      {/* =========================================================================
          NAVIGATION DRAWER & OVERLAY (50% Desktop, 100% Mobile)
      ========================================================================= */}
      
      {/* 1. Backdrop Overlay (Fade-in effect, z-40) */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Top-Right Screen Close Button (Over the dark overlay, z-50) */}
      <button 
        onClick={() => setIsMenuOpen(false)}
        className={`fixed top-6 right-6 z-50 p-2 text-stone-900 md:text-white hover:scale-110 transition-all duration-300 focus:outline-none ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Cerrar Menú"
        title="Cerrar Menú"
      >
        <X className="w-8 h-8 stroke-[2.2] drop-shadow-md text-stone-900 md:text-white" />
      </button>

      {/* 3. Sliding White Panel Drawer (z-50, Slide-in from left) */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white z-50 shadow-2xl transition-transform duration-300 ease-out overflow-y-auto no-scrollbar ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } w-full md:w-[50vw] max-w-2xl font-sans`}
      >
        <div className="p-8 sm:p-10 flex flex-col min-h-full">
          
          {/* TOP DRAWER HEADER: Brand Logo Text & Mobile Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-200">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="group flex flex-col"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase text-stone-900 font-sans group-hover:text-[#81c0b1] transition-colors">
                DISEÑA TU ESPACIO
              </span>
              <span className="text-[10px] tracking-[0.3em] uppercase text-stone-400 font-light mt-0.5">
                Mobiliario & Arquitectura de Interiores
              </span>
            </Link>

            {/* Extra Close Icon inside panel for accessibility on mobile */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-1.5 text-stone-800 hover:text-black md:hidden"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* DRAWER SEARCH BAR (For quick mobile and drawer exploration) */}
          <form onSubmit={handleSearchSubmit} className="mt-6 relative">
            <input 
              type="text" 
              placeholder="Buscar en todo el catálogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 py-3 pl-4 pr-10 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
            />
            <button 
              type="submit" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* HORIZONTAL PRIMARY NAVIGATION TABS */}
          <div className="mt-8 border-b border-stone-200 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-6 text-sm font-medium uppercase tracking-wider whitespace-nowrap pb-2">
              {primaryTabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-2.5 transition-all text-xs sm:text-sm font-medium tracking-wider focus:outline-none relative ${
                      isActive 
                        ? 'text-[#81c0b1] border-b-2 border-[#81c0b1] font-semibold' 
                        : 'text-stone-800 hover:text-black'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECONDARY VERTICAL NAVIGATION LIST */}
          <div className="mt-8 flex-1">
            {activeTab === 'PRODUCTOS' && (
              <div className="flex flex-col gap-5 text-sm uppercase tracking-wide">
                {secondaryProducts.map((item) => {
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between group transition-colors duration-200 py-0.5 ${
                        item.isSpecialOffer
                          ? 'text-red-700 font-bold hover:text-red-800'
                          : 'text-stone-800 hover:text-stone-950 font-normal hover:font-medium'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.badge && (
                          <span className="text-[9px] font-bold bg-[#81c0b1]/20 text-[#4c8477] px-1.5 py-0.5 tracking-widest">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <span className={`text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                        item.isSpecialOffer ? 'text-red-700' : 'text-stone-400'
                      }`}>
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            {activeTab === 'INSPIRACIÓN' && (
              <div className="flex flex-col gap-5 text-sm uppercase tracking-wide text-stone-800">
                <Link to="/catalog?filter=tendencias" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Tendencias 2026
                </Link>
                <Link to="/catalog?filter=proyectos" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Casas & Residencias Diseñadas
                </Link>
                <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Asesoría de Interiorismo Virtual
                </Link>
              </div>
            )}

            {activeTab === 'NOVEDADES' && (
              <div className="flex flex-col gap-5 text-sm uppercase tracking-wide text-stone-800">
                <Link to="/catalog?filter=nuevos" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Últimos Lanzamientos de Temporada
                </Link>
                <Link to="/catalog?filter=destacados" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Colección de Autor By Alexis Madrigal
                </Link>
              </div>
            )}

            {activeTab === 'NAVIDAD' && (
              <div className="flex flex-col gap-5 text-sm uppercase tracking-wide text-stone-800">
                <Link to="/catalog?filter=navidad" onClick={() => setIsMenuOpen(false)} className="hover:text-black text-emerald-800">
                  Edición Especial Festiva & Regalos
                </Link>
                <Link to="/catalog?filter=ambientacion" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Iluminación Cálida Festiva
                </Link>
              </div>
            )}

            {activeTab === 'OFERTAS' && (
              <div className="flex flex-col gap-5 text-sm uppercase tracking-wide text-red-700 font-semibold">
                <Link to="/catalog?filter=ofertas" onClick={() => setIsMenuOpen(false)} className="hover:text-red-900">
                  Ver Todas las Ofertas Especiales (-30%)
                </Link>
                <Link to="/catalog?filter=outlet" onClick={() => setIsMenuOpen(false)} className="hover:text-red-900">
                  Outlet Piezas de Exhibición
                </Link>
              </div>
            )}

            {activeTab === 'PROFESIONALES' && (
              <div className="flex flex-col gap-5 text-sm uppercase tracking-wide text-stone-800">
                <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Portal para Arquitectos & Diseñadores
                </Link>
                <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="hover:text-black">
                  Precios Mayoristas & Especificación en Obra
                </Link>
              </div>
            )}
          </div>

          {/* DRAWER FOOTER: Quick Access & Social contact */}
          <div className="pt-8 mt-8 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-500 gap-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/booking" 
                onClick={() => setIsMenuOpen(false)}
                className="font-bold text-stone-900 uppercase tracking-wider hover:text-[#81c0b1] transition-colors"
              >
                Agendar Visita
              </Link>
              <span>•</span>
              <Link 
                to="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="font-bold text-stone-900 uppercase tracking-wider hover:text-[#81c0b1] transition-colors"
              >
                Back-office
              </Link>
            </div>
            <span className="font-mono text-[11px] text-stone-400">
              © 2026 Diseña Tu Espacio
            </span>
          </div>

        </div>
      </aside>
    </>
  );
};
