import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Star, ShoppingBag, Truck, Calendar, Sparkles } from 'lucide-react';
import fallbackImg from '../assets/images/royal_flower_bouquet_1785404632631.jpg';

interface ProductQuickViewModalProps {
  product: Product;
  onClose: () => void;
  onGoToDetails: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onGoToDetails,
}) => {
  const { language } = useLanguage();
  const { formatPrice, addToCart } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0].nameAr : ''
  );
  const [selectedWrapping, setSelectedWrapping] = useState(
    product.wrappingColors ? product.wrappingColors[0].nameAr : ''
  );

  const title = language === 'ar' ? product.nameAr : product.nameEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;

  const currentImg = product.images[selectedImageIndex] || product.images[0] || fallbackImg;

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      selectedSize,
      selectedWrappingColor: selectedWrapping,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#151111] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#7D0A0A]/20 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={language === 'en' ? 'Close' : 'إغلاق'}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-[#7D0A0A] hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Images Gallery */}
          <div className="space-y-3">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-black relative">
              <img
                src={currentImg}
                alt={title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImg;
                }}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === idx ? 'border-[#7D0A0A]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
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

          {/* Details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-500 font-bold mb-1">
                <div className="flex items-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="mr-1">{product.rating}</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400">({product.reviewsCount} تقييم)</span>
              </div>

              <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100">
                {title}
              </h2>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-[#7D0A0A] dark:text-[#D4AF37]">
                  {formatPrice(product.price * quantity)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(product.originalPrice * quantity)}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                {description}
              </p>

              {/* Sizes Selector */}
              {product.sizes && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    الحجم / التنسيق:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.nameAr}
                        onClick={() => setSelectedSize(size.nameAr)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          selectedSize === size.nameAr
                            ? 'bg-[#7D0A0A] text-white border-[#7D0A0A]'
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {size.nameAr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wrapping colors selector */}
              {product.wrappingColors && (
                <div className="mt-4">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-2">
                    لون التغليف الملكي:
                  </span>
                  <div className="flex gap-2">
                    {product.wrappingColors.map((col) => (
                      <button
                        key={col.nameAr}
                        onClick={() => setSelectedWrapping(col.nameAr)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                          selectedWrapping === col.nameAr ? 'ring-2 ring-[#7D0A0A]' : ''
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.nameAr}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-bold text-sm text-gray-900 dark:text-gray-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#7D0A0A] hover:bg-[#5A0707] text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>إضافة للسلة</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onGoToDetails(product);
                }}
                className="w-full py-2 text-center text-xs font-bold text-[#7D0A0A] dark:text-[#D4AF37] hover:underline"
              >
                عرض كافة تفاصيل المنتج وبطاقة الإهداء ←
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
