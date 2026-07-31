import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, MapPin, Send, MessageCircle, Instagram } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const { t, language } = useLanguage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    showToast(
      language === 'en'
        ? 'Your message was sent successfully! Abaq Nizwa VIP team will contact you shortly ✨'
        : 'تم إرسال رسالتك بنجاح! سيتواصل معك فريق عبق نزوى قريباً ✨'
    );
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {t('contact_us')}
        </h1>
        <p className="text-xs text-gray-500">
          {language === 'en'
            ? 'We are delighted to assist with your inquiries and VIP custom requests'
            : 'يسعدنا الإجابة على استفساراتكم وتنسيق الطلبات الخاصة بكبار الشخصيات'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Contact Form */}
        <div className="bg-white dark:bg-[#151111] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg space-y-4">
          <h2 className="text-lg font-bold font-heading text-gray-900 dark:text-gray-100">
            {language === 'en' ? 'Send a Direct Message' : 'أرسل رسالة مباشرة'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">{language === 'en' ? 'Full Name:' : 'الاسم الكامل:'}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'en' ? 'Enter your full name...' : 'أدخل اسمك الكريم...'}
                className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">{language === 'en' ? 'WhatsApp / Phone:' : 'رقم التواصل (واتساب):'}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+968 91234567"
                className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">{language === 'en' ? 'Message & Inquiry Details:' : 'تفاصيل الاستفسار أو الطلب الخاص:'}</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={language === 'en' ? 'Write your request or custom requirements here...' : 'اكتب رسالتك أو استفسارك هنا...'}
                className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#7D0A0A] text-white py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'en' ? 'Send Message' : 'إرسال الرسالة'}</span>
            </button>
          </form>
        </div>

        {/* Showrooms & WhatsApp Direct Info */}
        <div className="space-y-6">
          <div className="bg-[#120D0D] text-white p-6 rounded-3xl border border-[#7D0A0A]/40 shadow-xl space-y-4">
            <h3 className="text-lg font-bold font-heading text-[#D4AF37]">
              {language === 'en' ? 'Official Flagship Showrooms in Oman' : 'معارضنا الرسمية في سلطنة عمان'}
            </h3>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="font-bold text-white">{language === 'en' ? 'Muscat Flagship Showroom' : 'معرض مسقط الرئيسي'}</h4>
                  <p>{language === 'en' ? 'Sultan Qaboos Street, Qurum - Muscat' : 'شارع السلطان قابوس، القرم - مسقط'}</p>
                  <p className="text-[11px] text-gray-400">{language === 'en' ? 'Hours: 9:00 AM - 10:00 PM' : 'ساعات العمل: 9:00 ص - 10:00 م'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="font-bold text-white">{language === 'en' ? 'Historic Nizwa Showroom' : 'معرض نزوى التاريخي'}</h4>
                  <p>{language === 'en' ? 'Near Ancient Nizwa Fort - Al Turath Quarter' : 'بالقرب من قلعة نزوى العريقة - حي التراث'}</p>
                  <p className="text-[11px] text-gray-400">{language === 'en' ? 'Hours: 9:00 AM - 10:00 PM' : 'ساعات العمل: 9:00 ص - 10:00 م'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
                <span>{language === 'en' ? 'Direct Support: +968 24123456 / +968 91234567' : 'الهاتف المباشر: +968 24123456 / +968 91234567'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <a
                href="https://wa.me/96891234567"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] text-white py-3 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'WhatsApp (+96891234567)' : 'الواتساب (+96891234567)'}</span>
              </a>

              <a
                href="https://instagram.com/abaq.nz"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white py-3 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span>{language === 'en' ? 'Instagram (@abaq.nz)' : 'انستجرام (@abaq.nz)'}</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
