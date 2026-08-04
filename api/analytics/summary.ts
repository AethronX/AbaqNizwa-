import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight, requireAdmin } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  await ensureSchema();
  if (!requireAdmin(req, res)) return;

  const daysParam = Number(req.query.days);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 365) : 30;

  const [
    visitsByDay,
    totalVisits,
    topPaths,
    deviceBreakdown,
    countryBreakdown,
    ordersByDay,
    orderStats,
    topProducts,
    topCities,
  ] = await Promise.all([
    sql`
      SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS count
      FROM analytics_events
      WHERE created_at >= now() - make_interval(days => ${days}) AND event_type = 'pageview'
      GROUP BY 1 ORDER BY 1 ASC
    `,
    sql`
      SELECT COUNT(*)::int AS total, COUNT(DISTINCT session_id)::int AS unique_sessions
      FROM analytics_events
      WHERE created_at >= now() - make_interval(days => ${days}) AND event_type = 'pageview'
    `,
    sql`
      SELECT path, COUNT(*)::int AS count
      FROM analytics_events
      WHERE created_at >= now() - make_interval(days => ${days}) AND event_type = 'pageview'
      GROUP BY path ORDER BY count DESC LIMIT 10
    `,
    sql`
      SELECT device_type, COUNT(*)::int AS count
      FROM analytics_events
      WHERE created_at >= now() - make_interval(days => ${days}) AND event_type = 'pageview'
      GROUP BY device_type ORDER BY count DESC
    `,
    sql`
      SELECT country, COUNT(*)::int AS count
      FROM analytics_events
      WHERE created_at >= now() - make_interval(days => ${days}) AND event_type = 'pageview' AND country IS NOT NULL
      GROUP BY country ORDER BY count DESC LIMIT 10
    `,
    sql`
      SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, COUNT(*)::int AS orders, COALESCE(SUM(total), 0)::float AS revenue
      FROM orders
      WHERE created_at >= now() - make_interval(days => ${days})
      GROUP BY 1 ORDER BY 1 ASC
    `,
    sql`
      SELECT COUNT(*)::int AS total_orders, COALESCE(SUM(total), 0)::float AS total_revenue, COALESCE(AVG(total), 0)::float AS avg_order_value
      FROM orders
      WHERE created_at >= now() - make_interval(days => ${days})
    `,
    sql`
      SELECT elem -> 'product' ->> 'nameAr' AS name_ar, elem -> 'product' ->> 'nameEn' AS name_en, COUNT(*)::int AS count
      FROM orders, jsonb_array_elements(data -> 'items') AS elem
      WHERE orders.created_at >= now() - make_interval(days => ${days})
      GROUP BY 1, 2 ORDER BY count DESC LIMIT 8
    `,
    sql`
      SELECT data -> 'shippingAddress' ->> 'city' AS city, COUNT(*)::int AS count
      FROM orders
      WHERE created_at >= now() - make_interval(days => ${days})
      GROUP BY 1 ORDER BY count DESC LIMIT 8
    `,
  ]);

  res.status(200).json({
    rangeDays: days,
    visitsByDay,
    totalVisits: totalVisits[0] ?? { total: 0, unique_sessions: 0 },
    topPaths,
    deviceBreakdown,
    countryBreakdown,
    ordersByDay,
    orderStats: orderStats[0] ?? { total_orders: 0, total_revenue: 0, avg_order_value: 0 },
    topProducts,
    topCities,
  });
}
