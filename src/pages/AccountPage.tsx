import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { User, PackageCheck, Heart, MapPin, LogOut, ShieldCheck } from 'lucide-react';

interface AccountPageProps {
  setActiveTab: (tab: string) => void;
  onTrackOrder: (orderNum: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ setActiveTab, onTrackOrder }) => {
  const { orders, wishlist, formatPrice } = useStore();
  const { t, language } = useLanguage();

  const [userProfile] = useState({
    name: language === 'en' ? 'Sheikha Al-Busaidi' : 'شيخة البوسعيدية',
    email: 'sheikha.b@gmail.com',
    phone: '+968 91112233',
    city: language === 'en' ? 'Muscat - Sultanate of Oman' : 'مسقط - سلطنة عمان',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-[#7D0A0A] to-[#4D0505] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#D4AF37]/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#7D0A0A] flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
            {userProfile.name[0]}
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold font-heading">{userProfile.name}</h1>
            <p className="text-xs text-gray-200">{userProfile.email} • {userProfile.phone}</p>
            <span className="inline-block text-[10px] bg-[#D4AF37] text-[#7D0A0A] font-extrabold px-2.5 py-0.5 rounded-full mt-1">
              {language === 'en' ? 'Gold Royal VIP Membership' : 'عضوية عبق الذهب الذهبية VIP'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('wishlist')}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold border border-white/20 flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 text-[#D4AF37]" />
            <span>{t('wishlist')} ({wishlist.length})</span>
          </button>
        </div>
      </div>

      {/* Orders History Table */}
      <div className="bg-white dark:bg-[#151111] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
          <span>{language === 'en' ? `Previous Orders History (${orders.length})` : `سجل الطلبات السابقة (${orders.length})`}</span>
        </h2>

        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-[#7D0A0A] dark:text-[#D4AF37]">
                    {ord.orderNumber}
                  </span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    {ord.status === 'delivered'
                      ? (language === 'en' ? 'Delivered' : 'تم التوصيل')
                      : (language === 'en' ? 'Processing & In Transit' : 'جاري التنسيق والتوصيل')}
                  </span>
                </div>
                <p className="text-gray-500">{language === 'en' ? 'Date:' : 'التاريخ:'} {ord.date}</p>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">
                  {language === 'en' ? 'Recipient:' : 'المستلم:'} {ord.recipientName} ({ord.shippingAddress.city})
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="font-extrabold text-sm text-gray-900 dark:text-gray-100">
                  {formatPrice(ord.total)}
                </span>
                <button
                  onClick={() => onTrackOrder(ord.orderNumber)}
                  className="bg-[#7D0A0A] text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                >
                  {t('track_order')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
