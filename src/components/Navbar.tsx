import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Sparkles,
} from 'lucide-react';
import logo from '../assets/logo-abaq-nizwa.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const {
    cart,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
    isAdmin,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Core destinations get top billing in the main bar; secondary utility
  // links (help/support-style pages) move into a slim strip above it —
  // keeps the primary bar to a scannable handful of items.
  const primaryLinks = [
    { id: 'home', label: t('nav_home') },
    { id: 'shop', label: t('nav_shop') },
    { id: 'categories', label: t('nav_categories') },
    { id: 'occasions', label: t('nav_occasions') },
  ];
  const utilityLinks = [
    { id: 'about', label: t('nav_about') },
    { id: 'contact', label: t('nav_contact') },
  ];
  const mobileLinks: { id: string; label: string; highlight?: boolean }[] = [
    ...primaryLinks,
    { id: 'custom-gift', label: t('nav_custom_gift'), highlight: true },
    ...utilityLinks,
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0D0A0A]/95 backdrop-blur-md border-b border-[#7D0A0A]/10 dark:border-white/10 transition-colors">
      {/* Utility Strip: language / currency / theme / support links — desktop only */}
      <div className="hidden lg:block border-b border-[#7D0A0A]/10 dark:border-white/10 bg-[#FBF6F3] dark:bg-[#0A0707]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {utilityLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-[11.5px] font-medium text-gray-500 dark:text-gray-400 hover:text-[#7D0A0A] dark:hover:text-[#D4AF37] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[11.5px]">
            <button
              onClick={toggleTheme}
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[#7D0A0A] dark:hover:text-[#D4AF37] transition-colors"
              title="تغيير المظهر"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />}
            </button>
            <span className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 font-bold uppercase text-gray-500 dark:text-gray-400 hover:text-[#7D0A0A] dark:hover:text-[#D4AF37] transition-colors"
              title="تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>
            <span className="w-px h-3 bg-gray-300 dark:bg-gray-700" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-transparent font-bold text-gray-500 dark:text-gray-400 hover:text-[#7D0A0A] dark:hover:text-[#D4AF37] cursor-pointer focus:outline-none transition-colors"
            >
              <option value="OMR">ر.ع. (OMR)</option>
              <option value="SAR">ر.س (SAR)</option>
              <option value="USD">$ (USD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">

          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 text-right focus:outline-none group shrink-0"
          >
            <img
              src={logo}
              alt="عبق نزوى - Abaq Nizwa"
              width={429}
              height={400}
              fetchPriority="high"
              className="h-10 sm:h-12 w-auto shrink-0 group-hover:scale-105 transition-transform"
            />
            <span className="hidden sm:inline-block text-[10px] tracking-widest text-[#8C6914] dark:text-[#D4AF37] uppercase font-serif-accent">
              Abaq Nizwa • Oman
            </span>
          </button>

          {/* Desktop Primary Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {primaryLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-[14.5px] font-semibold tracking-wide transition-colors relative py-1 ${
                  activeTab === link.id
                    ? 'text-[#7D0A0A] dark:text-[#D4AF37]'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#7D0A0A] dark:hover:text-[#D4AF37]'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-[#7D0A0A] dark:bg-[#D4AF37] rounded-full origin-center transition-transform duration-200 ${
                    activeTab === link.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Custom Gift Studio — distinct CTA, not a plain nav link */}
          <button
            onClick={() => handleNavClick('custom-gift')}
            className={`hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-bold transition-all shrink-0 ${
              activeTab === 'custom-gift'
                ? 'bg-[#7D0A0A] border-[#7D0A0A] text-white shadow-md'
                : 'bg-gradient-to-r from-[#FCECEF] to-white dark:from-[#7D0A0A]/25 dark:to-transparent border-[#D4AF37]/50 text-[#7D0A0A] dark:text-[#D4AF37] hover:border-[#D4AF37] hover:shadow-md'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'custom-gift' ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`} />
            {t('nav_custom_gift')}
          </button>

          {/* Action Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1 ms-auto lg:ms-0">
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (activeTab !== 'shop') {
                  setActiveTab('shop');
                }
              }}
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1515] text-gray-700 dark:text-gray-300 transition-colors"
              title="بحث في المتجر"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 hover:text-[#7D0A0A]" />
            </button>
          </div>

          <span className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-gray-800" />

          {/* Cart Button */}
          <button
            onClick={() => handleNavClick('cart')}
            aria-label={t('nav_cart')}
            className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95 shrink-0"
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
              className="hidden sm:inline-block bg-[#D4AF37] text-[#7D0A0A] font-bold px-2.5 py-1 rounded-md text-xs border border-[#7D0A0A]/30 shadow-sm shrink-0"
            >
              الأدمن
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={language === 'en' ? 'Toggle menu' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

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
                  aria-label={language === 'en' ? 'Clear search' : 'مسح البحث'}
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
          {mobileLinks.map((link) => (
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
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2 text-xs text-gray-500 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-gray-100 dark:bg-[#1A1515] text-xs font-semibold px-2 py-1 rounded-md border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200"
              >
                <option value="OMR">ر.ع. (OMR)</option>
                <option value="SAR">ر.س (SAR)</option>
                <option value="USD">$ (USD)</option>
              </select>

              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold border border-gray-200 dark:border-gray-700"
              >
                <Globe className="w-3.5 h-3.5 text-[#7D0A0A] dark:text-[#D4AF37]" />
                {language === 'ar' ? 'EN' : 'عربي'}
              </button>

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
          </div>
        </div>
      )}
    </header>
  );
};
