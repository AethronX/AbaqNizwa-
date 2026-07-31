import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { Heart, Sparkles } from 'lucide-react';

interface WishlistPageProps {
  onSelectProduct: (product: Product) => void;
  setActiveTab: (tab: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectProduct, setActiveTab }) => {
  const { wishlist } = useStore();
  const { t, language } = useLanguage();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-10 h-10 fill-[#7D0A0A]" />
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {t('wishlist_empty')}
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          {language === 'en'
            ? 'Click the heart icon on any floral product or gift to save it here for later.'
            : 'انقر على رمز القلب الموجود على أي منتج أو باقة ورد لحفظها في قائمتك المفضلة والعودة إليها لاحقاً.'}
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="bg-[#7D0A0A] text-white px-8 py-3.5 rounded-full font-bold text-xs shadow-xl inline-flex items-center gap-2 border border-[#D4AF37]/40"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{t('continue_shopping')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {language === 'en' ? `Wishlist Saved Items (${wishlist.length})` : `الهدايا والمنتجات المفضلة (${wishlist.length})`}
        </h1>
        <p className="text-xs text-gray-500">
          {language === 'en'
            ? 'Your saved selection of luxury flowers, perfumes, and chocolates'
            : 'مجموعتك الخاصة المحفوظة من الورد والعطور والشوكولاتة الفاخرة'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <ProductCard
            key={item.product.id}
            product={item.product}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};
