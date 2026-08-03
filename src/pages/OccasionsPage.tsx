import React from 'react';
import { OCCASIONS } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Gift, ArrowLeft, ArrowRight } from 'lucide-react';

interface OccasionsPageProps {
  setActiveTab: (tab: string) => void;
  onSelectOccasion?: (occasionId: string) => void;
}

export const OccasionsPage: React.FC<OccasionsPageProps> = ({ setActiveTab, onSelectOccasion }) => {
  const { setSelectedCategoryFilter } = useStore();
  const { language, t } = useLanguage();

  const handleOccasionClick = (occId: string) => {
    if (onSelectOccasion) {
      onSelectOccasion(occId);
    }
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold">
          <Gift className="w-4 h-4 text-[#D4AF37]" />
          <span>{language === 'en' ? 'Bespoke Gifts for Every Precious Moment' : 'هدايا مخصصة لكل لحظة تعني لك الكثير'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {t('occasions_title')}
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          {t('occasions_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {OCCASIONS.map((occ) => {
          const occName = language === 'en' ? occ.nameEn : occ.nameAr;
          return (
            <div
              key={occ.id}
              onClick={() => handleOccasionClick(occ.id)}
              className="group bg-white dark:bg-[#151111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={occ.image}
                  alt={occName}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 right-4 left-4 text-white">
                  <span className="text-[10px] bg-[#D4AF37] text-[#7D0A0A] font-extrabold px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {language === 'en' ? 'Royal Styling' : 'تنسيق ملكي'}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-white group-hover:text-[#D4AF37] transition-colors">
                    {occName}
                  </h3>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {language === 'en'
                    ? `Luxury gift boxes and rose bouquets crafted specifically for ${occName} with customized gift cards.`
                    : `تشكيلة هدايا وباقات ورد فاخرة مصممة خصيصاً لمناسبة ${occName} مع بطاقات إهداء مخصصة.`}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOccasionClick(occ.id);
                  }}
                  className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-[#7D0A0A] hover:text-white dark:hover:bg-[#7D0A0A] text-gray-800 dark:text-gray-200 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 group-hover:bg-[#7D0A0A] group-hover:text-white"
                >
                  <span>{language === 'en' ? `Browse ${occName} Gifts` : `تصفح هدايا ${occName}`}</span>
                  {language === 'en' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
