import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Product, Order } from '../types';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Truck,
  Sparkles,
  DollarSign,
  Star,
  Image,
  Layers
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    formatPrice,
    updateOrderStatus,
    deleteProduct,
    addProduct,
    reviews
  } = useStore();

  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'orders' | 'coupons' | 'reviews'>('kpis');

  // New Product Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(35);
  const [newProdCategory, setNewProdCategory] = useState('bouquets');
  const [newProdDescAr, setNewProdDescAr] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80');

  // KPI calculations
  const totalSalesOMR = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr || !newProdPrice) return;
    addProduct({
      nameAr: newProdNameAr,
      nameEn: newProdNameEn || newProdNameAr,
      descriptionAr: setNewProdDescAr ? newProdDescAr : 'تنسيق ورد فاخر جديد من عبق نزوى',
      descriptionEn: 'Luxury arrangement by Abaq Nizwa',
      price: Number(newProdPrice),
      category: newProdCategory,
      images: [newProdImage],
      inStock: true,
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: true,
      tagsAr: ['جديد', 'فاخر']
    });

    setNewProdNameAr('');
    setNewProdNameEn('');
    setNewProdDescAr('');
    setShowAddProductModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#7D0A0A] dark:text-[#D4AF37] text-xs font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{language === 'en' ? 'ABAQ NIZWA VIP ADMIN PORTAL' : 'لوحة تحكم عبق نزوى الإدارية VIP'}</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
            {language === 'en' ? 'Sales, Products & Orders Management' : 'إدارة المبيعات والمنتجات والطلبات'}
          </h1>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="bg-[#7D0A0A] hover:bg-[#5A0707] text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-lg flex items-center gap-2 border border-[#D4AF37]/50 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>{language === 'en' ? 'Add New Product or Bouquet' : 'إضافة منتج أو باقة جديدة'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100 dark:border-gray-800 text-xs">
        {[
          { id: 'kpis', label: language === 'en' ? 'Analytics & KPIs' : 'المؤشرات والتقارير', icon: BarChart3 },
          { id: 'orders', label: language === 'en' ? `Orders (${orders.length})` : `إدارة الطلبات (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: language === 'en' ? `Inventory (${products.length})` : `المخزون والمنتجات (${products.length})`, icon: Package },
          { id: 'coupons', label: language === 'en' ? `Promo Codes (${coupons.length})` : `أكواد الخصم (${coupons.length})`, icon: Tag },
          { id: 'reviews', label: language === 'en' ? `Reviews (${reviews.length})` : `التقييمات (${reviews.length})`, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#7D0A0A] text-white shadow-md'
                  : 'bg-white dark:bg-[#151111] text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 text-[#D4AF37]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW KPIS */}
      {activeTab === 'kpis' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <span className="text-xs text-gray-500 font-bold block">{language === 'en' ? 'Total Sales Revenue:' : 'إجمالي إيرادات المبيعات:'}</span>
              <div className="text-3xl font-extrabold text-[#7D0A0A] dark:text-[#D4AF37] font-heading">
                {formatPrice(totalSalesOMR)}
              </div>
              <span className="text-[11px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-bold inline-block">
                {language === 'en' ? '+18.5% vs Last Month' : '+18.5% مقارنة بالشهر الماضي'}
              </span>
            </div>

            <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <span className="text-xs text-gray-500 font-bold block">{language === 'en' ? 'Completed Orders:' : 'عدد الطلبات المكتملة:'}</span>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 font-heading">
                {totalOrders} {language === 'en' ? 'Orders' : 'طلبات'}
              </div>
              <span className="text-[11px] text-gray-400 block">{language === 'en' ? 'Across all Omani Governorates' : 'من كافة محافظات سلطنة عمان'}</span>
            </div>

            <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <span className="text-xs text-gray-500 font-bold block">{language === 'en' ? 'Total Gift Products:' : 'إجمالي باقات الورد والهدايا:'}</span>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 font-heading">
                {totalProducts} {language === 'en' ? 'Items' : 'منتجاً'}
              </div>
              <span className="text-[11px] text-gray-400 block">{language === 'en' ? 'Ready for express dispatch' : 'جاهزة للتوصيل الفوري'}</span>
            </div>

            <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
              <span className="text-xs text-gray-500 font-bold block">{language === 'en' ? 'Average Order Value:' : 'متوسط قيمة الفاتورة:'}</span>
              <div className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 font-heading">
                {formatPrice(totalSalesOMR / (totalOrders || 1))}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold block">{language === 'en' ? 'High-Ticket Luxury Basket' : 'معدل شراء فاخر high-ticket'}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg font-heading text-gray-900 dark:text-gray-100">
            {language === 'en' ? 'Live Orders & Status Control' : 'قائمة طلبات العملاء والحالات الحية'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-500">
                  <th className="py-3 px-2">{language === 'en' ? 'Order No.' : 'رقم الطلب'}</th>
                  <th className="py-3 px-2">{language === 'en' ? 'Customer & Recipient' : 'العميل والمستلم'}</th>
                  <th className="py-3 px-2">{language === 'en' ? 'Date & Time' : 'التاريخ والتوقيت'}</th>
                  <th className="py-3 px-2">{language === 'en' ? 'Amount' : 'المبلغ'}</th>
                  <th className="py-3 px-2">{language === 'en' ? 'Payment' : 'طريقة الدفع'}</th>
                  <th className="py-3 px-2">{language === 'en' ? 'Current Status' : 'حالة الطلب الحالية'}</th>
                  <th className="py-3 px-2">{language === 'en' ? 'Update Status' : 'تحديث الحالة'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="py-3.5 px-2 font-extrabold text-[#7D0A0A] dark:text-[#D4AF37]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-2 font-bold text-gray-900 dark:text-gray-100">
                      <div>{ord.customerName}</div>
                      <div className="text-[10px] text-gray-400">To: {ord.recipientName} ({ord.shippingAddress.city})</div>
                    </td>
                    <td className="py-3.5 px-2 text-gray-500">
                      {ord.date} <br /> {ord.deliveryTime}
                    </td>
                    <td className="py-3.5 px-2 font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3.5 px-2 uppercase font-semibold text-gray-600 dark:text-gray-400">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#7D0A0A] text-white">
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="bg-gray-100 dark:bg-gray-800 text-xs p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 font-bold"
                      >
                        <option value="pending">{language === 'en' ? 'Pending' : 'قيد المعالجة'}</option>
                        <option value="preparing">{language === 'en' ? 'Selecting Roses' : 'تجهيز الورد'}</option>
                        <option value="arranging">{language === 'en' ? 'Wrapping Gift' : 'التنسيق والتغليف'}</option>
                        <option value="shipped">{language === 'en' ? 'Shipped' : 'خرج للشحن'}</option>
                        <option value="delivered">{language === 'en' ? 'Delivered' : 'تم التوصيل'}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg font-heading text-gray-900 dark:text-gray-100">
              {language === 'en' ? 'Manage Products & Stock' : 'إدارة منتجات ومخزون عبق نزوى'}
            </h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-[#7D0A0A] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              + {language === 'en' ? 'Add Item' : 'إضافة منتج'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => {
              const pName = language === 'en' ? p.nameEn : p.nameAr;
              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-4 items-center bg-gray-50/50 dark:bg-gray-800/30"
                >
                  <img src={p.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 space-y-1 text-xs">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{pName}</h4>
                    <p className="text-[#7D0A0A] dark:text-[#D4AF37] font-bold">{formatPrice(p.price)}</p>
                    <span className="text-[10px] text-gray-400 block">{language === 'en' ? 'Category:' : 'التصنيف:'} {p.category}</span>
                  </div>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title={language === 'en' ? 'Delete Item' : 'حذف المنتج'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg font-heading text-gray-900 dark:text-gray-100">
            {language === 'en' ? 'Active Promo Codes & Offers' : 'أكواد الخصم والعروض الملكية النشطة'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="p-4 rounded-2xl border border-[#D4AF37]/40 bg-[#FCECEF]/40 dark:bg-[#7D0A0A]/20 space-y-2">
                <span className="font-extrabold text-base text-[#7D0A0A] dark:text-[#D4AF37] block">
                  {language === 'en' ? 'Promo Code:' : 'كود الخصم:'} {c.code}
                </span>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">{language === 'en' ? 'Discount:' : 'خصم بنسبة:'} {c.discountPercent}%</p>
                <p className="text-[11px] text-gray-500">{language === 'en' ? c.descriptionEn : c.descriptionAr}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <h3 className="font-bold text-lg font-heading text-gray-900 dark:text-gray-100">
            {language === 'en' ? 'Approved Customer Reviews' : 'مراجعات وتقييمات العملاء المعتمدة'}
          </h3>
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-xs space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span>{r.userName} ({r.city})</span>
                  <span className="text-amber-500">★ {r.rating}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">"{r.comment}"</p>
                <span className="text-[10px] text-gray-400 block">{r.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl max-w-md w-full space-y-4 border border-[#7D0A0A]/30">
            <h3 className="font-bold text-lg font-heading text-gray-900 dark:text-gray-100">
              {language === 'en' ? 'Add New Floral Gift or Product' : 'إضافة باقة ورد أو هدية جديدة'}
            </h3>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">{language === 'en' ? 'Product Name (Arabic):' : 'اسم المنتج باللغة العربية:'}</label>
                <input
                  type="text"
                  required
                  value={newProdNameAr}
                  onChange={(e) => setNewProdNameAr(e.target.value)}
                  placeholder={language === 'en' ? 'e.g. Royal Sultana Nizwa Bouquet' : 'مثال: باقة سلطانة نزوى الملكية'}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">{language === 'en' ? 'Price (OMR):' : 'السعر (ر.ع.):'}</label>
                <input
                  type="number"
                  required
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">{language === 'en' ? 'Main Category:' : 'التصنيف الرئيسي:'}</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 font-bold"
                >
                  <option value="bouquets">{language === 'en' ? 'Fresh Flower Bouquets' : 'باقات الورد الطبيعي'}</option>
                  <option value="chocolates">{language === 'en' ? 'Luxury Chocolates' : 'الشوكولاتة الفاخرة'}</option>
                  <option value="perfumes">{language === 'en' ? 'Omani Niche Perfumes' : 'عطور النيش العمانية'}</option>
                  <option value="wedding">{language === 'en' ? 'Wedding Gifts & Stages' : 'هدايا وتجهيزات الزواج'}</option>
                  <option value="graduation">{language === 'en' ? 'Graduation Gifts' : 'هدايا التخرج'}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">{language === 'en' ? 'Image URL:' : 'رابط صورة المنتج (URL):'}</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  {language === 'en' ? 'Cancel' : 'إلغاء'}
                </button>
                <button
                  type="submit"
                  className="bg-[#7D0A0A] text-white px-5 py-2 rounded-xl font-bold shadow-md"
                >
                  {language === 'en' ? 'Save & Publish' : 'حفظ ونشر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
