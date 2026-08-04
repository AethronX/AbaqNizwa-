import React from 'react';
import { SimpleLineChart } from './SimpleLineChart';
import { EmptyState } from './EmptyState';
import { BarChart3 } from 'lucide-react';

export const ChartContainer: React.FC<{
  data: { label: string; value: number }[];
  color?: string;
}> = ({ data, color = '#D4AF37' }) => {
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) {
    return <EmptyState icon={BarChart3} title="لا توجد بيانات كافية لهذه الفترة" />;
  }
  return <SimpleLineChart data={data} color={color} />;
};
