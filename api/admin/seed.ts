import { sql, ensureSchema } from '../_lib/db.js';
import { handlePreflight, requireAdmin } from '../_lib/auth.js';
import type { ApiRequest, ApiResponse } from '../_lib/types';
import { PRODUCTS, COUPONS } from '../../src/data/mockData.js';

// One-time bootstrap: loads the existing product catalog and coupons into
// a freshly connected, empty database. Safe to call more than once — it
// skips rows that already exist by id.
export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  await ensureSchema();
  if (!requireAdmin(req, res)) return;

  let productsInserted = 0;
  for (const p of PRODUCTS) {
    const result = await sql`
      INSERT INTO products (id, category, price, in_stock, data)
      VALUES (${p.id}, ${p.category}, ${p.price}, ${p.inStock}, ${JSON.stringify(p)})
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    productsInserted += result.length;
  }

  let couponsInserted = 0;
  for (const c of COUPONS) {
    const result = await sql`
      INSERT INTO coupons (id, code, active, data)
      VALUES (${c.id}, ${c.code}, ${c.active}, ${JSON.stringify(c)})
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    couponsInserted += result.length;
  }

  res.status(200).json({
    ok: true,
    productsInserted,
    couponsInserted,
    productsSkippedExisting: PRODUCTS.length - productsInserted,
    couponsSkippedExisting: COUPONS.length - couponsInserted,
  });
}
