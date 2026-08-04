export function formatOmr(n: number): string {
  return `${(n || 0).toFixed(2)} ر.ع.`;
}

export function timeAgo(dateStr: string): string {
  const then = new Date(dateStr.replace(' ', 'T')).getTime();
  if (Number.isNaN(then)) return dateStr;
  const diffMin = Math.round((Date.now() - then) / 60000);
  if (diffMin < 1) return 'الآن';
  if (diffMin < 60) return `قبل ${diffMin} د`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `قبل ${diffH} س`;
  const diffD = Math.round(diffH / 24);
  return `قبل ${diffD} يوم`;
}
