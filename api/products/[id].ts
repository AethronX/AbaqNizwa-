import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight, requireAdmin } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();
  if (!requireAdmin(req, res)) return;

  const id = req.query.id as string;

  if (req.method === 'PUT') {
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

  if (req.method === 'DELETE') {
    await sql`DELETE FROM products WHERE id = ${id}`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
