import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Plus,
  Trash2,
  LogOut,
  Sparkles,
  DatabaseZap,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
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

function formatOmr(n: number) {
  return `${(n || 0).toFixed(2)} ر.ع.`;
}

export const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
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

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    nameAr: '', nameEn: '', descriptionAr: '', price: 35, category: 'bouquets', image: '', stockQuantity: 50,
  });
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
      setOrders(o);
      setCoupons(c);
      setCustomers(cu);
      setAnalytics(an);
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.nameAr || !newProd.price) return;
    await api.createProduct({
      nameAr: newProd.nameAr,
      nameEn: newProd.nameEn || newProd.nameAr,
      descriptionAr: newProd.descriptionAr || 'تنسيق ورد فاخر جديد من عبق نزوى',
      descriptionEn: 'Luxury arrangement by Abaq Nizwa',
      price: Number(newProd.price),
      category: newProd.category,
      images: [newProd.image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80'],
      inStock: true,
      stockQuantity: Number(newProd.stockQuantity) || 50,
      isFeatured: true,
      tagsAr: ['جديد', 'فاخر'],
      tagsEn: ['New', 'Luxury'],
    });
    setNewProd({ nameAr: '', nameEn: '', descriptionAr: '', price: 35, category: 'bouquets', image: '', stockQuantity: 50 });
    setShowAddProduct(false);
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

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'analytics', label: 'التحليلات والمؤشرات', icon: BarChart3 },
    { id: 'orders', label: `الطلبات (${orders.length})`, icon: ShoppingBag },
    { id: 'products', label: `المنتجات (${products.length})`, icon: Package },
    { id: 'coupons', label: `أكواد الخصم (${coupons.length})`, icon: Tag },
    { id: 'customers', label: `العملاء (${customers.length})`, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0F0B0B] text-gray-100">
      <header className="border-b border-gray-800 bg-[#151111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            <span>لوحة تحكم عبق نزوى</span>
          </div>
          <div className="flex items-center gap-4">
            {liveVisitors !== null && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-3 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{liveVisitors} زائر الآن</span>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-950/40 border border-red-900 text-red-300 text-sm rounded-2xl p-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => loadAll()} className="font-bold underline">إعادة المحاولة</button>
          </div>
        )}

        {!loading && products.length === 0 && orders.length === 0 && !error && (
          <div className="bg-[#151111] border border-[#D4AF37]/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-200">
              <DatabaseZap className="w-5 h-5 text-[#D4AF37]" />
              <span>قاعدة البيانات فارغة. اضغط لتحميل كتالوج المنتجات الأولي.</span>
            </div>
            <div className="flex items-center gap-3">
              {seedResult && <span className="text-xs text-gray-400">{seedResult}</span>}
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-800 text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 ${
                  activeTab === tab.id ? 'bg-[#7D0A0A] text-white' : 'bg-[#151111] text-gray-300 border border-gray-800'
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
                        rangeDays === d ? 'bg-[#D4AF37] text-[#151111]' : 'bg-[#151111] text-gray-400 border border-gray-800'
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
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500">
                        <th className="py-3 px-2">رقم الطلب</th>
                        <th className="py-3 px-2">العميل والمستلم</th>
                        <th className="py-3 px-2">التاريخ</th>
                        <th className="py-3 px-2">المبلغ</th>
                        <th className="py-3 px-2">الحالة</th>
                        <th className="py-3 px-2">تحديث</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {orders.map((ord) => (
                        <tr key={ord.id}>
                          <td className="py-3.5 px-2 font-extrabold text-[#D4AF37]">{ord.orderNumber}</td>
                          <td className="py-3.5 px-2">
                            <div className="font-bold">{ord.customerName}</div>
                            <div className="text-[10px] text-gray-500">إلى: {ord.recipientName} ({ord.shippingAddress?.city})</div>
                          </td>
                          <td className="py-3.5 px-2 text-gray-400">{ord.date}</td>
                          <td className="py-3.5 px-2 font-bold">{formatOmr(ord.total)}</td>
                          <td className="py-3.5 px-2">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#7D0A0A]">
                              {STATUS_LABELS[ord.status] || ord.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-2">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="bg-[#1A1515] text-xs p-1.5 rounded-lg border border-gray-700 font-bold"
                            >
                              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                <option key={val} value={val}>{label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={6} className="py-8 text-center text-gray-500">لا توجد طلبات بعد</td></tr>
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
                    onClick={() => setShowAddProduct(true)}
                    className="bg-[#7D0A0A] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> إضافة منتج
                  </button>
                }
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl border border-gray-800 flex gap-4 items-center bg-[#151111]">
                      <img src={p.images?.[0]} alt={p.nameAr} className="w-16 h-16 rounded-xl object-cover" loading="lazy" />
                      <div className="flex-1 space-y-1 text-xs">
                        <h4 className="font-bold text-gray-100">{p.nameAr}</h4>
                        <p className="text-[#D4AF37] font-bold">{formatOmr(p.price)}</p>
                        <span className="text-[10px] text-gray-500 block">{p.category}</span>
                      </div>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-gray-500 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {products.length === 0 && <div className="text-gray-500 text-sm col-span-full text-center py-8">لا توجد منتجات بعد</div>}
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
                    <div key={c.id} className="p-4 rounded-2xl border border-[#D4AF37]/30 bg-[#151111] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-base text-[#D4AF37]">{c.code}</span>
                        <button onClick={() => handleDeleteCoupon(c.id)} className="text-gray-500 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-300 font-bold">خصم {c.discountPercent}%</p>
                      <p className="text-[11px] text-gray-500">{c.descriptionAr}</p>
                    </div>
                  ))}
                  {coupons.length === 0 && <div className="text-gray-500 text-sm col-span-full text-center py-8">لا توجد أكواد خصم بعد</div>}
                </div>
              </Panel>
            )}

            {activeTab === 'customers' && (
              <Panel title="العملاء (مستخرجة من سجل الطلبات)">
                <div className="overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500">
                        <th className="py-3 px-2">الاسم</th>
                        <th className="py-3 px-2">الهاتف</th>
                        <th className="py-3 px-2">المدينة</th>
                        <th className="py-3 px-2">عدد الطلبات</th>
                        <th className="py-3 px-2">إجمالي الإنفاق</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {customers.map((c) => (
                        <tr key={c.phone}>
                          <td className="py-3.5 px-2 font-bold">{c.name}</td>
                          <td className="py-3.5 px-2 text-gray-400">{c.phone}</td>
                          <td className="py-3.5 px-2 text-gray-400">{c.city}</td>
                          <td className="py-3.5 px-2">{c.total_orders}</td>
                          <td className="py-3.5 px-2 font-bold text-[#D4AF37]">{formatOmr(c.total_spent)}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-gray-500">لا يوجد عملاء بعد</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}
          </>
        )}
      </main>

      {showAddProduct && (
        <Modal onClose={() => setShowAddProduct(false)} title="إضافة منتج جديد">
          <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
            <Field label="اسم المنتج (عربي)">
              <input required value={newProd.nameAr} onChange={(e) => setNewProd({ ...newProd, nameAr: e.target.value })} className={inputClass} />
            </Field>
            <Field label="اسم المنتج (إنجليزي)">
              <input value={newProd.nameEn} onChange={(e) => setNewProd({ ...newProd, nameEn: e.target.value })} className={inputClass} />
            </Field>
            <Field label="الوصف">
              <input value={newProd.descriptionAr} onChange={(e) => setNewProd({ ...newProd, descriptionAr: e.target.value })} className={inputClass} />
            </Field>
            <Field label="السعر (ر.ع.)">
              <input type="number" required value={newProd.price} onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })} className={inputClass} />
            </Field>
            <Field label="الكمية بالمخزون">
              <input type="number" value={newProd.stockQuantity} onChange={(e) => setNewProd({ ...newProd, stockQuantity: Number(e.target.value) })} className={inputClass} />
            </Field>
            <Field label="التصنيف">
              <select value={newProd.category} onChange={(e) => setNewProd({ ...newProd, category: e.target.value })} className={inputClass}>
                <option value="bouquets">باقات الورد</option>
                <option value="chocolates">الشوكولاتة</option>
                <option value="perfumes">العطور</option>
                <option value="wedding">هدايا الزواج</option>
                <option value="graduation">هدايا التخرج</option>
              </select>
            </Field>
            <Field label="رابط الصورة">
              <input value={newProd.image} onChange={(e) => setNewProd({ ...newProd, image: e.target.value })} className={inputClass} />
            </Field>
            <ModalActions onClose={() => setShowAddProduct(false)} submitLabel="حفظ" />
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

const inputClass = 'w-full p-2.5 rounded-xl border border-gray-700 bg-[#1A1515] text-gray-100';

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-[#151111] p-5 rounded-2xl border border-gray-800 space-y-1.5">
    <span className="text-[11px] text-gray-500 font-bold block">{label}</span>
    <div className="text-2xl font-extrabold text-[#D4AF37]">{value}</div>
  </div>
);

const Panel: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode }> = ({ title, action, children }) => (
  <div className="bg-[#151111] p-6 rounded-3xl border border-gray-800 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="font-bold text-sm text-gray-100">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="font-semibold block mb-1 text-gray-300">{label}</label>
    {children}
  </div>
);

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-[#151111] p-6 rounded-3xl max-w-md w-full space-y-4 border border-[#7D0A0A]/40" onClick={(e) => e.stopPropagation()}>
      <h3 className="font-bold text-lg text-gray-100">{title}</h3>
      {children}
    </div>
  </div>
);

const ModalActions: React.FC<{ onClose: () => void; submitLabel: string }> = ({ onClose, submitLabel }) => (
  <div className="flex justify-end gap-2 pt-2">
    <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-gray-400 hover:bg-gray-800">إلغاء</button>
    <button type="submit" className="bg-[#7D0A0A] text-white px-5 py-2 rounded-xl font-bold">{submitLabel}</button>
  </div>
);
