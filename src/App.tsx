import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ToastContainer } from './components/ToastContainer';
import { CustomGiftStudio } from './components/CustomGiftStudio';
import { MobileBottomNav } from './components/MobileBottomNav';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OccasionsPage } from './pages/OccasionsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Product } from './types';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [trackOrderNumber, setTrackOrderNumber] = useState<string | undefined>(undefined);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromPage = (orderNum: string) => {
    setTrackOrderNumber(orderNum);
    setActiveTab('track-order');
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
            onOrderCompleted={(order) => {
              setTrackOrderNumber(order.orderNumber);
              setActiveTab('track-order');
            }}
            onBackToCart={() => setActiveTab('cart')}
          />
        )}

        {activeTab === 'wishlist' && (
          <WishlistPage
            onSelectProduct={handleSelectProduct}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'track-order' && (
          <TrackOrderPage initialOrderNumber={trackOrderNumber} />
        )}

        {activeTab === 'account' && (
          <AccountPage
            setActiveTab={setActiveTab}
            onTrackOrder={handleTrackOrderFromPage}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
        {activeTab === 'contact' && <ContactPage />}
        {activeTab === 'faq' && <FAQPage />}
        {activeTab === 'privacy' && <PrivacyPage />}
        {activeTab === 'terms' && <TermsPage />}

        {activeTab === 'admin' && <AdminDashboard />}
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
