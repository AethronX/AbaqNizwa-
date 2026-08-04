import { sql, ensureSchema } from './_lib/db';
import { handlePreflight, requireAdmin } from './_lib/auth';
import type { ApiRequest, ApiResponse } from './_lib/types';

// Customers aren't a separate write-model — they're derived from orders,
// grouped by phone number, so the list always reflects real order history.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  await ensureSchema();
  if (!requireAdmin(req, res)) return;

  const rows = await sql`
    SELECT
      data ->> 'customerPhone' AS phone,
      MAX(data ->> 'customerName') AS name,
      MAX(data ->> 'customerEmail') AS email,
      MAX(data -> 'shippingAddress' ->> 'city') AS city,
      COUNT(*)::int AS total_orders,
      COALESCE(SUM(total), 0)::float AS total_spent,
      MIN(created_at) AS first_order_at,
      MAX(created_at) AS last_order_at
    FROM orders
    WHERE data ->> 'customerPhone' IS NOT NULL
    GROUP BY phone
    ORDER BY total_spent DESC
  `;

  res.status(200).json(rows);
}
