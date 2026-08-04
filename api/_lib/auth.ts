import jwt from 'jsonwebtoken';
import type { ApiRequest, ApiResponse } from './types';

const COOKIE_NAME = 'abaq_admin_session';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET env var is not set.');
  }
  return secret;
}

export function signAdminToken(): string {
  return jwt.sign({ role: 'admin' }, getJwtSecret(), { expiresIn: '7d' });
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

export function isAdminRequest(req: ApiRequest): boolean {
  const cookies = req.cookies ?? parseCookies(req.headers.cookie as string | undefined);
  const token = cookies[COOKIE_NAME];
  if (!token) return false;
  try {
    jwt.verify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export function requireAdmin(req: ApiRequest, res: ApiResponse): boolean {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export function setAdminCookie(res: ApiResponse, token: string) {
  const maxAge = 7 * 24 * 60 * 60;
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=None`
  );
}

export function clearAdminCookie(res: ApiResponse) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None`
  );
}

// Allowed cross-origin callers: the storefront itself and the separate
// admin app (set ADMIN_ORIGIN once the admin/ Vercel project is deployed).
function allowedOrigins(): string[] {
  const list = [process.env.SITE_ORIGIN, process.env.ADMIN_ORIGIN].filter(
    (v): v is string => Boolean(v)
  );
  return list;
}

export function applyCors(req: ApiRequest, res: ApiResponse): void {
  const origin = req.headers.origin as string | undefined;
  const allowed = allowedOrigins();
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

// Call at the top of every handler. Applies CORS headers and, for a
// preflight OPTIONS request, ends the response — returns true in that
// case so the caller knows to stop.
export function handlePreflight(req: ApiRequest, res: ApiResponse): boolean {
  applyCors(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
