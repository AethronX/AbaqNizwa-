import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Home, Store, Sparkles, Heart, ShoppingBag, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { cart, wishlist } = useStore();
  const { t, language } = useLanguage();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  const navItems = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'shop', label: t('nav_shop'), icon: Store },
    { id: 'custom-gift', label: language === 'en' ? 'Custom Gift' : 'صمّم هديتك', icon: Sparkles, highlight: true },
    { id: 'wishlist', label: language === 'en' ? 'Wishlist' : 'المفضلة', icon: Heart, badge: totalWishlistCount },
    { id: 'cart', label: language === 'en' ? 'Basket' : 'السلة', icon: ShoppingBag, badge: totalCartCount },
  ];

  const handleTap = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 w-full z-40 bg-white/95 dark:bg-[#0D0A0A]/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 px-1 py-1.5 shadow-2xl">
      <div className="grid grid-cols-5 items-center w-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={() => handleTap(item.id)}
                className="flex flex-col items-center justify-center relative -top-3 group focus:outline-none col-span-1"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#7D0A0A] via-[#9E0D0D] to-[#D4AF37] text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#0D0A0A] group-active:scale-95 transition-transform">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37] animate-pulse" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-[#7D0A0A] dark:text-[#D4AF37] mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTap(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-colors relative col-span-1 ${
                isActive
                  ? 'text-[#7D0A0A] dark:text-[#D4AF37] font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#7D0A0A] text-white text-[9px] font-bold px-1 py-0.2 min-w-[15px] h-3.5 rounded-full flex items-center justify-center border border-white dark:border-black">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] mt-1 leading-none whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
