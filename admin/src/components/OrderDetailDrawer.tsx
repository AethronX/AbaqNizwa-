import React, { useEffect, useState } from 'react';
import { X, MapPin, Phone, Mail, Calendar, Clock, Tag, CreditCard, CheckCircle2, Circle, Save } from 'lucide-react';
import { StatusBadge, orderStatusTone } from './StatusBadge';
import { api } from '../lib/api';

const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد المعالجة',
  preparing: 'تجهيز الورد',
  arranging: 'التنسيق والتغليف',
  shipped: 'خرج للشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

const PAYMENT_LABELS: Record<string, string> = {
  whatsapp: 'واتساب',
  cod: 'الدفع عند الاستلام',
  visa: 'فيزا',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  thawani: 'ثواني',
};

function formatOmr(n: number) {
  return `${(n || 0).toFixed(2)} ر.ع.`;
}

export const OrderDetailDrawer: React.FC<{ order: any; onClose: () => void; onSaved: () => void }> = ({ order, onClose, onSaved }) => {
  const [notes, setNotes] = useState(order.adminNotes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(order.adminNotes || '');
    setSaved(false);
  }, [order.id]);

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await api.updateOrderNotes(order.id, notes);
      setSaved(true);
      onSaved();
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={onClose}>
      <div
        className="w-full max-w-lg h-full bg-white dark:bg-[#151111] overflow-y-auto shadow-2xl animate-[slideIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-[#151111] border-b border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between z-10">
          <div>
            <h3 className="font-extrabold text-base text-[#7D0A0A] dark:text-[#D4AF37]">{order.orderNumber}</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{order.date}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge tone={orderStatusTone(order.status)} label={STATUS_LABELS[order.status] || order.status} />
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Tracking timeline — real data already collected per order, never surfaced before */}
          <section>
            <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-3">مراحل تنفيذ الطلب</h4>
            <div className="space-y-0">
              {(order.trackingTimeline || []).map((step: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {step.completed ? (
                      <CheckCircle2 className={`w-5 h-5 ${step.current ? 'text-[#D4AF37]' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 dark:text-gray-700" />
                    )}
                    {i < order.trackingTimeline.length - 1 && (
                      <div className={`w-px flex-1 min-h-[18px] ${step.completed ? 'bg-emerald-300 dark:bg-emerald-800' : 'bg-gray-200 dark:bg-gray-800'}`} />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className={`text-sm font-bold ${step.completed ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}`}>{step.titleAr}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Customer & recipient */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-2">العميل</h4>
              <p className="font-bold text-gray-900 dark:text-gray-100">{order.customerName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {order.customerPhone}</p>
              {order.customerEmail && <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><Mail className="w-3 h-3" /> {order.customerEmail}</p>}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-2">المستلم</h4>
              <p className="font-bold text-gray-900 dark:text-gray-100">{order.recipientName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {order.recipientPhone}</p>
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1"><MapPin className="w-4 h-4" /> عنوان التوصيل</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {order.shippingAddress?.city} — {order.shippingAddress?.area} — {order.shippingAddress?.street}
              {order.shippingAddress?.building ? ` — ${order.shippingAddress.building}` : ''}
            </p>
            {order.shippingAddress?.notes && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">ملاحظات: {order.shippingAddress.notes}</p>}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {order.deliveryDate}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {order.deliveryTime}</span>
            </div>
          </section>

          {/* Items */}
          <section>
            <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-2">المنتجات ({order.items?.length || 0})</h4>
            <div className="space-y-2">
              {(order.items || []).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#1A1515]">
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="font-bold text-gray-800 dark:text-gray-200 truncate">{item.product?.nameAr}</p>
                    <p className="text-gray-400 dark:text-gray-500">الكمية: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 shrink-0">{formatOmr(item.product?.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Totals */}
          <section className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-800 pt-4">
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>المجموع الفرعي</span><span>{formatOmr(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> خصم {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span>-{formatOmr(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500 dark:text-gray-400">
              <span>التوصيل</span><span>{formatOmr(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-100 dark:border-gray-800">
              <span>الإجمالي</span><span>{formatOmr(order.total)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 pt-1">
              <CreditCard className="w-3 h-3" />
              <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
            </div>
          </section>

          {/* Admin notes */}
          <section className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-2">ملاحظات داخلية (تظهر للإدارة فقط)</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="أضف ملاحظة عن هذا الطلب..."
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1A1515] text-gray-900 dark:text-gray-100 text-sm resize-none transition-colors duration-200 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30"
            />
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="mt-2 flex items-center gap-2 bg-[#7D0A0A] hover:bg-[#5A0707] disabled:opacity-60 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جارِ الحفظ...' : saved ? 'تم الحفظ ✓' : 'حفظ الملاحظة'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};
