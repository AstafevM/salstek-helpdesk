import axios from 'axios';
import { API_URL, AUTH_TOKEN_KEY } from '@/utils/env';

// Создаём экземпляр axios с базовыми настройками
export const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запроса: добавляем токен в заголовок Authorization,
// если он есть в localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответа: если сервер вернул 401 (неавторизован),
// удаляем токен и перекидываем на страницу логина
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = '/login';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);