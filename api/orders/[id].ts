import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight, requireAdmin } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

const VALID_STATUSES = ['pending', 'preparing', 'arranging', 'shipped', 'delivered', 'cancelled'];

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();
  if (!requireAdmin(req, res)) return;

  const id = req.query.id as string;

  if (req.method === 'PATCH') {
    const { status } = req.body || {};
    if (typeof status !== 'string' || !VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const existing = await sql`SELECT data FROM orders WHERE id = ${id}`;
    if (existing.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const order = existing[0].data;
    const updatedTimeline = order.trackingTimeline.map((t: any, idx: number) => {
      if (status === 'preparing' && idx <= 1) return { ...t, completed: true, current: idx === 1 };
      if (status === 'arranging' && idx <= 2) return { ...t, completed: true, current: idx === 2 };
      if (status === 'shipped' && idx <= 3) return { ...t, completed: true, current: idx === 3 };
      if (status === 'delivered') return { ...t, completed: true, current: false };
      return t;
    });
    const updated = { ...order, status, trackingTimeline: updatedTimeline };

    await sql`
      UPDATE orders SET status = ${status}, data = ${JSON.stringify(updated)}, updated_at = now()
      WHERE id = ${id}
    `;
    res.status(200).json(updated);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
