import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
  danger: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
  info: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
};

export const StatusBadge: React.FC<{ label: string; tone: Tone }> = ({ label, tone }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${TONE_CLASSES[tone]}`}>
    {label}
  </span>
);

export function orderStatusTone(status: string): Tone {
  switch (status) {
    case 'delivered': return 'success';
    case 'cancelled': return 'danger';
    case 'shipped': return 'info';
    case 'pending': return 'neutral';
    default: return 'warning';
  }
}

export function stockTone(qty: number): Tone {
  if (qty <= 0) return 'danger';
  if (qty <= 3) return 'warning';
  return 'success';
}
