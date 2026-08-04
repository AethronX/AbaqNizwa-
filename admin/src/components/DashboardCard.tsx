import React from 'react';

export const DashboardCard: React.FC<{
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, action, className = '', children }) => (
  <div
    className={`bg-white dark:bg-[#151111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-none transition-shadow p-5 sm:p-6 space-y-4 ${className}`}
  >
    {(title || action) && (
      <div className="flex items-start justify-between gap-3">
        <div>
          {title && <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{title}</h3>}
          {subtitle && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);
