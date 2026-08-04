// Talks to the /api serverless backend. Same-origin on the storefront,
// so no base URL configuration is needed here (the separate admin app
// sets VITE_API_BASE_URL to point back at this site).
const API_BASE = '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getProducts: () => request<any[]>('/products'),

  createOrder: (order: any) =>
    request<any>('/orders', { method: 'POST', body: JSON.stringify(order) }),

  validateCoupon: (code: string, subtotal: number) =>
    request<{ success: boolean; message: string; coupon?: any }>('/coupons?action=validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),

  track: (payload: { path: string; referrer?: string; sessionId?: string; eventType?: string }) =>
    fetch(`${API_BASE}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Analytics must never break the storefront.
    }),
};
