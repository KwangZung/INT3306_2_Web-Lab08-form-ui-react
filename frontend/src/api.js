import axios from 'axios';
// const api = axios.create({ baseURL: '/' });
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
});
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;