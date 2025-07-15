import axios from 'axios'
const API_BASE = import.meta.env.VITE_API_BASE; 
const api = axios.create({
  baseURL: '${API_BASE}/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
