import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ShieldCheck,
  User,
  Sparkles,
  Flower2,
  PackageCheck,
  Truck,
  Instagram
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, dir, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const {
    cart,
    wishlist,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    isAdmin,
    setIsAdmin,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistCount = wishlist.length;

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: t('nav_home') },
    { id: 'shop', label: t('nav_shop') },
    { id: 'categories', label: t('nav_categories') },
    { id: 'custom-gift', label: t('nav_custom_gift'), highlight: true },
    { id: 'occasions', label: t('nav_occasions') },
    { id: 'track-order', label: t('nav_track_order') },
    { id: 'about', label: t('nav_about') },
    { id: 'contact', label: t('nav_contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D0A0A]/95 backdrop-blur-md border-b border-[#7D0A0A]/10 dark:border-white/10 transition-colors">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 text-right focus:outline-none group shrink-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#7D0A0A] text-[#D4AF37] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-[#D4AF37]/30 shrink-0">
              <Flower2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg sm:text-2xl tracking-wide text-[#7D0A0A] dark:text-[#F3F3F3] leading-none whitespace-nowrap">
                عبق نزوى
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-widest text-[#D4AF37] uppercase font-serif-accent mt-0.5">
                Abaq Nizwa • Oman
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-all relative py-1 ${
                  activeTab === link.id
                    ? 'text-[#7D0A0A] dark:text-[#D4AF37] font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#7D0A0A] dark:hover:text-[#D4AF37]'
                }`}
              >
                {link.highlight ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] border border-[#7D0A0A]/20 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    {link.label}
                  </span>
                ) : (
                  link.label
                )}
                {activeTab === link.id && !link.highlight && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7D0A0A] dark:bg-[#D4AF37] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            
            {/* Currency Switcher (Hidden on small mobile, accessible in drawer) */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="hidden sm:inline-block bg-gray-100 dark:bg-[#1A1515] text-xs font-semibold px-2 py-1.5 rounded-md border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 cursor-pointer focus:outline-none"
            >
              <option value="OMR">ر.ع. (OMR)</option>
              <option value="SAR">ر.س (SAR)</option>
              <option value="USD">$ (USD)</option>
            </select>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1515] text-gray-700 dark:text-gray-300 transition-colors flex items-center gap-1 text-xs font-bold"
              title="تغيير اللغة"
            >
              <Globe className="w-4 h-4 text-[#7D0A0A] dark:text-[#D4AF37]" />
              <span className="uppercase text-[11px] sm:text-xs">{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1515] text-gray-700 dark:text-gray-300 transition-colors"
              title="تغيير المظهر"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-gray-700" />
              ) : (
                <Sun className="w-4 h-4 text-[#D4AF37]" />
              )}
            </button>

            {/* Search Trigger Button */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (activeTab !== 'shop') {
                  setActiveTab('shop');
                }
              }}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1515] text-gray-700 dark:text-gray-300 transition-colors relative"
              title="بحث في المتجر"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 hover:text-[#7D0A0A]" />
            </button>

            {/* Wishlist Button (Hidden on small screens since it's in bottom bar) */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1515] text-gray-700 dark:text-gray-300 transition-colors relative"
              title="المفضلة"
            >
              <Heart className={`w-5 h-5 ${totalWishlistCount > 0 ? 'text-[#7D0A0A] fill-[#7D0A0A]' : ''}`} />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7D0A0A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalWishlistCount}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              onClick={() => handleNavClick('account')}
              className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1515] text-gray-700 dark:text-gray-300 transition-colors"
              title="حسابي"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => handleNavClick('cart')}
              className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-semibold hidden sm:inline">{t('nav_cart')}</span>
              {totalCartCount > 0 && (
                <span className="bg-[#D4AF37] text-[#7D0A0A] font-bold text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin shortcut if admin mode */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="hidden sm:inline-block bg-[#D4AF37] text-[#7D0A0A] font-bold px-2.5 py-1 rounded-md text-xs border border-[#7D0A0A]/30 shadow-sm"
              >
                الأدمن
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>
        </div>

        {/* Live Search Bar Popup */}
        {searchOpen && (
          <div className="pb-4 pt-1 px-2 border-t border-gray-100 dark:border-gray-800 animate-fadeIn">
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="ابحث عن باقات ورد، شوكولاتة، عطور، هدايا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-gray-50 dark:bg-[#161212] text-gray-900 dark:text-gray-100 pr-10 pl-10 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-[#7D0A0A] text-sm shadow-inner"
              />
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#120E0E] border-t border-gray-200 dark:border-gray-800 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-right py-2.5 px-3 rounded-lg text-base font-medium flex items-center justify-between ${
                activeTab === link.id
                  ? 'bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] font-bold'
                  : 'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>{link.label}</span>
              {link.highlight && (
                <span className="text-xs bg-[#7D0A0A] text-white px-2 py-0.5 rounded-full">
                  استوديو
                </span>
              )}
            </button>
          ))}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-gray-700 dark:text-gray-300">العملة:</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="bg-gray-100 dark:bg-[#1A1515] text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200"
                >
                  <option value="OMR">ر.ع. (OMR)</option>
                  <option value="SAR">ر.س (SAR)</option>
                  <option value="USD">$ (USD)</option>
                </select>
              </div>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-700"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#7D0A0A]" />
                    <span>{language === 'en' ? 'Dark Mode' : 'المظهر الليلي'}</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{language === 'en' ? 'Light Mode' : 'المظهر النهاري'}</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="text-gray-500 hover:underline"
            >
              {isAdmin ? 'خروج الأدمن' : 'دخول الأدمن'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
