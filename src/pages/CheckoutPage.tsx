import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  MapPin,
  ArrowRight,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';

interface CheckoutPageProps {
  onOrderCompleted: () => void;
  onBackToCart: () => void;
}

// Remembers sender + address details after a successful order so repeat
// customers don't have to retype everything on their next visit.
const SAVED_INFO_KEY = 'abaq_saved_checkout_info';

interface SavedCheckoutInfo {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  area: string;
  street: string;
  building: string;
}

const loadSavedInfo = (): Partial<SavedCheckoutInfo> => {
  try {
    const raw = localStorage.getItem(SAVED_INFO_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderCompleted, onBackToCart }) => {
  const { cart, cartSubtotal, discountAmount, deliveryFee, cartTotal, formatPrice, createOrder, appliedCoupon } = useStore();
  const { t, language } = useLanguage();

  const savedInfo = React.useMemo(loadSavedInfo, []);
  const isReturningCustomer = Object.keys(savedInfo).length > 0;

  const [customerName, setCustomerName] = useState(savedInfo.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(savedInfo.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(savedInfo.customerEmail || '');

  const [city, setCity] = useState(savedInfo.city || '');
  const [area, setArea] = useState(savedInfo.area || '');
  const [street, setStreet] = useState(savedInfo.street || '');
  const [building, setBuilding] = useState(savedInfo.building || '');
  const [notes, setNotes] = useState('');

  const [isForSomeoneElse, setIsForSomeoneElse] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');

  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [deliveryTime, setDeliveryTime] = useState(language === 'en' ? '5:00 PM - 8:00 PM (Evening)' : '17:00 - 20:00 (مساءً)');

  const [orderSent, setOrderSent] = useState(false);

  // Oman Cities
  const omanCities = language === 'en'
    ? ['Muscat', 'Nizwa', 'Salalah', 'Sohar', 'Sur', 'Ibri', 'Rustaq', 'Barka', 'Ibra']
    : ['مسقط', 'نزوى', 'صلالة', 'صحار', 'صور', 'عبري', 'الرستاق', 'بركاء', 'إبرا'];

  const buildWhatsAppUrl = () => {
    const itemsList = cart.map(i => `- ${language === 'en' ? i.product.nameEn : i.product.nameAr} (x${i.quantity})`).join('\n');
    const finalRecipientName = isForSomeoneElse ? recipientName : customerName;
    const finalRecipientPhone = isForSomeoneElse ? recipientPhone : customerPhone;
    const msg = encodeURIComponent(
      `مرحباً عبق نزوى ✨ أود تأكيد طلبي:\n\n` +
      `*المنتجات:*\n${itemsList}\n\n` +
      `*المبلغ الإجمالي:* ${formatPrice(cartTotal)}\n` +
      `*اسم العميل:* ${customerName} (${customerPhone})\n` +
      `*البريد الإلكتروني:* ${customerEmail}\n` +
      `*المستلم:* ${finalRecipientName} (${finalRecipientPhone})\n` +
      `*العنوان:* ${city} - ${area} - ${street}${building ? ` - ${building}` : ''}\n` +
      (notes ? `*ملاحظات التوصيل:* ${notes}\n` : '') +
      `*تاريخ ووقت التوصيل المفضل:* ${deliveryDate} (${deliveryTime})`
    );
    return `https://wa.me/96891234567?text=${msg}`;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    createOrder({
      customerName,
      customerPhone,
      customerEmail,
      recipientName: isForSomeoneElse ? recipientName : customerName,
      recipientPhone: isForSomeoneElse ? recipientPhone : customerPhone,
      shippingAddress: { city, area, street, building, notes },
      deliveryDate,
      deliveryTime,
      paymentMethod: 'whatsapp',
      paymentStatus: 'pending',
      items: cart,
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryFee,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
    });

    const infoToSave: SavedCheckoutInfo = { customerName, customerPhone, customerEmail, city, area, street, building };
    localStorage.setItem(SAVED_INFO_KEY, JSON.stringify(infoToSave));

    window.open(buildWhatsAppUrl(), '_blank');
    setOrderSent(true);
  };

  if (orderSent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
            {language === 'en' ? 'Almost done!' : 'خطوة أخيرة!'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {language === 'en'
              ? 'We opened WhatsApp with your order details ready. Please press send there to confirm your order with our team.'
              : 'فتحنا لك واتساب برسالة الطلب جاهزة. الرجاء الضغط على إرسال هناك لتأكيد طلبك مع فريقنا.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="bg-[#0B7A3D] hover:bg-[#096830] text-white px-6 py-3 rounded-full font-bold text-sm shadow-md flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'en' ? 'Open WhatsApp Again' : 'فتح واتساب مرة أخرى'}</span>
          </a>
          <button
            onClick={onOrderCompleted}
            className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-6 py-3 rounded-full font-bold text-sm shadow-xl border border-[#D4AF37]/50"
          >
            {language === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-[#7D0A0A] transition-colors"
      >
        {language === 'en' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        <span>{language === 'en' ? 'Back to Gift Basket' : 'العودة لسلة الهدايا'}</span>
      </button>

      <div className="border-b border-gray-100 dark:border-gray-800 pb-4 space-y-4">
        {/* Checkout Steps Progress Bar */}
        <div className="flex items-center justify-between max-w-xl mx-auto bg-gray-50 dark:bg-[#151111] p-3 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'en' ? '1. Gift Basket' : '١. السلة المختارة'}</span>
          </div>
          <span className="text-gray-300">➔</span>
          <div className="flex items-center gap-1.5 text-[#7D0A0A] dark:text-[#D4AF37]">
            <MapPin className="w-4 h-4" />
            <span>{language === 'en' ? '2. Address & Recipient' : '٢. العنوان والمستلم'}</span>
          </div>
          <span className="text-gray-300">➔</span>
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'en' ? '3. Send via WhatsApp' : '٣. الإرسال عبر واتساب'}</span>
          </div>
        </div>

        <div className="text-center sm:text-start">
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
            {t('checkout_title')}
          </h1>
          <p className="text-xs text-gray-500">
            {language === 'en'
              ? 'Enter delivery details and recipient address — we\'ll prepare a WhatsApp message for you to send our team'
              : 'أدخل تفاصيل التوصيل وعنوان المستلم، وسنجهز لك رسالة واتساب لإرسالها لفريقنا'}
          </p>
          {isReturningCustomer && (
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1.5 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {language === 'en'
                ? 'Welcome back! We filled in your details from last time — feel free to edit anything.'
                : 'أهلاً بعودتك! عبّأنا بياناتك من طلبك السابق — عدّل أي شيء تحتاجه.'}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left 2 Cols: Sender & Recipient */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Customer Info */}
          <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="font-bold font-heading text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <User className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
              <span>{language === 'en' ? '1. Sender Details' : '١. بيانات صاحب الطلب'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">{language === 'en' ? 'Full Name:' : 'الاسم الكامل:'}</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Ahmed Al-Balushi' : 'مثال: أحمد البلوشي'}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">{language === 'en' ? 'Phone Number:' : 'رقم الهاتف:'}</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+968 9XXX XXXX"
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">{language === 'en' ? 'Email Address:' : 'البريد الإلكتروني:'}</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Recipient Details */}
          <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-heading text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
                <span>{language === 'en' ? '2. Recipient Address & Delivery' : '٢. عنوان المستلم والتوصيل'}</span>
              </h3>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isForSomeoneElse}
                  onChange={(e) => setIsForSomeoneElse(e.target.checked)}
                  className="w-4 h-4 accent-[#7D0A0A]"
                />
                <span>{language === 'en' ? 'Send as Gift to Someone Else' : 'إهداء لشخص آخر'}</span>
              </label>
            </div>

            {isForSomeoneElse && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-3 bg-[#FCECEF]/40 dark:bg-gray-800/50 rounded-2xl border border-[#7D0A0A]/20">
                <div>
                  <label className="font-semibold block mb-1">{language === 'en' ? 'Recipient Full Name:' : 'اسم المستلم للهداية:'}</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder={language === 'en' ? 'e.g. Maryam Al-Harthy' : 'مثال: مريم الحارثية'}
                    className="w-full bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-300 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">{language === 'en' ? 'Recipient WhatsApp Phone:' : 'هاتف المستلم (واتساب):'}</label>
                  <input
                    type="text"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+968 9XXX XXXX"
                    className="w-full bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-300 dark:border-gray-700"
                  />
                </div>
              </div>
            )}

            {/* Quick Address Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#7D0A0A] dark:text-[#D4AF37] block">
                {language === 'en' ? '📍 Quick Address Fill Shortcuts:' : '📍 اختصارات تعبئة العنوان السريعة:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: language === 'en' ? 'Muscat - Qurum' : 'مسقط - القرم', c: language === 'en' ? 'Muscat' : 'مسقط', a: language === 'en' ? 'Qurum' : 'القرم', s: language === 'en' ? 'Sultan Qaboos St' : 'شارع السلطان قابوس' },
                  { label: language === 'en' ? 'Muscat - Seeb' : 'مسقط - السيب', c: language === 'en' ? 'Muscat' : 'مسقط', a: language === 'en' ? 'Seeb' : 'السيب', s: language === 'en' ? 'Al Mouj St' : 'شارع الموج' },
                  { label: language === 'en' ? 'Nizwa - Heritage Qtr' : 'نزوى - حي التراث', c: language === 'en' ? 'Nizwa' : 'نزوى', a: language === 'en' ? 'Al Turath' : 'حي التراث', s: language === 'en' ? 'Nizwa Fort St' : 'شارع قلعة نزوى' },
                  { label: language === 'en' ? 'Sohar - Corniche' : 'صحار - الكورنيش', c: language === 'en' ? 'Sohar' : 'صحار', a: language === 'en' ? 'Waqibah' : 'الوقيبة', s: language === 'en' ? 'Corniche St' : 'شارع الكورنيش' },
                  { label: language === 'en' ? 'Salalah - Saada' : 'صلالة - السعادة', c: language === 'en' ? 'Salalah' : 'صلالة', a: language === 'en' ? 'Saada' : 'السعادة', s: language === 'en' ? 'Salam St' : 'شارع السلام' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setCity(preset.c);
                      setArea(preset.a);
                      setStreet(preset.s);
                    }}
                    className="text-[11px] bg-gray-100 hover:bg-[#7D0A0A] dark:bg-gray-800 hover:text-white dark:hover:bg-[#7D0A0A] text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-semibold transition-all border border-gray-200 dark:border-gray-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">{t('city_oman')}</label>
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold"
                >
                  <option value="" disabled>{language === 'en' ? 'Select city' : 'اختر المدينة'}</option>
                  {omanCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">{t('area_district')}</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Qurum' : 'مثال: القرم'}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">{t('street_address')}</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Sultan Qaboos Street' : 'مثال: شارع السلطان قابوس'}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">{language === 'en' ? 'Building / Villa No. (Optional):' : 'رقم المبنى / الفيلا (اختياري):'}</label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Villa 12' : 'مثال: فيلا 12'}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">{language === 'en' ? 'Delivery Notes (Optional):' : 'ملاحظات التوصيل (اختياري):'}</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Please call before arrival' : 'مثال: يرجى الاتصال قبل الوصول'}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#7D0A0A]" /> {t('select_delivery_date')}
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7D0A0A]" /> {t('select_delivery_time')}
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-bold"
                >
                  <option value="10:00 - 13:00 (صباحاً)">{language === 'en' ? '10:00 AM - 1:00 PM (Morning)' : '10:00 - 13:00 (صباحاً)'}</option>
                  <option value="17:00 - 20:00 (مساءً)">{language === 'en' ? '5:00 PM - 8:00 PM (Evening)' : '17:00 - 20:00 (مساءً)'}</option>
                  <option value="20:00 - 23:00 (ليلاً)">{language === 'en' ? '8:00 PM - 11:00 PM (Night)' : '20:00 - 23:00 (ليلاً)'}</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Summary & Finish */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg space-y-6 sticky top-28">
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-3">
              {t('order_summary')}
            </h3>

            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>{t('discount')}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('delivery_fee')}</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 dark:text-gray-100 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span>{t('grand_total')}</span>
                <span className="text-xl text-[#7D0A0A] dark:text-[#D4AF37]">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
              {language === 'en'
                ? 'No online payment required. We confirm your order and arrange payment directly with you over WhatsApp.'
                : 'لا حاجة للدفع الإلكتروني. سنؤكد طلبك ونرتب الدفع معك مباشرة عبر واتساب.'}
            </p>

            <button
              type="submit"
              className="w-full bg-[#0B7A3D] hover:bg-[#096830] text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'Send Order via WhatsApp' : 'إرسال الطلب عبر واتساب'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
