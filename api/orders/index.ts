import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight, requireAdmin } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

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

  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
    const rows = await sql`SELECT data FROM orders ORDER BY created_at DESC`;
    res.status(200).json(rows.map((r: any) => r.data));
    return;
  }

  if (req.method === 'POST') {
    const orderData = req.body;
    if (!orderData || !Array.isArray(orderData.items) || typeof orderData.total !== 'number') {
      res.status(400).json({ error: 'Invalid order payload' });
      return;
    }
    const id = `ord-${Date.now()}`;
    const orderNumber = `AN-${Math.floor(10000 + Math.random() * 90000)}`;
    const full = {
      ...orderData,
      id,
      orderNumber,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
      trackingTimeline: buildTimeline(),
    };
    await sql`
      INSERT INTO orders (id, order_number, status, total, data)
      VALUES (${id}, ${orderNumber}, 'pending', ${full.total}, ${JSON.stringify(full)})
    `;
    res.status(201).json(full);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
