import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
}

const translations: Record<string, { ar: string; en: string }> = {
  // Navigation & General
  brand_name: { ar: 'عبق نزوى', en: 'Abaq Nizwa' },
  brand_tagline: { ar: 'الورد والهدايا الفاخرة', en: 'Luxury Flowers & Gifts' },
  hero_title: { ar: 'نتحدث لغة الجمال', en: 'We Speak the Language of Beauty' },
  hero_subtitle: { ar: 'تنسيق باقات الورد الملكية، الشوكولاتة الفاخرة، العطور النيش، وتجهيز هدايا المناسبات بلمسة نزوانية عريقة.', en: 'Royal flower bouquet arrangements, luxury chocolates, niche perfumes, and custom gift boxes crafted with Nizwa elegance.' },
  order_now: { ar: 'اطلب الآن', en: 'Order Now' },
  custom_gift_btn: { ar: 'صمم هديتك بنفسك', en: 'Build Custom Gift' },
  shop_now: { ar: 'تسوق الآن', en: 'Shop Now' },

  nav_home: { ar: 'الرئيسية', en: 'Home' },
  nav_shop: { ar: 'المتجر', en: 'Shop' },
  nav_categories: { ar: 'التصنيفات', en: 'Categories' },
  nav_custom_gift: { ar: 'تصميم حسب الطلب', en: 'Custom Gift' },
  nav_occasions: { ar: 'المناسبات', en: 'Occasions' },
  nav_track_order: { ar: 'تتبع الطلب', en: 'Track Order' },
  nav_about: { ar: 'عن عبق نزوى', en: 'About Us' },
  nav_contact: { ar: 'تواصل معنا', en: 'Contact Us' },
  nav_admin: { ar: 'لوحة التحكم', en: 'Admin Portal' },
  nav_wishlist: { ar: 'المفضلة', en: 'Wishlist' },
  nav_cart: { ar: 'سلة الهدايا', en: 'Gift Basket' },
  nav_account: { ar: 'حسابي', en: 'My Account' },

  // Categories
  cat_title: { ar: 'تصنيفاتنا الفاخرة', en: 'Our Luxury Categories' },
  cat_subtitle: { ar: 'اختر الهدية المثالية من تشكيلاتنا المصممة بأعلى معايير الأناقة', en: 'Choose the perfect gift from our meticulously curated collections' },

  // Best sellers & products
  best_sellers: { ar: 'الأكثر مبيعاً', en: 'Best Sellers' },
  new_arrivals: { ar: 'أحدث التنسيقات', en: 'New Arrivals' },
  featured_products: { ar: 'مجموعات مميزة', en: 'Featured Collections' },
  add_to_cart: { ar: 'إضافة للسلة', en: 'Add to Cart' },
  buy_now: { ar: 'شراء الآن', en: 'Buy Now' },
  out_of_stock: { ar: 'نفذت الكمية', en: 'Out of Stock' },
  in_stock: { ar: 'متوفر للطلب الفوري', en: 'In Stock' },
  currency_omr: { ar: 'ر.ع.', en: 'OMR' },
  currency_sar: { ar: 'ر.س', en: 'SAR' },
  currency_usd: { ar: '$', en: 'USD' },
  reviews: { ar: 'تقييمات', en: 'Reviews' },

  // Occasions
  occasions_title: { ar: 'هدايا لكافة المناسبات', en: 'Gifts for Every Occasion' },
  occasions_subtitle: { ar: 'اجعل كل لحظة تتألق بالورد والشوكولاتة والعطور الفاخرة', en: 'Make every memory bloom with fine flowers, chocolates & perfumes' },

  // Reviews & Social
  reviews_title: { ar: 'ماذا يقول عملاؤنا', en: 'What Our Clients Say' },
  reviews_subtitle: { ar: 'تجارب حقيقية لعملاء وثقوا بلغة جمال عبق نزوى', en: 'Authentic testimonials from clients who experienced Abaq Nizwa' },
  instagram_title: { ar: 'تابعونا على إنستغرام', en: 'Follow Us on Instagram' },
  instagram_handle: { ar: '@abaq_nizwa', en: '@abaq_nizwa' },

  // Custom Gift Builder
  custom_builder_title: { ar: 'استوديو تصميم الهدايا حسب الطلب', en: 'Custom Gift Design Studio' },
  custom_builder_subtitle: { ar: 'صمم هديتك خطوة بخطوة: اختر الفازة، عدد ونوع الورد، الشوكولاتة، والعطر والبطاقة الخاصة', en: 'Create your bespoke gift step by step: select vase, rose count, chocolate, perfume & personal card' },
  step_1_base: { ar: '١. القاعدة أو الفازة', en: '1. Base or Vase' },
  step_2_flowers: { ar: '٢. نوع وعدد الورد', en: '2. Roses & Count' },
  step_3_wrapping: { ar: '٣. التغليف والشرائط', en: '3. Wrapping & Ribbons' },
  step_4_addons: { ar: '٤. الشوكولاتة والعطور', en: '4. Chocolates & Perfumes' },
  step_5_card: { ar: '٥. بطاقة الإهداء والتوصيل', en: '5. Gift Card & Delivery' },

  // Footer
  footer_about_text: { ar: 'عبق نزوى هي علامة عمانية فاخرة متخصصة في تنسيق الورد الملكي، الشوكولاتة المذهبة، والعطور النيش وتجهيز هدايا الزفاف والمناسبات الخاصة.', en: 'Abaq Nizwa is an Omani luxury brand specialized in royal floral styling, 24k gold chocolates, niche perfumes, and wedding gift boxes.' },
  quick_links: { ar: 'روابط سريعة', en: 'Quick Links' },
  customer_service: { ar: 'خدمة العملاء', en: 'Customer Care' },
  newsletter_title: { ar: 'انضم لنشرتنا النبيلة', en: 'Subscribe to Our Newsletter' },
  newsletter_desc: { ar: 'احصل على خصم 10% على طلبك الأول وأحدث التشكيلات الموسمية.', en: 'Get 10% off your first luxury order and seasonal previews.' },
  subscribe: { ar: 'اشتراك', en: 'Subscribe' },
  enter_email: { ar: 'أدخل بريدك الإلكتروني...', en: 'Enter your email address...' },
  rights_reserved: { ar: 'جميع الحقوق محفوظة © عبق نزوى', en: 'All Rights Reserved © Abaq Nizwa' },

  // Product Page
  select_flower_count: { ar: 'اختر عدد الورود:', en: 'Select Rose Count:' },
  select_wrapping_color: { ar: 'اختر لون التغليف:', en: 'Select Wrapping Color:' },
  select_size: { ar: 'اختر الحجم:', en: 'Select Size:' },
  gift_message_card: { ar: 'إضافة بطاقة إهداء خاصة:', en: 'Add Personalized Gift Card:' },
  recipient_name: { ar: 'اسم المستلم:', en: 'Recipient Name:' },
  recipient_phone: { ar: 'رقم هاتف المستلم (واتساب):', en: 'Recipient Phone (WhatsApp):' },
  write_card_message: { ar: 'اكتب رسالتك القلبية هنا...', en: 'Write your heart-felt message here...' },
  select_delivery_date: { ar: 'تاريخ التوصيل الفاخر:', en: 'Delivery Date:' },
  select_delivery_time: { ar: 'وقت التوصيل المفضل:', en: 'Delivery Time Slot:' },
  related_products: { ar: 'منتجات قد تعجبك أيضاً', en: 'You May Also Like' },

  // Cart & Checkout
  shopping_cart: { ar: 'سلة الهدايا الفاخرة', en: 'Luxury Gift Basket' },
  empty_cart: { ar: 'سلتك فارغة حالياً', en: 'Your Gift Basket is empty' },
  continue_shopping: { ar: 'تصفح تشكيلات الورد والهدايا', en: 'Explore Flowers & Gifts' },
  coupon_placeholder: { ar: 'أدخل كود الخصم (مثل ABAQ10)...', en: 'Enter promo code (e.g., ABAQ10)...' },
  apply: { ar: 'تطبيق', en: 'Apply' },
  order_summary: { ar: 'ملخص الطلب', en: 'Order Summary' },
  subtotal: { ar: 'المجموع الفرعي:', en: 'Subtotal:' },
  discount: { ar: 'الخصم:', en: 'Discount:' },
  delivery_fee: { ar: 'رسوم التوصيل السريع:', en: 'Express Delivery:' },
  grand_total: { ar: 'الإجمالي الكلي:', en: 'Grand Total:' },
  proceed_checkout: { ar: 'المتابعة للتأكيد والدفع', en: 'Proceed to Checkout' },

  // Checkout
  checkout_title: { ar: 'تأكيد الطلب والدفع الفاخر', en: 'Checkout & Payment' },
  shipping_info: { ar: 'معلومات التوصيل والعنوان', en: 'Delivery & Shipping Details' },
  city_oman: { ar: 'المحافظة / المدينة (سلطنة عمان):', en: 'City / Governorate (Oman):' },
  area_district: { ar: 'المنطقة / الحي:', en: 'Area / Neighborhood:' },
  street_address: { ar: 'الشارع / اسم الفيلا / المجمع:', en: 'Street / Villa / Building:' },
  payment_method: { ar: 'طريقة الدفع الفاخرة:', en: 'Payment Method:' },
  place_order: { ar: 'تأكيد الطلب الآن', en: 'Complete Order' },
  order_placed_success: { ar: 'تم استلام طلبك بنجاح!', en: 'Order Placed Successfully!' },
  order_number_is: { ar: 'رقم طلبك هو:', en: 'Your Order Number is:' },

  // Admin
  admin_dashboard: { ar: 'لوحة تحكم إدارة عبق نزوى', en: 'Abaq Nizwa Management Dashboard' },
  admin_products: { ar: 'إدارة المنتجات', en: 'Products Management' },
  admin_orders: { ar: 'إدارة الطلبات', en: 'Orders Management' },
  admin_customers: { ar: 'إدارة العملاء', en: 'Customers Management' },
  admin_coupons: { ar: 'إدارة الكوبونات', en: 'Coupons Management' },
  admin_analytics: { ar: 'تقارير المبيعات', en: 'Sales Analytics' },
  add_product: { ar: 'إضافة منتج جديد', en: 'Add New Product' },

  // Tracking
  track_title: { ar: 'تتبع حالة طلب الهدايا', en: 'Track Gift Order Status' },
  enter_order_num: { ar: 'أدخل رقم الطلب (مثال: AN-89241)...', en: 'Enter order number (e.g. AN-89241)...' },
  track_btn: { ar: 'تتبع الآن', en: 'Track Now' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('abaq_lang') as Language) || 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('abaq_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
