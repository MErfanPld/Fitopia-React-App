import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://fitopiaapi.pythonanywhere.com/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;