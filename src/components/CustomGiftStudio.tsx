import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { CustomGiftState, Product } from '../types';
import {
  Sparkles,
  Flower2,
  Gift,
  Check,
  Calendar,
  Clock,
  Heart,
  ShoppingBag,
  Palette,
  Send,
  Sliders
} from 'lucide-react';

interface CustomGiftStudioProps {
  onGoToCart: () => void;
}

export const CustomGiftStudio: React.FC<CustomGiftStudioProps> = ({ onGoToCart }) => {
  const { formatPrice, addToCart, products } = useStore();
  const { t } = useLanguage();

  const [activeStep, setActiveStep] = useState(1);

  const [state, setState] = useState<CustomGiftState>({
    baseType: 'box',
    flowerType: 'red_roses',
    flowerCount: 50,
    wrappingColor: 'برغندي عبق',
    chocolateAddon: 'chocolates_gold_36',
    perfumeAddon: 'nizwa_perfume_100ml',
    ribbonColor: 'ذهبي مطرز',
    cardMessage: 'مع أطيب الأماني وأجمل التهاني بمناسبة هذا اليوم السعيد.',
    recipientName: '',
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    deliveryTime: '17:00 - 20:00 (مساءً)',
  });

  // Bases
  const bases = [
    {
      id: 'box',
      nameAr: 'صندوق مخملي برغندي ملكي',
      nameEn: 'Royal Burgundy Velvet Box',
      price: 15.00,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'vase',
      nameAr: 'فازة كريستال إيطالية ضخمة',
      nameEn: 'Grand Italian Crystal Vase',
      price: 25.00,
      image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'tray',
      nameAr: 'صينية أكريليك بحواف ذهبية',
      nameEn: 'Gold Trimmed Acrylic Tray',
      price: 20.00,
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'basket',
      nameAr: 'سلة خيزران دانتيل تراثية',
      nameEn: 'Heritage Wicker Lace Basket',
      price: 12.00,
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80',
    },
  ];

  // Flower Types
  const flowerTypes = [
    { id: 'red_roses', nameAr: 'ورد جوري برغندي هولندي', pricePerRose: 0.60, colorHex: '#7D0A0A' },
    { id: 'white_lilies', nameAr: 'زنبق كازابلانكا أبيض فواح', pricePerRose: 0.80, colorHex: '#FFFFFF' },
    { id: 'pink_peonies', nameAr: 'بيبي جوري وردي ناعم', pricePerRose: 0.50, colorHex: '#FCECEF' },
    { id: 'burgundy_orchids', nameAr: 'أوركيد ملكي فاخر', pricePerRose: 1.20, colorHex: '#800020' },
  ];

  // Wrappings
  const wrappings = [
    { name: 'برغندي عبق', hex: '#7D0A0A' },
    { name: 'أبيض لؤلؤي', hex: '#FFFFFF' },
    { name: 'ذهبي مطفأ', hex: '#D4AF37' },
    { name: 'وردي ناعم', hex: '#FCECEF' },
  ];

  // Ribbon Colors
  const ribbons = ['ذهبي مطرز', 'برغندي حريري', 'أبيض ملكي', 'أسود فاخر'];

  // Addons
  const chocolatesOption = { id: 'chocolates_gold_36', nameAr: 'صندوق شوكولاتة مذهبة (16 قطعة)', price: 15.00 };
  const perfumeOption = { id: 'nizwa_perfume_100ml', nameAr: 'عطر عبق نزوى اللبان والعنبر (50ml)', price: 30.00 };

  // Price Calculation
  const selectedBase = bases.find((b) => b.id === state.baseType) || bases[0];
  const selectedFlower = flowerTypes.find((f) => f.id === state.flowerType) || flowerTypes[0];
  const flowerTotal = selectedFlower.pricePerRose * state.flowerCount;
  const chocTotal = state.chocolateAddon ? chocolatesOption.price : 0;
  const perfTotal = state.perfumeAddon ? perfumeOption.price : 0;
  const grandTotal = selectedBase.price + flowerTotal + chocTotal + perfTotal;

  const handleFinishCustomGift = () => {
    // Construct a custom product representation
    const customProduct: Product = {
      id: `custom-gift-${Date.now()}`,
      nameAr: `هدية مخصصة - ${selectedBase.nameAr} (${state.flowerCount} وردة)`,
      nameEn: `Custom Gift - ${selectedBase.nameEn} (${state.flowerCount} roses)`,
      descriptionAr: `هدية مصممة خصيصاً بالورد والزينة وحسب اختيار العميل مع كارت إهداء خاص.`,
      descriptionEn: `Bespoke custom gift designed by client with personalized card message.`,
      price: grandTotal,
      category: 'custom-design',
      images: [selectedBase.image],
      inStock: true,
      stockQuantity: 99,
      tagsAr: ['تصميم حسب الطلب', 'هدية مخصصة'],
      tagsEn: ['Custom Gift', 'Bespoke'],
    };

    addToCart({
      product: customProduct,
      quantity: 1,
      selectedSize: `قاعدة: ${selectedBase.nameAr}`,
      selectedWrappingColor: state.wrappingColor,
      selectedFlowerCount: state.flowerCount,
      cardMessage: state.cardMessage,
      recipientName: state.recipientName,
      deliveryDate: state.deliveryDate,
      deliveryTime: state.deliveryTime,
      customAddonPrice: 0,
    });

    onGoToCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#7D0A0A] via-[#4D0505] to-[#7D0A0A] rounded-3xl p-8 text-white text-center shadow-xl border border-[#D4AF37]/30 relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1 rounded-full text-xs font-bold text-[#D4AF37]">
            <Sparkles className="w-4 h-4" />
            <span>استوديو التنسيق الخاص</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-wide">
            صمم هديتك حسب ذوقك الرفيع
          </h1>
          <p className="text-sm text-gray-200 leading-relaxed font-light">
            ابنِ تحفتك الفنية خطوة بخطوة وسيقوم خبراء التنسيق في عبق نزوى بتنفيذها بدقة متناهية وإرسالها لمن تحب.
          </p>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="flex items-center justify-between max-w-3xl mx-auto mb-10 overflow-x-auto pb-2">
        {[
          { num: 1, title: '١. القاعدة' },
          { num: 2, title: '٢. الورد' },
          { num: 3, title: '٣. التغليف' },
          { num: 4, title: '٤. الإضافات' },
          { num: 5, title: '٥. الرسالة والتأكيد' },
        ].map((step) => (
          <button
            key={step.num}
            onClick={() => setActiveStep(step.num)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeStep === step.num
                ? 'bg-[#7D0A0A] text-white shadow-md border border-[#D4AF37]/50'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-extrabold ${
                activeStep === step.num ? 'bg-[#D4AF37] text-[#7D0A0A]' : 'bg-gray-300 dark:bg-gray-700 text-gray-700'
              }`}
            >
              {step.num}
            </span>
            <span>{step.title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Step Content Area */}
        <div className="lg:col-span-2 bg-white dark:bg-[#151111] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg space-y-6">
          
          {/* STEP 1: BASE */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
                <span>الخطوة 1: اختر قاعدة الهدايا أو الفازة</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bases.map((base) => (
                  <div
                    key={base.id}
                    onClick={() => setState({ ...state, baseType: base.id as any })}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                      state.baseType === base.id
                        ? 'border-[#7D0A0A] bg-[#FCECEF]/40 dark:bg-[#7D0A0A]/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300'
                    }`}
                  >
                    <img src={base.image} alt={base.nameAr} loading="lazy" decoding="async" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{base.nameAr}</h3>
                      <p className="text-xs text-gray-500 mt-1">{base.nameEn}</p>
                      <span className="text-sm font-bold text-[#7D0A0A] dark:text-[#D4AF37] block mt-2">
                        +{formatPrice(base.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveStep(2)}
                  className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md"
                >
                  التالي: اختيار الورد ←
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FLOWERS */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Flower2 className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
                <span>الخطوة 2: اختر نوع وعدد الورود الطبيعية</span>
              </h2>

              {/* Flower type selection */}
              <div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-3">نوع الورد:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {flowerTypes.map((flower) => (
                    <button
                      key={flower.id}
                      onClick={() => setState({ ...state, flowerType: flower.id as any })}
                      className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                        state.flowerType === flower.id
                          ? 'border-[#7D0A0A] bg-[#FCECEF]/40 dark:bg-[#7D0A0A]/20 font-bold'
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: flower.colorHex }} />
                        <span className="text-xs text-gray-800 dark:text-gray-200">{flower.nameAr}</span>
                      </div>
                      <span className="text-xs text-[#7D0A0A] dark:text-[#D4AF37] font-bold">
                        {formatPrice(flower.pricePerRose)} / وردة
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flower Count */}
              <div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-3">
                  عدد الورود المطلوب ({state.flowerCount} وردة):
                </span>
                <div className="flex items-center gap-3">
                  {[25, 50, 75, 100].map((count) => (
                    <button
                      key={count}
                      onClick={() => setState({ ...state, flowerCount: count })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        state.flowerCount === count
                          ? 'bg-[#7D0A0A] text-white border-[#7D0A0A]'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {count} وردة
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                >
                  → السابق
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md"
                >
                  التالي: التغليف والشرائط ←
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: WRAPPING & RIBBONS */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
                <span>الخطوة 3: اختر لون التغليف وشريط الإهداء</span>
              </h2>

              <div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-3">لون ورق التغليف الفاخر:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {wrappings.map((wrap) => (
                    <button
                      key={wrap.name}
                      onClick={() => setState({ ...state, wrappingColor: wrap.name })}
                      className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold ${
                        state.wrappingColor === wrap.name
                          ? 'border-[#7D0A0A] bg-[#FCECEF]/40 dark:bg-[#7D0A0A]/20'
                          : 'border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-gray-300 shadow-inner" style={{ backgroundColor: wrap.hex }} />
                      <span>{wrap.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-3">نوع شريط التغليف:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ribbons.map((rib) => (
                    <button
                      key={rib}
                      onClick={() => setState({ ...state, ribbonColor: rib })}
                      className={`p-3 rounded-xl border text-xs font-bold text-center ${
                        state.ribbonColor === rib
                          ? 'border-[#7D0A0A] bg-[#7D0A0A] text-white'
                          : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {rib}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                >
                  → السابق
                </button>
                <button
                  onClick={() => setActiveStep(4)}
                  className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md"
                >
                  التالي: الشوكولاتة والعطور ←
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: ADDONS */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
                <span>الخطوة 4: إضافة شوكولاتة مذهبة أو عطر نيش (اختياري)</span>
              </h2>

              <div className="space-y-4">
                {/* Chocolate Option */}
                <div
                  onClick={() =>
                    setState({
                      ...state,
                      chocolateAddon: state.chocolateAddon ? undefined : chocolatesOption.id,
                    })
                  }
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    state.chocolateAddon
                      ? 'border-[#7D0A0A] bg-[#FCECEF]/40 dark:bg-[#7D0A0A]/20'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!state.chocolateAddon}
                      onChange={() => {}}
                      className="w-5 h-5 accent-[#7D0A0A] rounded"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{chocolatesOption.nameAr}</h3>
                      <p className="text-xs text-gray-500">شوكولاتة بلجيكية فاخرة بلمسة من الذهب عيار 24</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#7D0A0A] dark:text-[#D4AF37]">
                    +{formatPrice(chocolatesOption.price)}
                  </span>
                </div>

                {/* Perfume Option */}
                <div
                  onClick={() =>
                    setState({
                      ...state,
                      perfumeAddon: state.perfumeAddon ? undefined : perfumeOption.id,
                    })
                  }
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    state.perfumeAddon
                      ? 'border-[#7D0A0A] bg-[#FCECEF]/40 dark:bg-[#7D0A0A]/20'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!state.perfumeAddon}
                      onChange={() => {}}
                      className="w-5 h-5 accent-[#7D0A0A] rounded"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{perfumeOption.nameAr}</h3>
                      <p className="text-xs text-gray-500">عبير اللبان العماني والعنبر الحصري من عبق نزوى</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#7D0A0A] dark:text-[#D4AF37]">
                    +{formatPrice(perfumeOption.price)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                >
                  → السابق
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md"
                >
                  التالي: بطاقة الإهداء والتسليم ←
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CARD & DELIVERY */}
          {activeStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-bold font-heading text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Send className="w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37]" />
                <span>الخطوة 5: بطاقة الإهداء الخاصة وتاريخ التوصيل</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    اسم الشخص المستلم للهداية:
                  </label>
                  <input
                    type="text"
                    value={state.recipientName}
                    onChange={(e) => setState({ ...state, recipientName: e.target.value })}
                    placeholder="مثال: الفاضلة شيخة الكندية"
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:border-[#7D0A0A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                    نص بطاقة الإهداء (تطبع على ورقة مخملية فاخرة):
                  </label>
                  <textarea
                    rows={3}
                    value={state.cardMessage}
                    onChange={(e) => setState({ ...state, cardMessage: e.target.value })}
                    placeholder="اكتب تهنئتك القلبية هنا..."
                    className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:border-[#7D0A0A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1 flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#7D0A0A]" />
                      <span>تاريخ التسليم الفاخر:</span>
                    </label>
                    <input
                      type="date"
                      value={state.deliveryDate}
                      onChange={(e) => setState({ ...state, deliveryDate: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:border-[#7D0A0A]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#7D0A0A]" />
                      <span>فترة التوصيل:</span>
                    </label>
                    <select
                      value={state.deliveryTime}
                      onChange={(e) => setState({ ...state, deliveryTime: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-sm focus:outline-none focus:border-[#7D0A0A]"
                    >
                      <option value="10:00 - 13:00 (صباحاً)">10:00 - 13:00 (صباحاً)</option>
                      <option value="17:00 - 20:00 (مساءً)">17:00 - 20:00 (مساءً)</option>
                      <option value="20:00 - 23:00 (ليلاً)">20:00 - 23:00 (ليلاً)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100"
                >
                  → السابق
                </button>
                <button
                  onClick={handleFinishCustomGift}
                  className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-8 py-3 rounded-2xl font-bold text-base shadow-xl flex items-center gap-2 border border-[#D4AF37]/50"
                >
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                  <span>إضافة التحفة المخصصة للسلة ({formatPrice(grandTotal)})</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Live Summary Sidebar */}
        <div className="bg-[#120D0D] text-white p-6 sm:p-8 rounded-3xl border border-[#7D0A0A]/40 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-heading font-bold text-lg text-[#D4AF37] flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>ملخص التنسيق</span>
              </h3>
              <span className="text-xs bg-[#7D0A0A] px-2.5 py-0.5 rounded-full font-semibold">مباشر</span>
            </div>

            <div className="space-y-4 py-4 text-xs text-gray-300">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>القاعدة:</span>
                <span className="font-bold text-white">{selectedBase.nameAr}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>الورد:</span>
                <span className="font-bold text-white">{selectedFlower.nameAr} ({state.flowerCount} وردة)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span>التغليف والشريط:</span>
                <span className="font-bold text-white">{state.wrappingColor} / {state.ribbonColor}</span>
              </div>
              {state.chocolateAddon && (
                <div className="flex justify-between items-center pb-2 border-b border-white/5 text-[#D4AF37]">
                  <span>إضافة:</span>
                  <span>شوكولاتة مذهبة (+{formatPrice(chocolatesOption.price)})</span>
                </div>
              )}
              {state.perfumeAddon && (
                <div className="flex justify-between items-center pb-2 border-b border-white/5 text-[#D4AF37]">
                  <span>إضافة:</span>
                  <span>عطر عبق نزوى (+{formatPrice(perfumeOption.price)})</span>
                </div>
              )}
              {state.recipientName && (
                <div className="flex justify-between items-center pb-2 border-b border-white/5 text-gray-400">
                  <span>المستلم:</span>
                  <span className="text-white">{state.recipientName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-400">التكلفة التقديرية:</span>
              <span className="text-2xl font-extrabold text-[#D4AF37]">
                {formatPrice(grandTotal)}
              </span>
            </div>

            <button
              onClick={handleFinishCustomGift}
              className="w-full bg-[#7D0A0A] hover:bg-[#5A0707] text-white py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 border border-[#D4AF37]/30"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>حفظ وتأكيد السلة</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
