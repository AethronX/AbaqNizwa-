import React from 'react';
import { X, Phone, MapPin, ShoppingBag, Wallet, Calendar } from 'lucide-react';
import { StatusBadge, orderStatusTone } from './StatusBadge';
import { EmptyState } from './EmptyState';

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

export const CustomerDetailDrawer: React.FC<{ customer: any; orders: any[]; onClose: () => void; onSelectOrder: (order: any) => void }> = ({
  customer,
  orders,
  onClose,
  onSelectOrder,
}) => {
  const customerOrders = orders.filter((o) => o.customerPhone === customer.phone);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={onClose}>
      <div className="w-full max-w-lg h-full bg-white dark:bg-[#151111] overflow-y-auto shadow-2xl animate-[slideIn_0.25s_ease-out]" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-[#151111] border-b border-gray-100 dark:border-gray-800 p-6 flex items-center justify-between z-10">
          <div>
            <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-100">{customer.name}</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {customer.phone}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm">
          <div className="grid grid-cols-3 gap-3">
            <SummaryTile icon={ShoppingBag} label="الطلبات" value={String(customer.total_orders)} />
            <SummaryTile icon={Wallet} label="إجمالي الإنفاق" value={formatOmr(customer.total_spent)} />
            <SummaryTile icon={MapPin} label="المدينة" value={customer.city || '—'} />
          </div>

          {customer.first_order_at && (
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> أول طلب: {new Date(customer.first_order_at).toLocaleDateString('ar')}
            </p>
          )}

          <section className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-3">سجل الطلبات</h4>
            {customerOrders.length === 0 ? (
              <EmptyState icon={ShoppingBag} title="لا توجد طلبات" />
            ) : (
              <div className="space-y-2">
                {customerOrders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => onSelectOrder(o)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1A1515] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                  >
                    <div>
                      <p className="font-extrabold text-xs text-[#7D0A0A] dark:text-[#D4AF37]">{o.orderNumber}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{o.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatOmr(o.total)}</span>
                      <StatusBadge tone={orderStatusTone(o.status)} label={STATUS_LABELS[o.status] || o.status} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const SummaryTile: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1A1515] text-center space-y-1">
    <Icon className="w-4 h-4 mx-auto text-[#7D0A0A] dark:text-[#D4AF37]" />
    <p className="text-xs font-extrabold text-gray-900 dark:text-gray-100 truncate">{value}</p>
    <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
  </div>
);
