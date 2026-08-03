import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  MessageCircle,
  Send,
  UserCheck
} from 'lucide-react';
import fallbackImg from '../assets/images/royal_flower_bouquet_1785404632631.jpg';

interface ProductDetailsPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onGoToCart: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onSelectProduct,
  onGoToCart,
}) => {
  const { language, t } = useLanguage();
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
    reviews,
    addReview,
  } = useStore();

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0].nameAr : ''
  );
  const [selectedWrapping, setSelectedWrapping] = useState(
    product.wrappingColors ? product.wrappingColors[0].nameAr : ''
  );
  const [selectedFlowerCount, setSelectedFlowerCount] = useState(
    product.flowerCountOptions ? product.flowerCountOptions[1] || product.flowerCountOptions[0] : 50
  );

  // Card Message details
  const [cardMessage, setCardMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [deliveryTime, setDeliveryTime] = useState('17:00 - 20:00 (مساءً)');

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const isLiked = isInWishlist(product.id);
  const title = language === 'ar' ? product.nameAr : product.nameEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;

  // Filter product reviews
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      selectedSize,
      selectedWrappingColor: selectedWrapping,
      selectedFlowerCount,
      cardMessage,
      recipientName,
      recipientPhone,
      deliveryDate,
      deliveryTime,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onGoToCart();
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `مرحباً متجر عبق نزوى ✨ أود طلب هذا المنتج مباشرة:\n- المنتج: ${title}\n- السعر: ${formatPrice(product.price * quantity)}\n- الكمية: ${quantity}\n- التغليف: ${selectedWrapping || 'ملكي'}\n- رسالة الإهداء: ${cardMessage || 'لا يوجد'}\n- اسم المستلم: ${recipientName || 'نفسي'}`
    );
    window.open(`https://wa.me/96891234567?text=${text}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !newComment) return;
    addReview({
      productId: product.id,
      productNameAr: product.nameAr,
      productNameEn: product.nameEn,
      userName: reviewerName,
      rating: newRating,
      comment: newComment,
      city: 'مسقط',
    });
    setNewComment('');
    setReviewerName('');
    setShowReviewModal(false);
  };

  const currentImg = product.images[selectedImgIndex] || product.images[0] || fallbackImg;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fadeIn">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-[#7D0A0A] dark:hover:text-[#D4AF37] transition-colors"
      >
        {language === 'en' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        <span>{language === 'en' ? 'Back to Shop' : 'العودة للمتجر'}</span>
      </button>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Col: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#120D0D] border border-gray-100 dark:border-gray-800 shadow-lg">
            <img
              src={currentImg}
              alt={title}
              referrerPolicy="no-referrer"
              fetchPriority="high"
              decoding="async"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImg;
              }}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />

            <button
              onClick={() => toggleWishlist(product)}
              aria-label={language === 'en' ? 'Toggle wishlist' : 'إضافة إلى المفضلة'}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-md transition-all ${
                isLiked ? 'bg-[#7D0A0A] text-white' : 'bg-white/80 dark:bg-black/60 text-gray-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImgIndex === idx
                      ? 'border-[#7D0A0A] dark:border-[#D4AF37] scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImg;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Product Buying Specs & Form */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#8C6914] dark:text-[#D4AF37] font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-700 dark:text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                  ({product.reviewsCount} {language === 'en' ? 'customer reviews' : 'تقييم عملاء'})
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
              {title}
            </h1>

            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-extrabold text-[#7D0A0A] dark:text-[#D4AF37]">
                {formatPrice(product.price * quantity)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.originalPrice * quantity)}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Options: Flower Count */}
          {product.flowerCountOptions && (
            <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                {language === 'en' ? 'Rose Count in Bouquet:' : 'عدد الورود في الباقة:'}
              </span>
              <div className="flex flex-wrap gap-2">
                {product.flowerCountOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedFlowerCount(c)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedFlowerCount === c
                        ? 'bg-[#7D0A0A] text-white border-[#7D0A0A]'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {c} {language === 'en' ? 'Roses' : 'وردة'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Options: Wrapping Colors */}
          {product.wrappingColors && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                {language === 'en' ? 'Royal Wrapping & Ribbon Color:' : 'لون التغليف الملكي والشريط:'}
              </span>
              <div className="flex items-center gap-3">
                {product.wrappingColors.map((col) => {
                  const colorName = language === 'en' ? col.nameEn : col.nameAr;
                  return (
                    <button
                      key={col.nameAr}
                      onClick={() => setSelectedWrapping(colorName)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedWrapping === colorName || selectedWrapping === col.nameAr
                          ? 'border-[#7D0A0A] bg-[#FCECEF]/40 dark:bg-[#7D0A0A]/30'
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: col.hex }} />
                      <span>{colorName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Gift Card Message Form */}
          <div className="bg-[#FCECEF]/40 dark:bg-[#151111] p-5 rounded-2xl border border-[#7D0A0A]/20 space-y-4">
            <h3 className="font-bold text-sm text-[#7D0A0A] dark:text-[#D4AF37] flex items-center gap-2 font-heading">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'en' ? 'Complimentary Gift Card & Delivery Time Slot' : 'بطاقة الإهداء وتحديد وقت التوصيل (مجاناً)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  {language === 'en' ? 'Recipient Name:' : 'اسم الشخص المستلم:'}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder={language === 'en' ? 'e.g., Mr. Ahmed Al-Riyami' : 'مثال: الفاضل أحمد الريامي'}
                  className="w-full bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">
                  {language === 'en' ? 'Recipient WhatsApp Phone:' : 'رقم هاتف المستلم (واتساب):'}
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+968 91234567"
                  className="w-full bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-xs block">
                  {language === 'en' ? 'Personal Gift Message (Printed in Gold Foil):' : 'رسالة الإهداء (تطبع بحبر ذهبي فاخر):'}
                </label>
                <div className="flex flex-wrap gap-1">
                  {[
                    language === 'en' ? 'Happy Birthday 🎂' : 'عيد ميلاد سعيد 🎂',
                    language === 'en' ? 'Congratulations 🎓' : 'مبارك التخرج 🎓',
                    language === 'en' ? 'Happy Wedding 💍' : 'مبارك الزفاف 💍',
                    language === 'en' ? 'Get Well Soon 🌸' : 'حمدالله على السلامة 🌸',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCardMessage(preset)}
                      className="text-[10px] bg-white dark:bg-gray-800 text-[#7D0A0A] dark:text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#7D0A0A]/20 hover:bg-[#7D0A0A] hover:text-white transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                placeholder={language === 'en' ? 'Write your heartfelt message here...' : 'اكتب كلماتك القلبية هنا...'}
                className="w-full bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#7D0A0A]" />
                  <span>{language === 'en' ? 'Delivery Date:' : 'تاريخ التوصيل:'}</span>
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7D0A0A]" />
                  <span>{language === 'en' ? 'Delivery Time Slot:' : 'فترة التوصيل:'}</span>
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-300 dark:border-gray-700"
                >
                  <option value="10:00 - 13:00 (صباحاً)">{language === 'en' ? '10:00 AM - 1:00 PM (Morning)' : '10:00 - 13:00 (صباحاً)'}</option>
                  <option value="17:00 - 20:00 (مساءً)">{language === 'en' ? '5:00 PM - 8:00 PM (Evening)' : '17:00 - 20:00 (مساءً)'}</option>
                  <option value="20:00 - 23:00 (ليلاً)">{language === 'en' ? '8:00 PM - 11:00 PM (Night)' : '20:00 - 23:00 (ليلاً)'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-sm text-gray-900 dark:text-gray-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#7D0A0A] hover:bg-[#5A0707] text-white py-3 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 border border-[#D4AF37]/40"
              >
                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                <span>{language === 'en' ? 'Add to Gift Basket' : 'إضافة إلى سلة الهدايا'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#D4AF37] hover:bg-[#c4a130] text-[#7D0A0A] py-3 rounded-2xl font-extrabold text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'en' ? 'Express Buy & Checkout' : 'شراء الآن والدفع الفوري'}</span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#0B7A3D] hover:bg-[#096830] text-white py-3 rounded-2xl font-extrabold text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Direct WhatsApp Order' : 'طلب مباشر عبر الواتساب'}</span>
              </button>
            </div>
          </div>

          {/* Guarantees bar */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-[#7D0A0A]" /> {language === 'en' ? 'Fast Oman Delivery' : 'توصيل سريع في عمان'}
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#7D0A0A]" /> {language === 'en' ? '100% Fresh Roses' : 'ورد طبيعي طازج'}
            </span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-4 h-4 text-[#7D0A0A]" /> {language === 'en' ? 'Surprise Guarantee' : 'سرية التوصيل والمفاجأة'}
            </span>
          </div>

        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="bg-white dark:bg-[#151111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100">
              {language === 'en'
                ? `Customer Reviews (${productReviews.length})`
                : `تقييمات العملاء لهذا المنتج (${productReviews.length})`}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'en'
                ? 'Authentic feedback from customers who ordered this arrangement'
                : 'تجارب حقيقية لعملاء تسوقوا هذا التنسيق'}
            </p>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-[#7D0A0A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            <span>{language === 'en' ? 'Write a Review' : 'كتابة تقييم'}</span>
          </button>
        </div>

        {productReviews.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-4">
            {language === 'en'
              ? 'No reviews yet for this product. Be the first to share your experience!'
              : 'لا توجد تقييمات مكتوبة لهذا المنتج بعد. كن أول من يشارك تجربته!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl space-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 dark:text-gray-100">{rev.userName}</span>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">{rev.comment}</p>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 block">{rev.date} • {rev.city}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-heading text-gray-900 dark:text-gray-100">
            {t('related_products')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151111] p-6 rounded-2xl max-w-md w-full space-y-4 border border-[#7D0A0A]/30">
            <h3 className="font-bold text-lg font-heading text-gray-900 dark:text-gray-100">
              إضافة تقييم جديد
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">اسمك الكامل:</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="أدخل اسمك الكريم..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">التقييم بالنجوم:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400"
                    >
                      <Star className={`w-6 h-6 ${newRating >= star ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">رأيك بالتفصيل:</label>
                <textarea
                  required
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب انطباعك عن جودة الورد والتنسيق..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#7D0A0A] text-white px-5 py-2 rounded-xl font-bold shadow-md"
                >
                  نشر التقييم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
