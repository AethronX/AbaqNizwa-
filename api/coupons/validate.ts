import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

// Public endpoint used at checkout — deliberately does not expose the
// full coupon list, only whether a given code applies.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  await ensureSchema();

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
