import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tag,
  ShieldCheck,
  Calendar,
  Gift,
  X
} from 'lucide-react';

interface CartPageProps {
  setActiveTab: (tab: string) => void;
  onProceedCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setActiveTab, onProceedCheckout }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    deliveryFee,
    cartTotal,
    formatPrice,
    showToast,
  } = useStore();

  const { t, language } = useLanguage();
  const [couponCodeInput, setCouponCodeInput] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput) return;
    const res = applyCoupon(couponCodeInput);
    if (res.success) {
      setCouponCodeInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-24 h-24 bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {t('empty_cart')}
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          {language === 'en'
            ? 'You have not added any roses, chocolates, or customized gifts to your basket yet. Explore Abaq Nizwa royal collections now!'
            : 'لم تقم بإضافة أي ورد أو شوكولاتة أو هدايا مخصصة إلى سلتك بعد. استكشف مجموعات عبق نزوى الفاخرة الآن!'}
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl inline-flex items-center gap-2 border border-[#D4AF37]/40"
        >
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{t('continue_shopping')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {language === 'en' ? `Royal Gift Basket (${cart.length} items)` : `سلة الهدايا الملكية (${cart.length} منتجات)`}
        </h1>
        <p className="text-xs text-gray-500">
          {language === 'en'
            ? 'Review items, gift message cards, and bespoke customizations before checkout'
            : 'مراجعة المنتجات والبطاقات وتخصيصات الإهداء قبل المتابعة والدفع'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const itemName = language === 'en' ? item.product.nameEn : item.product.nameAr;
            return (
              <div
                key={item.cartId}
                className="bg-white dark:bg-[#151111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={item.product.images[0]}
                    alt={itemName}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-100 dark:border-gray-800"
                  />
                  <div className="space-y-1 text-xs">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 font-heading">
                      {itemName}
                    </h3>

                    {item.selectedSize && (
                      <span className="text-gray-500 block">
                        {language === 'en' ? 'Size:' : 'الحجم:'} {item.selectedSize}
                      </span>
                    )}
                    {item.selectedWrappingColor && (
                      <span className="text-gray-500 block">
                        {language === 'en' ? 'Wrapping:' : 'التغليف:'} {item.selectedWrappingColor}
                      </span>
                    )}
                    {item.selectedFlowerCount && (
                      <span className="text-gray-500 block">
                        {language === 'en' ? 'Roses:' : 'عدد الورود:'} {item.selectedFlowerCount} {language === 'en' ? 'Roses' : 'وردة'}
                      </span>
                    )}

                    {item.cardMessage && (
                      <div className="bg-[#FCECEF]/60 dark:bg-[#7D0A0A]/20 p-2 rounded-lg text-[11px] text-[#7D0A0A] dark:text-[#D4AF37] max-w-sm mt-1">
                        <strong>
                          {language === 'en'
                            ? `Gift Card for (${item.recipientName || 'Recipient'}):`
                            : `بطاقة إهداء إلى (${item.recipientName || 'المستلم'}):`}
                        </strong> "{item.cardMessage}"
                      </div>
                    )}

                    <div className="text-[#7D0A0A] dark:text-[#D4AF37] font-bold text-sm pt-1">
                      {formatPrice((item.product.price + (item.customAddonPrice || 0)) * item.quantity)}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                    <button
                      onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 dark:text-gray-300 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-600 dark:text-gray-300 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title={language === 'en' ? 'Remove' : 'حذف'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setActiveTab('shop')}
              className="text-xs font-bold text-[#7D0A0A] dark:text-[#D4AF37] hover:underline flex items-center gap-1"
            >
              {language === 'en' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              <span>{language === 'en' ? 'Add More Flowers & Gifts' : 'إضافة المزيد من الورد والهدايا'}</span>
            </button>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg space-y-6">
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-3">
              {t('order_summary')}
            </h3>

            {/* Subtotal */}
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
              <span>{t('subtotal')}</span>
              <span className="font-bold text-gray-900 dark:text-gray-100">{formatPrice(cartSubtotal)}</span>
            </div>

            {/* Coupon Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                {language === 'en' ? 'Royal Promo Code:' : 'كود الخصم الملكي:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. ABAQ10' : 'مثال: ABAQ10'}
                  className="flex-1 bg-gray-50 dark:bg-gray-800 text-xs px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 uppercase"
                />
                <button
                  type="submit"
                  className="bg-[#7D0A0A] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow"
                >
                  {t('apply')}
                </button>
              </div>
            </form>

            {appliedCoupon && (
              <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-300 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'en' ? 'Promo Code:' : 'كود الخصم:'} {appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                </div>
                <button onClick={removeCoupon} className="text-red-600 font-bold">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-100 dark:border-gray-800">
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

            <button
              onClick={onProceedCheckout}
              className="w-full bg-[#7D0A0A] hover:bg-[#5A0707] text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 border border-[#D4AF37]/50"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>
                {language === 'en'
                  ? `Proceed to Checkout (${formatPrice(cartTotal)})`
                  : `متابعة الشراء والدفع (${formatPrice(cartTotal)})`}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
