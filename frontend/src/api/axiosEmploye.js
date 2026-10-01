import axios from 'axios';

const apiEmploye = axios.create({ baseURL: 'http://localhost:8000/api' });

apiEmploye.interceptors.request.use((config) => {
  const token = localStorage.getItem('employe_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiEmploye;