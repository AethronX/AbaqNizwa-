import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Plus,
  Trash2,
  Pencil,
  LogOut,
  Sparkles,
  DatabaseZap,
  Search,
  Sun,
  Moon,
  Bell,
  X,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SimpleLineChart } from '../components/SimpleLineChart';
import { SimpleBarList } from '../components/SimpleBarList';

type Tab = 'analytics' | 'orders' | 'products' | 'coupons' | 'customers';

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد المعالجة',
  preparing: 'تجهيز الورد',
  arranging: 'التنسيق والتغليف',
  shipped: 'خرج للشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

const CATEGORY_LABELS: Record<string, string> = {
  bouquets: 'باقات الورد',
  chocolates: 'الشوكولاتة',
  perfumes: 'العطور',
  wedding: 'هدايا الزواج',
  graduation: 'هدايا التخرج',
  baby: 'هدايا المواليد',
  'luxury-gifts': 'هدايا فاخرة',
};

function formatOmr(n: number) {
  return `${(n || 0).toFixed(2)} ر.ع.`;
}

const emptyProductForm = {
  id: '',
  nameAr: '',
  nameEn: '',
  descriptionAr: '',
  price: 35,
  category: 'bouquets',
  image: '',
  stockQuantity: 50,
};

export const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('analytics');

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [rangeDays, setRangeDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seedResult, setSeedResult] = useState<string>('');
  const [seeding, setSeeding] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState<number | null>(null);

  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
  const showToast = (message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  };
  const knownOrderIds = useRef<Set<string> | null>(null);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const isEditingProduct = Boolean(productForm.id);

  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '', discountPercent: 10, minOrder: 0, validUntil: '', descriptionAr: '', descriptionEn: '', active: true,
  });

  const loadAll = async (silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const [p, o, c, cu, an] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getCoupons(),
        api.getCustomers(),
        api.getAnalyticsSummary(rangeDays),
      ]);
      setProducts(p);
      setCoupons(c);
      setCustomers(cu);
      setAnalytics(an);

      // New-order notification: compare against the set of order ids we've
      // already seen. First load just seeds the baseline silently.
      if (knownOrderIds.current === null) {
        knownOrderIds.current = new Set(o.map((ord: any) => ord.id));
      } else {
        const fresh = o.filter((ord: any) => !knownOrderIds.current!.has(ord.id));
        for (const ord of fresh) {
          showToast(`طلب جديد وصل! ${ord.orderNumber} — ${formatOmr(ord.total)} 🎉`);
        }
        knownOrderIds.current = new Set(o.map((ord: any) => ord.id));
      }
      setOrders(o);
    } catch (err) {
      if (!silent) setError(err instanceof Error ? err.message : 'تعذر تحميل البيانات');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDays]);

  // Anything that happens on the storefront (new orders, coupon usage...)
  // shows up here without a manual refresh — background poll every 20s.
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') loadAll(true);
    }, 20000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDays]);

  // Live visitor count — separate, much faster poll (5s) since it's a
  // cheap single-row query, independent of the heavier full-data refresh.
  useEffect(() => {
    const poll = () => {
      if (document.visibilityState !== 'visible') return;
      api.getLiveVisitors().then((r) => setLiveVisitors(r.activeVisitors)).catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult('');
    try {
      const res = await api.seed();
      setSeedResult(`تمت الإضافة: ${res.productsInserted} منتج، ${res.couponsInserted} كوبون`);
      await loadAll();
    } catch (err) {
      setSeedResult(err instanceof Error ? err.message : 'فشل التحميل الأولي');
    } finally {
      setSeeding(false);
    }
  };

  const openAddProduct = () => {
    setProductForm(emptyProductForm);
    setShowProductForm(true);
  };

  const openEditProduct = (p: any) => {
    setProductForm({
      id: p.id,
      nameAr: p.nameAr || '',
      nameEn: p.nameEn || '',
      descriptionAr: p.descriptionAr || '',
      price: p.price || 0,
      category: p.category || 'bouquets',
      image: p.images?.[0] || '',
      stockQuantity: p.stockQuantity ?? 0,
    });
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.nameAr || !productForm.price) return;

    if (isEditingProduct) {
      const existing = products.find((p) => p.id === productForm.id);
      await api.updateProduct({
        ...existing,
        nameAr: productForm.nameAr,
        nameEn: productForm.nameEn || productForm.nameAr,
        descriptionAr: productForm.descriptionAr || existing?.descriptionAr,
        price: Number(productForm.price),
        category: productForm.category,
        images: [productForm.image || existing?.images?.[0]],
        stockQuantity: Number(productForm.stockQuantity) || 0,
        inStock: Number(productForm.stockQuantity) > 0,
      });
    } else {
      await api.createProduct({
        nameAr: productForm.nameAr,
        nameEn: productForm.nameEn || productForm.nameAr,
        descriptionAr: productForm.descriptionAr || 'تنسيق ورد فاخر جديد من عبق نزوى',
        descriptionEn: 'Luxury arrangement by Abaq Nizwa',
        price: Number(productForm.price),
        category: productForm.category,
        images: [productForm.image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80'],
        inStock: true,
        stockQuantity: Number(productForm.stockQuantity) || 50,
        isFeatured: true,
        tagsAr: ['جديد', 'فاخر'],
        tagsEn: ['New', 'Luxury'],
      });
    }
    setProductForm(emptyProductForm);
    setShowProductForm(false);
    loadAll();
  };

  const handleDeleteProduct = async (id: string) => {
    await api.deleteProduct(id);
    loadAll();
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await api.updateOrderStatus(id, status);
    loadAll();
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    await api.createCoupon(newCoupon);
    setNewCoupon({ code: '', discountPercent: 10, minOrder: 0, validUntil: '', descriptionAr: '', descriptionEn: '', active: true });
    setShowAddCoupon(false);
    loadAll();
  };

  const handleDeleteCoupon = async (id: string) => {
    await api.deleteCoupon(id);
    loadAll();
  };

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockCount = products.filter((p) => (p.stockQuantity ?? 0) <= 3).length;

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchesSearch =
        !q ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const productCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).filter(Boolean),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchesSearch =
        !q || p.nameAr?.toLowerCase().includes(q) || p.nameEn?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, productSearch, productCategoryFilter]);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'analytics', label: 'التحليلات والمؤشرات', icon: BarChart3 },
    { id: 'orders', label: `الطلبات (${orders.length})`, icon: ShoppingBag },
    { id: 'products', label: `المنتجات (${products.length})`, icon: Package },
    { id: 'coupons', label: `أكواد الخصم (${coupons.length})`, icon: Tag },
    { id: 'customers', label: `العملاء (${customers.length})`, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBFB] dark:bg-[#0F0B0B] text-gray-900 dark:text-gray-100">
      {/* Toast notifications */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] space-y-2 w-full max-w-sm px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-[#151111] border border-[#D4AF37]/40 shadow-xl rounded-2xl p-4 flex items-start gap-3 text-sm animate-[fadeIn_0.3s_ease-out]"
          >
            <Bell className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <span className="flex-1 text-gray-800 dark:text-gray-100">{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7D0A0A] dark:text-[#D4AF37] font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>لوحة تحكم عبق نزوى</span>
          </div>
          <div className="flex items-center gap-3">
            {liveVisitors !== null && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{liveVisitors} زائر الآن</span>
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="تبديل المظهر"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#D4AF37]" />}
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm rounded-2xl p-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => loadAll()} className="font-bold underline">إعادة المحاولة</button>
          </div>
        )}

        {!loading && products.length === 0 && orders.length === 0 && !error && (
          <div className="bg-white dark:bg-[#151111] border border-[#D4AF37]/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <DatabaseZap className="w-5 h-5 text-[#D4AF37]" />
              <span>قاعدة البيانات فارغة. اضغط لتحميل كتالوج المنتجات الأولي.</span>
            </div>
            <div className="flex items-center gap-3">
              {seedResult && <span className="text-xs text-gray-500 dark:text-gray-400">{seedResult}</span>}
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="bg-[#7D0A0A] hover:bg-[#5A0707] disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                {seeding ? 'جارِ التحميل...' : 'تحميل البيانات الأولية'}
              </button>
            </div>
          </div>
        )}

        {!loading && lowStockCount > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm rounded-2xl p-4">
            تنبيه: {lowStockCount} منتج بمخزون منخفض (3 قطع أو أقل) — راجع تبويب المنتجات.
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-gray-800 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#7D0A0A] text-white'
                    : 'bg-white dark:bg-[#151111] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                }`}
              >
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex items-center justify-end gap-2 text-xs">
                  {[7, 30, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setRangeDays(d)}
                      className={`px-3 py-1.5 rounded-lg font-bold ${
                        rangeDays === d
                          ? 'bg-[#D4AF37] text-[#151111]'
                          : 'bg-white dark:bg-[#151111] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
                      }`}
                    >
                      {d} يوم
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="إجمالي الإيرادات" value={formatOmr(totalRevenue)} />
                  <StatCard label="عدد الطلبات" value={String(orders.length)} />
                  <StatCard label="الزيارات" value={String(analytics?.totalVisits?.total ?? 0)} />
                  <StatCard label="زوّار فريدون" value={String(analytics?.totalVisits?.unique_sessions ?? 0)} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Panel title="الزيارات عبر الوقت">
                    <SimpleLineChart
                      data={(analytics?.visitsByDay ?? []).map((r: any) => ({ label: r.day, value: r.count }))}
                      color="#D4AF37"
                    />
                  </Panel>
                  <Panel title="الإيرادات عبر الوقت">
                    <SimpleLineChart
                      data={(analytics?.ordersByDay ?? []).map((r: any) => ({ label: r.day, value: r.revenue }))}
                      color="#7D0A0A"
                    />
                  </Panel>
                  <Panel title="أكثر الصفحات زيارة">
                    <SimpleBarList
                      data={(analytics?.topPaths ?? []).map((r: any) => ({ label: r.path, value: r.count }))}
                    />
                  </Panel>
                  <Panel title="المنتجات الأكثر طلباً">
                    <SimpleBarList
                      data={(analytics?.topProducts ?? []).map((r: any) => ({ label: r.name_ar, value: r.count }))}
                    />
                  </Panel>
                  <Panel title="الأجهزة">
                    <SimpleBarList
                      data={(analytics?.deviceBreakdown ?? []).map((r: any) => ({ label: r.device_type, value: r.count }))}
                    />
                  </Panel>
                  <Panel title="المدن الأكثر طلباً">
                    <SimpleBarList
                      data={(analytics?.topCities ?? []).map((r: any) => ({ label: r.city, value: r.count }))}
                    />
                  </Panel>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <Panel title="قائمة الطلبات وتحديث الحالة">
                <div className="flex flex-col sm:flex-row gap-3">
                  <SearchInput value={orderSearch} onChange={setOrderSearch} placeholder="ابحث برقم الطلب أو اسم العميل أو الهاتف..." />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className={selectClass}
                  >
                    <option value="all">كل الحالات</option>
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                        <th className="py-3 px-2">رقم الطلب</th>
                        <th className="py-3 px-2">العميل والمستلم</th>
                        <th className="py-3 px-2">التاريخ</th>
                        <th className="py-3 px-2">المبلغ</th>
                        <th className="py-3 px-2">الحالة</th>
                        <th className="py-3 px-2">تحديث</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td className="py-3.5 px-2 font-extrabold text-[#7D0A0A] dark:text-[#D4AF37]">{ord.orderNumber}</td>
                          <td className="py-3.5 px-2">
                            <div className="font-bold">{ord.customerName}</div>
                            <div className="text-[10px] text-gray-500">إلى: {ord.recipientName} ({ord.shippingAddress?.city})</div>
                          </td>
                          <td className="py-3.5 px-2 text-gray-500 dark:text-gray-400">{ord.date}</td>
                          <td className="py-3.5 px-2 font-bold">{formatOmr(ord.total)}</td>
                          <td className="py-3.5 px-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#7D0A0A] text-white">
                              {STATUS_LABELS[ord.status] || ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="bg-gray-50 dark:bg-[#1A1515] text-xs p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 font-bold"
                            >
                              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-gray-400 dark:text-gray-500">لا توجد طلبات مطابقة</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {activeTab === 'products' && (
              <Panel
                title="إدارة المنتجات"
                action={
                  <button
                    onClick={openAddProduct}
                    className="bg-[#7D0A0A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة منتج
                  </button>
                }
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <SearchInput value={productSearch} onChange={setProductSearch} placeholder="ابحث باسم المنتج..." />
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className={selectClass}
                  >
                    <option value="all">كل التصنيفات</option>
                    {productCategories.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex gap-4 items-center bg-gray-50/60 dark:bg-[#151111]">
                      <img src={p.images?.[0]} alt={p.nameAr} className="w-16 h-16 rounded-xl object-cover shrink-0" loading="lazy" />
                      <div className="flex-1 space-y-1 text-xs min-w-0">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">{p.nameAr}</h4>
                        <p className="text-[#7D0A0A] dark:text-[#D4AF37] font-bold">{formatOmr(p.price)}</p>
                        <span className={`text-[10px] block ${(p.stockQuantity ?? 0) <= 3 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                          {CATEGORY_LABELS[p.category] || p.category} · مخزون: {p.stockQuantity ?? 0}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 shrink-0">
                        <button onClick={() => openEditProduct(p)} className="p-2 text-gray-400 hover:text-[#D4AF37]">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && <div className="text-gray-400 dark:text-gray-500 text-sm col-span-full text-center py-8">لا توجد منتجات مطابقة</div>}
                </div>
              </Panel>
            )}

            {activeTab === 'coupons' && (
              <Panel
                title="أكواد الخصم"
                action={
                  <button
                    onClick={() => setShowAddCoupon(true)}
                    className="bg-[#7D0A0A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة كود
                  </button>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {coupons.map((c) => (
                    <div key={c.id} className="p-4 rounded-2xl border border-[#D4AF37]/30 bg-gray-50/60 dark:bg-[#151111] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-base text-[#7D0A0A] dark:text-[#D4AF37]">{c.code}</span>
                        <button onClick={() => handleDeleteCoupon(c.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">خصم {c.discountPercent}%</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">{c.descriptionAr}</p>
                    </div>
                  ))}
                  {coupons.length === 0 && <div className="text-gray-400 dark:text-gray-500 text-sm col-span-full text-center py-8">لا توجد أكواد خصم بعد</div>}
                </div>
              </Panel>
            )}

            {activeTab === 'customers' && (
              <Panel title="العملاء (مستخرجة من سجل الطلبات)">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                        <th className="py-3 px-2">الاسم</th>
                        <th className="py-3 px-2">الهاتف</th>
                        <th className="py-3 px-2">المدينة</th>
                        <th className="py-3 px-2">عدد الطلبات</th>
                        <th className="py-3 px-2">إجمالي الإنفاق</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {customers.map((c) => (
                        <tr key={c.phone}>
                          <td className="py-3.5 px-2 font-bold">{c.name}</td>
                          <td className="py-3.5 px-2 text-gray-500 dark:text-gray-400">{c.phone}</td>
                          <td className="py-3.5 px-2 text-gray-500 dark:text-gray-400">{c.city}</td>
                          <td className="py-3.5 px-2">{c.total_orders}</td>
                          <td className="py-3.5 px-2 font-bold text-[#7D0A0A] dark:text-[#D4AF37]">{formatOmr(c.total_spent)}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-400 dark:text-gray-500">لا يوجد عملاء بعد</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}
          </>
        )}
      </main>

      {showProductForm && (
        <Modal onClose={() => setShowProductForm(false)} title={isEditingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}>
          <form onSubmit={handleSubmitProduct} className="space-y-3 text-xs">
            <Field label="اسم المنتج (عربي)">
              <input required value={productForm.nameAr} onChange={(e) => setProductForm({ ...productForm, nameAr: e.target.value })} className={inputClass} />
            </Field>
            <Field label="اسم المنتج (إنجليزي)">
              <input value={productForm.nameEn} onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })} className={inputClass} />
            </Field>
            <Field label="الوصف">
              <input value={productForm.descriptionAr} onChange={(e) => setProductForm({ ...productForm, descriptionAr: e.target.value })} className={inputClass} />
            </Field>
            <Field label="السعر (ر.ع.)">
              <input type="number" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} className={inputClass} />
            </Field>
            <Field label="الكمية بالمخزون">
              <input type="number" value={productForm.stockQuantity} onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })} className={inputClass} />
            </Field>
            <Field label="التصنيف">
              <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className={inputClass}>
                <option value="bouquets">باقات الورد</option>
                <option value="chocolates">الشوكولاتة</option>
                <option value="perfumes">العطور</option>
                <option value="wedding">هدايا الزواج</option>
                <option value="graduation">هدايا التخرج</option>
                <option value="baby">هدايا المواليد</option>
                <option value="luxury-gifts">هدايا فاخرة</option>
              </select>
            </Field>
            <Field label="رابط الصورة">
              <input value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className={inputClass} />
            </Field>
            <ModalActions onClose={() => setShowProductForm(false)} submitLabel={isEditingProduct ? 'حفظ التعديلات' : 'حفظ'} />
          </form>
        </Modal>
      )}

      {showAddCoupon && (
        <Modal onClose={() => setShowAddCoupon(false)} title="إضافة كود خصم">
          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
            <Field label="الكود">
              <input required value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} className={inputClass} />
            </Field>
            <Field label="نسبة الخصم %">
              <input type="number" required value={newCoupon.discountPercent} onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })} className={inputClass} />
            </Field>
            <Field label="الحد الأدنى للطلب">
              <input type="number" value={newCoupon.minOrder} onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: Number(e.target.value) })} className={inputClass} />
            </Field>
            <Field label="صالح حتى">
              <input type="date" value={newCoupon.validUntil} onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })} className={inputClass} />
            </Field>
            <Field label="الوصف">
              <input value={newCoupon.descriptionAr} onChange={(e) => setNewCoupon({ ...newCoupon, descriptionAr: e.target.value, descriptionEn: e.target.value })} className={inputClass} />
            </Field>
            <ModalActions onClose={() => setShowAddCoupon(false)} submitLabel="حفظ" />
          </form>
        </Modal>
      )}
    </div>
  );
};

const inputClass = 'w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1A1515] text-gray-900 dark:text-gray-100';
const selectClass = 'p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1A1515] text-gray-900 dark:text-gray-100 text-xs font-bold';

const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1">
    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2.5 pr-9 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1A1515] text-gray-900 dark:text-gray-100 text-xs"
    />
  </div>
);

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white dark:bg-[#151111] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-1.5">
    <span className="text-[11px] text-gray-500 dark:text-gray-500 font-bold block">{label}</span>
    <div className="text-2xl font-extrabold text-[#7D0A0A] dark:text-[#D4AF37]">{value}</div>
  </div>
);

const Panel: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode }> = ({ title, action, children }) => (
  <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="font-semibold block mb-1 text-gray-600 dark:text-gray-300">{label}</label>
    {children}
  </div>
);

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white dark:bg-[#151111] p-6 rounded-3xl max-w-md w-full space-y-4 border border-[#7D0A0A]/20 dark:border-[#7D0A0A]/40 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
      {children}
    </div>
  </div>
);

const ModalActions: React.FC<{ onClose: () => void; submitLabel: string }> = ({ onClose, submitLabel }) => (
  <div className="flex justify-end gap-2 pt-2">
    <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">إلغاء</button>
    <button type="submit" className="bg-[#7D0A0A] text-white px-5 py-2 rounded-xl font-bold">{submitLabel}</button>
  </div>
);
