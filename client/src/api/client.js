import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Response Interceptor for standard error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = error.response?.data?.error || {
      message: error.message || 'Network communication failure with LabTrack server.'
    };
    return Promise.reject(errorResponse);
  }
);

export const equipmentApi = {
  getAll: (params) => api.get('/equipment', { params }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  updateStatus: (id, status, note) => api.patch(`/equipment/${id}/status`, { status, note }),
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

export const maintenanceApi = {
  getAll: (params) => api.get('/maintenance', { params }),
  create: (data) => api.post('/maintenance', data)
};

export const activityApi = {
  getAll: (params) => api.get('/activity', { params })
};

export const healthApi = {
  check: () => api.get('/health')
};

export default api;
