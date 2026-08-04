import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight, requireAdmin } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();

  if (req.method === 'GET') {
    const rows = await sql`SELECT data FROM products ORDER BY created_at DESC`;
    res.status(200).json(rows.map((r: any) => r.data));
    return;
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    const product = req.body;
    if (!product || typeof product.nameAr !== 'string' || typeof product.price !== 'number') {
      res.status(400).json({ error: 'Invalid product payload' });
      return;
    }
    const id = `p-${Date.now()}`;
    const full = { ...product, id };
    await sql`
      INSERT INTO products (id, category, price, in_stock, data)
      VALUES (${id}, ${full.category ?? 'uncategorized'}, ${full.price}, ${full.inStock ?? true}, ${JSON.stringify(full)})
    `;
    res.status(201).json(full);
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
