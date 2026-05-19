import axios from 'axios';

// Vite proxies /api → http://localhost:5100 (see vite.config.ts).
// TODO: Add any request/response interceptors you need, e.g. for error normalisation.
export const apiClient = axios.create({
  baseURL: '/api',
});
