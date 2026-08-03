import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Order } from '../types';
import {
  Search,
  PackageCheck,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Calendar,
  Sparkles,
  Phone
} from 'lucide-react';

interface TrackOrderPageProps {
  initialOrderNumber?: string;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ initialOrderNumber }) => {
  const { getOrderByIdOrNumber, orders, formatPrice } = useStore();
  const { t, language } = useLanguage();

  const [searchCode, setSearchCode] = useState(initialOrderNumber || 'AN-89241');
  const [searchedOrder, setSearchedOrder] = useState<Order | undefined>(() => {
    return getOrderByIdOrNumber(initialOrderNumber || 'AN-89241') || orders[0];
  });

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode) return;
    const found = getOrderByIdOrNumber(searchCode);
    setSearchedOrder(found);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold">
          <PackageCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>{language === 'en' ? 'Live Royal Order Tracking' : 'تتبع الشحنات الملكية فورياً'}</span>
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {t('track_order_title')}
        </h1>
        <p className="text-xs text-gray-500">
          {language === 'en'
            ? 'Enter your order number to trace floral preparation, wrapping, and express courier status'
            : 'أدخل رقم الطلب الخاص بك لمتابعة مراحل تجهيز الورد والتوصيل المباشر'}
        </p>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleTrackSearch} className="max-w-lg mx-auto flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder={language === 'en' ? 'Enter Order No. (e.g. AN-89241)...' : 'أدخل رقم الطلب (مثال: AN-89241)...'}
            className="w-full bg-white dark:bg-[#151111] text-gray-900 dark:text-gray-100 pr-10 pl-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-sm font-bold shadow-sm focus:outline-none focus:border-[#7D0A0A]"
          />
          <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
        </div>
        <button
          type="submit"
          className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md border border-[#D4AF37]/40 shrink-0"
        >
          {t('track_order')}
        </button>
      </form>

      {/* Result Display */}
      {searchedOrder ? (
        <div className="bg-white dark:bg-[#151111] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-xs text-gray-500 block">{language === 'en' ? 'Order Number:' : 'رقم الطلب:'}</span>
              <h2 className="text-2xl font-extrabold font-heading text-[#7D0A0A] dark:text-[#D4AF37]">
                {searchedOrder.orderNumber}
              </h2>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">{language === 'en' ? 'Order Date:' : 'تاريخ الطلب:'} {searchedOrder.date}</span>
            </div>

            <div className="flex flex-col sm:items-end gap-1">
              <span className="text-xs text-gray-500">{language === 'en' ? 'Current Status:' : 'حالة الطلب الحالية:'}</span>
              <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#7D0A0A] text-white border border-[#D4AF37]/40 shadow-sm">
                {searchedOrder.status === 'pending' && (language === 'en' ? 'Processing' : 'قيد المعالجة')}
                {searchedOrder.status === 'preparing' && (language === 'en' ? 'Fresh Floral Selection' : 'تجهيز الورد')}
                {searchedOrder.status === 'arranging' && (language === 'en' ? 'Bespoke Arrangement' : 'تنسيق الباقة الملكية')}
                {searchedOrder.status === 'shipped' && (language === 'en' ? 'Out for Delivery 🚚' : 'خرجت للتوصيل 🚚')}
                {searchedOrder.status === 'delivered' && (language === 'en' ? 'Delivered Successfully ✓' : 'تم التوصيل بنجاح ✓')}
              </span>
            </div>
          </div>

          {/* Timeline Visual Progress */}
          <div className="space-y-6">
            <h3 className="font-heading font-bold text-base text-gray-900 dark:text-gray-100">
              {language === 'en' ? 'Preparation & Delivery Timeline:' : 'خط زمني لمراحل التجهيز والتوصيل:'}
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:right-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
              {searchedOrder.trackingTimeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pr-8">
                  <div
                    className={`absolute right-0 top-1 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-md z-10 ${
                      step.completed
                        ? 'bg-[#7D0A0A] text-[#D4AF37] border-2 border-[#D4AF37]'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </div>

                  <div className={`p-4 rounded-2xl border flex-1 transition-all ${
                    step.current
                      ? 'bg-[#FCECEF]/60 dark:bg-[#7D0A0A]/20 border-[#7D0A0A]'
                      : 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <h4 className={`font-bold text-sm ${step.completed ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                        {language === 'en' ? step.titleEn : step.titleAr}
                      </h4>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">{step.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipient & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800 text-xs">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl space-y-1">
              <span className="text-gray-500 block font-semibold">{language === 'en' ? 'Recipient Details:' : 'اسم وسجل المستلم:'}</span>
              <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">{searchedOrder.recipientName}</h5>
              <p className="text-gray-500">{searchedOrder.recipientPhone}</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl space-y-1">
              <span className="text-gray-500 block font-semibold">{language === 'en' ? 'Delivery Address:' : 'عنوان التوصيل:'}</span>
              <h5 className="font-bold text-sm text-gray-900 dark:text-gray-100">{searchedOrder.shippingAddress.city} - {searchedOrder.shippingAddress.area}</h5>
              <p className="text-gray-500">{searchedOrder.shippingAddress.street}</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-[#151111] rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
          <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
            {language === 'en'
              ? 'No order found with this code. Please verify the code format (e.g. AN-89241).'
              : 'لم نجد طلب بهذا الرقم. يرجى التأكد من كتابة الرقم مثل (AN-89241).'}
          </p>
        </div>
      )}

    </div>
  );
};
