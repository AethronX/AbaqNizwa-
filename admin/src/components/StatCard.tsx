import React from 'react';

export const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: { value: number; label: string } | null;
}> = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white dark:bg-[#151111] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-none transition-shadow space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-gray-500 dark:text-gray-500 font-bold">{label}</span>
      <div className="w-8 h-8 rounded-xl bg-[#7D0A0A]/10 dark:bg-[#D4AF37]/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#7D0A0A] dark:text-[#D4AF37]" />
      </div>
    </div>
    <div className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{value}</div>
    {trend && (
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
          trend.value >= 0
            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
            : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
        }`}
      >
        {trend.value >= 0 ? '▲' : '▼'} {trend.label}
      </span>
    )}
  </div>
);
