import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import fallbackImg from '../assets/images/royal_flower_bouquet_1785404632631.jpg';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickView,
}) => {
  const { language } = useLanguage();
  const { formatPrice, addToCart } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const [imgSrc, setImgSrc] = useState(product.images[0]);

  const title = language === 'ar' ? product.nameAr : product.nameEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      product,
      quantity: 1,
      selectedSize: product.sizes ? product.sizes[0].nameAr : undefined,
      selectedWrappingColor: product.wrappingColors ? product.wrappingColors[0].nameAr : undefined,
    });
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white dark:bg-[#151111] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full bg-gray-50 dark:bg-black/30 overflow-hidden">
        <img
          src={imgSrc || fallbackImg}
          alt={title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgSrc(fallbackImg)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Overlay Dark Blur on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-[#7D0A0A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-[#D4AF37]/40">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              {language === 'en' ? 'Best Seller' : 'الأكثر مبيعاً'}
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#D4AF37] text-[#7D0A0A] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              {language === 'en' ? 'NEW' : 'جديد'}
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {language === 'en' ? 'OFF' : 'خصم'} {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-[#1A1414]/90 text-gray-900 dark:text-gray-100 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 hover:bg-[#7D0A0A] hover:text-white"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Quick View' : 'نظرة سريعة'}</span>
          </button>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Subtext & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="text-[#8C6914] dark:text-[#D4AF37] font-semibold text-[11px] uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-700 dark:text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-500 dark:text-gray-400 text-[10px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-heading font-bold text-base text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-[#7D0A0A] dark:group-hover:text-[#D4AF37] transition-colors">
            {title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg text-[#7D0A0A] dark:text-[#D4AF37]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              className="bg-gray-100 hover:bg-[#7D0A0A] dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:text-white p-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1"
              title={language === 'en' ? 'Add to Cart' : 'إضافة للسلة'}
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-semibold hidden sm:inline">{language === 'en' ? 'Add' : 'السلة'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCard = React.memo(ProductCardComponent);
