import { sql, ensureSchema } from './_lib/db.js';
import { handlePreflight, requireAdmin } from './_lib/auth.js';
import type { ApiRequest, ApiResponse } from './_lib/types';

async function validate(req: ApiRequest, res: ApiResponse) {
  const { code, subtotal } = req.body || {};
  if (typeof code !== 'string' || typeof subtotal !== 'number') {
    res.status(400).json({ success: false, message: 'بيانات غير صحيحة' });
    return;
  }
  const cleanCode = code.trim().toUpperCase();
  const rows = await sql`
    SELECT data FROM coupons WHERE code = ${cleanCode} AND active = true LIMIT 1
  `;
  if (rows.length === 0) {
    res.status(200).json({ success: false, message: 'كود الخصم غير صحيح أو منتهي الصلاحية' });
    return;
  }
  const coupon = rows[0].data;
  if (subtotal < coupon.minOrder) {
    res.status(200).json({
      success: false,
      message: `الحد الأدنى لاستخدام هذا الكود هو ${coupon.minOrder} ر.ع.`,
    });
    return;
  }
  res.status(200).json({ success: true, message: `تم تطبيق خصم ${coupon.discountPercent}%`, coupon });
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();

  const id = req.query.id as string | undefined;
  const action = req.query.action as string | undefined;

  // Public: checkout validates a code without seeing the full coupon list.
  if (req.method === 'POST' && action === 'validate') {
    return validate(req, res);
  }

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
    const newId = `c-${Date.now()}`;
    const code = coupon.code.trim().toUpperCase();
    const full = { ...coupon, id: newId, code, usageCount: 0 };
    await sql`
      INSERT INTO coupons (id, code, active, data)
      VALUES (${newId}, ${code}, ${full.active ?? true}, ${JSON.stringify(full)})
    `;
    res.status(201).json(full);
    return;
  }

  if (req.method === 'DELETE' && id) {
    await sql`DELETE FROM coupons WHERE id = ${id}`;
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === 'PATCH' && id) {
    const { active } = req.body || {};
    if (typeof active !== 'boolean') {
      res.status(400).json({ error: 'Invalid active value' });
      return;
    }
    const existing = await sql`SELECT data FROM coupons WHERE id = ${id}`;
    if (existing.length === 0) {
      res.status(404).json({ error: 'Coupon not found' });
      return;
    }
    const updated = { ...existing[0].data, active };
    await sql`UPDATE coupons SET active = ${active}, data = ${JSON.stringify(updated)} WHERE id = ${id}`;
    res.status(200).json(updated);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
