import React from 'react';
import { EmptyState } from './EmptyState';

interface Row {
  label: string;
  value: number;
}

export const ProgressBarList: React.FC<{ data: Row[]; color?: string; emptyLabel?: string; formatValue?: (v: number) => string }> = ({
  data,
  color = '#7D0A0A',
  emptyLabel = 'لا توجد بيانات كافية بعد',
  formatValue,
}) => {
  if (data.length === 0) {
    return <EmptyState title={emptyLabel} />;
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <div className="space-y-3">
      {data.map((row, i) => {
        const pct = Math.round((row.value / total) * 100);
        return (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[60%]">{row.label || '—'}</span>
              <span className="text-gray-500 dark:text-gray-400 font-bold shrink-0">
                {formatValue ? formatValue(row.value) : row.value} <span className="text-gray-500 dark:text-gray-400">({pct}%)</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(row.value / max) * 100}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
