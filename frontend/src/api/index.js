import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response handler: 401 → logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  sendOtp: (data) => api.post('/auth/otp/send', data),
  verifyOtp: (data) => api.post('/auth/otp/verify', data),
};

// Schemes
export const schemeApi = {
  getAll: () => api.get('/schemes'),
  getById: (id) => api.get(`/schemes/${id}`),
  discover: (data) => api.post('/schemes/discover', data),
};

// Applications
export const applicationApi = {
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  submit: (id) => api.post(`/applications/${id}/submit`),
  getAll: (page = 0, size = 20) => api.get(`/applications?page=${page}&size=${size}`),
  getMy: () => api.get('/applications/my'),
  getById: (id) => api.get(`/applications/${id}`),
  runEligibilityCheck: (id) => api.post(`/applications/${id}/eligibility-check`),
  officerAction: (id, data) => api.post(`/applications/${id}/action`, data),
  getStats: () => api.get('/applications/stats'),
};

// Applicant Profile
export const profileApi = {
  get: () => api.get('/applicants/profile'),
  save: (data) => api.post('/applicants/profile', data),
  addEducation: (data) => api.post('/applicants/profile/education', data),
};

// Documents
export const documentApi = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyDocuments: () => api.get('/documents/my'),
};

// Grievances
export const grievanceApi = {
  create: (data) => api.post('/grievances', data),
  getMy: () => api.get('/grievances/my'),
  getById: (id) => api.get(`/grievances/${id}`),
  getAll: (page = 0) => api.get(`/grievances?page=${page}`),
  update: (id, data) => api.put(`/grievances/${id}`, data),
};

// Chatbot
export const chatbotApi = {
  query: (query, sessionId) => api.post('/chatbot/query', { query, sessionId }),
};

// Workflow
export const workflowApi = {
  getTransitions: (applicationId) => api.get(`/workflow/${applicationId}/transitions`),
};
