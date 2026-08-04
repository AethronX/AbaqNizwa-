import bcrypt from 'bcryptjs';
import { handlePreflight, isAdminRequest, signAdminToken, setAdminCookie, clearAdminCookie } from './_lib/auth.js';
import type { ApiRequest, ApiResponse } from './_lib/types';

async function login(req: ApiRequest, res: ApiResponse) {
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
  setAdminCookie(res, signAdminToken());
  res.status(200).json({ ok: true });
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;

  const action = (req.query.action as string) || (req.method === 'GET' ? 'me' : '');

  if (action === 'login' && req.method === 'POST') return login(req, res);

  if (action === 'logout' && req.method === 'POST') {
    clearAdminCookie(res);
    res.status(200).json({ ok: true });
    return;
  }

  if (action === 'me' && req.method === 'GET') {
    res.status(200).json({ authenticated: isAdminRequest(req) });
    return;
  }

  res.status(404).json({ error: 'Not found' });
}
