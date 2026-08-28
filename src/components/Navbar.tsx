import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Calendar, User, Search, ChevronDown, Menu, X, Globe, DollarSign, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { MegaMenu } from './MegaMenu';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { currency, setCurrency, language, setLanguage } = useCurrency();
  const { user, logout } = useAuth();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Listen to window scroll position to transition header from transparent overlay to white
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-sans ${
        isScrolled 
          ? 'bg-white text-brand-black shadow-subtle border-b border-brand-border' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white border-b border-white/10'
      }`}
    >
      {/* Top Utility Announcement Bar */}
      <div 
        className={`text-[11px] font-light py-1.5 px-6 flex justify-between items-center tracking-widest uppercase transition-colors duration-300 ${
          isScrolled 
            ? 'bg-brand-black text-white' 
            : 'bg-black/40 text-neutral-200 border-b border-white/10'
        }`}
      >
        <div className="hidden sm:block text-[10px] tracking-[0.2em] font-medium text-neutral-300">
          Envíos a toda Colombia e Internacional • Estudio Lumínico Especializado
        </div>

        <div className="mx-auto sm:mx-0 flex items-center space-x-6 text-[10px]">
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

      {/* Main Navigation Bar */}
      <nav className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between relative">
        
        {/* Mobile Hamburger Button */}
        <button 
          className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-brand-black' : 'text-white'}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir Menú"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Official Brand Logo (Prominent Size & Smooth Color Transition) */}
        <Link to="/" className="flex items-center group py-2">
          <img 
            src="/images/logo_black.png" 
            alt="Diseño Tu Espacio - By Alexis Madrigal"
            className={`h-16 sm:h-18 md:h-20 lg:h-22 w-auto object-contain transition-all duration-500 drop-shadow-sm ${
              isScrolled 
                ? 'brightness-100' 
                : 'brightness-0 invert'
            }`}
          />
        </Link>

        {/* Desktop Links (Westwing Overlay Style) */}
        <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-[0.15em]">
          <Link 
            to="/" 
            className={`transition-colors ${
              isScrolled 
                ? 'text-neutral-800 hover:text-black' 
                : 'text-white hover:text-amber-200 drop-shadow-sm'
            }`}
          >
            {language === 'en' ? 'Home' : 'Inicio'}
          </Link>

          <div 
            className={`relative py-7 cursor-pointer flex items-center gap-1 transition-colors ${
              isScrolled 
                ? 'text-neutral-800 hover:text-black' 
                : 'text-white hover:text-amber-200 drop-shadow-sm'
            }`}
            onMouseEnter={() => setIsMegaMenuOpen(true)}
          >
            <span>{language === 'en' ? 'Catalog' : 'Catálogo'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          <Link 
            to="/booking" 
            className={`flex items-center gap-1.5 transition-colors ${
              isScrolled 
                ? 'text-neutral-800 hover:text-black' 
                : 'text-white hover:text-amber-200 drop-shadow-sm'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {language === 'en' ? 'Book Visit' : 'Agendar Visita'}
          </Link>

          <Link 
            to="/admin" 
            className={`transition-colors ${
              isScrolled 
                ? 'text-neutral-800 hover:text-black' 
                : 'text-white hover:text-amber-200 drop-shadow-sm'
            }`}
          >
            Back-office
          </Link>
        </div>

        {/* Action Controls (Westwing Underline Search + User Profile + Cart) */}
        <div className="flex items-center space-x-4 sm:space-x-5">
          
          {/* Westwing Minimalist Underline / Glass Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative">
            <input 
              type="text" 
              placeholder={language === 'en' ? 'Search lamp, style...' : 'Buscar lámpara, estilo...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-36 lg:w-52 transition-all duration-300 text-xs py-1.5 pl-2 pr-7 focus:outline-none ${
                isScrolled
                  ? 'bg-brand-surface border border-brand-border text-brand-black focus:border-black'
                  : 'bg-transparent border-b border-white/50 text-white placeholder-neutral-300 focus:border-white'
              }`}
            />
            <button 
              type="submit" 
              className={`absolute right-1.5 transition-colors ${
                isScrolled ? 'text-neutral-500 hover:text-brand-black' : 'text-white/80 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* User Account Indicator & Logout Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/admin" 
                className={`p-1.5 transition-colors flex items-center gap-1.5 border px-2.5 py-1 ${
                  isScrolled
                    ? 'border-brand-border bg-brand-surface text-brand-black'
                    : 'border-white/30 bg-black/40 text-white backdrop-blur-xs'
                }`}
                title={`Portal Back-office (${user.role})`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden lg:inline-block text-[10px] font-bold uppercase truncate max-w-[90px]">
                  {user.full_name.split(' ')[0]}
                </span>
                <span className={`text-[8px] uppercase font-bold px-1.5 py-0.2 ${
                  user.role === 'admin' ? 'bg-black text-white' : 'bg-neutral-700 text-white'
                }`}>
                  {user.role === 'admin' ? 'Admin' : 'Collab'}
                </span>
              </Link>

              <button 
                onClick={logout}
                className={`p-1.5 transition-colors ${
                  isScrolled ? 'text-neutral-400 hover:text-red-600' : 'text-white/70 hover:text-red-400'
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
                isScrolled ? 'text-neutral-800 hover:text-brand-black' : 'text-white hover:text-amber-200'
              }`}
              title="Iniciar Sesión / Registrarse"
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline-block">Entrar</span>
            </Link>
          )}

          {/* Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            className={`p-2 relative transition-colors ${
              isScrolled ? 'text-neutral-800 hover:text-brand-black' : 'text-white hover:text-amber-200'
            }`}
            aria-label="Carrito de compras"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-0 bg-brand-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-subtle">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* MegaMenu Dropdown */}
        <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-black text-white px-6 py-6 space-y-4 text-xs uppercase tracking-widest font-medium border-t border-neutral-800">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">
            {language === 'en' ? 'Home' : 'Inicio'}
          </Link>
          <Link to="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">
            {language === 'en' ? 'Full Catalog' : 'Catálogo Completo'}
          </Link>
          <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-300" /> {language === 'en' ? 'Book Appointment' : 'Agendar Cita'}
          </Link>
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">
            Back-office / Admin
          </Link>
        </div>
      )}
    </header>
  );
};
