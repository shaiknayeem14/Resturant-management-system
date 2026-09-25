// Determine API base URL dynamically for local dev, custom env, and Vercel production
const getApiBaseUrl = () => {
  // If explicitly configured via Vite env
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl && envApiUrl.trim() !== '') {
    const trimmed = envApiUrl.trim();
    return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
  }

  // When running in browser on localhost/127.0.0.1, use relative /api (proxied by Vite)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '/api';
    }
  }

  // Deployed production fallback to Render API
  return 'https://resturant-management-system-cy8j.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('bistro_token');
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || `HTTP ${response.status}: ${response.statusText}` };
      }
    }

    if (!response.ok) {
      const err = new Error(data.message || `Request failed with status ${response.status}`);
      err.status = response.status;
      err.data = data;

      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        localStorage.removeItem('bistro_token');
        localStorage.removeItem('bistro_user');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { message: data.message } }));
        }
      }

      throw err;
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  // Auth endpoints
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),

  // Food & Menu endpoints
  getCategories: () => request('/foods/categories'),
  getFoodItems: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    return request(`/foods${queryString ? `?${queryString}` : ''}`);
  },
  getFoodItemById: (id) => request(`/foods/${id}`),
  createFoodItem: (foodData) => request('/foods', { method: 'POST', body: JSON.stringify(foodData) }),
  updateFoodItem: (id, foodData) => request(`/foods/${id}`, { method: 'PUT', body: JSON.stringify(foodData) }),
  deleteFoodItem: (id) => request(`/foods/${id}`, { method: 'DELETE' }),

  // Orders endpoints
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/my-orders'),
  getOrderById: (id) => request(`/orders/${id}`),
  getAllOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/orders${query ? `?${query}` : ''}`);
  },
  updateOrderStatus: (id, status, note) =>
    request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, note }) }),
  cancelOrder: (id, reason) => request(`/orders/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) }),

  // Tables endpoints
  getTables: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tables${query ? `?${query}` : ''}`);
  },
  createTable: (tableData) => request('/tables', { method: 'POST', body: JSON.stringify(tableData) }),
  updateTable: (id, tableData) => request(`/tables/${id}`, { method: 'PUT', body: JSON.stringify(tableData) }),
  deleteTable: (id) => request(`/tables/${id}`, { method: 'DELETE' }),

  // Reservations endpoints
  createReservation: (bookingData) =>
    request('/reservations', { method: 'POST', body: JSON.stringify(bookingData) }),
  getMyReservations: () => request('/reservations/my-reservations'),
  getAllReservations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reservations${query ? `?${query}` : ''}`);
  },
  updateReservationStatus: (id, updateData) =>
    request(`/reservations/${id}/status`, { method: 'PUT', body: JSON.stringify(updateData) }),
  cancelReservation: (id) => request(`/reservations/${id}/cancel`, { method: 'PUT' }),

  // Admin Analytics & Users
  getAdminAnalytics: () => request('/admin/analytics'),
  getAdminUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`);
  },
  updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
};
