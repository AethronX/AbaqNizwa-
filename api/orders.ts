import { sql, ensureSchema } from './_lib/db.js';
import { handlePreflight, requireAdmin } from './_lib/auth.js';
import type { ApiRequest, ApiResponse } from './_lib/types';

const VALID_STATUSES = ['pending', 'preparing', 'arranging', 'shipped', 'delivered', 'cancelled'];

function buildTimeline() {
  return [
    { titleAr: 'تم استلام الطلب والدفع', titleEn: 'Order Received & Paid', time: 'الآن', completed: true, current: true },
    { titleAr: 'اختيار الورد والتجهيز', titleEn: 'Selecting Fresh Roses', time: 'قيد الانتظار', completed: false },
    { titleAr: 'تنسيق الباقة والتغليف الملكي', titleEn: 'Arranging Bouquet & Wrapping', time: 'قيد الانتظار', completed: false },
    { titleAr: 'خرجت مع مندوب التوصيل', titleEn: 'Out for Delivery', time: 'قيد الانتظار', completed: false },
    { titleAr: 'تم التوصيل بنجاح', titleEn: 'Delivered', time: 'قيد الانتظار', completed: false },
  ];
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();

  const id = req.query.id as string | undefined;

  if (req.method === 'GET' && !id) {
    if (!requireAdmin(req, res)) return;
    const rows = await sql`SELECT data FROM orders ORDER BY created_at DESC`;
    res.status(200).json(rows.map((r: any) => r.data));
    return;
  }

  if (req.method === 'POST' && !id) {
    const orderData = req.body;
    if (!orderData || !Array.isArray(orderData.items) || typeof orderData.total !== 'number') {
      res.status(400).json({ error: 'Invalid order payload' });
      return;
    }
    const newId = `ord-${Date.now()}`;
    const orderNumber = `AN-${Math.floor(10000 + Math.random() * 90000)}`;
    const full = {
      ...orderData,
      id: newId,
      orderNumber,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
      trackingTimeline: buildTimeline(),
    };
    await sql`
      INSERT INTO orders (id, order_number, status, total, data)
      VALUES (${newId}, ${orderNumber}, 'pending', ${full.total}, ${JSON.stringify(full)})
    `;
    res.status(201).json(full);
    return;
  }

  if (req.method === 'PATCH' && id) {
    if (!requireAdmin(req, res)) return;
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
