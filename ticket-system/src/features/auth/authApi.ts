// src/features/auth/authApi.ts
import { apiSlice } from '@/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<void, { email: string; password: string }>({
      async queryFn() {
        // Всегда успешный логин
        return { data: undefined };
      },
    }),
    register: builder.mutation<void, any>({
      async queryFn() {
        return { data: undefined };
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;