import axios from 'axios';

const apiCandidat = axios.create({ baseURL: 'http://localhost:8000/api' });

apiCandidat.interceptors.request.use((config) => {
  const token = localStorage.getItem('candidat_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiCandidat;