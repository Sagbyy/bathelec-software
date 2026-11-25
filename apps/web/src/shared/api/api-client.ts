import axios from 'axios';
import { API_PROXY_PATH } from '../config/access-control';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PROXY_URL ?? API_PROXY_PATH,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
