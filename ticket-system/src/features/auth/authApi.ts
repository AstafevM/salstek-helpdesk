// src/features/auth/authApi.ts
import { apiSlice } from '@/api/apiSlice';
import type { User } from '@/types/ticket.types';

// Типы для запросов
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

// Тип ответа сервера
interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        data: userData,
      }),
    }),
  }),
});

// Экспортируем хуки для использования в компонентах
export const { useLoginMutation, useRegisterMutation } = authApi;