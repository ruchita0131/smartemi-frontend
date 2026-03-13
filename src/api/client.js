import axios from 'axios';

const client = axios.create({
  baseURL: "https://smartemi-api.onrender.com",
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request automatically
client.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;