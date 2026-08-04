import React from 'react';
import { ShoppingBag, UserPlus, XCircle, CheckCircle2 } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface ActivityItem {
  id: string;
  type: 'new_order' | 'new_customer' | 'cancelled' | 'delivered';
  title: string;
  time: string;
}

const ICONS: Record<ActivityItem['type'], React.ElementType> = {
  new_order: ShoppingBag,
  new_customer: UserPlus,
  cancelled: XCircle,
  delivered: CheckCircle2,
};

const COLORS: Record<ActivityItem['type'], string> = {
  new_order: 'text-[#7D0A0A] dark:text-[#D4AF37] bg-[#7D0A0A]/10 dark:bg-[#D4AF37]/10',
  new_customer: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
  cancelled: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40',
  delivered: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
};

export const ActivityFeed: React.FC<{ items: ActivityItem[] }> = ({ items }) => {
  if (items.length === 0) {
    return <EmptyState title="لا يوجد نشاط حديث" description="ستظهر هنا آخر الطلبات والأحداث فور حدوثها" />;
  }
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = ICONS[item.type];
        return (
          <div key={item.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-800/60 last:border-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${COLORS[item.type]}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <p className="text-gray-800 dark:text-gray-200 font-medium truncate">{item.title}</p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{item.time}</span>
          </div>
        );
      })}
    </div>
  );
};
