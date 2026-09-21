import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('caresync_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized Global Exceptions
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on auth expiry if not on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('caresync_token');
        localStorage.removeItem('caresync_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
};

export const doctorAPI = {
  getAll: (params) => API.get('/doctors', { params }),
  getById: (id, params) => API.get(`/doctors/${id}`, { params }),
  updateProfile: (id, data) => API.put(`/doctors/${id}`, data),
};

export const appointmentAPI = {
  create: (data) => API.post('/appointments', data),
  getAll: (params) => API.get('/appointments', { params }),
  getById: (id) => API.get(`/appointments/${id}`),
  updateStatus: (id, status) => API.patch(`/appointments/${id}/status`, { status }),
  cancel: (id) => API.delete(`/appointments/${id}`),
};

export const reviewAPI = {
  add: (data) => API.post('/reviews', data),
  getByDoctor: (doctorId) => API.get(`/reviews/doctor/${doctorId}`),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/admin/users'),
  toggleDoctorVerification: (id) => API.put(`/admin/doctors/${id}/verify`),
};

export default API;
