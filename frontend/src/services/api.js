const API_BASE_URL = '/api';

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('bistro_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
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
