import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  me: () => api.get('/auth/me')
};

export const candidateAPI = {
  list: (params) => api.get('/candidates', { params }),
  detail: (id) => api.get(`/candidates/${id}`),
  updateStatus: (id, status) => api.patch(`/candidates/${id}/status`, { status }),
  delete: (id) => api.delete(`/candidates/${id}`)
};

export const uploadAPI = {
  uploadResume: (formData, onUploadProgress) => api.post('/upload/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  })
};

export const jobAPI = {
  create: (jobData) => api.post('/jobs', jobData),
  list: () => api.get('/jobs'),
  rankings: (jobId) => api.get(`/jobs/${jobId}/rankings`),
  match: (candidateId, jobId) => api.post('/jobs/match', { candidateId, jobId })
};

export const analyticsAPI = {
  dashboard: () => api.get('/analytics/dashboard'),
  skills: () => api.get('/analytics/skills'),
  scores: () => api.get('/analytics/scores'),
  status: () => api.get('/analytics/status'),
  trends: () => api.get('/analytics/trends')
};

export default api;
