// API service for all HTTP requests
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://naveen.hummingtone.com/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
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

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  googleLogin: (data) => apiClient.post('/auth/google', data)
};

// Task APIs
export const taskAPI = {
  getAllTasks: () => apiClient.get('/tasks'),
  getTaskById: (id) => apiClient.get(`/tasks/${id}`),
  createTask: (data) => apiClient.post('/tasks', data),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`)
};

// Submission APIs
export const submissionAPI = {
  submitTask: (data) => apiClient.post('/submissions', data),
  getAllSubmissions: () => apiClient.get('/submissions/admin/all'),
  getStudentSubmissions: () => apiClient.get('/submissions/my/submissions'),
  updateSubmission: (id, data) => apiClient.put(`/submissions/${id}`, data)
};

export default apiClient;
