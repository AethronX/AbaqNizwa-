// Cross-origin client for the storefront's /api backend. VITE_API_BASE_URL
// must point at the storefront's deployed URL (e.g. https://abaq-nizwa.vercel.app) —
// set it in this project's Vercel env vars once the storefront domain is known.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

if (!API_BASE) {
  console.warn('VITE_API_BASE_URL is not set — API requests will fail. See admin/.env.example.');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    credentials: 'include',
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
  login: (username: string, password: string) =>
    request<{ ok: true }>('/auth?action=login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request<{ ok: true }>('/auth?action=logout', { method: 'POST' }),
  me: () => request<{ authenticated: boolean }>('/auth?action=me'),

  getProducts: () => request<any[]>('/products'),
  createProduct: (product: any) =>
    request<any>('/products', { method: 'POST', body: JSON.stringify(product) }),
  updateProduct: (product: any) =>
    request<any>(`/products?id=${encodeURIComponent(product.id)}`, { method: 'PUT', body: JSON.stringify(product) }),
  deleteProduct: (id: string) => request<void>(`/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getOrders: () => request<any[]>('/orders'),
  updateOrderStatus: (id: string, status: string) =>
    request<any>(`/orders?id=${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  getCoupons: () => request<any[]>('/coupons'),
  createCoupon: (coupon: any) =>
    request<any>('/coupons', { method: 'POST', body: JSON.stringify(coupon) }),
  deleteCoupon: (id: string) => request<void>(`/coupons?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),

  getCustomers: () => request<any[]>('/customers'),

  getAnalyticsSummary: (days: number) => request<any>(`/analytics?days=${days}`),
  getLiveVisitors: () => request<{ activeVisitors: number }>('/analytics?live=1'),

  seed: () => request<any>('/admin/seed', { method: 'POST' }),
};
