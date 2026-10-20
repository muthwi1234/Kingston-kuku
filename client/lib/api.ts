const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.error?.message || error.message || 'An error occurred');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: any) => fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    login: (data: any) => fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),
    me: () => fetchAPI('/api/auth/me'),
  },
  products: {
    getAll: (params?: { category?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append('category', params.category);
      if (params?.search) searchParams.append('search', params.search);
      return fetchAPI(`/api/products?${searchParams.toString()}`);
    },
    getById: (id: string) => fetchAPI(`/api/products/${id}`),
    create: (data: any) => fetchAPI('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchAPI(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchAPI(`/api/products/${id}`, {
      method: 'DELETE',
    }),
  },
  categories: {
    getAll: () => fetchAPI('/api/categories'),
  },
  orders: {
    create: (data: any) => fetchAPI('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getAll: (params?: { status?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.search) searchParams.append('search', params.search);
      return fetchAPI(`/api/orders?${searchParams.toString()}`);
    },
    getMyOrders: () => fetchAPI('/api/orders/my'),
    getById: (id: string) => fetchAPI(`/api/orders/${id}`),
    updateStatus: (id: string, status: string) => fetchAPI(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
    verifyPayment: (id: string, mpesaCode?: string) => fetchAPI(`/api/orders/${id}/verify-payment`, {
      method: 'PATCH',
      body: JSON.stringify({ mpesaCode }),
    }),
  },
  admin: {
    getStats: () => fetchAPI('/api/admin/stats'),
    getSalesReport: (params?: { startDate?: string; endDate?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);
      return fetchAPI(`/api/admin/reports/sales?${searchParams.toString()}`);
    },
    getCustomers: () => fetchAPI('/api/admin/customers'),
    updateUserRole: (id: string, role: string) => fetchAPI(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  },
  settings: {
    getAll: () => fetchAPI('/api/settings'),
    update: (key: string, value: string) => fetchAPI(`/api/settings/${key}`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    }),
  },
  contact: {
    sendMessage: (data: any) => fetchAPI('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },
  upload: {
    image: (image: string) => fetchAPI('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image }),
    }),
  },
  deliveryZones: {
    getAll: () => fetchAPI('/api/delivery-zones'),
    create: (data: any) => fetchAPI('/api/delivery-zones', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchAPI(`/api/delivery-zones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchAPI(`/api/delivery-zones/${id}`, {
      method: 'DELETE',
    }),
  },
};
