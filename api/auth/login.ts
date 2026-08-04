import bcrypt from 'bcryptjs';
import { handlePreflight, signAdminToken, setAdminCookie } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, password } = req.body || {};
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (!expectedUsername || !expectedHash) {
    res.status(500).json({ error: 'Admin credentials are not configured on the server.' });
    return;
  }

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    username !== expectedUsername
  ) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const valid = await bcrypt.compare(password, expectedHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const token = signAdminToken();
  setAdminCookie(res, token);
  res.status(200).json({ ok: true });
}
