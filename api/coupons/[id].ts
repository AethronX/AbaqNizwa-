import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight, requireAdmin } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  await ensureSchema();
  if (!requireAdmin(req, res)) return;

  const id = req.query.id as string;

  if (req.method === 'DELETE') {
    await sql`DELETE FROM coupons WHERE id = ${id}`;
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
