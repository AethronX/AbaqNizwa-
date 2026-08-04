import { sql, ensureSchema } from './_lib/db.js';
import { handlePreflight, requireAdmin } from './_lib/auth.js';
import type { ApiRequest, ApiResponse } from './_lib/types';

function detectDeviceType(userAgent: string | undefined): string {
  if (!userAgent) return 'unknown';
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

async function track(req: ApiRequest, res: ApiResponse) {
  const { path, referrer, sessionId, eventType, meta } = req.body || {};
  if (typeof path !== 'string') {
    res.status(400).json({ error: 'path is required' });
    return;
  }
  const userAgent = req.headers['user-agent'] as string | undefined;
  const country = (req.headers['x-vercel-ip-country'] as string | undefined) || null;

  await sql`
    INSERT INTO analytics_events (event_type, path, referrer, device_type, country, session_id, meta)
    VALUES (
      ${typeof eventType === 'string' ? eventType : 'pageview'},
      ${path},
      ${typeof referrer === 'string' ? referrer : null},
      ${detectDeviceType(userAgent)},
      ${country},
      ${typeof sessionId === 'string' ? sessionId : null},
      ${meta ? JSON.stringify(meta) : null}
    )
  `;
  res.status(204).end();
}

// Fast, cheap path for frequent polling — "visitors active in the last
// couple of minutes" as a live-ish proxy for concurrent visitors, without
// running the full multi-query summary on every poll.
async function liveVisitors(req: ApiRequest, res: ApiResponse) {
  if (!requireAdmin(req, res)) return;
  const rows = await sql<{ active: number }>`
    SELECT COUNT(DISTINCT session_id)::int AS active
    FROM analytics_events
    WHERE created_at >= now() - interval '2 minutes'
      AND event_type IN ('pageview', 'heartbeat')
  `;
  res.status(200).json({ activeVisitors: rows[0]?.active ?? 0 });
}

async function summary(req: ApiRequest, res: ApiResponse) {
  if (req.query.live === '1') return liveVisitors(req, res);
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

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();

  if (req.method === 'POST') return track(req, res);
  if (req.method === 'GET') return summary(req, res);

  res.status(405).json({ error: 'Method not allowed' });
}
