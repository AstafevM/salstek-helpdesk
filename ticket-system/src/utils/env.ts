// src/utils/env.ts

export const API_URL = import.meta.env.VITE_API_URL as string;
export const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY as string;

// Раннее обнаружение ошибок (если забыли создать .env)
if (!API_URL) {
  throw new Error('⚠️ VITE_API_URL не задан в .env файле!');
}
if (!AUTH_TOKEN_KEY) {
  throw new Error('⚠️ VITE_AUTH_TOKEN_KEY не задан в .env файле!');
}