import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800 ${className}`} />
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-[#151111] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-28" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[0, 1].map((i) => (
        <div key={i} className="bg-white dark:bg-[#151111] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>
      ))}
    </div>
  </div>
);
