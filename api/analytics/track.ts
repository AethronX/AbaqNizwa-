import { sql, ensureSchema } from '../_lib/db';
import { handlePreflight } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

function detectDeviceType(userAgent: string | undefined): string {
  if (!userAgent) return 'unknown';
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  await ensureSchema();

  const { path, referrer, sessionId, eventType, meta } = req.body || {};
  if (typeof path !== 'string') {
    res.status(400).json({ error: 'path is required' });
    return;
  }

  const userAgent = req.headers['user-agent'] as string | undefined;
  const country = (req.headers['x-vercel-ip-country'] as string | undefined) || null;

  await sql`
    INSERT INTO analytics_events (event_type, path, referrer, device_type, country, session_id, meta)
    VALUES (
      ${typeof eventType === 'string' ? eventType : 'pageview'},
      ${path},
      ${typeof referrer === 'string' ? referrer : null},
      ${detectDeviceType(userAgent)},
      ${country},
      ${typeof sessionId === 'string' ? sessionId : null},
      ${meta ? JSON.stringify(meta) : null}
    )
  `;

  res.status(204).end();
}
