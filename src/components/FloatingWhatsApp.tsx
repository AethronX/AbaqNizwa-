import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FloatingWhatsApp: React.FC = () => {
  const { language } = useLanguage();
  const whatsappUrl = 'https://wa.me/96891234567?text=' + encodeURIComponent('مرحباً فريق عبق نزوى، أود الاستفسار عن تنسيق هدية خاصة ✨');

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 lg:bottom-6 left-3 sm:left-4 lg:left-6 z-40 bg-[#25D366] hover:bg-[#1EBE5A] text-white p-2.5 sm:p-3.5 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 group border-2 border-white/60 active:scale-95"
      title={language === 'ar' ? 'تواصل مباشر عبر الواتساب' : 'Direct WhatsApp Contact'}
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold px-0 group-hover:px-2">
        {language === 'ar' ? 'خدمة العملاء' : 'WhatsApp'}
      </span>
    </a>
  );
};

