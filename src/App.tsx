import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BookingPage } from './pages/BookingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ProtectedRoute } from './components/ProtectedRoute';

// ----------------------------------------------------------------------
// INTERRUPTOR DE MANTENIMIENTO GLOBAL
// Cambiar a `false` cuando finalice el mantenimiento de la base de datos
// ----------------------------------------------------------------------
const IS_MAINTENANCE_MODE = false;

const MaintenanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isLoginPage = location.pathname === '/login';

  // Si está en mantenimiento, bloquear a todos los usuarios EXCEPTO administradores autenticados o la página de login
  if (IS_MAINTENANCE_MODE && !isAdmin && !isLoginPage) {
    return <MaintenancePage />;
  }

  return (
    <>
      {IS_MAINTENANCE_MODE && isAdmin && (
        <div className="bg-amber-600 text-white text-xs font-bold py-2 px-4 text-center sticky top-0 z-[100] flex items-center justify-center gap-2 shadow-md">
          <span>⚠️ MODO MANTENIMIENTO ACTIVO — Acceso Exclusivo de Administrador</span>
        </div>
      )}
      {children}
    </>
  );
};

const MainContent: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Automatically track page views in Google Analytics and Meta Pixel on route changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('config', 'G-GCG3E204JM', {
          page_path: location.pathname + location.search
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('track', 'PageView');
      }
    }
  }, [location]);

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <main className={`flex-1 ${isHome ? 'pt-0' : isAdmin ? 'pt-0 lg:pt-[110px]' : 'pt-[110px]'}`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'collaborator']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </main>
  );
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  // En el panel interno, la barra pública, el footer y WhatsApp se ocultan en móvil/tablet
  const publicChromeClass = isAdmin ? 'hidden lg:block' : '';

  return (
    <div className="min-h-screen flex flex-col bg-brand-white text-brand-black selection:bg-brand-black selection:text-white">
      <div className={publicChromeClass}>
        <Header />
      </div>
      <CartDrawer />

      <MainContent />

      <div className={publicChromeClass}>
        <Footer />
      </div>
      <div className={publicChromeClass}>
        <WhatsAppButton phoneNumber="573113477785" />
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <MaintenanceGuard>
              <AppShell />
            </MaintenanceGuard>
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </AuthProvider>
  );
};
