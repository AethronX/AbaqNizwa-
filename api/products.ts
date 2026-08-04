import { sql, ensureSchema } from './_lib/db.js';
import { handlePreflight, requireAdmin } from './_lib/auth.js';
import type { ApiRequest, ApiResponse } from './_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();

  const id = req.query.id as string | undefined;

  if (req.method === 'GET' && !id) {
    const rows = await sql`SELECT data FROM products ORDER BY created_at DESC`;
    res.status(200).json(rows.map((r: any) => r.data));
    return;
  }

  if (req.method === 'POST' && !id) {
    if (!requireAdmin(req, res)) return;
    const product = req.body;
    if (!product || typeof product.nameAr !== 'string' || typeof product.price !== 'number') {
      res.status(400).json({ error: 'Invalid product payload' });
      return;
    }
    const newId = `p-${Date.now()}`;
    const full = { ...product, id: newId };
    await sql`
      INSERT INTO products (id, category, price, in_stock, data)
      VALUES (${newId}, ${full.category ?? 'uncategorized'}, ${full.price}, ${full.inStock ?? true}, ${JSON.stringify(full)})
    `;
    res.status(201).json(full);
    return;
  }

  if (req.method === 'PUT' && id) {
    if (!requireAdmin(req, res)) return;
    const product = req.body;
    if (!product || product.id !== id) {
      res.status(400).json({ error: 'Payload id must match URL id' });
      return;
    }
    const result = await sql`
      UPDATE products
      SET category = ${product.category ?? 'uncategorized'},
          price = ${product.price},
          in_stock = ${product.inStock ?? true},
          data = ${JSON.stringify(product)},
          updated_at = now()
      WHERE id = ${id}
      RETURNING data
    `;
    if (result.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.status(200).json(result[0].data);
    return;
  }

  if (req.method === 'DELETE' && id) {
    if (!requireAdmin(req, res)) return;
    await sql`DELETE FROM products WHERE id = ${id}`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
