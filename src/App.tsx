import React, { useState, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';

import { HomePage } from './pages/HomePage';
import { Product } from './types';

// Lazy-loaded routes: only fetched when the visitor actually navigates to them,
// keeping the initial homepage bundle small.
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const OccasionsPage = lazy(() => import('./pages/OccasionsPage').then(m => ({ default: m.OccasionsPage })));
const CustomGiftStudio = lazy(() => import('./components/CustomGiftStudio').then(m => ({ default: m.CustomGiftStudio })));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage').then(m => ({ default: m.ProductDetailsPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-10 h-10 border-4 border-[#7D0A0A]/20 border-t-[#7D0A0A] dark:border-[#D4AF37]/20 dark:border-t-[#D4AF37] rounded-full animate-spin" />
  </div>
);

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FDFBFB] dark:bg-[#0F0B0B] text-gray-900 dark:text-gray-100 flex flex-col font-sans selection:bg-[#7D0A0A] selection:text-white transition-colors duration-300">
      
      {/* Toast notifications */}
      <ToastContainer />

      {/* Luxury Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Router */}
      <main className="flex-1 pb-16 lg:pb-0">
        {activeTab === 'home' && (
          <HomePage setActiveTab={setActiveTab} onSelectProduct={handleSelectProduct} />
        )}

        <Suspense fallback={<PageLoadingFallback />}>
        {activeTab === 'shop' && (
          <ShopPage onSelectProduct={handleSelectProduct} />
        )}

        {activeTab === 'categories' && (
          <CategoriesPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'occasions' && (
          <OccasionsPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'custom-gift' && (
          <CustomGiftStudio onGoToCart={() => setActiveTab('cart')} />
        )}

        {activeTab === 'product-details' && selectedProduct && (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => setActiveTab('shop')}
            onSelectProduct={handleSelectProduct}
            onGoToCart={() => setActiveTab('cart')}
          />
        )}

        {activeTab === 'cart' && (
          <CartPage
            setActiveTab={setActiveTab}
            onProceedCheckout={() => setActiveTab('checkout')}
          />
        )}

        {activeTab === 'checkout' && (
          <CheckoutPage
            onOrderCompleted={() => setActiveTab('home')}
            onBackToCart={() => setActiveTab('cart')}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'faq' && <FAQPage />}
        {activeTab === 'privacy' && <PrivacyPage />}
        {activeTab === 'terms' && <TermsPage />}

        {activeTab === 'admin' && <AdminDashboard />}
        </Suspense>
      </main>

      {/* Floating WhatsApp CTA button */}
      <FloatingWhatsApp />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Luxury Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <StoreProvider>
          <MainApp />
        </StoreProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
