import axios from 'axios';

const api = axios.create({
  baseURL: 'https://promptly-kmtl.onrender.com',
  withCredentials: true,
});

export default api;
