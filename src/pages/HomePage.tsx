import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';
import { CATEGORIES, OCCASIONS, BANNERS, INSTAGRAM_POSTS } from '../data/mockData';
import { Product } from '../types';
import heroFallbackImg from '../assets/images/nizwa_hero_banner_1785404588402.jpg';
import bouquetFallbackImg from '../assets/images/royal_flower_bouquet_1785404632631.jpg';
import customGiftStudioImg from '../assets/images/abaq_hero_banner_1785401665275.jpg';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Flower2,
  Gift,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, onSelectProduct }) => {
  const { products } = useStore();
  const { t, language } = useLanguage();

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeBestSellerTab, setActiveBestSellerTab] = useState('all');

  // Filtered best sellers
  const bestSellers = products.filter((p) => p.isBestSeller || p.isFeatured);
  const displayedBestSellers = activeBestSellerTab === 'all'
    ? bestSellers
    : bestSellers.filter((p) => p.category === activeBestSellerTab);

  const currentBanner = BANNERS[currentBannerIndex];

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % BANNERS.length);
  };
  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#0F0B0B] text-white">
        <div className="relative min-h-[540px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
          {/* Background Image & Ambient Overlays */}
          <div className="absolute inset-0">
            <img
              src={currentBanner.image}
              alt={currentBanner.titleAr}
              referrerPolicy="no-referrer"
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = heroFallbackImg;
              }}
              className="w-full h-full object-cover object-center filter brightness-65 scale-105 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent rtl:bg-gradient-to-l" />
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#0F0B0B] via-[#0F0B0B]/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 sm:py-16 w-full">
            <div className="max-w-2xl space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-4 py-1.5 rounded-full text-xs font-bold text-[#D4AF37] tracking-wider animate-fadeIn backdrop-blur-md shadow-lg">
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span>{language === 'en' ? 'ABAQ NIZWA • Authentic Omani Royal Flowers & Gifts' : 'عـبـق نـزوَى • أصالة الورد الهدايا العمانية الفاخرة'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-tight text-white drop-shadow-lg">
                {language === 'en' ? currentBanner.titleEn : currentBanner.titleAr}
              </h1>

              <p className="text-sm sm:text-lg text-gray-200 font-light leading-relaxed max-w-xl">
                {language === 'en' ? currentBanner.subtitleEn : currentBanner.subtitleAr}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => setActiveTab('shop')}
                  className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-7 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-2xl flex items-center gap-2.5 border border-[#D4AF37]/60 transition-all hover:scale-105 active:scale-95"
                >
                  <span>{language === 'en' ? currentBanner.buttonTextEn : currentBanner.buttonTextAr}</span>
                  {language === 'en' ? <ArrowRight className="w-4 h-4 text-[#D4AF37]" /> : <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />}
                </button>

                <button
                  onClick={() => setActiveTab('custom-gift')}
                  className="bg-white/15 hover:bg-white/25 text-white px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm backdrop-blur-md border border-white/30 transition-all flex items-center gap-2 hover:border-[#D4AF37]/60"
                >
                  <Gift className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'en' ? 'Build Custom Gift' : 'صمّم هديتك حسب الطلب'}</span>
                </button>
              </div>

              {/* Trust Badge Social Proof */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-gray-300 border-t border-white/10 max-w-lg">
                <span className="text-gray-200 font-medium">
                  {language === 'en' ? 'Trusted by 5,000+ Happy Clients in Oman 🇴🇲' : 'أكثر من 5,000+ زبون سعيد في سلطنة عمان 🇴🇲'}
                </span>
              </div>

            </div>
          </div>

          {/* Carousel Pagination & Arrows */}
          <div className="absolute bottom-8 left-4 right-4 sm:left-8 sm:right-8 z-20 flex items-center justify-between pointer-events-none">
            {/* Dots */}
            <div className="flex items-center pointer-events-auto bg-black/40 backdrop-blur-md px-1 py-1.5 rounded-full border border-white/10">
              {BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className="p-2 flex items-center justify-center"
                  aria-label={`Go to banner ${idx + 1}`}
                >
                  <span
                    className={`block h-2 rounded-full transition-all duration-300 ${
                      currentBannerIndex === idx ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Arrows */}
            <div className="hidden sm:flex items-center gap-2 pointer-events-auto">
              <button
                onClick={prevBanner}
                className="p-2.5 rounded-full bg-black/50 hover:bg-[#7D0A0A] text-white transition-colors border border-white/20 backdrop-blur-md"
                aria-label="Previous banner"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={nextBanner}
                className="p-2.5 rounded-full bg-black/50 hover:bg-[#7D0A0A] text-white transition-colors border border-white/20 backdrop-blur-md"
                aria-label="Next banner"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND VALUES / FEATURES BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-white dark:bg-[#151111] rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-gray-800/80 shadow-md">
          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50/70 dark:bg-white/5 border border-transparent hover:border-[#D4AF37]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                {language === 'en' ? 'Same-Day Express Delivery' : 'توصيل سريع بنفس اليوم'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {language === 'en' ? 'Across all governorates in Oman' : 'في كافة محافظات عمان'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50/70 dark:bg-white/5 border border-transparent hover:border-[#D4AF37]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                {language === 'en' ? '100% Fresh Roses Daily' : 'ورد طازج 100% يومياً'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {language === 'en' ? 'Imported from premier global farms' : 'مستورد من أفضل المزارع العالمية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50/70 dark:bg-white/5 border border-transparent hover:border-[#D4AF37]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                {language === 'en' ? 'Royal Gift Wrapping' : 'تغليف ملكي فاخر'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {language === 'en' ? 'Personalized velvet gift cards' : 'بطاقات إهداء مخصصة ومخملية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-gray-50/70 dark:bg-white/5 border border-transparent hover:border-[#D4AF37]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                {language === 'en' ? '100% Secure Payment' : 'دفع آمن ومضمون 100%'}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {language === 'en' ? 'Thawani & Debit Card Options' : 'عبر ثواني والبطاقات البنكية'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#7D0A0A] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'en' ? 'Main Categories' : 'التصنيفات الرئيسية'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
              {t('cat_title')}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('categories')}
            className="text-xs font-bold text-[#7D0A0A] dark:text-[#D4AF37] hover:underline flex items-center gap-1 self-start"
          >
            <span>{language === 'en' ? `View All Categories (${CATEGORIES.length})` : `عرض كافة التصنيفات (${CATEGORIES.length})`}</span>
            {language === 'en' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.id === 'custom-design') {
                  setActiveTab('custom-gift');
                } else {
                  setActiveTab('shop');
                }
              }}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={language === 'en' ? cat.nameEn : cat.nameAr}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = bouquetFallbackImg;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              
              <div className="absolute bottom-4 right-4 left-4 text-white space-y-1">
                <span className="text-[10px] bg-[#D4AF37] text-[#7D0A0A] font-extrabold px-2 py-0.5 rounded-full inline-block">
                  {cat.itemCount} {language === 'en' ? 'Items' : 'تشكيلة'}
                </span>
                <h3 className="font-heading font-bold text-base sm:text-lg group-hover:text-[#D4AF37] transition-colors">
                  {language === 'en' ? cat.nameEn : cat.nameAr}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#7D0A0A] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-[#D4AF37]" />
              <span>{language === 'en' ? 'VIP Choice' : 'اختيارات نخبة العملاء'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
              {t('best_sellers')}
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: language === 'en' ? 'All' : 'الكل' },
              { id: 'bouquets', label: language === 'en' ? 'Roses' : 'الورد' },
              { id: 'chocolates', label: language === 'en' ? 'Chocolates' : 'الشوكولاتة' },
              { id: 'perfumes', label: language === 'en' ? 'Perfumes' : 'العطور' },
              { id: 'wedding', label: language === 'en' ? 'Weddings' : 'الزواج' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveBestSellerTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  activeBestSellerTab === tab.id
                    ? 'bg-[#7D0A0A] text-white shadow'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedBestSellers.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* CUSTOM DESIGN STUDIO CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1A1212] via-[#2A1616] to-[#1A1212] rounded-3xl p-8 lg:p-12 text-white border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 z-10">
            <span className="text-xs bg-[#D4AF37] text-[#7D0A0A] font-extrabold px-3 py-1 rounded-full inline-block">
              {language === 'en' ? 'Custom Gift Studio' : 'استوديو الهدايا المخصصة'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight text-white">
              {language === 'en' ? 'Craft Your Gift With Roses, Gold & Perfumes' : 'صمم هديتك الخاصة بالورد والذهب والعطور'}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
              {language === 'en'
                ? 'Select crystal vase, rose count & color, velvet ribbons, gold chocolates, and luxury card for direct delivery across Oman.'
                : 'اختر الفازة الكريستالية، عدد ونوع الورود، لون التغليف وشريط الإهداء وشوكولاتة الذهب وسنقوم بصنعها بحرفية عالية وتوصيلها لمستلمها في عمان.'}
            </p>
            <button
              onClick={() => setActiveTab('custom-gift')}
              className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 border border-[#D4AF37]/50"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'en' ? 'Start Design Studio' : 'ابدأ التنسيق الفوري الآن'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 shadow-lg">
            <img
              src={customGiftStudioImg}
              alt="Custom Gift Studio"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* OCCASIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[#7D0A0A] dark:text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Gift className="w-4 h-4" />
            <span>{language === 'en' ? 'Gifts for Every Moment' : 'هدايا لكافة المناسبات'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
            {t('occasions_title')}
          </h2>
          <p className="text-xs text-gray-500">{t('occasions_subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => setActiveTab('shop')}
              className="group bg-white dark:bg-[#151111] p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all cursor-pointer text-center space-y-3"
            >
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={occ.image}
                  alt={language === 'en' ? occ.nameEn : occ.nameAr}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 group-hover:text-[#7D0A0A] dark:group-hover:text-[#D4AF37]">
                {language === 'en' ? occ.nameEn : occ.nameAr}
              </h3>
            </div>
          ))}
        </div>
      </section>


      {/* INSTAGRAM FEED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Instagram className="w-6 h-6 text-[#E1306C]" />
            <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100">
              {t('instagram_title')} <a href="https://instagram.com/abaq.nz" target="_blank" rel="noreferrer" className="text-[#7D0A0A] dark:text-[#D4AF37] font-serif-accent text-sm hover:underline">@abaq.nz</a>
            </h2>
          </div>
          <a
            href="https://instagram.com/abaq.nz"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-[#7D0A0A] dark:text-[#D4AF37] bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-[#7D0A0A] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
            <span>{language === 'en' ? 'Follow @abaq.nz →' : 'متابعة @abaq.nz ←'}</span>
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm"
            >
              <img
                src={post.image}
                alt={language === 'en' ? post.captionEn : post.captionAr}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-3">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-white" /> {post.likes}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onGoToDetails={(p) => {
            setQuickViewProduct(null);
            onSelectProduct(p);
          }}
        />
      )}

    </div>
  );
};
