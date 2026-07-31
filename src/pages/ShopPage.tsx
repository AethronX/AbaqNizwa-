import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';
import { CATEGORIES, OCCASIONS } from '../data/mockData';
import { Product } from '../types';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Filter
} from 'lucide-react';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const { products, searchQuery, setSearchQuery, selectedCategoryFilter, setSelectedCategoryFilter } = useStore();
  const { t, language } = useLanguage();

  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.nameAr.toLowerCase().includes(query) || p.nameEn.toLowerCase().includes(query);
        const matchDesc = p.descriptionAr.toLowerCase().includes(query) || p.descriptionEn.toLowerCase().includes(query);
        const matchTags = p.tagsAr.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      // Category
      if (selectedCategoryFilter !== 'all' && p.category !== selectedCategoryFilter) {
        return false;
      }

      // Occasion
      if (selectedOccasion !== 'all' && p.occasionId !== selectedOccasion) {
        return false;
      }

      // Max price
      if (p.price > maxPrice) {
        return false;
      }

      // Rating
      if (p.rating < minRating) {
        return false;
      }

      // Stock
      if (inStockOnly && !p.inStock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured
    });
  }, [products, searchQuery, selectedCategoryFilter, selectedOccasion, maxPrice, minRating, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategoryFilter('all');
    setSelectedOccasion('all');
    setMaxPrice(200);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
            {language === 'en' ? 'Luxury Flowers & Gifts Gallery' : 'معرض الهدايا والورد الفاخر'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'en'
              ? `Showing ${filteredProducts.length} items available for royal delivery`
              : `عرض ${filteredProducts.length} منتجاً متاحاً للتوصيل الملكي`}
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-3">
          
          {/* Sorting */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1A1414] px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-xs">
            <ArrowUpDown className="w-4 h-4 text-[#7D0A0A] dark:text-[#D4AF37]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-800 dark:text-gray-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">{language === 'en' ? 'Featured & VIP' : 'الأبرز والـ VIP'}</option>
              <option value="price-asc">{language === 'en' ? 'Price: Low to High' : 'السعر: من الأقل إلى الأعلى'}</option>
              <option value="price-desc">{language === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى إلى الأقل'}</option>
              <option value="rating">{language === 'en' ? 'Highest Rated' : 'الأعلى تقييماً'}</option>
            </select>
          </div>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden bg-[#7D0A0A] text-white p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
            <span>{language === 'en' ? 'Filter' : 'تصفية'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6 bg-white dark:bg-[#151111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-bold font-heading text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#7D0A0A] dark:text-[#D4AF37]" />
              <span>{language === 'en' ? 'Filter Results' : 'تصفية النتائج'}</span>
            </h3>
            <button onClick={resetFilters} className="text-xs text-[#7D0A0A] dark:text-[#D4AF37] hover:underline">
              {language === 'en' ? 'Reset' : 'إعادة ضبط'}
            </button>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">{language === 'en' ? 'Category:' : 'التصنيف:'}</span>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`w-full text-right py-1.5 px-2.5 rounded-lg transition-colors ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-[#7D0A0A] text-white font-bold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {language === 'en' ? 'All' : 'الكل'}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryFilter(cat.id)}
                  className={`w-full text-right py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-between ${
                    selectedCategoryFilter === cat.id
                      ? 'bg-[#7D0A0A] text-white font-bold'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{language === 'en' ? cat.nameEn : cat.nameAr}</span>
                  <span className="text-[10px] opacity-70">({cat.itemCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Occasions Filter */}
          <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">{language === 'en' ? 'Occasion:' : 'المناسبة:'}</span>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="all">{language === 'en' ? 'All Occasions' : 'كافة المناسبات'}</option>
              {OCCASIONS.map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {language === 'en' ? occ.nameEn : occ.nameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
              <span>{language === 'en' ? 'Max Price:' : 'الحد الأقصى للسعر:'}</span>
              <span className="text-[#7D0A0A] dark:text-[#D4AF37]">{maxPrice} {language === 'en' ? 'OMR' : 'ر.ع.'}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#7D0A0A]"
            />
          </div>

          {/* Stock Filter */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{language === 'en' ? 'In-Stock Only:' : 'المتوفر في المخزون فقط:'}</span>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-[#7D0A0A]"
            />
          </div>
        </aside>

        {/* PRODUCTS GRID */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Active filter badges */}
          {(selectedCategoryFilter !== 'all' || selectedOccasion !== 'all' || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold">التصفية النشطة:</span>
              {selectedCategoryFilter !== 'all' && (
                <span className="bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                  تصنيف: {CATEGORIES.find((c) => c.id === selectedCategoryFilter)?.nameAr}
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedCategoryFilter('all')} />
                </span>
              )}
              {selectedOccasion !== 'all' && (
                <span className="bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                  مناسبة: {OCCASIONS.find((o) => o.id === selectedOccasion)?.nameAr}
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedOccasion('all')} />
                </span>
              )}
              {searchQuery && (
                <span className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
                  بحث: "{searchQuery}"
                  <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-[#151111] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 space-y-4">
              <div className="w-16 h-16 bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100">
                لم نجد هدايا تطابق اختيارك الحالي
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                يرجى تجربة البحث بكلمات أخرى أو تقليل شروط التصفية لاستكشاف تشكيلات عبق نزوى.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#7D0A0A] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md"
              >
                إعادة ضبط كافة الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onGoToDetails={(p) => {
            setQuickViewProduct(null);
            onSelectProduct(p);
          }}
        />
      )}

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="bg-white dark:bg-[#151111] w-full max-w-xs h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold font-heading text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
                  <span>تصفية النتائج</span>
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories Filter */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">التصنيف:</span>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setSelectedCategoryFilter('all');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-right py-2 px-3 rounded-xl transition-colors ${
                      selectedCategoryFilter === 'all'
                        ? 'bg-[#7D0A0A] text-white font-bold'
                        : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    الكل
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryFilter(cat.id);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-right py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                        selectedCategoryFilter === cat.id
                          ? 'bg-[#7D0A0A] text-white font-bold'
                          : 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <span>{cat.nameAr}</span>
                      <span className="text-[10px] opacity-70">({cat.itemCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasions Filter */}
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">المناسبة:</span>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <option value="all">كافة المناسبات</option>
                  {OCCASIONS.map((occ) => (
                    <option key={occ.id} value={occ.id}>
                      {occ.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>الحد الأقصى للسعر:</span>
                  <span className="text-[#7D0A0A] dark:text-[#D4AF37]">{maxPrice} ر.ع.</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#7D0A0A]"
                />
              </div>

              {/* Stock Filter */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">المتوفر في المخزون فقط:</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#7D0A0A]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-[#7D0A0A] text-white py-3 rounded-xl font-bold text-xs shadow-md"
              >
                تطبيق التصفية ({filteredProducts.length} منتج)
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
