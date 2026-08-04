import React from 'react';

interface Row {
  label: string;
  value: number;
}

export const SimpleBarList: React.FC<{ data: Row[]; color?: string }> = ({ data, color = '#7D0A0A' }) => {
  if (data.length === 0) {
    return <div className="text-xs text-gray-400 dark:text-gray-500 py-4 text-center">لا توجد بيانات كافية بعد</div>;
  }
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2.5">
      {data.map((row, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[70%]">{row.label || '—'}</span>
            <span className="text-gray-500 dark:text-gray-400 font-bold">{row.value}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(row.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
