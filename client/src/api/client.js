import axios from 'axios';

// Create Central Axios Instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Attach authorization token if present in localStorage
    const token = localStorage.getItem('labtrack_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Consistent Error and Payload Extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorPayload = error.response?.data || {
      success: false,
      message: error.message || 'Network communication failure with LabTrack server.',
      errors: null
    };
    return Promise.reject(errorPayload);
  }
);

// Domain API Services
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users')
};

export const equipmentApi = {
  getAll: (params) => api.get('/equipment', { params }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  updateStatus: (id, status) => api.patch(`/equipment/${id}/status`, { status }),
  delete: (id) => api.delete(`/equipment/${id}`)
};

export const labsApi = {
  getAll: () => api.get('/labs'),
  getById: (id) => api.get(`/labs/${id}`),
  create: (data) => api.post('/labs', data)
};

export const categoriesApi = {
  getAll: () => api.get('/categories')
};

export const allocationsApi = {
  getAll: (params) => api.get('/allocations', { params }),
  create: (data) => api.post('/allocations', data),
  returnItem: (id) => api.put(`/allocations/${id}/return`)
};

export const maintenanceApi = {
  getAll: (params) => api.get('/maintenance', { params }),
  report: (data) => api.post('/maintenance/report', data),
  updateStatus: (id, status, notes) => api.put(`/maintenance/${id}/status`, { status, technician_notes: notes })
};

export const reportsApi = {
  getSummary: () => api.get('/reports/summary')
};

export const activityApi = {
  getAll: (params) => api.get('/activity', { params })
};

export const healthApi = {
  check: () => api.get('/health')
};

export default api;
