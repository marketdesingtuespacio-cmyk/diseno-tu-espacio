import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { WhatsAppButton } from './components/WhatsAppButton';
import { ProtectedRoute } from './components/ProtectedRoute';

// Code-split secondary and heavy routes so initial homepage load is ultra-fast
const CatalogPage = lazy(() =>
  import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const BookingPage = lazy(() =>
  import('./pages/BookingPage').then((m) => ({ default: m.BookingPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage }))
);
const MaintenancePage = lazy(() =>
  import('./pages/MaintenancePage').then((m) => ({ default: m.MaintenancePage }))
);

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

  if (IS_MAINTENANCE_MODE && !isAdmin && !isLoginPage) {
    return (
      <Suspense fallback={null}>
        <MaintenancePage />
      </Suspense>
    );
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    if (typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('config', 'G-GCG3E204JM', {
          page_path: location.pathname + location.search,
        });
      }
      if ((window as any).fbq) {
        (window as any).fbq('track', 'PageView');
      }
    }
  }, [location.pathname, location.search]);

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <main className={`flex-1 ${isAdmin ? 'pt-0 lg:pt-[140px]' : 'pt-[116px] md:pt-[130px] lg:pt-[140px]'}`}>
      <Suspense
        fallback={
          <div className="min-h-[55vh] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/p/:slug" element={<ProductDetailPage />} />
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
      </Suspense>
    </main>
  );
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
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
