import React from 'react';
import { Flower2, Sparkles, Award, Heart, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{language === 'en' ? 'Omani Heritage & Artisanal Elegance' : 'قصة العرق والأصالة العمانية'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-gray-900 dark:text-gray-100 leading-tight">
          {language === 'en' ? 'About Abaq Nizwa Luxury Store' : 'عن علامة عبق نزوى (Abaq Nizwa)'}
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed font-light">
          {language === 'en'
            ? 'Inspired by the historic grandeur of Nizwa Castle, we craft timeless expressions of luxury through rare fresh blooms, niche perfumes, and gilded chocolates.'
            : 'نستلهم من تاريخ نزوى العريق وقلعتها الخالدة لغة الجمال والفخامة في تنسيق أندر أنواع الورد الطبيعي والعطور والشوكولاتة المذهبة.'}
        </p>
      </div>

      {/* Story Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="rounded-3xl overflow-hidden aspect-[4/3] border border-[#7D0A0A]/20 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
            alt="Abaq Nizwa Heritage"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <span className="text-xs bg-[#7D0A0A] text-[#D4AF37] font-bold px-3 py-1 rounded-full inline-block">
            {language === 'en' ? 'Our Mission & Vision' : 'رسالتنا وأهدافنا'}
          </span>
          <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-gray-100">
            {language === 'en'
              ? 'Speaking the Language of Flowers & Elegance'
              : 'نتحدث لغة الجمال وننقل مشاعركم بأرقى طريقة'}
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {language === 'en'
              ? 'Founded in the heart of Oman, Abaq Nizwa stands as the premier house for VIP wedding floral arrangements, corporate gifting, and bespoke luxury celebrations. We curate fresh Dutch and French roses wrapped in silk and gold accents.'
              : 'تأسست علامة عبق نزوى في قلب سلطنة عمان لتكون الرواد في تنسيق الهدايا الفاخرة للزفاف، التخرج، ومناسبات كبار الشخصيات. يلتزم فريقنا باختيار الورد الهولندي والفرنسي الطازج وتغليفه بالحرير والذهب.'}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-1">
              <h4 className="font-bold text-[#7D0A0A] dark:text-[#D4AF37]">
                {language === 'en' ? '100% Fresh Blooms' : 'ورد طبيعي 100%'}
              </h4>
              <p className="text-gray-500 text-[11px]">
                {language === 'en' ? 'Daily arrivals from Jebel Akhdar & Holland' : 'يصل يومياً من مزارع الجبل الأخضر وهولندا'}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-1">
              <h4 className="font-bold text-[#7D0A0A] dark:text-[#D4AF37]">
                {language === 'en' ? 'Royal Frankincense Perfumes' : 'عطور اللبان الحصرية'}
              </h4>
              <p className="text-gray-500 text-[11px]">
                {language === 'en' ? 'Niche scents infused with royal Dhofari Olibanum' : 'تركيبات نيش ملكية مستوحاة من لبان ظفار'}
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
