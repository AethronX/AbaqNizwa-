import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

interface CategoriesPageProps {
  setActiveTab: (tab: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ setActiveTab }) => {
  const { setSelectedCategoryFilter } = useStore();
  const { language, t } = useLanguage();

  const handleCategoryClick = (catId: string) => {
    if (catId === 'custom-design') {
      setActiveTab('custom-gift');
    } else {
      setSelectedCategoryFilter(catId);
      setActiveTab('shop');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{language === 'en' ? 'Browse by Type & Collection' : 'تصفح حسب النوع والتشكيلة'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {language === 'en' ? 'Our Luxury Categories' : 'تصنيفات عبق نزوى الفاخرة'}
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          {language === 'en'
            ? 'Select your preferred section from royal rose bouquets, niche perfumes, gold chocolates and royal gift hampers.'
            : 'اختر القسم المفضل لديك من باقات الورد، العطور النيش، الشوكولاتة المذهبة وهدايا المناسبات الملكية.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="group bg-white dark:bg-[#151111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={cat.image}
                alt={language === 'en' ? cat.nameEn : cat.nameAr}
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-3 right-3 bg-[#7D0A0A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
                {cat.itemCount} {language === 'en' ? 'Products' : 'منتجاً'}
              </span>
            </div>

            <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-[#7D0A0A] dark:group-hover:text-[#D4AF37] transition-colors">
                  {language === 'en' ? cat.nameEn : cat.nameAr}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {language === 'en' ? cat.descriptionEn : cat.descriptionAr}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs font-bold text-[#7D0A0A] dark:text-[#D4AF37]">
                <span>{language === 'en' ? 'Explore Full Collection' : 'تصفح التشكيلة الكاملة'}</span>
                {language === 'en' ? (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                ) : (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
