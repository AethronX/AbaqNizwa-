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
  DatabaseZap,
  Search,
  Sun,
  Moon,
  Bell,
  X,
  DollarSign,
  TrendingUp,
  Eye,
  UserCheck,
  Percent,
  Repeat,
  Boxes,
  UserPlus,
  Download,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { DashboardCard } from '../components/DashboardCard';
import { SectionHeader } from '../components/SectionHeader';
import { StatCard } from '../components/StatCard';
import { ProgressBarList } from '../components/ProgressBar';
import { ChartContainer } from '../components/ChartContainer';
import { EmptyState } from '../components/EmptyState';
import { DashboardSkeleton } from '../components/Skeleton';
import { ActivityFeed, ActivityItem } from '../components/ActivityCard';
import { StatusBadge, orderStatusTone, stockTone } from '../components/StatusBadge';
import { OrderDetailDrawer } from '../components/OrderDetailDrawer';
import { CustomerDetailDrawer } from '../components/CustomerDetailDrawer';
import { downloadCsv } from '../lib/csv';
import logo from '../assets/logo-abaq-nizwa.png';

type Tab = 'analytics' | 'orders' | 'products' | 'coupons' | 'customers';
type SortDir = 'asc' | 'desc';
interface SortState { key: string; dir: SortDir; }

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد المعالجة',
  preparing: 'تجهيز الورد',
  arranging: 'التنسيق والتغليف',
  shipped: 'خرج للشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

