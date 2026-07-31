import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import {
  Flower2,
  Instagram,
  Phone,
  Mail,
  MapPin,
  Heart
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t, language } = useLanguage();

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#120D0D] text-gray-300 pt-16 pb-8 border-t-4 border-[#7D0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7D0A0A] text-[#D4AF37] flex items-center justify-center shadow-inner">
                <Flower2 className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-wide">
                {language === 'en' ? 'Abaq Nizwa' : 'عبق نزوى'}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer_about_text')}
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#D4AF37]">
              <a
                href="https://instagram.com/abaq.nz"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#7D0A0A] hover:text-white flex items-center justify-center transition-colors group"
                title="Instagram @abaq.nz"
              >
                <Instagram className="w-4 h-4 text-[#E1306C] group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://wa.me/96891234567"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp +96891234567"
              >
                <Phone className="w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="mailto:info@abaqnizwa.com"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#7D0A0A] hover:text-white flex items-center justify-center transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-r-2 ltr:border-r-0 ltr:border-l-2 border-[#D4AF37] pr-3 ltr:pr-0 ltr:pl-3 font-heading">
              {t('quick_links')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('shop')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {language === 'en' ? 'Browse All Flowers & Gifts' : 'تصفح كافة الهدايا والورد'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('custom-gift')}
                  className="hover:text-[#D4AF37] transition-colors text-[#D4AF37] font-semibold"
                >
                  {language === 'en' ? 'Custom Gift Studio' : 'استوديو التنسيق حسب الطلب'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('categories')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {language === 'en' ? 'Flower & Chocolate Categories' : 'تصنيفات الورد والشوكولاتة'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('occasions')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {language === 'en' ? 'Wedding & Graduation Gifts' : 'هدايا الزواج والتخرج'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('track-order')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {language === 'en' ? 'Track Your Gift Order' : 'تتبع حالة طلبك'}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-r-2 ltr:border-r-0 ltr:border-l-2 border-[#D4AF37] pr-3 ltr:pr-0 ltr:pl-3 font-heading">
              {t('customer_service')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {language === 'en' ? 'About Abaq Nizwa' : 'عن علامة عبق نزوى'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {language === 'en' ? 'Contact Us & Showrooms' : 'اتصل بنا ومعارضنا'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('faq')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  الأسئلة الشائعة
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('privacy')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  سياسة الخصوصية
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('terms')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  الشروط والأحكام
                </button>
              </li>
            </ul>
          </div>

          {/* Showroom Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 border-r-2 ltr:border-r-0 ltr:border-l-2 border-[#D4AF37] pr-3 ltr:pr-0 ltr:pl-3 font-heading">
              {language === 'en' ? 'Our Showroom' : 'معرضنا في سلطنة عمان'}
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white text-xs">{language === 'en' ? 'Nizwa Main Showroom (Single Branch)' : 'معرض نزوى الرئيسي (الفرع الوحيد)'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{language === 'en' ? 'Near Historic Nizwa Fort - Al Turath Quarter' : 'بالقرب من قلعة نزوى العريقة - حي التراث'}</p>
                </div>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-[11px] text-[#D4AF37]">
                <span>{language === 'en' ? '🚀 Express delivery across all regions of Oman' : '🚀 خدمة التوصيل السريع لجميع مناطق ومحافظات سلطنة عمان'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Bottom Bar */}
        <div className="pt-8 pb-16 md:pb-0 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 px-12 md:px-0 text-center md:text-start">
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm md:max-w-none">
            <span>{t('rights_reserved')}</span>
            <span className="text-gray-600 hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-[#D4AF37]">
              صُنع بحب في عمان <Heart className="w-3 h-3 text-[#7D0A0A] fill-[#7D0A0A]" />
            </span>
          </div>

          {/* Accepted payment logos simulation */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm md:max-w-none">
            <span className="text-gray-400 text-[11px] w-full sm:w-auto text-center">وسائل الدفع المقبولة:</span>
            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white">Apple Pay</span>
            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white">Google Pay</span>
            <span className="px-2 py-1 bg-[#7D0A0A] rounded text-[10px] font-bold text-[#D4AF37]">Thawani ثواني</span>
            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white">Visa</span>
            <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white">Mastercard</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
