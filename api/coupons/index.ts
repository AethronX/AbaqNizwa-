import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight, requireAdmin } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();
  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    const rows = await sql`SELECT data FROM coupons ORDER BY created_at DESC`;
    res.status(200).json(rows.map((r: any) => r.data));
    return;
  }

  if (req.method === 'POST') {
    const coupon = req.body;
    if (!coupon || typeof coupon.code !== 'string' || typeof coupon.discountPercent !== 'number') {
      res.status(400).json({ error: 'Invalid coupon payload' });
      return;
    }
    const id = `c-${Date.now()}`;
    const code = coupon.code.trim().toUpperCase();
    const full = { ...coupon, id, code, usageCount: 0 };
    await sql`
      INSERT INTO coupons (id, code, active, data)
      VALUES (${id}, ${code}, ${full.active ?? true}, ${JSON.stringify(full)})
    `;
    res.status(201).json(full);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