const DEVICE_LABELS: Record<string, string> = {
  mobile: 'الجوال',
  desktop: 'سطح المكتب',
  tablet: 'التابلت',
  unknown: 'غير معروف',
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

function timeAgo(dateStr: string) {
  const then = new Date(dateStr.replace(' ', 'T')).getTime();
  if (Number.isNaN(then)) return dateStr;
  const diffMin = Math.round((Date.now() - then) / 60000);
  if (diffMin < 1) return 'الآن';
  if (diffMin < 60) return `قبل ${diffMin} د`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `قبل ${diffH} س`;
  const diffD = Math.round(diffH / 24);
  return `قبل ${diffD} يوم`;
}

function sortRows<T extends Record<string, any>>(rows: T[], sort: SortState): T[] {
  return [...rows].sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];
    let cmp: number;
    if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
    else cmp = String(av ?? '').localeCompare(String(bv ?? ''), 'ar');
    return sort.dir === 'asc' ? cmp : -cmp;
  });
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

  const [orderSort, setOrderSort] = useState<SortState>({ key: 'date', dir: 'desc' });
  const [productSort, setProductSort] = useState<SortState>({ key: 'nameAr', dir: 'asc' });
  const [customerSort, setCustomerSort] = useState<SortState>({ key: 'total_spent', dir: 'desc' });

  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState('preparing');

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

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

      // Keep the open drawer's data fresh if a background poll runs while it's open.
      setSelectedOrder((prev: any) => (prev ? o.find((x: any) => x.id === prev.id) || prev : prev));
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

  const handleToggleCoupon = async (c: any) => {
    await api.toggleCoupon(c.id, !c.active);
    loadAll();
  };

  const handleBulkStatusUpdate = async () => {
    await Promise.all([...selectedOrderIds].map((id) => api.updateOrderStatus(id, bulkStatus)));
    setSelectedOrderIds(new Set());
    loadAll();
  };

  const toggleOrderSelected = (id: string) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const lowStockCount = products.filter((p) => (p.stockQuantity ?? 0) > 0 && (p.stockQuantity ?? 0) <= 3).length;
  const outOfStockCount = products.filter((p) => (p.stockQuantity ?? 0) <= 0).length;
  const availableCount = products.length - lowStockCount - outOfStockCount;

  const orderStats = analytics?.orderStats ?? { total_orders: 0, total_revenue: 0, avg_order_value: 0 };
  const totalVisits = analytics?.totalVisits ?? { total: 0, unique_sessions: 0 };
  const conversionRate = totalVisits.total > 0 ? (orderStats.total_orders / totalVisits.total) * 100 : 0;
  const returningCustomers = customers.filter((c) => (c.total_orders ?? 0) > 1).length;
  const returningRate = customers.length > 0 ? (returningCustomers / customers.length) * 100 : 0;

  const rangeStartMs = Date.now() - rangeDays * 24 * 60 * 60 * 1000;
  const newCustomersInRange = customers.filter((c) => {
    const t = new Date(c.first_order_at).getTime();
    return Number.isFinite(t) && t >= rangeStartMs;
  }).length;

  // Activity feed: derived entirely from the already-loaded orders list —
  // a customer's first (by date) order in this list is "new customer",
  // otherwise classified by current status. No invented data.
  const activityItems: ActivityItem[] = useMemo(() => {
    const seenPhones = new Set<string>();
    const sortedAsc = [...orders].sort((a, b) => a.date.localeCompare(b.date));
    const classified = sortedAsc.map((o) => {
      const isFirstForCustomer = o.customerPhone && !seenPhones.has(o.customerPhone);
      if (o.customerPhone) seenPhones.add(o.customerPhone);
      let type: ActivityItem['type'] = 'new_order';
      let title = `طلب جديد ${o.orderNumber} من ${o.customerName} — ${formatOmr(o.total)}`;
      if (isFirstForCustomer) {
        type = 'new_customer';
        title = `عميل جديد: ${o.customerName} (أول طلب ${o.orderNumber})`;
      } else if (o.status === 'cancelled') {
        type = 'cancelled';
        title = `طلب ملغي ${o.orderNumber}`;
      } else if (o.status === 'delivered') {
        type = 'delivered';
        title = `تم توصيل الطلب ${o.orderNumber}`;
      }
      return { id: o.id, type, title, time: timeAgo(o.date) };
    });
    return classified.reverse().slice(0, 8);
  }, [orders]);

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

  const sortedOrders = useMemo(() => sortRows(filteredOrders, orderSort), [filteredOrders, orderSort]);

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

  const sortedProducts = useMemo(() => sortRows(filteredProducts, productSort), [filteredProducts, productSort]);
  const sortedCustomers = useMemo(() => sortRows(customers, customerSort), [customers, customerSort]);

  const topProductsWithStock = useMemo(() => {
    return (analytics?.topProducts ?? []).map((tp: any) => {
      const match = products.find((p) => p.nameAr === tp.name_ar);
      return { ...tp, stock: match?.stockQuantity, price: match?.price };
    });
  }, [analytics, products]);

  const recentOrders = orders.slice(0, 6);

  const allVisibleOrdersSelected = sortedOrders.length > 0 && sortedOrders.every((o) => selectedOrderIds.has(o.id));
  const toggleSelectAllOrders = () => {
    setSelectedOrderIds(allVisibleOrdersSelected ? new Set() : new Set(sortedOrders.map((o) => o.id)));
  };

  const exportOrdersCsv = () =>
    downloadCsv(
      'orders.csv',
      ['رقم الطلب', 'العميل', 'الهاتف', 'المبلغ', 'الحالة', 'التاريخ'],
      sortedOrders.map((o) => [o.orderNumber, o.customerName, o.customerPhone, o.total, STATUS_LABELS[o.status] || o.status, o.date])
    );

  const exportProductsCsv = () =>
    downloadCsv(
      'products.csv',
      ['الاسم', 'السعر', 'التصنيف', 'المخزون'],
      sortedProducts.map((p) => [p.nameAr, p.price, CATEGORY_LABELS[p.category] || p.category, p.stockQuantity ?? 0])
    );

  const exportCustomersCsv = () =>
    downloadCsv(
      'customers.csv',
      ['الاسم', 'الهاتف', 'المدينة', 'عدد الطلبات', 'إجمالي الإنفاق'],
      sortedCustomers.map((c) => [c.name, c.phone, c.city, c.total_orders, c.total_spent])
    );

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'analytics', label: 'نظرة عامة', icon: BarChart3 },
    { id: 'orders', label: `الطلبات (${orders.length})`, icon: ShoppingBag },
    { id: 'products', label: `المنتجات (${products.length})`, icon: Package },
    { id: 'coupons', label: `أكواد الخصم (${coupons.length})`, icon: Tag },
    { id: 'customers', label: `العملاء (${customers.length})`, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0F0B0B] text-gray-900 dark:text-gray-100 text-[15px]">
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

      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#151111]/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#7D0A0A] dark:text-[#D4AF37] font-bold text-base">
            <img src={logo} alt="عبق نزوى" className="w-9 h-9 object-contain" width={36} height={36} />
            <span>لوحة تحكم عبق نزوى</span>
          </div>
          <div className="flex items-center gap-3">
            {liveVisitors !== null && (
              <div className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-3 py-1.5 rounded-full">
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
              className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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
                className="bg-[#7D0A0A] hover:bg-[#5A0707] disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-xl"
              >
                {seeding ? 'جارِ التحميل...' : 'تحميل البيانات الأولية'}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-gray-800 text-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#7D0A0A] text-white'
                    : 'bg-white dark:bg-[#151111] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 text-[#D4AF37]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <SectionHeader
                  title="نظرة عامة على الأداء"
                  description="كل الأرقام محدّثة تلقائياً من بيانات المتجر الحقيقية"
                  action={
                    <div className="flex items-center gap-2 text-sm">
                      {[7, 30, 90].map((d) => (
                        <button
                          key={d}
                          onClick={() => setRangeDays(d)}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                            rangeDays === d
                              ? 'bg-[#D4AF37] text-[#151111]'
                              : 'bg-white dark:bg-[#151111] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800'
                          }`}
                        >
                          {d} يوم
                        </button>
                      ))}
                    </div>
                  }
                />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={DollarSign} label="إجمالي الإيرادات" value={formatOmr(orderStats.total_revenue)} />
                  <StatCard icon={ShoppingBag} label="عدد الطلبات" value={String(orderStats.total_orders)} />
                  <StatCard icon={Eye} label="الزيارات" value={String(totalVisits.total)} />
                  <StatCard icon={UserCheck} label="زوّار فريدون" value={String(totalVisits.unique_sessions)} />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <DashboardCard title="الإيرادات عبر الوقت" subtitle="ر.ع. — الطلبات الملغية غير محتسبة">
                    <ChartContainer
                      data={(analytics?.ordersByDay ?? []).map((r: any) => ({ label: r.day, value: r.revenue }))}
                      color="#7D0A0A"
                    />
                  </DashboardCard>
                  <DashboardCard title="الزيارات عبر الوقت">
                    <ChartContainer
                      data={(analytics?.visitsByDay ?? []).map((r: any) => ({ label: r.day, value: r.count }))}
                      color="#D4AF37"
                    />
                  </DashboardCard>
                </div>

                {/* Business Insights */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">مؤشرات الأداء التجاري</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard icon={TrendingUp} label="متوسط قيمة الطلب" value={formatOmr(orderStats.avg_order_value)} />
                    <StatCard icon={Percent} label="معدل التحويل" value={`${conversionRate.toFixed(1)}%`} />
                    <StatCard icon={Repeat} label="عملاء متكررون" value={customers.length > 0 ? `${returningRate.toFixed(0)}%` : '—'} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Top Products table */}
                  <DashboardCard title="المنتجات الأكثر طلباً">
                    {topProductsWithStock.length === 0 ? (
                      <EmptyState icon={Package} title="لا توجد بيانات منتجات لهذه الفترة" />
                    ) : (
                      <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                              <th className="text-start py-2 px-2 font-semibold">المنتج</th>
                              <th className="text-start py-2 px-2 font-semibold">الطلبات</th>
                              <th className="text-start py-2 px-2 font-semibold">المخزون</th>
                              <th className="text-start py-2 px-2 font-semibold">الحالة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                            {topProductsWithStock.map((tp: any, i: number) => (
                              <tr key={i}>
                                <td className="py-2.5 px-2 font-medium text-gray-800 dark:text-gray-200 max-w-[160px] truncate">{tp.name_ar}</td>
                                <td className="py-2.5 px-2 font-bold text-[#7D0A0A] dark:text-[#D4AF37]">{tp.count}</td>
                                <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400">{tp.stock ?? '—'}</td>
                                <td className="py-2.5 px-2">
                                  {typeof tp.stock === 'number' ? (
                                    <StatusBadge
                                      tone={stockTone(tp.stock)}
                                      label={tp.stock <= 0 ? 'نفذ' : tp.stock <= 3 ? 'منخفض' : 'متوفر'}
                                    />
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DashboardCard>

                  {/* Recent Orders widget */}
                  <DashboardCard title="أحدث الطلبات">
                    {recentOrders.length === 0 ? (
                      <EmptyState icon={ShoppingBag} title="لا توجد طلبات بعد" description="ستظهر هنا الطلبات فور وصولها" />
                    ) : (
                      <div className="overflow-x-auto -mx-2">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                              <th className="text-start py-2 px-2 font-semibold">الطلب</th>
                              <th className="text-start py-2 px-2 font-semibold">العميل</th>
                              <th className="text-start py-2 px-2 font-semibold">المبلغ</th>
                              <th className="text-start py-2 px-2 font-semibold">الحالة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                            {recentOrders.map((o) => (
                              <tr key={o.id} onClick={() => setSelectedOrder(o)} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                <td className="py-2.5 px-2 font-extrabold text-[#7D0A0A] dark:text-[#D4AF37]">{o.orderNumber}</td>
                                <td className="py-2.5 px-2 text-gray-700 dark:text-gray-300 max-w-[120px] truncate">{o.customerName}</td>
                                <td className="py-2.5 px-2 font-bold">{formatOmr(o.total)}</td>
                                <td className="py-2.5 px-2">
                                  <StatusBadge tone={orderStatusTone(o.status)} label={STATUS_LABELS[o.status] || o.status} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DashboardCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Customers summary */}
                  <DashboardCard title="ملخص العملاء">
                    {customers.length === 0 ? (
                      <EmptyState icon={Users} title="لا يوجد عملاء بعد" />
                    ) : (
                      <div className="space-y-3">
                        <SummaryRow icon={Users} label="إجمالي العملاء" value={String(customers.length)} />
                        <SummaryRow icon={UserPlus} label={`عملاء جدد (${rangeDays} يوم)`} value={String(newCustomersInRange)} />
                        <SummaryRow icon={Repeat} label="عملاء متكررون" value={String(returningCustomers)} />
                      </div>
                    )}
                  </DashboardCard>

                  {/* Inventory overview */}
                  <DashboardCard title="نظرة على المخزون">
                    {products.length === 0 ? (
                      <EmptyState icon={Boxes} title="لا توجد بيانات مخزون" />
                    ) : (
                      <div className="space-y-3">
                        <SummaryRow icon={Boxes} label="منتجات متوفرة" value={String(availableCount)} tone="success" />
                        <SummaryRow icon={Boxes} label="مخزون منخفض" value={String(lowStockCount)} tone="warning" />
                        <SummaryRow icon={Boxes} label="نفذ من المخزون" value={String(outOfStockCount)} tone="danger" />
                      </div>
                    )}
                  </DashboardCard>

                  {/* Devices */}
                  <DashboardCard title="الأجهزة">
                    <ProgressBarList
                      data={(analytics?.deviceBreakdown ?? []).map((r: any) => ({ label: DEVICE_LABELS[r.device_type] || r.device_type, value: r.count }))}
                      color="#7D0A0A"
                    />
                  </DashboardCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Traffic */}
                  <DashboardCard title="أكثر الصفحات زيارة">
                    <ProgressBarList
                      data={(analytics?.topPaths ?? []).map((r: any) => ({ label: r.path, value: r.count }))}
                      color="#D4AF37"
                    />
                  </DashboardCard>

                  {/* Activity Feed */}
                  <DashboardCard title="أحدث الأنشطة">
                    <ActivityFeed items={activityItems} />
                  </DashboardCard>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <DashboardCard
                title="قائمة الطلبات وتحديث الحالة"
                action={
                  <button
                    onClick={exportOrdersCsv}
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-lg"
                  >
                    <Download className="w-3.5 h-3.5" /> تصدير CSV
                  </button>
                }
              >
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

                {selectedOrderIds.size > 0 && (
                  <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#7D0A0A]/5 dark:bg-[#D4AF37]/10 border border-[#7D0A0A]/20 dark:border-[#D4AF37]/20">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{selectedOrderIds.size} طلب محدد</span>
                    <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className={selectClass}>
                      {Object.entries(STATUS_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                    <button onClick={handleBulkStatusUpdate} className="bg-[#7D0A0A] text-white text-sm font-bold px-4 py-1.5 rounded-lg">
                      تطبيق الحالة
                    </button>
                    <button onClick={() => setSelectedOrderIds(new Set())} className="text-sm text-gray-500 dark:text-gray-400 underline">
                      إلغاء التحديد
                    </button>
                  </div>
                )}

                {sortedOrders.length === 0 ? (
                  <EmptyState icon={ShoppingBag} title="لا توجد طلبات مطابقة" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                          <th className="py-3 px-2 w-8">
                            <input type="checkbox" checked={allVisibleOrdersSelected} onChange={toggleSelectAllOrders} className="rounded" />
                          </th>
                          <SortableTh label="رقم الطلب" sortKey="orderNumber" sort={orderSort} onSort={(k) => setOrderSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))} />
                          <th className="py-3 px-2">العميل والمستلم</th>
                          <SortableTh label="التاريخ" sortKey="date" sort={orderSort} onSort={(k) => setOrderSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))} />
                          <SortableTh label="المبلغ" sortKey="total" sort={orderSort} onSort={(k) => setOrderSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))} />
                          <th className="py-3 px-2">الحالة</th>
                          <th className="py-3 px-2">تحديث</th>
                          <th className="py-3 px-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {sortedOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="py-3.5 px-2">
                              <input
                                type="checkbox"
                                checked={selectedOrderIds.has(ord.id)}
                                onChange={() => toggleOrderSelected(ord.id)}
                                className="rounded"
                              />
                            </td>
                            <td className="py-3.5 px-2 font-extrabold text-[#7D0A0A] dark:text-[#D4AF37] cursor-pointer" onClick={() => setSelectedOrder(ord)}>
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-2">
                              <div className="font-bold">{ord.customerName}</div>
                              <div className="text-xs text-gray-500">إلى: {ord.recipientName} ({ord.shippingAddress?.city})</div>
                            </td>
                            <td className="py-3.5 px-2 text-gray-500 dark:text-gray-400">{ord.date}</td>
                            <td className="py-3.5 px-2 font-bold">{formatOmr(ord.total)}</td>
                            <td className="py-3.5 px-2">
                              <StatusBadge tone={orderStatusTone(ord.status)} label={STATUS_LABELS[ord.status] || ord.status} />
                            </td>
                            <td className="py-3.5 px-2">
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className="bg-gray-50 dark:bg-[#1A1515] text-sm p-1.5 rounded-lg border border-gray-300 dark:border-gray-700 font-bold"
                              >
                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                  <option key={val} value={val}>{label}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3.5 px-2">
                              <button onClick={() => setSelectedOrder(ord)} className="p-1.5 text-gray-400 hover:text-[#7D0A0A] dark:hover:text-[#D4AF37]">
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </DashboardCard>
            )}

            {activeTab === 'products' && (
              <DashboardCard
                title="إدارة المنتجات"
                action={
                  <div className="flex items-center gap-2">
                    <button
                      onClick={exportProductsCsv}
                      className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-lg"
                    >
                      <Download className="w-3.5 h-3.5" /> تصدير
                    </button>
                    <button
                      onClick={openAddProduct}
                      className="bg-[#7D0A0A] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> إضافة منتج
                    </button>
                  </div>
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
                  <select
                    value={`${productSort.key}:${productSort.dir}`}
                    onChange={(e) => {
                      const [key, dir] = e.target.value.split(':');
                      setProductSort({ key, dir: dir as SortDir });
                    }}
                    className={selectClass}
                  >
                    <option value="nameAr:asc">الاسم (أ-ي)</option>
                    <option value="price:asc">السعر (الأقل أولاً)</option>
                    <option value="price:desc">السعر (الأعلى أولاً)</option>
                    <option value="stockQuantity:asc">المخزون (الأقل أولاً)</option>
                  </select>
                </div>
                {sortedProducts.length === 0 ? (
                  <EmptyState icon={Package} title="لا توجد منتجات مطابقة" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedProducts.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex gap-4 items-center bg-gray-50/60 dark:bg-[#1A1515]/50">
                        <img src={p.images?.[0]} alt={p.nameAr} className="w-16 h-16 rounded-xl object-cover shrink-0" loading="lazy" />
                        <div className="flex-1 space-y-1 text-sm min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">{p.nameAr}</h4>
                          <p className="text-[#7D0A0A] dark:text-[#D4AF37] font-bold">{formatOmr(p.price)}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 dark:text-gray-500">{CATEGORY_LABELS[p.category] || p.category}</span>
                            <StatusBadge
                              tone={stockTone(p.stockQuantity ?? 0)}
                              label={`مخزون: ${p.stockQuantity ?? 0}`}
                            />
                          </div>
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
                  </div>
                )}
              </DashboardCard>
            )}

            {activeTab === 'coupons' && (
              <DashboardCard
                title="أكواد الخصم"
                action={
                  <button
                    onClick={() => setShowAddCoupon(true)}
                    className="bg-[#7D0A0A] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة كود
                  </button>
                }
              >
                {coupons.length === 0 ? (
                  <EmptyState icon={Tag} title="لا توجد أكواد خصم بعد" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {coupons.map((c) => (
                      <div key={c.id} className={`p-4 rounded-2xl border space-y-2 ${c.active ? 'border-[#D4AF37]/30 bg-gray-50/60 dark:bg-[#1A1515]/50' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 opacity-60'}`}>
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-lg text-[#7D0A0A] dark:text-[#D4AF37]">{c.code}</span>
                          <button onClick={() => handleDeleteCoupon(c.id)} className="text-gray-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-bold">خصم {c.discountPercent}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.descriptionAr}</p>
                        <label className="flex items-center gap-2 pt-1 cursor-pointer">
                          <input type="checkbox" checked={c.active} onChange={() => handleToggleCoupon(c)} className="rounded" />
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{c.active ? 'مفعّل' : 'معطّل'}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </DashboardCard>
            )}

            {activeTab === 'customers' && (
              <DashboardCard
                title="العملاء (مستخرجة من سجل الطلبات)"
                action={
                  <button
                    onClick={exportCustomersCsv}
                    className="flex items-center gap-1.5 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-lg"
                  >
                    <Download className="w-3.5 h-3.5" /> تصدير CSV
                  </button>
                }
              >
                {sortedCustomers.length === 0 ? (
                  <EmptyState icon={Users} title="لا يوجد عملاء بعد" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-start text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                          <SortableTh label="الاسم" sortKey="name" sort={customerSort} onSort={(k) => setCustomerSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))} />
                          <th className="py-3 px-2">الهاتف</th>
                          <th className="py-3 px-2">المدينة</th>
                          <SortableTh label="عدد الطلبات" sortKey="total_orders" sort={customerSort} onSort={(k) => setCustomerSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))} />
                          <SortableTh label="إجمالي الإنفاق" sortKey="total_spent" sort={customerSort} onSort={(k) => setCustomerSort((s) => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }))} />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {sortedCustomers.map((c) => (
                          <tr key={c.phone} onClick={() => setSelectedCustomer(c)} className="cursor-pointer hover:bg-gray-50/60 dark:hover:bg-gray-800/20 transition-colors">
                            <td className="py-3.5 px-2 font-bold">{c.name}</td>
                            <td className="py-3.5 px-2 text-gray-500 dark:text-gray-400">{c.phone}</td>
                            <td className="py-3.5 px-2 text-gray-500 dark:text-gray-400">{c.city}</td>
                            <td className="py-3.5 px-2">{c.total_orders}</td>
                            <td className="py-3.5 px-2 font-bold text-[#7D0A0A] dark:text-[#D4AF37]">{formatOmr(c.total_spent)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </DashboardCard>
            )}
          </>
        )}
      </main>

      {selectedOrder && (
        <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} onSaved={() => loadAll(true)} />
      )}

      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          orders={orders}
          onClose={() => setSelectedCustomer(null)}
          onSelectOrder={(o) => {
            setSelectedCustomer(null);
            setSelectedOrder(o);
          }}
        />
      )}

      {showProductForm && (
        <Modal onClose={() => setShowProductForm(false)} title={isEditingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}>
          <form onSubmit={handleSubmitProduct} className="space-y-3 text-sm">
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
          <form onSubmit={handleCreateCoupon} className="space-y-3 text-sm">
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

const inputClass = 'w-full p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1A1515] text-gray-900 dark:text-gray-100 text-sm';
const selectClass = 'p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1A1515] text-gray-900 dark:text-gray-100 text-sm font-bold';

const SearchInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1">
    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2.5 pr-9 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1A1515] text-gray-900 dark:text-gray-100 text-sm"
    />
  </div>
);

const SortableTh: React.FC<{ label: string; sortKey: string; sort: SortState; onSort: (key: string) => void }> = ({ label, sortKey, sort, onSort }) => (
  <th className="py-3 px-2 cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300" onClick={() => onSort(sortKey)}>
    <span className="inline-flex items-center gap-1">
      {label}
      {sort.key === sortKey ? (
        sort.dir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-30" />
      )}
    </span>
  </th>
);

const SummaryRow: React.FC<{ icon: React.ElementType; label: string; value: string; tone?: 'success' | 'warning' | 'danger' }> = ({ icon: Icon, label, value, tone }) => {
  const toneClass =
    tone === 'success' ? 'text-emerald-600 dark:text-emerald-400' :
    tone === 'warning' ? 'text-amber-600 dark:text-amber-400' :
    tone === 'danger' ? 'text-red-600 dark:text-red-400' :
    'text-gray-900 dark:text-gray-100';
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      <span className={`font-extrabold ${toneClass}`}>{value}</span>
    </div>
  );
};

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
