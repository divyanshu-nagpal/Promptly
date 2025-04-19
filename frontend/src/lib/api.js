import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // optional, if you're using cookies or auth
});

export default api;
