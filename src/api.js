import axios from 'axios';
// const api = axios.create({ baseURL: '/' });
const api = axios.create({
  baseURL: 'http://localhost:5000', // Server Node.js
  timeout: 10000,
});
export default api;