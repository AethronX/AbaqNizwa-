import React from 'react';

interface Point {
  label: string;
  value: number;
}

export const SimpleLineChart: React.FC<{ data: Point[]; color?: string; height?: number }> = ({
  data,
  color = '#D4AF37',
  height = 140,
}) => {
  if (data.length === 0) {
    return <div className="text-xs text-gray-500 py-8 text-center">لا توجد بيانات كافية بعد</div>;
  }

  const width = 600;
  const padding = 24;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = data.length > 1 ? (width - padding * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padding + i * stepX;
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[420px]" style={{ height }}>
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill={color} />
        ))}
        {points.map((p, i) =>
          i % Math.ceil(points.length / 8 || 1) === 0 ? (
            <text key={`label-${i}`} x={p.x} y={height - 4} fontSize={9} textAnchor="middle" fill="#9CA3AF">
              {p.label.slice(5)}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
};
