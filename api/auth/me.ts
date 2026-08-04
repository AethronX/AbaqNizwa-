import { handlePreflight, isAdminRequest } from '../_lib/auth';
import type { ApiRequest, ApiResponse } from '../_lib/types';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  res.status(200).json({ authenticated: isAdminRequest(req) });
}
